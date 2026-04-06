const WdtSubmission = require('../models/WdtSubmission');
const SixBySixScore = require('../models/SixBySixScore');
const FitmentScore = require('../models/FitmentScore');
const User = require('../models/User');
const Setting = require('../models/Setting');

// GET /api/eper/reports/dashboard-summary
const getDashboardSummary = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });

    const allSubs = await WdtSubmission.find({})
      .populate('employee', 'name department')
      .populate('department', 'code name');

    const submissionStats = {
      draft: 0, submitted: 0, underReview: 0, returned: 0, approved: 0
    };
    let totalUtilization = 0;
    let submissionCount = 0;

    const fteByTowerMap = {};
    const activityFteMap = {};

    allSubs.forEach(sub => {
      if (sub.status === 'draft') submissionStats.draft++;
      else if (sub.status === 'submitted') submissionStats.submitted++;
      else if (sub.status === 'under_review') submissionStats.underReview++;
      else if (sub.status === 'returned_for_revision') submissionStats.returned++;
      else if (sub.status === 'approved') submissionStats.approved++;

      if (sub.utilizationRate > 0) {
        totalUtilization += sub.utilizationRate;
        submissionCount++;
      }
    });

    const sixScores = await SixBySixScore.find({}).populate('activity', 'name tower');
    sixScores.forEach(score => {
      const towerName = score.activity?.tower?.name || 'Unknown';
      fteByTowerMap[towerName] = (fteByTowerMap[towerName] || 0) + (score.activity?.currentFTE || 0);
    });

    const avgSetting = await Setting.findOne({ key: 'avgSalaryPerFTE' });
    const avgSalary = avgSetting ? avgSetting.value : 600000;
    const consolidatableScores = sixScores.filter(s => s.consolidate);
    const totalFTE = consolidatableScores.reduce((sum, s) => sum + (s.activity?.currentFTE || 0), 0);
    const savedFTE = totalFTE * 0.6;
    const costSaving = savedFTE * avgSalary;

    res.json({
      totalEmployees,
      submissionStats,
      avgUtilization: submissionCount > 0 ? (totalUtilization / submissionCount) : 0,
      fteByTower: Object.entries(fteByTowerMap).map(([tower, totalFTE]) => ({ tower, totalFTE })),
      consolidationSummary: {
        activities: consolidatableScores.length,
        savedFTE: parseFloat(savedFTE.toFixed(2)),
        costSaving: parseFloat(costSaving.toFixed(0))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/reports/utilization
const getUtilization = async (req, res) => {
  try {
    const submissions = await WdtSubmission.find({})
      .populate('employee', 'name email grade')
      .populate('department', 'code name');

    const report = submissions.map(sub => ({
      employee: sub.employee?.name || 'Unknown',
      department: sub.department?.name || 'Unknown',
      hoursLogged: parseFloat((sub.totalHoursLogged || 0).toFixed(2)),
      standardHours: sub.standardHours,
      utilizationPct: parseFloat(((sub.utilizationRate || 0) * 100).toFixed(1)),
      overtimeHours: sub.overtimeHours || 0,
      status: sub.status,
      month: sub.month,
      year: sub.year
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/reports/fte-consolidation-summary
const getFteConsolidationSummary = async (req, res) => {
  try {
    const scores = await SixBySixScore.find({ consolidate: true })
      .populate('activity', 'name currentFTE');

    const avgSetting = await Setting.findOne({ key: 'avgSalaryPerFTE' });
    const avgSalary = avgSetting ? avgSetting.value : 600000;

    let totalFTE = 0;
    const perActivity = scores.map(s => {
      const fte = s.activity?.currentFTE || 0;
      totalFTE += fte;
      return {
        activityId: s.activity?._id,
        name: s.activity?.name || 'Unknown',
        currentFTE: fte,
        consolidate: s.consolidate
      };
    });

    const savedFTE = totalFTE * 0.6;
    const annualSaving = savedFTE * avgSalary;

    res.json({
      totalConsolidatableActivities: scores.length,
      totalFTEOnConsolidatable: parseFloat(totalFTE.toFixed(2)),
      estimatedSavedFTE: parseFloat(savedFTE.toFixed(2)),
      estimatedAnnualSaving: parseFloat(annualSaving.toFixed(0)),
      perActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/reports/fte-summary
const getFteSummary = async (req, res) => {
  try {
    const scores = await SixBySixScore.find({})
      .populate({
        path: 'activity',
        populate: [
          { path: 'tower', select: 'name' },
          { path: 'process', select: 'name' },
          { path: 'department', select: 'code name' }
        ]
      });

    const result = scores.map(s => ({
      department: s.activity?.department?.name || '',
      tower: s.activity?.tower?.name || '',
      process: s.activity?.process?.name || '',
      activity: s.activity?.name || '',
      currentFTE: s.activity?.currentFTE || 0,
      consolidate: s.consolidate,
      totalScore: s.totalScore
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/reports/fitment-summary
const getFitmentSummary = async (req, res) => {
  try {
    const scores = await FitmentScore.find({})
      .populate('employee', 'name department')
      .populate('employee.department', 'name');

    const counts = { Fit: 0, 'Train to Fit': 0, 'Low Fit': 0, Unfit: 0 };
    scores.forEach(s => {
      if (counts[s.remark] !== undefined) counts[s.remark]++;
    });

    const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });
    counts['Not Scored'] = Math.max(0, totalEmployees - scores.length);

    res.json({ counts, scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardSummary,
  getUtilization,
  getFteConsolidationSummary,
  getFteSummary,
  getFitmentSummary
};
