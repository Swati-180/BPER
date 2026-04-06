const router = require('express').Router();
const { saveScore, getResultsByDept, getConsolidationOutput } = require('../controllers/sixBySixController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.post('/score', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), saveScore);
router.get('/results/:deptId', verifyToken, getResultsByDept);
router.get('/consolidation-output', verifyToken, getConsolidationOutput);

module.exports = router;
