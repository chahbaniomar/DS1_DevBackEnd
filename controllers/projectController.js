const asyncHandler = require('express-async-handler');
const Project = require('../models/Project'); // Import the Project Schema

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (User or Manager)
const createProject = asyncHandler(async (req, res) => {
    // req.user is available because of the 'protect' middleware!
    const { nom_du_projet, description, statut } = req.body;

    if (!nom_du_projet) {
        res.status(400);
        throw new Error('Project name is required.');
    }

    // FIX: Nasta3mlou Project.create() lel-tathmin bech yitpassa el-validation conflict
    const createdProject = await Project.create({
        nom_du_projet,
        description,
        statut,
        // The ID comes from the authenticated user
        proprietaire_du_projet: req.user._id, 
    });

    res.status(201).json(createdProject);
});

// @desc    Get all projects (User sees only their own; Manager sees all)
// @route   GET /api/projects
// @access  Private (User or Manager)
const getProjects = asyncHandler(async (req, res) => {
    // If the user is a manager, find all projects
    if (req.user.role === 'manager') {
        // Manager rule: "Seul le manager peut voir tous les projets de tous les utilisateurs" 
        const projects = await Project.find({}).populate('proprietaire_du_projet', 'nom login');
        res.json(projects);
    } else {
        // User rule: See only their own projects
        const projects = await Project.find({ proprietaire_du_projet: req.user._id }).populate('proprietaire_du_projet', 'nom login');
        res.json(projects);
    }
});


module.exports = { createProject, getProjects };