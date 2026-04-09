const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  process: { type: mongoose.Schema.Types.ObjectId, ref: 'EperProcess', required: true },
  tower: { type: mongoose.Schema.Types.ObjectId, ref: 'EperTower', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'EperDepartment', required: true },
  automationPotential: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  currentFTE: { type: Number, default: 0 },
  proposedFTE: { type: Number, default: 0 },
  location: { type: String, default: '' },
  systemUsed: { type: String, default: '' },
  slaTat: { type: String, default: '' },
  isCustom: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { collection: 'eper_activities', timestamps: true });

module.exports = mongoose.model('EperActivity', activitySchema);
