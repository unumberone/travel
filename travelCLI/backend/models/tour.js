
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  nguoi_dung: { type: String, required: true },
  so_diem: { type: Number, required: true },
  nhan_xet: { type: String, required: true },
  ngay_danh_gia: { type: Date, required: true },
});

const TourSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  vung_mien: { type: String, required: true },
  dia_chi: { type: String, required: true },
  tinh_thanh: { type: String, required: true },
  mo_ta: { type: String, required: true },
  loai_hinh: { type: String, required: true },
  gio_mo_cua: { type: String, required: true },
  gio_dong_cua: { type: String, required: true },
  lien_he: { type: String, required: true },
  website: { type: String, required: true },
  vi_do: { type: Number, required: true },
  kinh_do: { type: Number, required: true },
  gia_tien: { type: Number, required: true },
  hinh_anh: [{ type: String, required: true }],
  danh_gia: { type: [ReviewSchema], required: true }, // Mảng các đánh giá
  tien_ich: [{ type: String, required: true }], // Mảng tiện ích
  so_nguoi: { type: Number, required: true },
  con_phong: { type: Boolean, required: true },
  ngay_dat_phong: [{ type: Date }],
});

module.exports = mongoose.model('Tour', TourSchema);