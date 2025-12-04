const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/utilisateur');

// El-middleware hathi hiya el-mas2oula 3la 7mayet kol route
// Tkhammim kima el-gardien mta3 el-birket el-koll.
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Nchoufou kan el-token mawjoud fi el-header mta3 el-request 
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') // Lazem yibda b "Bearer "
    ) {
        try {
            // 2. Njibdou el-token, illi houa el-string illi ba3d "Bearer "
            token = req.headers.authorization.split(' ')[1];

            // 3. Nverifiou el-token باستعمال el-JWT_SECRET illi 7attinah fi .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Kan el-token s7i7, njiw nlawej 3al utilisateur fi el-database
            // FIX: Nasta3mlou .lean() bach njiwbou haja sdhila (plain object) w ma t3awelch el-validation mta3 el-model
            // w n7ottou les données mta3ou fi req.user bach nista3mlouhom fi el-controller
            req.user = await User.findById(decoded.id).select('_id role nom login').lean(); 
            
            // 5. N3addiw lel-middleware illi ba3dou wela lel-route controller
            next();

        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            res.status(401); // Erreur 401 (ma 3andouch 7a9)
            // Na3mlou throw bich el-asyncHandler ycatchi el-erreur w ywa99ef el-khedma 
            throw new Error('Not authorized, token failed');
        }
    }

    // Kan ma lqinech el-token fi el-header
    if (!token) {
        res.status(401); // Unauthorized (ma 3andouch 7a9)
        throw new Error('Not authorized, no token');
    }
});

// El-middleware (manager) hathi tzid verification bach tichouf kan el-utilisateur manager
const manager = (req, res, next) => {
    // Nchoufou kan el-utilisateur mawjoud w el-role mta3ou 'manager'
    if (req.user && req.user.role === 'manager') {
        next(); // Kan s7i7, n3addiw lel-route
    } else {
        res.status(401); // Unauthorized (ma 3andouch 7a9)
        // Yibda ma 3andouch el-role 'manager', nwaqfou el-khedma
        throw new Error('Not authorized as a manager');
    }
};

module.exports = { protect, manager };