const Setting = require('../models/Setting');

// GET /api/eper/settings/standardHours
const getStandardHours = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'standardHours' });
    res.json({ value: setting ? setting.value : 160 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/eper/settings/standardHours  (admin only)
const updateStandardHours = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || isNaN(value) || value < 1) {
      return res.status(400).json({ message: 'Invalid value for standardHours.' });
    }
    const setting = await Setting.findOneAndUpdate(
      { key: 'standardHours' },
      { value: Number(value) },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/settings/all  (admin)
const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStandardHours, updateStandardHours, getAllSettings };
