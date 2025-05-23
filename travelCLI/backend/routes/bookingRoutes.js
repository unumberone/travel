const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Tạo mới booking
router.post("/", bookingController.createBooking);
// Lấy tất cả booking
router.get("/", bookingController.getAllBookings);
// Lấy booking theo ID
router.get("/:id", bookingController.getBookingById);
// Lấy booking theo userId
router.get("/user/:userId", bookingController.getBookingsByUser);
module.exports = router;