const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
    {
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        consultationId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true
        },
        choice : {
            type: String,
            enum: ['yes', 'no', 'abstain'],
            required: true
        }

    },
    { timestamps: true }
);

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;