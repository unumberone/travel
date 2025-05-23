const Tour = require('../models/tour.js');
// Create new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tours
exports.getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find();

    const lstVungMien = await Tour.distinct('vung_mien').sort();
    const lstLoaiHinh = await Tour.distinct('loai_hinh').sort();
    const lstTinhThanh = await Tour.distinct('tinh_thanh').sort();
    res.status(200).json({ 
      tours: tours,
      lstVungMien: lstVungMien,
      lstLoaiHinh: lstLoaiHinh,
      lstTinhThanh: lstTinhThanh
    });
    // res.status(200).json({ message: 'Get all tours' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTourCount = async (req, res) => {
  try {
    const count = await Tour.countDocuments();
    res.status(200).json({ count: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getlimitTour = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit);
    const page = parseInt(req.params.page);
    const tours = await Tour.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ tours: tours });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update tour
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAllTour = async (req, res) => {
  try {
    const lstTour = await Tour.find();
    await Promise.all(
      lstTour.map(tour =>
        Tour.findByIdAndUpdate(tour._id, { gia_tien: Number(tour.gia_tien) })
      )
    );
    
    res.status(200).json({ message: 'Update all tours successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lọc tour theo tên, vùng miền, địa chỉ, tỉnh thành, loại hình, giá tiền
exports.filterTours = async (req, res) => {
  try {
    const {
      ten,
      vung_mien,
      dia_chi,
      tinh_thanh,
      loai_hinh,
      gia_tien_min,
      gia_tien_max,
      so_nguoi,
      ngay_dat_phong,
      sort
    } = req.body;

    let filter = {};
    filter.con_phong = true; // Chỉ lấy các tour còn phòng

    if (ten) filter.ten = { $regex: ten, $options: 'i' };
    if (vung_mien && vung_mien != "") filter.vung_mien = vung_mien;
    if (dia_chi) filter.dia_chi = { $regex: dia_chi, $options: 'i' };
    if (tinh_thanh && tinh_thanh != "") filter.tinh_thanh = tinh_thanh;
    if (loai_hinh && loai_hinh != "") filter.loai_hinh = loai_hinh;
    if (gia_tien_min != null || gia_tien_max != null) {
      filter.gia_tien = {};
      if (gia_tien_min != null) filter.gia_tien.$gte = Number(gia_tien_min);
      if (gia_tien_max != null) filter.gia_tien.$lte = Number(gia_tien_max);
    }
    if (so_nguoi) filter.so_nguoi = { $gte: Number(so_nguoi) };

    // Lọc ngày chưa bị đặt
    if (ngay_dat_phong && ngay_dat_phong.length > 0) {
      // Chuyển về dạng Date để so sánh chính xác
      const date = new Date(ngay_dat_phong);
      // Tìm các tour mà ngày này KHÔNG nằm trong mảng ngay_dat_phong
      filter.ngay_dat_phong = { $ne: date };
    }

    let query = Tour.find(filter);
    if (sort === "asc") query = query.sort({ gia_tien: 1 });
    if (sort === "desc") query = query.sort({ gia_tien: -1 });
    const tours = await query;
    res.status(200).json({ tours: tours });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
