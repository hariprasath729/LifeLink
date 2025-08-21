const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  // ... (other fields are the same)
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  requestType: { type: String, enum: ['blood', 'medicine'], required: true },
  details: { bloodType: String, medicineName: String, dosage: String, units: { type: Number, required: true } },
  urgency: { type: String, enum: ['Routine', 'High', 'Critical'], default: 'High' },
  
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'], // <-- 'Completed' is added
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);