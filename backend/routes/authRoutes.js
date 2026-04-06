const router = require('express').Router();
const { register, login, getMe, getAllUsers } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyToken, allowRoles('admin'), getAllUsers);

module.exports = router;
