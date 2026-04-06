const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g. "HR", "FA"
  name: { type: String, required: true }
}, { collection: 'eper_departments', timestamps: true });

module.exports = mongoose.model('EperDepartment', departmentSchema);
