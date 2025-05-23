const momoPayment = require('../middleware/momoPaymentMiddleware');
const Booking = require("../models/booking");
const Tour = require("../models/tour");

exports.momoPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo } = req.body;
    if (!amount || !orderId || !orderInfo) {
      return res.status(400).json({ error: "Thiếu thông tin thanh toán!" });
    }
    const payUrl = await momoPayment({
      amount,
      orderId,
      orderInfo,
    });
    res.json({ payUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || "Lỗi tạo thanh toán MoMo" });
  }
};


/**
 * Xử lý callback (IPN) từ MoMo khi thanh toán thành công
 * MoMo sẽ gửi POST tới ipnUrl bạn đã cấu hình, thường là /api/momo/callback
 */
exports.momoCallback = async (req, res) => {
  try {
    const {
      orderId, // bookingId
      resultCode,
      message,
      amount,
      transId
    } = req.body;

    // MoMo gửi resultCode === 0 là thành công
    if (resultCode === 0) {
      // Cập nhật trạng thái booking sang "paid"
      const booking = await Booking.findByIdAndUpdate(
        orderId,
        { status: "paid", momoTransId: transId },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ message: "Không tìm thấy booking!" });
      }
      // Trả về cho MoMo biết đã nhận callback thành công
      return res.status(200).json({ message: "Thanh toán thành công, đã cập nhật booking và tour." });
    } else {
      // Nếu thanh toán thất bại hoặc bị hủy, cập nhật trạng thái và xóa ngày đã giữ khỏi tour
      const booking = await Booking.findByIdAndUpdate(orderId, { status: "cancel" }, { new: true });
      if (booking) {
        // Xóa các ngày đã giữ khỏi tour
        const getDatesInRange = (start, end) => {
          const date = new Date(start);
          const endDate = new Date(end);
          const dates = [];
          while (date <= endDate) {
            dates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            date.setDate(date.getDate() + 1);
          }
          return dates;
        };
        const bookedDates = getDatesInRange(booking.checkIn, booking.checkOut);
        await Tour.findByIdAndUpdate(
          booking.tourId,
          { $pull: { ngay_dat_phong: { $in: bookedDates } } }
        );
      }
      return res.status(200).json({ message: "Thanh toán thất bại hoặc bị hủy." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi xử lý callback MoMo", error: error.message });
  }
};