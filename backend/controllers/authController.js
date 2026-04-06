const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, department, tower, grade, reportingTo } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, role, department, tower, grade, reportingTo });
    res.status(201).json({ message: 'User created successfully.', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .populate('department', 'code name')
      .populate('tower', 'name');
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is inactive.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        tower: user.tower,
        grade: user.grade
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('department', 'code name')
      .populate('tower', 'name')
      .populate('reportingTo', 'name email');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/users  (admin only - get all users)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('department', 'code name')
      .populate('tower', 'name')
      .populate('reportingTo', 'name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, getAllUsers };
