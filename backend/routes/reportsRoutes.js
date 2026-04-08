const router = require('express').Router();
const {
  getDashboardSummary, getUtilization,
  getFteConsolidationSummary, getFteSummary, getFitmentSummary
} = require('../controllers/reportsController');
const verifyToken = require('../middleware/verifyToken');
const { allowRoles } = require('../middleware/roleCheck');

router.get('/dashboard-summary', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getDashboardSummary);
router.get('/utilization', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getUtilization);
router.get('/fte-consolidation-summary', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getFteConsolidationSummary);
router.get('/fte-summary', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getFteSummary);
router.get('/fitment-summary', verifyToken, allowRoles('admin', 'supervisor', 'tower_lead'), getFitmentSummary);

module.exports = router;
