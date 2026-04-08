const mongoose = require('mongoose');

const towerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'EperDepartment', required: true }
}, { collection: 'eper_towers', timestamps: true });

module.exports = mongoose.model('EperTower', towerSchema);
