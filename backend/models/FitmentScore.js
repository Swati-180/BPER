const mongoose = require('mongoose');

const fitmentScoreSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: {
    pmsRating:          { type: Number, default: 0 },
    complexityOfWork:   { type: Number, default: 0 },
    changeReadiness:    { type: Number, default: 0 },
    serviceOrientation: { type: Number, default: 0 },
    teamPlayer:         { type: Number, default: 0 },
    locationPreference: { type: Number, default: 0 },
    qualifications:     { type: Number, default: 0 },
    expCurrentRole:     { type: Number, default: 0 },
    totalExperience:    { type: Number, default: 0 },
    currentCtc:         { type: Number, default: 0 },
    multiplexer:        { type: Number, default: 0 },
    communicativeness:  { type: Number, default: 0 },
    selfMotivated:      { type: Number, default: 0 }
  },
  totalScore: { type: Number, default: 0 },
  weightedScore: { type: Number, default: 0 },
  remark: { type: String, enum: ['Fit', 'Train to Fit', 'Low Fit', 'Unfit', 'Not Scored'], default: 'Not Scored' }
}, { collection: 'eper_fitment_scores', timestamps: true });

// Weightages per parameter
const WEIGHTAGES = {
  pmsRating: 0.05,
  complexityOfWork: 0.10,
  changeReadiness: 0.10,
  serviceOrientation: 0.10,
  teamPlayer: 0.08,
  locationPreference: 0.05,
  qualifications: 0.09,
  expCurrentRole: 0.10,
  totalExperience: 0.06,
  currentCtc: 0.05,
  multiplexer: 0.07,
  communicativeness: 0.07,
  selfMotivated: 0.08
};

// Pre-save hook for fitment score calculation
fitmentScoreSchema.pre('save', function(next) {
  const p = this.parameters;
  let total = 0;
  let weighted = 0;

  Object.keys(WEIGHTAGES).forEach(key => {
    const score = p[key] || 0;
    total += score;
    weighted += score * WEIGHTAGES[key];
  });

  this.totalScore = total;
  this.weightedScore = parseFloat(weighted.toFixed(2));

  if (weighted < 10) {
    this.remark = 'Unfit';
  } else if (weighted >= 10 && weighted < 14) {
    this.remark = 'Low Fit';
  } else if (weighted >= 14 && weighted < 17) {
    this.remark = 'Train to Fit';
  } else {
    this.remark = 'Fit';
  }

  next();
});

module.exports = mongoose.model('EperFitmentScore', fitmentScoreSchema);
