const express = require('express'); // nimportiw express
const dotenv = require('dotenv'); // nimportiw dotenv: bch na9raw variables mel .env
const connectDB = require('./config/db.js'); // fonction bch tsahelna na3mlou connexion m3a database

// Imports taa routes
const authRoutes = require('./routes/authRoutes.js'); // routes mta3 l'authentification (register/login)
const projectRoutes = require('./routes/projectRoutes.js'); // routes mta3 projets
const taskRoutes = require('./routes/taskRoutes.js'); // routes mta3 tasks

// CONFIGURATION 

// Load environment variables from .env file
dotenv.config(); // houni na9raw variables confidential bch nist3mlohom fil app (PORT, DB URI...)


// Connect to Database
connectDB(); // houni na3mlou connexion m3a la base de données (MongoDB wela ay base)

const app = express(); // naamlou instance mel express, heya l server mta3na

// Middleware for parsing JSON requests (needed to read data from POST requests)
app.use(express.json()); // middleware bch y5allina na9raw JSON body fil requests (POST/PUT)

// Basic Test Route
app.get('/', (req, res) => { // route test bch n3arfo eli server khadem
    res.send('API is running...');
});

// --- API ROUTES ---
// Authentication Routes: POST /api/auth/register & /api/auth/login
app.use('/api/auth', authRoutes); // kol chy b /api/auth ymchi lel authRoutes

// Project Routes: POST/GET /api/projects (Protected)
app.use('/api/projects', projectRoutes); // kol requests b /api/projects ymchiw lel projectRoutes

// Task Routes: POST/PUT/GET /api/tasks (Protected)
app.use('/api/tasks', taskRoutes); // kol requests b /api/tasks ymchiw lel taskRoutes


// --- ERROR HANDLERS ---
// These MUST be placed after all other routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js'); 
app.use(notFound); // middleware: ki l route mch mawjouda yji houni
app.use(errorHandler); // middleware: bch yjib errors w yb3ath response mratba


// --- SERVER START ---
const PORT = process.env.PORT || 5000; // naakhou port men .env wala nrod 5000 par défaut

app.listen(PORT, console.log(`Server running on port ${PORT}`)); // nbdew server w nprintiw port li ykhdem 3lih
