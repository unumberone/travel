import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css";
import TourCard from "./../shared/TourCard";
import Newsletter from "./../shared/Newsletter";
import { Col, Container, Row } from "reactstrap";
import { BASE_URL } from "../utils/config";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tours, setTours] = useState([]);
  const [lstTourRender, setLstTourRender] = useState([]);
  const limit = 6;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tours`);
        const data = await response.json();

        setTours(data.tours);
        setPageCount(Math.ceil(data.tours.length / limit));
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

  return (
    <>
      <CommonSection title={"All Tours"} />

      <section>
        <Container>
          <Row>
          
            <Col lg="3">
              <div className="filter-sidebar p-3 border rounded bg-white">
                <div className="filter-group mb-3">
                  <h6>Ngân sách</h6>
                  <div className="btn-group-wrap">
                    <button className="btn btn-outline-secondary">Dưới 5 triệu</button>
                    <button className="btn btn-outline-secondary">Từ 5 - 10 triệu</button>
                    <button className="btn btn-outline-secondary">Từ 10 - 20 triệu</button>
                    <button className="btn btn-outline-secondary">Trên 20 triệu</button>
                  </div>
                </div>

                <div className="filter-group mb-3">
                  <h6>Điểm khởi hành</h6>
                  <select className="form-select">
                    <option>Tất cả</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                  </select>
                </div>

                <div className="filter-group mb-3">
                  <h6>Điểm đến</h6>
                  <select className="form-select">
                    <option>New Zealand</option>
                    <option>Úc</option>
                  </select>
                </div>

                <div className="filter-group mb-3">
                  <h6>Ngày đi</h6>
                  <input type="date" className="form-control" />
                </div>

                <div className="filter-group mb-3">
                  <h6>Dòng tour</h6>
                  <div className="btn-group-wrap">
                    <button className="btn btn-outline-secondary">Cao cấp</button>
                    <button className="btn btn-outline-secondary">Tiêu chuẩn</button>
                    <button className="btn btn-outline-secondary">Tiết kiệm</button>
                    <button className="btn btn-outline-secondary">Giá tốt</button>
                  </div>
                </div>

                <div className="filter-group mb-4">
                  <h6>Phương tiện</h6>
                  <div className="btn-group-wrap">
                    <button className="btn btn-outline-secondary">Xe</button>
                    <button className="btn btn-outline-secondary">Máy bay</button>
                  </div>
                </div>

                <button className="btn btn-primary w-100">Áp dụng</button>
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
