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
            enum: ['en cours', 'approuver', 'rejeter'],
            default: 'en cours'
        }
    },
    { timestamps: true }
);
const Engagement = mongoose.model('Engagement', engagementSchema);

module.exports = Engagement;