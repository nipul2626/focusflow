const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);


router.get('/', taskController.getTasks);


router.post('/', taskController.createTask);


router.get('/:id', taskController.getTaskById);


router.put('/:id', taskController.updateTask);


router.delete('/:id', taskController.deleteTask);


router.patch('/:id/complete', taskController.completeTask);


router.patch('/:id/restore', taskController.restoreTask);

module.exports = router;