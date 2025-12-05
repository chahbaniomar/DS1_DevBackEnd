const asyncHandler = require('express-async-handler'); // Helper bach nhandle errors mtaa async
const User = require('../models/utilisateur'); // Import ta3 User Schema
const generateToken = require('../utils/generateToken'); // Import JWT generator

// @desc    Register user jdida
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // 1. Njeebou data taa user men req.body
    const { nom, login, mot_de_passe, role } = req.body;

    // 2. Nchoufou ken user mawjouda deja
    const userExists = await User.findOne({ login });

    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User bih login hedha mawjouda deja.');
    }

    // 3. Ncreateiw user jdida (password yet-hash automatiquement fl pre-save hook fi models/User.js)
    const user = await User.create({
        nom,
        login,
        mot_de_passe,
        role: role || 'user', // Default role 'user' ken ma t3aytch
    });

    if (user) {
        res.status(201).json({ // 201: Created
            _id: user._id,
            nom: user.nom,
            login: user.login,
            role: user.role,
            token: generateToken(user._id, user.role), // Ngenerateiw JWT
        });
    } else {
        res.status(400);
        throw new Error('Data ta3 user ghalta');
    }
});

// @desc    Authenticate user w jib token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { login, mot_de_passe } = req.body;

    // 1. Nlawa 3la user b login
    const user = await User.findOne({ login });

    // 2. Nchoufou ken user mawjouda w password sahih (using method mtaa models/User.js)
    if (user && (await user.matchPassword(mot_de_passe))) {
        res.json({
            _id: user._id,
            nom: user.nom,
            login: user.login,
            role: user.role,
            token: generateToken(user._id, user.role), // Ngenerateiw JWT
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Login wala password ghalta');
    }
});

module.exports = { registerUser, loginUser };
