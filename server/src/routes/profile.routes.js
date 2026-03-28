const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);
router.delete('/avatar', profileController.deleteAvatar);

module.exports = router;