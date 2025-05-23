import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "reactstrap";
import { BASE_URL } from "../utils/config";
import DatePicker from "../components/DatePicker/DatePicker";
import { getNights } from "../utils/booking";
import { formatDateVN } from "../utils/timeFormat"; // Thêm dòng này

const formatVND = (value) => Number(value).toLocaleString("vi-VN") + " ₫";

const TourFullDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  // State cho ngày nhận, trả phòng và số khách
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // selectedRange giống Payment.jsx
  const [selectedRange, setSelectedRange] = useState([today, today]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  // Lấy danh sách ngày đã bị disable từ tour (nếu có)
  const disabledDates = useMemo(() => {
    if (!tour || !tour.ngay_dat_phong) return [];
    return tour.ngay_dat_phong.map(d => new Date(d));
  }, [tour]);

  useEffect(() => {
    fetch(`${BASE_URL}/tours/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) setTour(data);
        else setTour(null);
      })
      .catch(() => setTour(null));
  }, [id]);

  // Khi mở datepicker, set lại tháng/năm theo ngày đã chọn
  const openDatePicker = () => {
    setCalendarYear(selectedRange[0]?.getFullYear() || today.getFullYear());
    setCalendarMonth(selectedRange[0]?.getMonth() || today.getMonth());
    setShowDatePicker(true);
  };

  // Xử lý chọn ngày
  const handleSelectDate = (range) => {
    setSelectedRange(range);
    if (range.length === 2) {
      setShowDatePicker(false);
    }
  };

  // Xử lý chuyển tháng
  const handleMonthChange = (y, m) => {
    setCalendarYear(y);
    setCalendarMonth(m);
  };

  // Lấy checkIn/checkOut dạng yyyy-mm-dd (giữ nguyên)
  const checkIn = selectedRange[0] ? selectedRange[0].toISOString().slice(0, 10) : todayStr;
  const checkOut = selectedRange[1] ? selectedRange[1].toISOString().slice(0, 10) : todayStr;

  const handleBooking = () => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    navigate("/payment", {
      state: {
        tour,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        userId
      },
    });
  };

  // Kiểm tra hợp lệ
  const isValid = useMemo(() => {
    return (
      checkIn &&
      checkOut &&
      checkOut >= checkIn &&
      checkIn >= todayStr
    );
  }, [checkIn, checkOut, todayStr]);

  // Tính tổng giá phòng (số đêm * giá/đêm)
  const nights = getNights(checkIn, checkOut);
  const totalPrice = tour ? nights * tour.gia_tien : 0;

  if (!tour) return <div style={{ padding: 50 }}>Đang tải hoặc không có dữ liệu...</div>;

  return (
    <Container className="py-5">
      <Row>
        {/* Hình ảnh chính + phụ */}
        <Col md={8}>
          <Row>
            <Col md={12}>
              <img
                src={tour.hinh_anh?.[0]}
                alt="main-img"
                className="img-fluid rounded mb-2"
                style={{ height: "400px", objectFit: "cover", width: "100%" }}
              />
            </Col>
            {tour.hinh_anh?.slice(1, 5).map((img, i) => (
              <Col md={6} key={i}>
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="img-fluid rounded mb-2"
                  style={{ height: "190px", objectFit: "cover", width: "100%" }}
                />
              </Col>
            ))}
          </Row>

          <h2 className="mt-4">{tour.ten}</h2>
          <p>{tour.dia_chi} - {tour.tinh_thanh}</p>
          <p><b>Loại hình:</b> {tour.loai_hinh}</p>
          <p><b>Mô tả:</b> {tour.mo_ta}</p>

          <Row className="mt-3">
            <Col md={4}><b>2 phòng ngủ</b></Col>
            <Col md={4}><b>3 phòng tắm</b></Col>
            <Col md={4}><b>1 phòng bếp</b></Col>
            <Col md={4}><b>{tour.so_nguoi || 8} khách</b></Col>
            <Col md={8}><b>Tiện ích:</b> {tour.tien_ich?.slice(0, 5).join(", ")}</Col>
          </Row>

          <hr />
          <h5>Nhận xét gần nhất</h5>
          {tour.danh_gia && tour.danh_gia.length > 0 ? (
            <div>
              {tour.danh_gia.map((dg, idx) => (
                <div key={idx} className="p-2 mb-2 border rounded">
                  <b>{dg.nguoi_dung}</b> - {dg.so_diem}★
                  <p>{dg.nhan_xet}</p>
                  <small>{new Date(dg.ngay_danh_gia).toLocaleDateString("vi-VN")}</small>
                </div>
              ))}
            </div>
          ) : <p>Chưa có đánh giá nào.</p>}
        </Col>

        {/* Cột đặt phòng */}
        <Col md={4}>
          <div className="border p-3 rounded shadow-sm" style={{ position: "relative" }}>
            <h4 className="text-danger">{formatVND(tour.gia_tien)} / đêm</h4>
            <div className="mb-2">
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Ngày nhận phòng</label>
                  <div
                    className="form-control"
                    style={{ cursor: "pointer", background: "#fff" }}
                    onClick={openDatePicker}
                  >
                    {formatDateVN(selectedRange[0])}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Ngày trả phòng</label>
                  <div
                    className="form-control"
                    style={{ cursor: "pointer", background: "#fff" }}
                    onClick={openDatePicker}
                  >
                    {formatDateVN(selectedRange[1])}
                  </div>
                </div>
              </div>
              <Modal isOpen={showDatePicker} toggle={() => setShowDatePicker(false)} centered>
                <div style={{ padding: 16 }}>
                  <DatePicker
                    year={calendarYear}
                    month={calendarMonth}
                    disabledDates={disabledDates}
                    selectedRange={selectedRange}
                    onSelectDate={handleSelectDate}
                    onMonthChange={handleMonthChange}
                  />
                </div>
              </Modal>
            </div>
            <div className="mb-3 mt-3">
              <label>Khách</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ minWidth: 36 }}
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >-</button>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  style={{ width: 60, textAlign: "center" }}
                  value={guests}
                  onChange={e => setGuests(Math.min(Math.max(1, Number(e.target.value)), tour.so_nguoi))}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ minWidth: 36 }}
                  disabled={guests >= tour.so_nguoi}
                  onClick={() => setGuests(Math.min(tour.so_nguoi, guests + 1))}
                >+</button>
              </div>
            </div>
            {!isValid && (
              <div className="text-danger mb-2" style={{ fontSize: 13 }}>
                Ngày trả phòng phải lớn hơn hoặc bằng ngày nhận phòng.<br />
                Ngày nhận phòng không được nhỏ hơn hôm nay.
              </div>
            )}
            <Button
              color="danger"
              block
              disabled={!isValid}
              onClick={handleBooking}
            >Đặt ngay</Button>
            <hr />
            <p className="mb-1">Tổng giá phòng</p>
            <h5>{formatVND(totalPrice)}</h5>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TourFullDetails;