import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Form, FormGroup, Input, Label } from "reactstrap";

const TourDetail = () => {
  const { id } = useParams();
  const [tours, setTour] = useState(null);

  useEffect(() => {
    // Gọi API lấy thông tin tour theo id
    fetch(`/api/tours/${id}`)
      .then(res => res.json())
      .then(data => setTour(data))
      .catch(() => setTour(null));
  }, [id]);

  const handleBook = (e) => {
    e.preventDefault();
    alert("Đặt phòng thành công! (Demo)");
    // Thực tế: Gửi dữ liệu đặt phòng lên server và chuyển sang trang thanh toán
  };

  if (!tours) return <div>Đang tải...</div>;

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <img src={tours.hinh_anh?.[0]} alt={tours.ten} className="img-fluid rounded" />
        </Col>
        <Col md={6}>
          <h2>{tours.ten}</h2>
          <p><b>Địa chỉ:</b> {tours.dia_chi}</p>
          <p><b>Mô tả:</b> {tours.mo_ta}</p>
          <p><b>Giá:</b> {tours.gia_tien?.toLocaleString("vi-VN")} ₫</p>
          <p><b>Tiện ích:</b> {tours.tien_ich?.join(", ")}</p>
          {/* Form đặt phòng */}
          <Form onSubmit={handleBook} className="mt-4">
            <FormGroup>
              <Label>Họ tên</Label>
              <Input required />
            </FormGroup>
            <FormGroup>
              <Label>Số điện thoại</Label>
              <Input required />
            </FormGroup>
            <FormGroup>
              <Label>Số lượng người</Label>
              <Input type="number" min={1} defaultValue={1} required />
            </FormGroup>
            <Button color="primary" type="submit">Đặt phòng & Thanh toán</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TourDetail;