const mongoose = require('mongoose');

const activityEntrySchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'EperActivity', default: null },
  isCustom: { type: Boolean, default: false },
  customText: { type: String, default: '' },
  aiMappedActivity: { type: mongoose.Schema.Types.ObjectId, ref: 'EperActivity', default: null },
  mappingAccepted: { type: Boolean, default: false },
  volumeMonthly: { type: Number, default: 0 },
  timePerTransaction: { type: Number, default: 0 }, // minutes
  totalHoursMonth: { type: Number, default: 0 }, // auto = volume * time / 60
  fteContribution: { type: Number, default: 0 }, // auto = totalHoursMonth / standardHours
  processSharePct: { type: Number, default: 0 }, // auto = totalHoursMonth / totalHoursLogged * 100
  flaggedForRevision: { type: Boolean, default: false },
  flagComment: { type: String, default: '' },
  editPermissionGranted: { type: Boolean, default: false },
  editPermissionRequested: { type: Boolean, default: false },
  editPermissionReason: { type: String, default: '' }
});

const wdtSubmissionSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'EperDepartment', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewerType: { type: String, enum: ['supervisor', 'tower_lead'], default: 'supervisor' },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  standardHours: { type: Number, default: 160 },
  overtimeHours: { type: Number, default: 0 },
  totalHoursLogged: { type: Number, default: 0 },   // auto calculated
  utilizationRate: { type: Number, default: 0 },     // auto calculated
  activities: [activityEntrySchema],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'returned_for_revision', 'approved'],
    default: 'draft'
  },
  revisionNote: { type: String, default: '' },
  submittedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null }
}, { collection: 'eper_wdt_submissions', timestamps: true });

// Pre-save hook for auto-calculations
wdtSubmissionSchema.pre('save', function(next) {
  const std = this.standardHours || 160;

  // Calculate each activity's derived fields
  let totalHours = 0;
  this.activities.forEach(act => {
    act.totalHoursMonth = (act.volumeMonthly * act.timePerTransaction) / 60;
    totalHours += act.totalHoursMonth;
  });

  this.totalHoursLogged = totalHours;
  this.utilizationRate = std > 0 ? (totalHours / std) : 0;

  // Now compute per-activity FTE and process share
  this.activities.forEach(act => {
    act.fteContribution = std > 0 ? (act.totalHoursMonth / std) : 0;
    act.processSharePct = totalHours > 0 ? ((act.totalHoursMonth / totalHours) * 100) : 0;
  });

  next();
});

module.exports = mongoose.model('EperWdtSubmission', wdtSubmissionSchema);
