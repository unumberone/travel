import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Modal,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from '../utils/config'
import DatePicker from "../components/DatePicker/DatePicker";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;
    const tour = bookingData?.tour;

    // Khởi tạo selectedRange dạng [from, to] từ params nếu có
    const [selectedRange, setSelectedRange] = useState(() => {
        if (bookingData.checkIn && bookingData.checkOut) {
            return [new Date(bookingData.checkIn), new Date(bookingData.checkOut)];
        }
        return [];
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    // State điều khiển tháng/năm hiển thị cho DatePicker
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    // Số khách và tổng tiền là state để cập nhật động
    const [guests, setGuests] = useState(bookingData.guests || 1);
    const [totalPrice, setTotalPrice] = useState(bookingData.totalPrice || 0);

    // disabledDates lấy từ tour.ngay_dat_phong (nếu có)
    const disabledDates = tour?.ngay_dat_phong?.map(d => new Date(d)) || [];

    // Form liên hệ
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        note: "",
        payment: "partial",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Hàm tính số đêm
    function getNights(from, to) {
        if (!from || !to) return 0;
        const ms = to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0);
        return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
    }

    // Khi chọn lại ngày, tính lại tổng tiền
    const handleSelectDate = (range) => {
        setSelectedRange(range);
        if (range.length === 2) {
            const nights = getNights(range[0], range[1]);
            setTotalPrice(nights * (tour.gia_tien || 0));
            setShowDatePicker(false);
        }
    };

    // Khi đổi số khách, cũng tính lại tổng tiền
    const handleGuestsChange = (e) => {
        const value = Number(e.target.value);
        setGuests(value);
    };

    if (!bookingData || !tour) {
        return (
            <Container className="py-5 text-center">
                <h4>Không có thông tin đặt phòng!</h4>
                <Button color="primary" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </Container>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBooking = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            setError("Vui lòng nhập đầy đủ tên khách hàng và số điện thoại!");
            return;
        }
        if (selectedRange.length < 2) {
            setError("Vui lòng chọn ngày nhận phòng và trả phòng!");
            return;
        }
        if (!guests) {
            setError("Thiếu thông tin số khách!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${BASE_URL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tourId: tour._id,
                    userId: bookingData.userId,
                    checkIn: selectedRange[0],
                    checkOut: selectedRange[1],
                    guests,
                    totalPrice,
                    contactInfo: {
                        name: form.name,
                        phone: form.phone,
                        email: form.email,
                        note: form.note,
                    },
                    paymentType: form.payment === "full" ? "full" : "partial",
                }),
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || "Đặt phòng thất bại, vui lòng thử lại!");
            }

            // Nếu có payUrl từ backend thì mở trang thanh toán MoMo
            if (res.payUrl) {
                window.location.href = res.payUrl;
                return;
            }

            // Nếu không có payUrl thì chuyển sang trang bill như cũ
            navigate(`/bill/${res.bookingId}`);
        } catch (err) {
            setError(err.message || "Đặt phòng thất bại, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row>
                <Col md={8}>
                    {/* Thông tin phòng và đánh giá */}
                    <Card className="mb-3 shadow-sm">
                        <Row className="g-0">
                            <Col md={4}>
                                <img
                                    src={tour.hinh_anh?.[0]}
                                    alt="main-img"
                                    className="img-fluid rounded mb-2"
                                    style={{ height: "200px", objectFit: "cover", width: "100%" }}
                                />
                            </Col>
                            <Col md={8}>
                                <CardBody>
                                    <CardTitle tag="h5" className="mb-2">{tour.ten}</CardTitle>
                                    <CardText>
                                        <small className="text-muted">{tour.dia_chi} - {tour.tinh_thanh}</small>
                                    </CardText>
                                    <CardText>
                                        <b>Tiện nghi:</b> {tour.tien_ich?.join(", ")}
                                    </CardText>
                                    <CardText>
                                        <b>Đánh giá:</b> {tour.rating || 5}★ ({tour.reviews || 5})
                                    </CardText>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>

                    {/* Thông tin đặt phòng với nút sửa thời gian */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody>
                            <CardTitle tag="h5" className="mb-3 text-danger">Thông tin đặt phòng</CardTitle>
                            <CardText className="mb-2">
                                <b>Mã tour:</b> {bookingData.tourId}
                            </CardText>
                            <CardText className="mb-2">
                                <b>Số khách:</b>{" "}
                                <Input
                                    type="number"
                                    min={1}
                                    max={tour?.so_khach_toi_da || 20}
                                    value={guests}
                                    onChange={handleGuestsChange}
                                    style={{ display: "inline-block", width: 80, marginLeft: 8 }}
                                    size="sm"
                                />
                            </CardText>
                            <CardText className="mb-2">
                                <b>Tổng tiền:</b> <span className="text-danger">{totalPrice?.toLocaleString()} ₫</span>
                            </CardText>
                            <CardText className="mb-2">
                                <b>Nhận phòng:</b> {selectedRange[0]?.toLocaleDateString("vi-VN") || "Chưa chọn"}
                            </CardText>
                            <CardText className="mb-2">
                                <b>Trả phòng:</b> {selectedRange[1]?.toLocaleDateString("vi-VN") || "Chưa chọn"}
                            </CardText>
                            <Button
                                color="primary"
                                outline
                                size="sm"
                                onClick={() => setShowDatePicker(true)}
                                className="mt-2"
                            >
                                Sửa thời gian
                            </Button>
                            <Modal isOpen={showDatePicker} toggle={() => setShowDatePicker(false)} centered>
                                <DatePicker
                                    year={year}
                                    month={month}
                                    disabledDates={disabledDates}
                                    selectedRange={selectedRange}
                                    onSelectDate={handleSelectDate}
                                    onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
                                />
                            </Modal>
                        </CardBody>
                    </Card>

                    {/* Thông tin liên hệ */}
                    <Card className="mb-3 shadow-sm">
                        <CardBody>
                            <h5 className="mb-3">Thông tin liên hệ</h5>
                            <Form>
                                <FormGroup className="mb-3">
                                    <Label>
                                        Tên khách hàng <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        name="name"
                                        placeholder="Nguyễn Văn A"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label>
                                        Số điện thoại <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        name="phone"
                                        placeholder="09** *** ***"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label>Email</Label>
                                    <Input
                                        name="email"
                                        placeholder="contact@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label>Yêu cầu đặc biệt?</Label>
                                    <Input
                                        type="textarea"
                                        rows={3}
                                        name="note"
                                        placeholder="Bạn cần thêm giường phụ hoặc có yêu cầu đặc biệt?"
                                        value={form.note}
                                        onChange={handleChange}
                                    />
                                    <small className="text-muted">
                                        Xin lưu ý yêu cầu đặc biệt không được bảo đảm trước và có thể bị thu phí
                                    </small>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>

                    <Card className="mb-3 shadow-sm">
                        <CardBody>
                            <h5 className="mb-3">Quy định độ tuổi</h5>
                            <ul className="mb-2">
                                <li>Người lớn: Từ 12 tuổi trở lên</li>
                                <li>Trẻ em: Từ 6 đến dưới 12 tuổi</li>
                                <li>Em bé: Dưới 6 tuổi</li>
                            </ul>
                            <div className="mb-2">
                                <b>Giá phòng tiêu chuẩn:</b>
                                <ul className="mb-0">
                                    <li>Tiêu chuẩn cho 2 người lớn & 1 trẻ em dưới 6 tuổi</li>
                                    <li>Không nhận vượt quá tiêu chuẩn</li>
                                </ul>
                            </div>
                            <div className="mt-2">
                                <small>
                                    Bằng việc đặt phòng, bạn đã đồng ý và có trách nhiệm tuân thủ những nội quy của căn hộ.
                                    <a href="#" style={{ marginLeft: 4 }}>Chi tiết nội quy</a>
                                </small>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-3 shadow-sm">
                        <CardBody>
                            <h5 className="mb-3">Chọn cách thanh toán</h5>
                            <Form>
                                <FormGroup check className="mb-3">
                                    <Label check>
                                        <Input
                                            type="radio"
                                            name="payment"
                                            value="full"
                                            checked={form.payment === "full"}
                                            onChange={handleChange}
                                        />{" "}
                                        Trả toàn bộ tiền phòng
                                        <br />
                                        <small>
                                            Bạn sẽ thanh toán toàn bộ số tiền phòng <b>{totalPrice?.toLocaleString()} ₫</b> hôm nay, phí phát sinh sẽ thanh toán khi nhận phòng.
                                        </small>
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="radio"
                                            name="payment"
                                            value="partial"
                                            checked={form.payment === "partial"}
                                            onChange={handleChange}
                                        />{" "}
                                        Trả trước một phần tiền phòng
                                        <br />
                                        <small>
                                            Bạn sẽ thanh toán trước <b>{(totalPrice / 2)?.toLocaleString()} ₫</b> hôm nay, phần còn lại <b>{(totalPrice / 2)?.toLocaleString()} ₫</b> sẽ thanh toán khi nhận phòng.
                                        </small>
                                    </Label>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>

                    <Card className="mb-3 shadow-sm">
                        <CardBody>
                            <h5 className="mb-3">Chi tiết giá</h5>
                            <Row>
                                <Col>Giá một đêm</Col>
                                <Col className="text-end">{(tour.gia_tien || 0).toLocaleString()} ₫</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>Tổng giá phòng</Col>
                                <Col className="text-end">{totalPrice?.toLocaleString()} ₫</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>
                                    <b>Bạn thanh toán</b>
                                </Col>
                                <Col className="text-end">
                                    <b className="text-danger">
                                        {form.payment === "full"
                                            ? totalPrice?.toLocaleString() + " ₫"
                                            : (totalPrice / 2)?.toLocaleString() + " ₫"}
                                    </b>
                                </Col>
                            </Row>
                            {form.payment === "partial" && (
                                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                                    💰 Phần còn lại <b>{(totalPrice / 2)?.toLocaleString()} ₫</b> sẽ được thanh toán vào lúc nhận phòng.<br />
                                    💰 Giá bạn thanh toán là cho số khách tiêu chuẩn, phụ thu thêm người và các khoản phát sinh khác sẽ được thu trực tiếp tại căn.
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {error && (
                        <div className="alert alert-danger py-2 mb-2">{error}</div>
                    )}
                    <div className="d-grid gap-2">
                        <Button
                            color="danger"
                            size="lg"
                            className="fw-bold"
                            onClick={handleBooking}
                            disabled={loading}
                        >
                            {loading ? "Đang đặt phòng..." : "Thanh toán momo"}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Payment;