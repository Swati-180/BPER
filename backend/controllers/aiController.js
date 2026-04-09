const { mapActivity } = require('../utils/aiActivityMapper');
const Activity = require('../models/Activity');

// POST /api/eper/ai/map-activity
const mapActivityRoute = async (req, res) => {
  try {
    const { customText, departmentId } = req.body;
    if (!customText || !departmentId) {
      return res.status(400).json({ message: 'customText and departmentId are required.' });
    }

    const activities = await Activity.find({ department: departmentId, isCustom: false }).select('_id name');
    const result = await mapActivity(customText, activities);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { mapActivityRoute };
