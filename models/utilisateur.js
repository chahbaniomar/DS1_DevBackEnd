const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for password encryption

// Nistawrd bcrypt bach na3mlou Encryption mta3 mot_de_passe
// Define the User schema based on project requirements 
const userSchema = mongoose.Schema({
    nom: { 
        type: String, 
        required: true // Lazem esm ikoun mawjoud
    },
    login: { 
        type: String, 
        required: true, 
        unique: true // Lazem login ikoun unique 
    },
    mot_de_passe: { 
        type: String, 
        required: true // Bach yetkhazzen encrypted fi database
    },
    role: {
        type: String,
        required: true,
        default: 'user', // El valeur default hiya 'user'
        enum: ['user', 'manager'] // role lazm ikoun ya 'user' ya 'manager'
    },
    date_de_creation: { 
        type: Date, 
        default: Date.now // Yet7adad automatiqument ki yetsabb el compte
    },
}, {
    timestamps: true // Mongoose tzid tari5 el inchae w ta3dil
});


// El Middleware (Pre-save Hook) hathi tekhdem qbal ma na3mlou save lel utilisateur fi database
userSchema.pre('save', async function (next) {
    // Kan el mot_de_passe ma tbadlouch wala ma khedminach bih, nwaqqufou w na3ddi toul
    // FIX: Nista3mlou 'return' bach nDhammnou beli el-fonction toufaa lahna
    if (!this.isModified('mot_de_passe')) {
        return next(); 
    }
    
    // Nawalldou el "salt" (valeur 3achway2ia) illi bach nista3mlouh fi el tachfir
    const salt = await bcrypt.genSalt(10);
    
    // Nachaffrou mot_de_passe  by using salt
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    

});


// Method bach nit2akkdou men mot_de_passe waqt login
// Method hethi tqaren bin mot_de_passe illi dakhhalnah (mouch mchaffar) wl mot_de_passe el mchaffar illi fi database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.mot_de_passe);
};

// FIX: Nista3mlou Model name unique 'UserAuth'
const User = mongoose.model('UserAuth', userSchema);
module.exports = User;