const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');
const {
	getSubmissionWindow,
	getPendingUsers,
	approvePendingUser,
	rejectPendingUser,
} = require('../controllers/adminController');

router.get('/submission-window', verifyToken, getSubmissionWindow);
router.get('/pending-users', verifyToken, allowRoles('admin'), getPendingUsers);
router.patch('/users/:id/approve', verifyToken, allowRoles('admin'), approvePendingUser);
router.patch('/users/:id/reject', verifyToken, allowRoles('admin'), rejectPendingUser);

module.exports = router;
