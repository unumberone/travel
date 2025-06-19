import React from 'react'
import Header from './../Header/Header'
import Routers from '../../router/Routers'
import Chatbot from '../Chatbot/Chatbot'
import Footer from './../Footer/Footer'

const Layout = () => {
   return (
      <>
         <Header />
         <Routers />
         <Chatbot />
         <Footer />      
      </>
   )
}

export default Layout