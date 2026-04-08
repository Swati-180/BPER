const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tower: { type: mongoose.Schema.Types.ObjectId, ref: 'EperTower', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'EperDepartment', required: true }
}, { collection: 'eper_processes', timestamps: true });

module.exports = mongoose.model('EperProcess', processSchema);
