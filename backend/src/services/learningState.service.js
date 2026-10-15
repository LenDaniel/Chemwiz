const defaults = require('../../../shared/learning-defaults.json');
const { getDataMode } = require('../config/runtime');
const { modelForRuntime } = require('../data/workerMongoContext');
const model = getDataMode() === 'local' ? require('../data/localModels').LearningState : modelForRuntime(require('../models/LearningState'));

function invalid(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(`Invalid ${label}.`);
  return value;
}
function integer(value, max, label) {
  if (!Number.isInteger(value) || value < 0 || value > max) invalid(`Invalid ${label}.`);
  return value;
}
function boundedText(value, length, label) {
  if (typeof value !== 'string' || value.length > length) invalid(`Invalid ${label}.`);
  return value;
}
function validateState(raw) {
  object(raw, 'learning state');
  if (Buffer.byteLength(JSON.stringify(raw)) > 750000) invalid('Learning data is too large.');
  const settings = { ...defaults.settings };
  const choices = { theme: ['dark', 'light'], fontSize: ['small', 'medium', 'large'], syllabus: ['ZIMSEC', 'CAIE'], sound: ['on', 'off'] };
  for (const [key, allowed] of Object.entries(choices)) {
    if (raw.settings?.[key] !== undefined) {
      if (!allowed.includes(raw.settings[key])) invalid(`Invalid setting: ${key}.`);
      settings[key] = raw.settings[key];
    }
  }
  const progress = {};
  const incomingProgress = object(raw.progress || {}, 'topic progress');
  if (Object.keys(incomingProgress).length > 100) invalid('Too many topic records.');
  for (const [id, value] of Object.entries(incomingProgress)) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['constructor', 'prototype'].includes(id)) invalid('Invalid topic identifier.');
    object(value, 'topic progress');
    if (!Array.isArray(value.chaptersRead) || value.chaptersRead.length > 200) invalid('Invalid chapters read.');
    const chaptersRead = [...new Set(value.chaptersRead.map((chapter) => boundedText(chapter, 80, 'chapter identifier')))];
    progress[id] = { chaptersRead, quizzesTaken: integer(value.quizzesTaken ?? 0, 1000000, 'quiz count'), percent: integer(value.percent ?? 0, 100, 'progress percentage') };
    if (value.lastScore !== undefined) progress[id].lastScore = integer(value.lastScore, 100, 'quiz score');
  }
  const rawStreak = object(raw.streak || defaults.streak, 'streak');
  const streak = {
    current: integer(rawStreak.current ?? 0, 100000, 'current streak'),
    longest: integer(rawStreak.longest ?? 0, 100000, 'longest streak'),
    lastDate: rawStreak.lastDate === null || rawStreak.lastDate === undefined ? null : boundedText(rawStreak.lastDate, 80, 'streak date'),
  };
  if (!Array.isArray(raw.mistakes) || raw.mistakes.length > 1000) invalid('The mistakes notebook supports up to 1,000 entries.');
  const mistakes = raw.mistakes.map((mistake) => {
    object(mistake, 'mistake');
    if (!Array.isArray(mistake.opts) || mistake.opts.length < 2 || mistake.opts.length > 10) invalid('Invalid quiz options.');
    return {
      q: boundedText(mistake.q, 6000, 'quiz question'),
      opts: mistake.opts.map((option) => boundedText(option, 3000, 'quiz option')),
      ans: integer(mistake.ans, mistake.opts.length - 1, 'correct answer'),
      picked: integer(mistake.picked, mistake.opts.length - 1, 'selected answer'),
      hint: boundedText(mistake.hint || '', 6000, 'quiz hint'),
      topicId: boundedText(mistake.topicId, 64, 'topic identifier'),
      t: integer(mistake.t, Number.MAX_SAFE_INTEGER, 'quiz timestamp'),
    };
  });
  return { settings, progress, streak, mistakes };
}
const defaultState = () => JSON.parse(JSON.stringify(defaults));
async function getState(userId) {
  if (getDataMode() === 'mongodb') await model.init();
  const document = getDataMode() === 'local' ? await model.get(userId) : await model.findOne({ userId }).lean();
  return document ? { state: document.state, revision: document.revision, updatedAt: document.updatedAt }
    : { state: defaultState(), revision: 0, updatedAt: null };
}
async function saveState(userId, revision, state) {
  if (getDataMode() === 'mongodb') await model.init();
  let document;
  if (getDataMode() === 'local') document = await model.compareAndSet(userId, revision, state);
  else {
    document = await model.findOneAndUpdate({ userId, revision }, { $set: { state }, $inc: { revision: 1 } }, { new: true, runValidators: true }).lean();
    if (!document && revision === 0) {
      try { document = await model.create({ userId, revision: 1, state }); }
      catch (error) { if (error.code !== 11000) throw error; }
    }
  }
  return document ? { state: document.state, revision: document.revision, updatedAt: document.updatedAt } : null;
}
module.exports = { defaultState, validateState, getState, saveState };
