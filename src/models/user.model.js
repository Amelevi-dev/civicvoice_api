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
            required: function() { return this.role === 'citizen'; },
            enum: ['n/A','Homme', 'Femme'],
            default: 'n/A',
        },
        age: {
            type: String,
            required: function() { return this.role === 'citizen'; }
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
        status: {
            type: Boolean,
            default: true
        },
        arrondissement:{
            type: String,
            required: true,
            enum:['1er Arrondissement','2e Arrondissement','3e Arrondissement','4e Arrondissement','5e Arrondissement','6e Arrondissement','7e Arrondissement']
        },
        quartier:{
            type: String,
            required: true
        },
        // Champs spécifiques aux autorités
        institutionName: {
            type: String,
            required: function() { return this.role === 'authority'; }
        },
        institutionType: {
            type: String,
            required: function() { return this.role === 'authority'; }
        },
        managerName: {
            type: String,
            required: function() { return this.role === 'authority'; }
        },
        managerRole: {
            type: String,
            required: function() { return this.role === 'authority'; }
        }
    },
    { timestamps: true }
);
const User = mongoose.model('User', userSchema);
module.exports = User;