const router = require('express').Router();
const { register, requestAccess, login, getMe, getAllUsers, updateUser, resetUserPassword, bulkUpdateUsers } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.post('/register', register);
router.post('/request-access', requestAccess);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyToken, allowRoles('admin'), getAllUsers);
router.patch('/users/:id', verifyToken, allowRoles('admin'), updateUser);
router.post('/users/:id/reset-password', verifyToken, allowRoles('admin'), resetUserPassword);
router.patch('/users/bulk', verifyToken, allowRoles('admin'), bulkUpdateUsers);

module.exports = router;
