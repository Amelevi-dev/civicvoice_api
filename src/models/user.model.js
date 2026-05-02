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
            enum: ['citizen', 'authority'],
            required: true
            
        },
        arrondissement:{
            type: String,
            required: true,
            enum:['Premier Arrondissement','Deuxième Arrondissement','Troisième Arrondissement','Quatrième Arrondissement','Cinquième Arrondissement','Sixième Arrondissement','Septième Arrondissement']
        }
    },
    { timestamps: true }
);
const User = mongoose.model('User', userSchema);
module.exports = User;