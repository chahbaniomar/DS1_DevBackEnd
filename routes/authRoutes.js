const express = require('express');
// Nistawrdou les fonctions mta3 lcontroller illi fihom el logic (register w login)
const { registerUser, loginUser } = require('../controllers/authController');

// N3amllou instance (version) mta3 el Router mta3 Express
const router = express.Router();

// El Route  mta3 tasjil (Registration)
// Ki tji POST 3al /api/auth/register, nkhaddmou  registerUser
router.post('/register', registerUser);

// El route mta3 Login
// Ki tji POST 3al /api/auth/login, nkhaddmou loginUser
router.post('/login', loginUser);

module.exports = router;