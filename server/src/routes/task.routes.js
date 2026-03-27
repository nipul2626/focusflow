const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All task routes require authentication
router.use(auth);

// GET /api/tasks - Get all tasks (with filters)
router.get('/', taskController.getTasks);

// POST /api/tasks - Create task
router.post('/', taskController.createTask);

// GET /api/tasks/:id - Get single task
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Archive task
router.delete('/:id', taskController.deleteTask);

// PATCH /api/tasks/:id/complete - Mark complete
router.patch('/:id/complete', taskController.completeTask);

// PATCH /api/tasks/:id/restore - Restore archived
router.patch('/:id/restore', taskController.restoreTask);

module.exports = router;