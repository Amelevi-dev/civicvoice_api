const mongoose = require('mongoose');


const engagementSchema = new mongoose.Schema(
    {
        authorityId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        consultationId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true
        },
        content : {
            type: String,
            required: true
        },
        status : {
            type: String,
            enum: ['en cours', 'réalisé', 'non tenu', 'annulé'],
            default: 'en cours'
        },
        deadline: {
            type: Date,
            required: false
        },
        updates: [{
            content: String,
            date: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);
const Engagement = mongoose.model('Engagement', engagementSchema);

module.exports = Engagement;