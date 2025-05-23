// Định dạng ngày dạng dd/mm/yyyy
export function formatDateVN(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
}

// Định dạng giờ:phút (HH:mm)
export function formatTimeHM(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

// Định dạng ngày giờ đầy đủ dd/mm/yyyy HH:mm
export function formatDateTimeVN(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
}

// Định dạng ISO (yyyy-mm-dd)
export function formatDateISO(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

// Định dạng ngày tháng năm đầy đủ (ví dụ: 24 tháng 5, 2025)
export function formatDateFullVN(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}