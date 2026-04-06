const router = require('express').Router();
const { getByDepartment, getFlatByDepartment, addCustom, updateActivity } = require('../controllers/activityController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.get('/by-department/:deptId', verifyToken, getByDepartment);
router.get('/flat/:deptId', verifyToken, getFlatByDepartment);
router.post('/custom', verifyToken, addCustom);
router.put('/:id', verifyToken, allowRoles('admin', 'tower_lead'), updateActivity);

module.exports = router;
