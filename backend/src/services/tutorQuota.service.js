const { User, dataMode } = require('../data/modelProvider');

// Serialize requests for each user in the single-process pilot server.
const locks = new Map();
async function withUserLock(id, action) {
  const previous = locks.get(id) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  locks.set(id, current);
  await previous;
  try {
    return await action();
  } finally {
    release();
    if (locks.get(id) === current) locks.delete(id);
  }
}

function dailyLimit() {
  const value = Number(process.env.AI_DAILY_MESSAGE_LIMIT || 20);
  return Number.isInteger(value) && value >= 1 && value <= 100 ? value : 20;
}

function utcDay() {
  return new Date().toISOString().slice(0, 10);
}

function resetAt(day) {
  return new Date(`${day}T00:00:00.000Z`).getTime() + 86400000;
}

async function reserve(userId) {
  const id = String(userId);
  if (dataMode === 'mongodb') {
    const day = utcDay();
    const limit = dailyLimit();
    // Atomic per-user reservation also works when multiple backend processes run.
    const user = await User.findOneAndUpdate(
      { _id: id, $or: [{ 'tutorUsage.day': { $ne: day } }, { 'tutorUsage.count': { $lt: limit } }] },
      [{ $set: { tutorUsage: {
        day,
        count: { $cond: [
          { $eq: ['$tutorUsage.day', day] },
          { $add: [{ $ifNull: ['$tutorUsage.count', 0] }, 1] },
          1,
        ] },
      } } }],
      { new: true, projection: { tutorUsage: 1 } }
    );
    if (!user) {
      const exists = await User.exists({ _id: id });
      return exists ? { exceeded: true, limit, remaining: 0, resetAt: new Date(resetAt(day)).toISOString() } : null;
    }
    return { exceeded: false, limit, remaining: limit - user.tutorUsage.count, resetAt: new Date(resetAt(day)).toISOString(), day };
  }
  return withUserLock(id, async () => {
    const user = await User.findById(id);
    if (!user) return null;
    const day = utcDay();
    const count = user.tutorUsage?.day === day ? Number(user.tutorUsage.count) || 0 : 0;
    const limit = dailyLimit();
    if (count >= limit) return { exceeded: true, limit, remaining: 0, resetAt: new Date(resetAt(day)).toISOString() };
    user.tutorUsage = { day, count: count + 1 };
    await user.save();
    return { exceeded: false, limit, remaining: limit - count - 1, resetAt: new Date(resetAt(day)).toISOString(), day };
  });
}

async function refund(userId, reservedDay) {
  const id = String(userId);
  if (dataMode === 'mongodb') {
    await User.updateOne(
      { _id: id, 'tutorUsage.day': reservedDay, 'tutorUsage.count': { $gt: 0 } },
      { $inc: { 'tutorUsage.count': -1 } }
    );
    return;
  }
  await withUserLock(id, async () => {
    const user = await User.findById(id);
    if (user?.tutorUsage?.day === reservedDay && user.tutorUsage.count > 0) {
      user.tutorUsage = { day: reservedDay, count: user.tutorUsage.count - 1 };
      await user.save();
    }
  });
}

module.exports = { reserve, refund };
