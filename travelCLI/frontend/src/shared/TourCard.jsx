import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import './tour-card.css'
import calculateAvgRating from '../utils/avgRating'

const TourCard = ({ tour }) => {

   // const { _id, ten, city, photo, price, featured, reviews } = tour

   // const { totalRating, avgRating } = calculateAvgRating(reviews)

   return (
      <div className='tour__card'>
         <Card>
            {
               tour.hinh_anh && tour.hinh_anh.length > 0 && (
                  <img
                     src={tour.hinh_anh[0]}
                     alt="tour-img"
                     className="tour__img"
                  />
               )
            }
            <div className="tour__img">
               {/* <img src={photo} alt="tour-img" /> */}
               {/* {featured && <span>Featured</span>} */}
            </div>

            <CardBody>
               <div className="card__top d-flex align-items-center justify-content-between">
                  <span className="tour__location d-flex align-items-center gap-1">
                     {/* <i class='ri-map-pin-line'></i> {city} */}
                  </span>
                  <span className="tour__rating d-flex align-items-center gap-1">
                     {/* <i class='ri-star-fill'></i> {avgRating === 0 ? null : avgRating} */}
                     {/* {totalRating === 0 ? ('Not rated') : (<span>({reviews.length})</span>)} */}

                  </span>
               </div>

               <h5 className='tour__title'><Link to={`/tours/${tour._id}`}>{tour.ten}</Link></h5>

               <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
                  <h5>${tour.gia_tien} <span> /per person</span></h5>

                  {/* <button className=' booking__btn'>
                     <Link to={`/tours/${_id}`}>Book Now</Link>
                  </button> */}
                  <Link to={`/tours/${tour._id}`}>
                     <button className=' booking__btn'>Book Now</button>
                  </Link>
               </div>
            </CardBody>
         </Card>
      </div>
   )
}

export default TourCard