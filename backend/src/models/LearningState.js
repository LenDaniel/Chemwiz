const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  revision: { type: Number, default: 0, required: true },
  state: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true, minimize: false });
module.exports = mongoose.model('LearningState', schema);
