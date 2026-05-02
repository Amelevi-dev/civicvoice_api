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
            enum: ['Premier Arrondissement','Deuxième Arrondissement','Troisième Arrondissement','Quatrième Arrondissement','Cinquième Arrondissement','Sixième Arrondissement','Septième Arrondissement']
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
            enum: ['active', 'closed'],
            default: 'active'
        },
        
    },
    { timestamps: true }
);
const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;