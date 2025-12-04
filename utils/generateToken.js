const jwt = require('jsonwebtoken'); // nimportiw jsonwebtoken bch ncréiw tokens JWT

// Function to generate the JWT
const generateToken = (id, role) => { // fonction tsna3 token w taakhou user id w role
    // We sign the token with the user's ID and role, and the secret key from the .env file
    return jwt.sign(
        { id, role }, // Payload: Data to include in the token (hachya eli n7ottouha jawwa token)
        process.env.JWT_SECRET, // Secret key from .env (clé secreta bch nasn3ou biha token)
        {
            expiresIn: '30d', // The token expires in 30 days (token yb9a 30 yom w yexpire)
        }
    );
};

module.exports = generateToken; // nasadirou fonction bch najmou nist3mloha fi fichiers okhrin
