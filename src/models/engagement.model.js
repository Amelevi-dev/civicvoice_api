const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema(
{
   authorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
      required: true
   },

   description: {
      type: String,
      required: true
   },

   status: {
      type: String,
      enum: [
         'pending',
         'in_progress',
         'completed',
         'cancelled'
      ],
      default: 'pending'
   },

   progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
   },

   dueDate: {
      type: Date
   }

},
{ timestamps: true }
);

module.exports =
mongoose.model('Engagement', engagementSchema);