const express = require('express'); // nimportiw express bch naamlou router
const { createTask, updateTask, getTasksByProject } = require('../controllers/taskController'); // naakhou functions mel controller
const { protect } = require('../middleware/authMiddleware'); // middleware protect bch yverifi token

const router = express.Router(); // naamlou router jdida taa express

// Route for creating a new task
// POST /api/tasks
router.route('/')
    .post(protect, createTask); // protect: yverifi token, ba3d ycréi tas9a new task

// Route for getting tasks by project ID
// GET /api/tasks/project/:projectId
router.route('/project/:projectId')
    .get(protect, getTasksByProject); // yjib tasks mtaa project mo3ayan (m3a token obligatoire)

// Route for updating a specific task
// PUT /api/tasks/:id
router.route('/:id')
    .put(protect, updateTask); // ybadel task mo3yana bech tekhdem PUT

module.exports = router; // nasadrou router bch nest3mlouha fil server principal
