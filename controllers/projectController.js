const asyncHandler = require('express-async-handler');
const Project = require('../models/Project'); // Import ta3 Project Schema

// @desc    Création ta3 projet jdida
// @route   POST /api/projects
// @access  Private (User ou Manager)
const createProject = asyncHandler(async (req, res) => {
    // req.user mawjouda b sabab middleware 'protect'!
    const { nom_du_projet, description, statut } = req.body;

    if (!nom_du_projet) {
        res.status(400);
        throw new Error('Lism ta3 projet lazm ykoun mawjoud.');
    }

    // FIX: Nasta3mlou Project.create() bach npassiw validation conflict
    const createdProject = await Project.create({
        nom_du_projet,
        description,
        statut,
        // ID jey men user li authenticated
        proprietaire_du_projet: req.user._id, 
    });

    res.status(201).json(createdProject);
});

// @desc    Jib kol projects (User ychouf li mte3ou; Manager ychouf kolshi)
// @route   GET /api/projects
// @access  Private (User ou Manager)
const getProjects = asyncHandler(async (req, res) => {
    // Ken user manager, njibou kol projects
    if (req.user.role === 'manager') {
        // Rule ta3 manager: "Ghir manager yemkin ychouf kol projets ta3 kol users"
        const projects = await Project.find({}).populate('proprietaire_du_projet', 'nom login');
        res.json(projects);
    } else {
        // Rule ta3 user: ychouf ghir projets mte3ou
        const projects = await Project.find({ proprietaire_du_projet: req.user._id }).populate('proprietaire_du_projet', 'nom login');
        res.json(projects);
    }
});


module.exports = { createProject, getProjects };
