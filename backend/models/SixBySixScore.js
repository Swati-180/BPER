const mongoose = require('mongoose');

const sixBySixSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'EperActivity', required: true },
  scoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'EperDepartment', required: true },
  parameters: {
    // Process Performance group — H = good for consolidation
    multipleLocns:  { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    routine:        { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    volumes:        { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    manpower:       { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    sops:           { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    erpTechnology:  { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    // Process Characteristic group — L = good for consolidation
    sensitivity:    { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    criticality:    { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    controls:       { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    proximity:      { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    regulatory:     { type: String, enum: ['H', 'M', 'L'], default: 'M' },
    skill:          { type: String, enum: ['H', 'M', 'L'], default: 'M' }
  },
  totalScore: { type: Number, default: 0 },   // auto calculated
  consolidate: { type: Boolean, default: false }, // auto = totalScore >= 7
  comments: { type: String, default: '' }
}, { collection: 'eper_sixbysix_scores', timestamps: true });

// Pre-save hook for 6x6 score calculation
sixBySixSchema.pre('save', function(next) {
  const p = this.parameters;
  const perfKeys = ['multipleLocns', 'routine', 'volumes', 'manpower', 'sops', 'erpTechnology'];
  const charKeys = ['sensitivity', 'criticality', 'controls', 'proximity', 'regulatory', 'skill'];

  // perfScore = count of H in performance group
  const perfScore = perfKeys.filter(k => p[k] === 'H').length;
  // charScore = count of L in characteristic group
  const charScore = charKeys.filter(k => p[k] === 'L').length;

  this.totalScore = perfScore + charScore;
  this.consolidate = this.totalScore >= 7;
  next();
});

module.exports = mongoose.model('EperSixBySixScore', sixBySixSchema);
