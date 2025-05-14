// import mongoose from 'mongoose'

// const TourSchema = new mongoose.Schema({
//   ten: String,
//   thanh_pho: String,
//   danh_gia: Number,
//   so_luot_danh_gia: Number,
//   hinh_anh: String,
//   gia_tien: Number,
//   gia_goc: Number,
//   uu_dai: Number
// })

// export default mongoose.model('Tour', TourSchema)


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
});

module.exports = mongoose.model('Tour', TourSchema);