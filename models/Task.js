const mongoose = require('mongoose');

// N3amlou el-Schema mta3 el Tache
const taskSchema = mongoose.Schema({
    titre: {
        type: String,
        required: true, // Lazem ikoun 3andek Titre lel Tache
    },
    description: {
        type: String,
    },
    statut: {
        type: String,
        required: true,
        default: 'todo', // El valeur default hiya 'todo' 
        // El valeurs el permitted 
        enum: ['todo', 'doing', 'done'], 
    },
    deadline: {
        type: Date, // Deadline 
    },
    // Reference lel Project illi taba3tou el Tache hathi
    projet_associe: {
        type: mongoose.Schema.Types.ObjectId, // Hatha el ID 
        required: true, // Lazem na3rfou chkoun el Project illi taba3tou
        ref: 'Projet', // Tconnectih lel Model mta3 Projet
    },
    // Reference lel Utilisateur illi m'asssigni 3lih el Tache
    utilisateur_assigne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth', // T connectih lel Model mta3 el Utilisateur
    },
    date_de_creation: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Mongoose tzid tari5 el inchae w modification automatiqument
});

const Task = mongoose.model('Tache', taskSchema);
module.exports = Task;