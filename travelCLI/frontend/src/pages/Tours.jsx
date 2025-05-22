import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css";
import TourCard from "./../shared/TourCard";
import Newsletter from "./../shared/Newsletter";
import { Col, Container, Row } from "reactstrap";
import { BASE_URL } from "../utils/config";

import NumberInput from "../components/NumberInput.tsx";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tours, setTours] = useState([]);
  const [lstTourRender, setLstTourRender] = useState([]);
  const limit = 6;

  const [lstVungMien, setLstVungMien] = useState([]);
  const [lstLoaiHinh, setLstLoaiHinh] = useState([]);
  const [lstTinhThanh, setLstTinhThanh] = useState([]);

  // State cho filter
  const [filter, setFilter] = useState({
    ten: "",
    vung_mien: "",
    dia_chi: "",
    tinh_thanh: "",
    loai_hinh: "",
    gia_tien_min: 0,
    gia_tien_max: 500000000,
    so_nguoi: 1,
    ngay_dat_phong: "",
    sort: "",
  });

  // Hàm gửi request lọc
  const handleFilter = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tours/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });
      const data = await response.json();
      setTours(data.tours);
      setPage(0);
      setPageCount(Math.ceil(data.tours.length / limit));
    } catch (error) {
      console.error("Error filtering tours:", error);
    }
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tours`);
        const data = await response.json();

        setTours(data.tours);
        setPageCount(Math.ceil(data.tours.length / limit));

        setLstVungMien(data.lstVungMien);
        setLstLoaiHinh(data.lstLoaiHinh);
        setLstTinhThanh(data.lstTinhThanh);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    const lst = tours.slice(page * limit, (page + 1) * limit);
    setLstTourRender(lst);
  }, [page, tours]);

  // Hàm xử lý thay đổi filter
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <CommonSection title={"All Tours"} />

      <section>
        <Container>
          <Row>
            <Col lg="3">
              <div className="filter-sidebar p-3 border rounded bg-white">
                <div className="filter-group mb-3">
                  <h6>Sắp xếp theo giá</h6>
                  <select
                    className="form-select"
                    name="sort"
                    value={filter.sort}
                    onChange={handleChange}
                  >
                    <option value="">Mặc định</option>
                    <option value="asc">Giá từ thấp đến cao</option>
                    <option value="desc">Giá từ cao đến thấp</option>
                  </select>
                </div>
                <div className="filter-group mb-3">
                  <h6>Tên tour</h6>
                  <input
                    type="text"
                    className="form-control"
                    name="ten"
                    value={filter.ten}
                    onChange={handleChange}
                    placeholder="Nhập tên tour"
                  />
                </div>

                <div className="filter-group mb-3">
                  <h6>Vùng miền</h6>
                  <select
                    className="form-select"
                    name="vung_mien"
                    value={filter.vung_mien}
                    onChange={handleChange}
                  >
                    <option value="">Tất cả</option>
                    {lstVungMien.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group mb-3">
                  <h6>Địa chỉ</h6>
                  <input
                    type="text"
                    className="form-control"
                    name="dia_chi"
                    value={filter.dia_chi}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div className="filter-group mb-3">
                  <h6>Tỉnh thành</h6>
                  <select
                    className="form-select"
                    name="tinh_thanh"
                    value={filter.tinh_thanh}
                    onChange={handleChange}
                  >
                    <option value="">Tất cả</option>
                    {lstTinhThanh.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group mb-3">
                  <h6>Loại hình</h6>
                  <select
                    className="form-select"
                    name="loai_hinh"
                    value={filter.loai_hinh}
                    onChange={handleChange}
                  >
                    <option value="">Tất cả</option>
                    {lstLoaiHinh.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group mb-3">
                  <h6>Giá tiền (VNĐ)</h6>
                  <div className="d-flex align-items-center gap-2">
                    <NumberInput
                      name="gia_tien_min"
                      value={filter.gia_tien_min}
                      onChange={(val) =>
                        setFilter((prev) => ({
                          ...prev,
                          gia_tien_min: val,
                        }))
                      }
                      className="form-control"
                      style={{ width: "45%" }}
                      min={0}
                      placeholder="Từ"
                    />
                    <span>-</span>
                    <NumberInput
                      name="gia_tien_max"
                      value={filter.gia_tien_max}
                      onChange={(val) =>
                        setFilter((prev) => ({
                          ...prev,
                          gia_tien_max: val,
                        }))
                      }
                      className="form-control"
                      style={{ width: "45%" }}
                      min={0}
                      placeholder="Đến"
                    />
                  </div>
                </div>

                <div className="filter-group mb-3">
                  <h6>Số người</h6>
                  <NumberInput
                    name="so_nguoi"
                    value={filter.so_nguoi}
                    onChange={(val) =>
                      setFilter((prev) => ({
                        ...prev,
                        so_nguoi: val,
                      }))
                    }
                    className="form-control"
                    style={{ width: "45%" }}
                    min={0}
                    placeholder="Đến"
                  />
                </div>

                <div className="filter-group mb-4">
                  <h6>Ngày đặt phòng</h6>
                  <input
                    type="date"
                    className="form-control"
                    name="ngay_dat_phong"
                    value={filter.ngay_dat_phong}
                    onChange={handleChange}
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleFilter}
                >
                  Áp dụng
                </button>
              </div>
            </Col>

            {/* Danh sách tour */}
            <Col lg="9">
              {lstTourRender.length > 0 && (
                <>
                  {lstTourRender.map((tour) => (
                    <div className="mb-4" key={tour._id}>
                      <TourCard tour={tour} />
                    </div>
                  ))}

                  <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                    {[...Array(pageCount).keys()].map((number) => (
                      <span
                        key={number}
                        onClick={() => setPage(number)}
                        className={page === number ? "active__page" : ""}
                      >
                        {number + 1}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Tours;
