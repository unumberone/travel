import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import { BASE_URL } from "../utils/config";


const formatVND = (value) => Number(value).toLocaleString("vi-VN") + " ₫";

const TourFullDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/tours/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) setTour(data);
        else setTour(null);
      })
      .catch(() => setTour(null));
  }, [id]);

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
          <div className="border p-3 rounded shadow-sm">
            <h4 className="text-danger">{formatVND(tour.gia_tien)} / đêm</h4>
            <div className="d-flex justify-content-between mt-2 mb-2">
              <span>Nhận phòng</span>
              <span>22/05/2025</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Trả phòng</span>
              <span>23/05/2025</span>
            </div>
            <div className="mb-3">
              <label>Khách</label>
              <input type="number" className="form-control" defaultValue={1} />
            </div>
            <Button color="danger" block>Đặt ngay</Button>
            <hr />
            <p className="mb-1">Tổng giá phòng</p>
            <h5>{formatVND(tour.gia_tien)}</h5>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TourFullDetails;
