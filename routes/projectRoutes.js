const express = require('express'); // nimportiw express bch naamlou router
const { createProject, getProjects } = require('../controllers/projectController'); // fonctions mtaa création w affichage projets
const { protect } = require('../middleware/authMiddleware'); // middleware protect bch yverifi token

const router = express.Router(); // naamlou router mel express

// All routes here are protected (requires a valid JWT)
router.route('/')
    .post(protect, createProject) // kol user m authentifié ynajm ycréi project (protect yverifi token)
    .get(protect, getProjects);  // kol user m authentifié ynajm yaffichi projects (controller yfarreq bin manager w user)

module.exports = router; // nasadrou router bch nest3mlouha fil server
