const Activity = require('../models/Activity');
const Process = require('../models/Process');
const Tower = require('../models/Tower');

// GET /api/eper/activities/by-department/:deptId
// Returns towers → processes → activities hierarchy
const getByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;

    const towers = await Tower.find({ department: deptId });
    const result = await Promise.all(towers.map(async (tower) => {
      const processes = await Process.find({ tower: tower._id });
      const processesWithActivities = await Promise.all(processes.map(async (proc) => {
        const activities = await Activity.find({ process: proc._id, isCustom: false });
        return { ...proc.toObject(), activities };
      }));
      return { ...tower.toObject(), processes: processesWithActivities };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/eper/activities/flat/:deptId  — flat list for AI mapping
const getFlatByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const activities = await Activity.find({ department: deptId, isCustom: false }).select('_id name');
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/eper/activities/custom
// Employee adds a custom activity
const addCustom = async (req, res) => {
  try {
    const { name, processId, towerId, deptId } = req.body;
    const activity = await Activity.create({
      name,
      process: processId,
      tower: towerId,
      department: deptId,
      isCustom: true,
      addedBy: req.user._id
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/eper/activities/:id
const updateActivity = async (req, res) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Activity not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getByDepartment, getFlatByDepartment, addCustom, updateActivity };
