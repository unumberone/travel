const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: String,
  distance: Number,
  price: {
    type: Number,
    required: true,
  },
  maxGroupSize: Number,
  desc: String,
  photo: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', tourSchema);
