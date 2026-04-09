const router = require('express').Router();
const { getStandardHours, updateStandardHours, getAllSettings } = require('../controllers/settingsController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.get('/standardHours', verifyToken, getStandardHours);
router.put('/standardHours', verifyToken, allowRoles('admin'), updateStandardHours);
router.get('/all', verifyToken, allowRoles('admin'), getAllSettings);

module.exports = router;
