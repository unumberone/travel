import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ThankYou from '../pages/ThankYou'
import Home from './../pages/Home'
import Login from './../pages/Login'
import Register from './../pages/Register'
import About from './../pages/About'
import SearchResultList from './../pages/SearchResultList'
import TourDetails from './../pages/TourDetails'
import Tours from './../pages/Tours'
import Admin from '../components/Admin/Admin'  
import TourFullDetails from '../shared/TourFullDetails'
import Payment from '../pages/Payment'
import Bill from '../pages/Bill'
import History from '../pages/History'


const Routers = () => {
   return (
      <Routes>
         <Route path='/' element={<Navigate to='/home'/>} />
         <Route path='/admin' element={<Admin/>} />
         <Route path='/home' element={<Home/>} />
         <Route path='/tours' element={<Tours/>} />
         <Route path='/tours/:id' element={<TourDetails/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/register' element={<Register/>} />
         <Route path='/about' element={<About/>} />
         <Route path='/thank-you' element={<ThankYou/>} />
         <Route path='/tours/search' element={<SearchResultList/>} />
         <Route path='/tour-full-details/:id' element={<TourFullDetails />} /> 
         <Route path='/payment' element={<Payment />} />
         <Route path='/bill/:bookingId' element={<Bill />} />
         <Route path='/history' element={<History />} />
      </Routes>
   )
}

export default Routers