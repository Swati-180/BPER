const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { collection: 'eper_settings', timestamps: true });

module.exports = mongoose.model('EperSetting', settingSchema);
