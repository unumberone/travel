const Booking = require("../models/booking");
const Tour = require("../models/tour");
const momoPayment = require("../middleware/momoPaymentMiddleware");

// POST /api/booking
// body: { tourId, userId, checkIn, checkOut, guests, totalPrice, contactInfo, paymentType }
exports.createBooking = async (req, res) => {
  try {
    const {
      tourId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      contactInfo,
      paymentType
    } = req.body;

    if (
      !tourId ||
      !userId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !totalPrice ||
      !contactInfo ||
      !contactInfo.name ||
      !contactInfo.phone
    ) {
      return res.status(400).json({ message: "Thiếu thông tin đặt phòng!" });
    }

    // Lấy các ngày trong khoảng checkIn - checkOut (chỉ lấy ngày, không lấy giờ)
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

    const bookedDates = getDatesInRange(checkIn, checkOut);

    // Lấy tour và kiểm tra trùng ngày (chỉ so sánh ngày, không so sánh giờ)
    const tour = await Tour.findById(tourId);
    const existedDates = tour.ngay_dat_phong.map(d => {
      const dt = new Date(d);
      return dt.toISOString().slice(0, 10);
    });

    const isOverlap = bookedDates.some(d =>
      existedDates.includes(d.toISOString().slice(0, 10))
    );

    if (isOverlap) {
      return res.status(400).json({ message: "Một hoặc nhiều ngày bạn chọn đã được đặt. Vui lòng chọn ngày khác!" });
    }

    // Lưu luôn ngày đã đặt vào tour
    await Tour.findByIdAndUpdate(
      tourId,
      { $push: { ngay_dat_phong: { $each: bookedDates } } }
    );

    // Tạo đơn hàng ở trạng thái "pending"
    const newBooking = new Booking({
      tourId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      contactInfo,
      paymentType,
      status: "pending" // trạng thái chờ thanh toán
    });

    await newBooking.save();

    // Gửi yêu cầu thanh toán MoMo
    let payUrl = null;
    try {
      payUrl = await momoPayment({
        amount: 1000,
        // amount: paymentType === "full" ? totalPrice : Math.floor(totalPrice / 2),
        orderId: newBooking._id.toString(),
        orderInfo: `Thanh toán tour ${tour.ten} (${tour._id})`,
        redirectUrl: `http://localhost:3000/bill/${newBooking._id}`,
      });
    } catch (err) {
      // Nếu lỗi tạo payUrl, vẫn trả về booking nhưng không có payUrl
      payUrl = null;
    }

    // Cập nhật lại booking với payUrl
    await Booking.findByIdAndUpdate(
      newBooking._id,
      { payUrl },
    );

    // Không thêm ngày đã đặt vào tour cho đến khi thanh toán thành công

    res.status(201).json({
      message: "Tạo đơn hàng thành công, chờ thanh toán!",
      bookingId: newBooking._id,
      booking: newBooking,
      payUrl
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đặt phòng!", error: error.message });
  }
};

// Lấy tất cả booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách booking!", error: error.message });
  }
};

// Lấy booking theo userId
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    const bookingsWithTour = await Promise.all(
      bookings.map(async (b) => {
        const tour = await Tour.findById(b.tourId);
        const obj = b.toObject();
        obj.tour = tour;
        return obj;
      })
    );
    res.status(200).json(bookingsWithTour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy booking theo user!", error: error.message });
  }
};

// Lấy booking theo id
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    const tour = await Tour.findById(booking.tourId);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking!" });
    }
    res.status(200).json({ booking, tour });

  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy booking!", error: error.message });
  }
};
