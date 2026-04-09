const router = require('express').Router();
const { saveScore, getByEmployee, getTeamScores } = require('../controllers/fitmentController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.post('/score', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), saveScore);
router.get('/employee/:employeeId', verifyToken, getByEmployee);
router.get('/team', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getTeamScores);

module.exports = router;
