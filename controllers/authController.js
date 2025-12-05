const asyncHandler = require('express-async-handler'); // Helper for handling async errors
const User = require('../models/utilisateur'); // Import the User Schema
const generateToken = require('../utils/generateToken'); // Import the JWT generator

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user data from the request body
    const { nom, login, mot_de_passe, role } = req.body;

    // 2. Check if the user already exists
    const userExists = await User.findOne({ login });

    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User with this login already exists.'); // The asyncHandler will catch this
    }

    // 3. Create the new user (password is automatically hashed by the pre-save hook in models/User.js)
    const user = await User.create({
        nom,
        login,
        mot_de_passe,
        role: role || 'user', // Default role is 'user' if not specified
    });

    if (user) {
        res.status(201).json({ // 201: Created
            _id: user._id,
            nom: user.nom,
            login: user.login,
            role: user.role,
            token: generateToken(user._id, user.role), // Generate JWT
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { login, mot_de_passe } = req.body;

    // 1. Find the user by login
    const user = await User.findOne({ login });

    // 2. Check if user exists AND if the password matches (using the custom method from models/User.js)
    if (user && (await user.matchPassword(mot_de_passe))) {
        res.json({
            _id: user._id,
            nom: user.nom,
            login: user.login,
            role: user.role,
            token: generateToken(user._id, user.role), // Generate JWT
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid login or password');
    }
});

module.exports = { registerUser, loginUser };