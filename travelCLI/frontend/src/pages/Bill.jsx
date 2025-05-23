import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import { formatDateVN } from "../utils/timeFormat";
import { getNights } from "../utils/booking";

const Bill = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/booking/${bookingId}`)
      .then(res => res.json())
      .then(async data => {
        setBooking(data.booking);
        setTour(data.tour);
        setLoading(false);

        // Nếu trạng thái là pending, gọi API lấy payUrl và mở ra
        if (data.booking && data.booking.status === "pending") {
          try {
            const resPay = await fetch(`${BASE_URL}/booking/${bookingId}/payurl`);
            const payData = await resPay.json();
            if (payData.payUrl) {
              window.location.href = payData.payUrl;
            }
          } catch (e) {
            // Không làm gì, chỉ hiển thị hóa đơn chờ thanh toán
          }
        }
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  if (!bookingId) {
    return (
      <Container className="py-5 text-center">
        <h4>Không có thông tin hóa đơn!</h4>
        <Button color="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  if (loading || !tour || !booking) {
    return (
      <Container className="py-5 text-center">
        <h4>Đang tải thông tin hóa đơn...</h4>
      </Container>
    );
  }

  // Tính giá một đêm
  const nights = getNights(booking.checkIn, booking.checkOut);
  const pricePerNight = nights > 0 ? Math.round(booking.totalPrice / nights) : booking.totalPrice;

  // Xác định số tiền đã thanh toán thực tế
  let paidAmount = 0;
  if (booking?.status === "paid") {
    paidAmount = booking?.paymentType === "full"
      ? booking?.totalPrice
      : booking?.totalPrice / 2;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          {/* Thông tin phòng */}
          <Card className="mb-3 shadow-sm">
            <Row className="g-0">
              <Col md={4}>
                <img
                  src={tour?.hinh_anh?.[0] || ""}
                  alt="main-img"
                  className="img-fluid rounded mb-2"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              </Col>
              <Col md={8}>
                <CardBody>
                  <CardTitle tag="h5">{tour?.ten || tour?.name || "Tên phòng"}</CardTitle>
                  <CardText>
                    <small>{tour?.dia_chi || tour?.address} {tour?.tinh_thanh ? `- ${tour.tinh_thanh}` : ""}</small>
                  </CardText>
                  <CardText>
                    <b>Tiện nghi:</b> {Array.isArray(tour?.tien_ich) ? tour.tien_ich.join(", ") : tour?.amenities}
                  </CardText>
                  <CardText>
                    <b>Đánh giá:</b> {tour?.rating || 5}★ ({tour?.reviews || 5})
                  </CardText>
                </CardBody>
              </Col>
            </Row>
          </Card>

          {/* Hóa đơn đặt phòng */}
          <Card className="mb-3 shadow-sm" style={{ border: "1px solid #19875433" }}>
            <CardBody>
              <CardTitle tag="h5" className="mb-3 text-success">Hóa đơn đặt phòng</CardTitle>
              <CardText className="mb-2">
                <b>Nhận phòng:</b> {booking?.checkIn ? formatDateVN(booking.checkIn) : ""}
              </CardText>
              <CardText className="mb-2">
                <b>Trả phòng:</b> {booking?.checkOut ? formatDateVN(booking.checkOut) : ""}
              </CardText>
              <CardText className="mb-2">
                <b>Số khách:</b> {booking?.guests}
              </CardText>
              <CardText className="mb-2">
                <b>Tổng tiền:</b> <span className="text-danger">{booking?.totalPrice?.toLocaleString()} ₫</span>
              </CardText>
              <CardText className="mb-2">
                <b>Trạng thái thanh toán:</b>{" "}
                <span className={
                  booking?.status === "paid"
                    ? "text-success fw-bold"
                    : booking?.status === "pending"
                      ? "text-warning fw-bold"
                      : "text-danger fw-bold"
                }>
                  {booking?.status === "paid"
                    ? "Đã thanh toán"
                    : booking?.status === "pending"
                      ? "Chờ thanh toán"
                      : "Đã hủy"}
                </span>
              </CardText>
              {/* Nếu chờ thanh toán, hiển thị nút thanh toán lại nếu cần */}
              {booking?.status === "pending" && (
                <div className="mt-3">
                  <Button
                    color="danger"
                    size="lg"
                    onClick={async () => {
                      if (booking.payUrl) {
                        window.location.href = booking.payUrl;
                      } else {
                        alert("Không thể lấy link thanh toán. Vui lòng thử lại sau.");
                      }
                    }}
                  >
                    Thanh toán lại với MoMo
                  </Button>
                  <div className="text-muted mt-2" style={{ fontSize: 14 }}>
                    Nếu bạn chưa thanh toán hoặc bị gián đoạn, hãy bấm nút trên để thanh toán lại.
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Thông tin liên hệ */}
          <Card className="mb-3 shadow-sm" style={{ border: "1px solid #0d6efd33" }}>
            <CardBody>
              <h5 className="mb-3">Thông tin liên hệ</h5>
              <CardText>
                <b>Khách hàng:</b> {booking?.contactInfo?.name}
              </CardText>
              <CardText>
                <b>Số điện thoại:</b> {booking?.contactInfo?.phone}
              </CardText>
              <CardText>
                <b>Email:</b> {booking?.contactInfo?.email}
              </CardText>
              <CardText>
                <b>Yêu cầu đặc biệt:</b> {booking?.contactInfo?.note || "Không"}
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          {/* Chi tiết thanh toán */}
          <Card className="mb-3 shadow-sm" style={{ border: "1px solid #ffc10755" }}>
            <CardBody>
              <h5 className="mb-3">Chi tiết thanh toán</h5>
              <Row>
                <Col>Giá một đêm</Col>
                <Col className="text-end">{pricePerNight?.toLocaleString()} ₫</Col>
              </Row>
              <hr />
              <Row>
                <Col>Tổng giá phòng</Col>
                <Col className="text-end">{booking?.totalPrice?.toLocaleString()} ₫</Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <b>Đã thanh toán</b>
                </Col>
                <Col className="text-end">
                  <b className={
                    booking?.status === "paid"
                      ? (booking?.paymentType === "full"
                        ? "text-success"
                        : "text-warning")
                      : "text-secondary"
                  }>
                    {booking?.status === "paid"
                      ? (booking?.paymentType === "full"
                        ? booking?.totalPrice?.toLocaleString() + " ₫"
                        : (booking?.totalPrice / 2)?.toLocaleString() + " ₫")
                      : "0 ₫"}
                  </b>
                </Col>
              </Row>
              {booking?.status === "paid" && booking?.paymentType === "partial" && (
                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  💰 Còn lại <b>{(booking?.totalPrice / 2)?.toLocaleString()} ₫</b> sẽ thanh toán khi nhận phòng.
                </div>
              )}
              <div className="mt-2" style={{ fontSize: 13 }}>
                <b>Hình thức thanh toán:</b>{" "}
                {booking?.paymentType === "full"
                  ? "Thanh toán toàn bộ"
                  : booking?.paymentType === "partial"
                    ? "Đặt cọc trước 50%"
                    : "Không xác định"}
              </div>
            </CardBody>
          </Card>

          <div className="d-grid gap-2">
            <Button color="primary" size="lg" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Bill;