const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: null
  },
});


module.exports = mongoose.model('User', userSchema);
