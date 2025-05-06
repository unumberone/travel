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
      </Routes>
   )
}

export default Routers