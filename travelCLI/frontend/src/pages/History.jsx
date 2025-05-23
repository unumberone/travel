import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Spinner, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const statusColor = (status) => {
    switch (status) {
        case "paid": return "success";
        case "pending": return "warning";
        case "cancel": return "danger";
        default: return "secondary";
    }
};
const statusText = (status) => {
    switch (status) {
        case "paid": return "Đã thanh toán";
        case "pending": return "Chờ thanh toán";
        case "cancel": return "Đã hủy";
        default: return "Không xác định";
    }
};

const paymentText = (booking) => {
    if (booking.status === "paid") {
        if (booking.paymentType === "full") return "Đã thanh toán toàn bộ";
        return "Đã đặt cọc trước 50%";
    }
    if (booking.status === "pending") return "Chờ thanh toán";
    if (booking.status === "cancel") return "Đã hủy";
    return "Không xác định";
};
const paymentClass = (booking) => {
    if (booking.status === "paid") return "text-success fw-bold";
    if (booking.status === "pending") return "text-warning fw-bold";
    if (booking.status === "cancel") return "text-danger fw-bold";
    return "text-secondary";
};

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            navigate("/login");
            return;
        }
        fetch(`${BASE_URL}/booking/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể lấy lịch sử đặt phòng!");
                setLoading(false);
            });
    }, [navigate]);

    const handleCardClick = (booking) => {
        navigate(`/bill/${booking._id}`);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner color="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h3 className="mb-4 fw-bold text-primary text-center">Lịch sử đặt phòng</h3>
            <Row>
                {bookings.length === 0 ? (
                    <Col>
                        <div className="text-center text-muted">Bạn chưa có lịch sử đặt phòng nào.</div>
                    </Col>
                ) : (
                    bookings.map((booking, idx) => (
                        <Col md={6} lg={4} key={booking._id || idx} className="mb-4">
                            <Card
                                className="shadow-sm h-100"
                                style={{
                                    border: "1px solid #e3e3e3",
                                    borderRadius: 16,
                                    transition: "box-shadow 0.2s",
                                    background: "#fff",
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleCardClick(booking)}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        padding: "0.5rem 1rem",
                                        zIndex: 2,
                                    }}
                                >
                                    <Badge color={statusColor(booking.status)} pill>
                                        {statusText(booking.status)}
                                    </Badge>
                                </div>
                                {booking.tour?.hinh_anh?.[0] && (
                                    <img
                                        src={booking.tour.hinh_anh[0]}
                                        alt="tour"
                                        style={{
                                            width: "100%",
                                            height: 160,
                                            objectFit: "cover",
                                            borderTopLeftRadius: 16,
                                            borderTopRightRadius: 16,
                                            borderBottom: "1px solid #eee"
                                        }}
                                    />
                                )}
                                <CardBody style={{ padding: "1.25rem" }}>
                                    <CardTitle tag="h5" className="mb-2 text-primary fw-bold" style={{ minHeight: 48 }}>
                                        {booking.tour?.ten || booking.tour?.name || "Phòng/Tour"}
                                    </CardTitle>
                                    <CardText className="mb-1" style={{ fontSize: 15, color: "#555" }}>
                                        <i className="ri-map-pin-line me-1"></i>
                                        {booking.tour?.dia_chi || booking.tour?.address || ""}
                                    </CardText>
                                    <CardText className="mb-1">
                                        <b>Nhận phòng:</b> <span className="text-dark">{new Date(booking.checkIn).toLocaleDateString("vi-VN")}</span>
                                    </CardText>
                                    <CardText className="mb-1">
                                        <b>Trả phòng:</b> <span className="text-dark">{new Date(booking.checkOut).toLocaleDateString("vi-VN")}</span>
                                    </CardText>
                                    <CardText className="mb-1">
                                        <b>Số khách:</b> <span className="text-dark">{booking.guests}</span>
                                    </CardText>
                                    <CardText className="mb-1">
                                        <b>Tổng tiền:</b>{" "}
                                        <span className="text-danger fw-bold">{booking.totalPrice?.toLocaleString()} ₫</span>
                                    </CardText>
                                    <CardText className="mb-1">
                                        <b>Trạng thái thanh toán:</b>{" "}
                                        <span className={paymentClass(booking)}>
                                            {paymentText(booking)}
                                        </span>
                                    </CardText>
                                    <CardText className="mb-0" style={{ fontSize: 14, color: "#888" }}>
                                        <i className="ri-time-line me-1"></i>
                                        Đặt lúc: {new Date(booking.createdAt).toLocaleString("vi-VN")}
                                    </CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default History;