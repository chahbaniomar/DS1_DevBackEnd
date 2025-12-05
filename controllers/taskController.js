const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Création d'une nouvelle task m3a projet
// @route   POST /api/tasks
// @access  Private (User ou Manager)
const createTask = asyncHandler(async (req, res) => {
    const { titre, description, statut, deadline, projet_associe } = req.body;
    const currentUserId = req.user._id;

    if (!titre || !projet_associe) {
        res.status(400);
        throw new Error('Titre taa task w projet li mratab bihhom lazemhom.');
    }

    // 1. Nchoufou ken projet mawjouda
    const project = await Project.findById(projet_associe);
    if (!project) {
        res.status(404);
        throw new Error('Projet mawjoudch.');
    }
    
    // 2. Ncreateiw task. By default, na3tiwh lel créateur
    const task = new Task({
        titre,
        description,
        statut: statut || 'todo',
        deadline,
        projet_associe,
        utilisateur_assigne: currentUserId, // By default lel li 3mlha
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
});


// @desc    Update task (yemkin include assignation, manager only)
// @route   PUT /api/tasks/:id
// @access  Private (User ou Manager)
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { titre, description, statut, deadline, utilisateur_assigne } = req.body;
    const currentUserRole = req.user.role;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task mawjoudch');
    }

    // A. Update taa assignation (manager bark)
    if (utilisateur_assigne) {
        // Rule taa projet: "Ghir manager yemkin y3ayet task lel user"
        if (currentUserRole !== 'manager') {
            res.status(403); // Forbidden
            throw new Error('Ghir manager yemkin y3ayet task lel user akhor.');
        }
        task.utilisateur_assigne = utilisateur_assigne;
    }
    
    // B. Update lkol shay okhor (ay user yemkin, ama normal lel assigned user w manager)
    if (titre) task.titre = titre;
    if (description) task.description = description;
    if (statut) {
        // Validation mawjouda fl schema Mongoose, ama n9adro n7absou status li ghalta
        if (!['todo', 'doing', 'done'].includes(statut)) {
            res.status(400);
            throw new Error('Statut lazm ykoun todo, doing, wala done.');
        }
        task.statut = statut;
    }
    if (deadline) task.deadline = deadline;

    const updatedTask = await task.save();
    res.json(updatedTask);
});


// @desc    Jib kol tasks mtaa projet mo3ayan
// @route   GET /api/tasks/project/:projectId
// @access  Private (User ou Manager)
const getTasksByProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;

    // Optional: n9adro nzido check ken user 3ando permission bach ychouf projet
    // (e.g., owned by him, wala manager). Tawa, na3mlo confiance fl sécurité taa projet.
    
    const tasks = await Task.find({ projet_associe: projectId })
        .populate('utilisateur_assigne', 'nom login')
        .sort({ deadline: 1 }); // example taa sorting basit

    res.json(tasks);
});

module.exports = { createTask, updateTask, getTasksByProject };
