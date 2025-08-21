const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['hospital', 'donor'],
    required: true,
  },
  profile: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    
    // Hospital-specific fields
    donorSecretKey: {
      type: String,
    },

    // Donor-specific fields
    bloodType: String,
    registeredByHospital: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);