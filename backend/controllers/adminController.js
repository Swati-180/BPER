const Setting = require('../models/Setting');
const User = require('../models/User');

// GET /api/admin/submission-window
const getSubmissionWindow = async (req, res) => {
  try {
    const existing = await Setting.findOne({ key: 'submissionWindow' });

    const now = new Date();
    let openAt;
    let closeAt;

    if (existing && existing.value) {
      openAt = existing.value.openAt ? new Date(existing.value.openAt) : null;
      closeAt = existing.value.closeAt ? new Date(existing.value.closeAt) : null;
    }

    // Default window: opened now, closes in 15 days if not configured.
    if (!openAt || Number.isNaN(openAt.getTime())) openAt = now;
    if (!closeAt || Number.isNaN(closeAt.getTime())) {
      closeAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    }

    const isOpen = now >= openAt && now <= closeAt;
    const remainingMs = Math.max(0, closeAt.getTime() - now.getTime());

    return res.json({
      openAt: openAt.toISOString(),
      closeAt: closeAt.toISOString(),
      isOpen,
      now: now.toISOString(),
      remainingMs,
      message: isOpen ? 'Submission window is open.' : 'Submissions are closed'
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/pending-users
const getPendingUsers = async (_req, res) => {
  try {
    const users = await User.find({ isActive: false })
      .select('name email role requestedRole createdAt')
      .sort({ createdAt: -1 });

    const formatted = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      requestedRole: user.requestedRole || user.role || 'employee',
      createdAt: user.createdAt,
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/approve
const approvePendingUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isActive) return res.status(400).json({ message: 'User is already active.' });

    user.role = user.requestedRole || user.role || 'employee';
    user.isActive = true;
    await user.save();

    return res.json({ message: 'User approved successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/reject
const rejectPendingUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isActive) return res.status(400).json({ message: 'Active users cannot be rejected.' });

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User request rejected successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getSubmissionWindow, getPendingUsers, approvePendingUser, rejectPendingUser };
