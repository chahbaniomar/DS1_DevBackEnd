// Middleware for handling 404 (Not Found) errors
const notFound = (req, res, next) => {
    // El middleware hathi tekhdem ki ykoun el URL ghalet wela mouch mawjoud
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Nraj3ou el status 404 (mouch mawjoud)
    next(error); // N3addiw erreur lel errorHandler illi ba3dou
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
    // N7adeddou el statusCode s7i7. Kan el status kan 200 (s7i7), nwalliouh 500 (erreur serveur)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);

    // Nraj3ou reponse  fi chkel JSON mrateb
    res.json({
        message: err.message, // Naffichou juste lmessage mta3 lerreur
        // El stack trace  n7otouh ken fi mode development 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };