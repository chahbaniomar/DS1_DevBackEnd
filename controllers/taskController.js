const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task associated with a project
// @route   POST /api/tasks
// @access  Private (User or Manager)
const createTask = asyncHandler(async (req, res) => {
    const { titre, description, statut, deadline, projet_associe } = req.body;
    const currentUserId = req.user._id;

    if (!titre || !projet_associe) {
        res.status(400);
        throw new Error('Task title and associated project are required.');
    }

    // 1. Verify the project exists
    const project = await Project.findById(projet_associe);
    if (!project) {
        res.status(404);
        throw new Error('Project not found.');
    }
    
    // 2. Create the task. By default, assign it to the creator.
    const task = new Task({
        titre,
        description,
        statut: statut || 'todo',
        deadline,
        projet_associe,
        utilisateur_assigne: currentUserId, // Default to creator
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
});


// @desc    Update a task (including assignment, restricted to manager)
// @route   PUT /api/tasks/:id
// @access  Private (User or Manager)
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { titre, description, statut, deadline, utilisateur_assigne } = req.body;
    const currentUserRole = req.user.role;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // A. Handle task assignment update (Manager-only rule)
    if (utilisateur_assigne) {
        // Project requirement: "Seul le manager peut affecter une tâche à un utilisateur"
        if (currentUserRole !== 'manager') {
            res.status(403); // Forbidden
            throw new Error('Only a manager can assign a task to another user.');
        }
        task.utilisateur_assigne = utilisateur_assigne;
    }
    
    // B. Handle other updates (Allowed for any user, but typically only the assigned user/manager)
    if (titre) task.titre = titre;
    if (description) task.description = description;
    if (statut) {
        // Validation is handled by the Mongoose schema, but we can prevent bad status explicitly
        if (!['todo', 'doing', 'done'].includes(statut)) {
            res.status(400);
            throw new Error('Statut must be todo, doing, or done.');
        }
        task.statut = statut;
    }
    if (deadline) task.deadline = deadline;

    const updatedTask = await task.save();
    res.json(updatedTask);
});


// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private (User or Manager)
const getTasksByProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;

    // Optional: Add logic to ensure the user has permission to view this project
    // (e.g., they own it, or they are a manager). For now, we rely on project security.
    
    const tasks = await Task.find({ projet_associe: projectId })
        .populate('utilisateur_assigne', 'nom login')
        .sort({ deadline: 1 }); // Simple sorting example

    res.json(tasks);
});

module.exports = { createTask, updateTask, getTasksByProject };