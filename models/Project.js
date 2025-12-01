const mongoose = require('mongoose');

// N3amlou Schema mta3 Project 
const projectSchema = mongoose.Schema({
    nom_du_projet: {
        type: String,
        required: true, // Lazem ikoun 3andek ism lel projet
    },
    description: {
        type: String,
    },
    // Reference lel utilisateur illi 3mal el projet
    proprietaire_du_projet: {
        type: mongoose.Schema.Types.ObjectId, // Hatha el ID 
        required: true, // Lazem ikoun mawjoud
        ref: 'UserAuth', // FIX: Tconnectih lel Model mtaa UserAuth
    },
    statut: {
        type: String,
        default: 'en cours', // El valeur default hiya 'en cours' 
        enum: ['en cours', 'terminé', 'en pause'], // El valeurs el permitted 
    },
    date_de_creation: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Mongoose tzid tari5 el incha2 w ta3dil automatiqument
});

const Project = mongoose.model('Projet', projectSchema);
module.exports = Project;