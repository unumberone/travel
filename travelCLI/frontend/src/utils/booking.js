/**
 * Tính số đêm giữa hai ngày (đã loại bỏ giờ phút giây)
 * @param {Date|string} checkIn - Ngày nhận phòng
 * @param {Date|string} checkOut - Ngày trả phòng
 * @returns {number} Số đêm (ít nhất là 1)
 */
export function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const from = new Date(checkIn);
  const to = new Date(checkOut);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  const ms = to - from;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Tính tổng chi phí
 * @param {number} pricePerNight - Giá một đêm
 * @param {number} nights - Số đêm
 * @returns {number} Tổng chi phí
 */
export function calcTotalPrice(pricePerNight, nights) {
  return pricePerNight * nights;
}