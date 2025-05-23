const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    note: String,
  },
  paymentType: {
    type: String,
    enum: ["full", "partial"],
    default: "partial",
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancel"],
    default: "pending",
  },
  payUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);