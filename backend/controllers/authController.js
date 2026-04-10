const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST /api/auth/request-access
const requestAccess = async (req, res) => {
  try {
    const { name, email, password, department, grade, requestedRole, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const allowedRequestedRoles = ['employee', 'supervisor', 'tower_lead'];
    const safeRequestedRole = allowedRequestedRoles.includes(requestedRole) ? requestedRole : 'employee';

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save hook
      role: 'employee',
      requestedRole: safeRequestedRole,
      department: department || null,
      grade: grade || '',
      company: company || null,
      status: 'pending',
      isActive: false
    });

    console.log(`New access request: ${email} - pending approval`);

    return res.status(201).json({
      message: 'Access request submitted. Awaiting admin approval.',
      userId: user._id
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'employee', department, tower, grade, reportingTo } = req.body;
    
    // 1. Basic Presence Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // 2. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    // 3. Password Strength Validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // 4. Role Validation
    const validRoles = ['admin', 'tower_lead', 'supervisor', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role provider. Choose from: ${validRoles.join(', ')}` });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      role, 
      department, 
      tower, 
      grade, 
      reportingTo,
      status: 'active',
      isActive: true
    });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
      message: 'User created successfully.', 
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        tower: user.tower,
        grade: user.grade
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .populate('department', 'code name')
      .populate('tower', 'name');
    
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    
    // Check if account is active
    if (user.isActive === false || user.status === 'pending') {
      return res.status(403).json({ message: 'Account pending approval.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
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
    const user = await User.findById(req.user._id || req.user.userId)
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

// PATCH /api/auth/users/:id
const updateUser = async (req, res) => {
  try {
    const { role, isActive, grade, reportingTo, status } = req.body;
    const updates = {};

    if (role) {
      const allowedRoles = ['admin', 'tower_lead', 'supervisor', 'employee'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      updates.role = role;
    }

    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (status) updates.status = status;
    if (typeof grade === 'string') updates.grade = grade;
    if (reportingTo !== undefined) updates.reportingTo = reportingTo || null;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select('-password')
      .populate('department', 'code name')
      .populate('tower', 'name')
      .populate('reportingTo', 'name email');

    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ message: 'User updated.', user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/users/:id/reset-password
const resetUserPassword = async (req, res) => {
  try {
    const { tempPassword } = req.body;
    if (!tempPassword || tempPassword.length < 8) {
      return res.status(400).json({ message: 'Temporary password with minimum 8 characters is required.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = tempPassword;
    await user.save();
    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/auth/users/bulk
const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, action, role } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'userIds is required.' });
    }

    const query = { _id: { $in: userIds } };

    if (action === 'deactivate') {
      await User.updateMany(query, { $set: { isActive: false, status: 'inactive' } });
      return res.json({ message: 'Users deactivated.' });
    }

    if (action === 'activate') {
      await User.updateMany(query, { $set: { isActive: true, status: 'active' } });
      return res.json({ message: 'Users activated.' });
    }

    if (action === 'change_role') {
      const allowedRoles = ['admin', 'tower_lead', 'supervisor', 'employee'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'A valid role is required for role change.' });
      }
      await User.updateMany(query, { $set: { role } });
      return res.json({ message: 'Roles updated.' });
    }

    return res.status(400).json({ message: 'Unsupported bulk action.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { register, requestAccess, login, getMe, getAllUsers, updateUser, resetUserPassword, bulkUpdateUsers };
