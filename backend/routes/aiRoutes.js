const router = require('express').Router();
const { mapActivityRoute } = require('../controllers/aiController');
const verifyToken = require('../middleware/verifyToken');

router.post('/map-activity', verifyToken, mapActivityRoute);

module.exports = router;
