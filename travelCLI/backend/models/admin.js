const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  collection: 'admins' 
});


module.exports = mongoose.model('Admin', adminSchema);
