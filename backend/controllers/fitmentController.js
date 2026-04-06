const FitmentScore = require('../models/FitmentScore');
const User = require('../models/User');

// POST /api/eper/fitment/score
const saveScore = async (req, res) => {
  try {
    const { employeeId, parameters } = req.body;

    // Upsert — one fitment score per employee per scorer
    const score = await FitmentScore.findOneAndUpdate(
      { employee: employeeId, scoredBy: req.user._id },
      { employee: employeeId, scoredBy: req.user._id, parameters },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Run calculation manually (findOneAndUpdate doesn't trigger pre-save)
    const WEIGHTAGES = {
      pmsRating: 0.05, complexityOfWork: 0.10, changeReadiness: 0.10,
      serviceOrientation: 0.10, teamPlayer: 0.08, locationPreference: 0.05,
      qualifications: 0.09, expCurrentRole: 0.10, totalExperience: 0.06,
      currentCtc: 0.05, multiplexer: 0.07, communicativeness: 0.07, selfMotivated: 0.08
    };

    let total = 0;
    let weighted = 0;
    const p = score.parameters;
    Object.keys(WEIGHTAGES).forEach(key => {
      const s = p[key] || 0;
      total += s;
      weighted += s * WEIGHTAGES[key];
    });

    score.totalScore = total;
    score.weightedScore = parseFloat(weighted.toFixed(2));

    if (weighted <= 10) score.remark = 'Unfit';
    else if (weighted > 10 && weighted < 20) score.remark = 'Low Fit';
    else if (weighted >= 20 && weighted <= 30) score.remark = 'Train to Fit';
    else score.remark = 'Fit';

    await score.save();
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/fitment/employee/:employeeId
const getByEmployee = async (req, res) => {
  try {
    const score = await FitmentScore.findOne({ employee: req.params.employeeId })
      .populate('employee', 'name email grade department')
      .populate('scoredBy', 'name');
    if (!score) return res.status(404).json({ message: 'No fitment score found.' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/fitment/team
const getTeamScores = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'supervisor') {
      const teamMembers = await User.find({ reportingTo: req.user._id }).select('_id');
      query = { employee: { $in: teamMembers.map(m => m._id) } };
    }

    const scores = await FitmentScore.find(query)
      .populate('employee', 'name email grade department')
      .populate('scoredBy', 'name');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { saveScore, getByEmployee, getTeamScores };
