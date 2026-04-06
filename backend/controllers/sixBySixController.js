const SixBySixScore = require('../models/SixBySixScore');
const Activity = require('../models/Activity');

// POST /api/eper/sixbysix/score
const saveScore = async (req, res) => {
  try {
    const { activityId, departmentId, parameters, comments } = req.body;

    // Upsert — one score per activity per scorer
    const score = await SixBySixScore.findOneAndUpdate(
      { activity: activityId, scoredBy: req.user._id },
      {
        activity: activityId,
        scoredBy: req.user._id,
        department: departmentId,
        parameters,
        comments: comments || ''
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Manually run pre-save hook logic for upsert (findOneAndUpdate doesn't trigger pre-save)
    const p = score.parameters;
    const perfKeys = ['multipleLocns', 'routine', 'volumes', 'manpower', 'sops', 'erpTechnology'];
    const charKeys = ['sensitivity', 'criticality', 'controls', 'proximity', 'regulatory', 'skill'];
    const perfScore = perfKeys.filter(k => p[k] === 'H').length;
    const charScore = charKeys.filter(k => p[k] === 'L').length;
    score.totalScore = perfScore + charScore;
    score.consolidate = score.totalScore >= 7;
    await score.save();

    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/sixbysix/results/:deptId
const getResultsByDept = async (req, res) => {
  try {
    const scores = await SixBySixScore.find({ department: req.params.deptId })
      .populate('activity', 'name process tower')
      .populate('scoredBy', 'name');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/sixbysix/consolidation-output
const getConsolidationOutput = async (req, res) => {
  try {
    const allScores = await SixBySixScore.find({})
      .populate('activity', 'name process tower department')
      .populate('activity.tower', 'name');

    const canConsolidate = allScores.filter(s => s.consolidate);
    const cannotConsolidate = allScores.filter(s => !s.consolidate);

    res.json({
      total: allScores.length,
      consolidatable: canConsolidate.length,
      notConsolidatable: cannotConsolidate.length,
      consolidatablePct: allScores.length > 0
        ? ((canConsolidate.length / allScores.length) * 100).toFixed(1)
        : 0,
      activities: allScores.map(s => ({
        _id: s._id,
        activity: s.activity,
        totalScore: s.totalScore,
        consolidate: s.consolidate,
        comments: s.comments
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { saveScore, getResultsByDept, getConsolidationOutput };
