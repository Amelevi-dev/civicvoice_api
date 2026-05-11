const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
    {
        title :{
            type:String,
            required:true  
        },
        description : {
            type:String,
            required:true
        },
        arrondissement: {
            type: String,
            required: true,
            enum: ['1er Arrondissement','2e Arrondissement','3e Arrondissement','4e Arrondissement','5e Arrondissement','6e Arrondissement','7e Arrondissement']
        },
        quartier: {
            type: String,
            required: true
        },
        createdBy : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startDate : {
            type: Date,
            required:true
        },
        endDate : {
            type: Date,
            required:true
        },
        status : {
            type: String,
            enum: ['active', 'closed', 'archived'],
            default: 'active'
        },
        
    },
    { timestamps: true }
);
const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;