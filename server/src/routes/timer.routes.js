const express = require('express');
const router = express.Router();
const timerController = require('../controllers/timerController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/start', timerController.startSession);
router.get('/current', timerController.getCurrentSession);
router.post('/complete', timerController.completeSession);
router.post('/cancel', timerController.cancelSession);
router.get('/stats', timerController.getSessionStats);

module.exports = router;