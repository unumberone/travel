import { useNavigate } from "react-router-dom";
import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";

const formatVND = (value) => {
  return Number(value).toLocaleString("vi-VN") + " ₫";
};

const TourCard = ({ tour }) => {
  return (
    <div className="tour__card">
      <Card className="tour-card">
        <div className="tour-image-container">
          {tour.hinh_anh && tour.hinh_anh.length > 0 && (
            <img src={tour.hinh_anh[0]} alt="tour-img" className="tour-image" />
          )}
          {/* Badge góc ảnh */}
        </div>
        <CardBody className="tour-body">
          <h5 className="tour-name">
            <Link to={`/tours/${tour._id}`}>{tour.ten}</Link>
          </h5>
          <div className="tour-info-row">
            <i className="ri-map-pin-line"></i>
            <span>
              <strong>{tour.dia_chi}</strong>
            </span>
          </div>
          <div className="tour-info-row">
            <i className="ri-calendar-line"></i>
            <span>
              Ngày khởi hành:{" "}
              <strong>{tour.ngay_khoi_hanh || "18/05/2025"}</strong>
            </span>
          </div>
          <div className="tour-info-row">
            <i className="ri-time-line"></i>
            <span>
              Giờ mở cửa: <strong>{tour.gio_mo_cua}</strong> -{" "}
              <strong>{tour.gio_dong_cua}</strong>
            </span>
          </div>
          <div className="tour-info-row">
            <i className="ri-user-line"></i>
            <span>
              Số chỗ còn: <strong>{tour.so_nguoi}</strong>
            </span>
          </div>
          {/* Tiện ích */}
          <div className="tour-info-row">
            <i className="ri-checkbox-circle-line"></i>
            <span>
              <strong>Tiện ích:</strong>{" "}
              {tour.tien_ich?.slice(0, 3).join(", ") || "Không có"}
            </span>
          </div>
          {/* Giá tour */}
          <div className="tour-pricing">
            <div className="tour-price-old">
              Giá từ: <del>5.990.000 ₫</del>
            </div>
            <div className="tour-price-sale">
              {tour.gia_tien ? formatVND(tour.gia_tien) : "Chưa cập nhật"}
            </div>
          </div>
          {/* Nút đặt ngay */}
          {/* Updated Link to navigate to TourFullDetails */}
          <Link to={`/tour-full-details/${tour._id}`}>
            <button className="booking__btn red">Đặt ngay</button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;