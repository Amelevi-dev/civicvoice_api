const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        /*photo: {
            type: String,
            lowercase: true,
            trim: true,
            default: ''
        },*/
        sexe: {
            type: String,
            required: true,
            enum: ['n/A','Homme', 'Femme'],
            default: 'n/A',
        },
        age: {
            type: String,
            required: true
        },
        emailOrPhone: { // phone number
            type: String,
            required: true,
            unique: true,
            // index: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            // index: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        confirmationCode: {
            type: String,
            lowercase: true,
            default: "0",
            trim: true
        },
        role: {
            type: String,
            enum: ['citizen', 'authority', 'observer', 'admin'],
            required: true
        },
        ninaNumber: {
            type: String,
            unique: true,
            sparse: true, // Allow null for unverified citizens
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: true
        },
        arrondissement:{
            type: String,
            required: true,
            enum:[
                'Commune I', 'Commune II', 'Commune III', 'Commune IV', 'Commune V', 'Commune VI',
                'Commune I (Bamako)', 'Commune II (Bamako)', 'Commune III (Bamako)', 'Commune IV (Bamako)', 'Commune V (Bamako)', 'Commune VI (Bamako)',
                'Kayes', 'Koulikoro', 'Sikasso', 'Ségou', 'Mopti', 'Tombouctou', 'Gao', 'Kidal', 'Taoudénit', 'Ménaka', 'Dioïla', 'Kati'
            ]
        }
    },
    { timestamps: true }
);
const User = mongoose.model('User', userSchema);
module.exports = User;