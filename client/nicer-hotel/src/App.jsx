import React from 'react'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
import AddRoom from './components/room/AddRoom'
import ExistingRooms from './components/room/ExistingRooms'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EditRoom from './components/room/EditRoom'
import Home from './components/home/Home'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import RoomListing from './components/room/RoomListing'
import Admin from './components/admin/Admin'
import Checkout from './components/bookings/Checkout'
import BookingSuccess from './components/bookings/BookingSuccess'
import Bookings from './components/bookings/Bookings'
import FindBooking from './components/bookings/FindBooking'

function App() {

  return (
    <>
    <main>
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/editRoom/:roomId' element={<EditRoom />}/>
          <Route path='/existingRooms' element={<ExistingRooms />}/>
          <Route path='/addRoom' element={<AddRoom />}/>
          <Route path='/bookRoom/:roomId' element={<Checkout />}/>
          <Route path='/browseAllRooms' element={<RoomListing />}/>
          <Route path='/Admin' element={<Admin />}/>
          <Route path='/BookingSuccess' element={<BookingSuccess />}/>
          <Route path='/existingBookings' element={<Bookings />}/>
          <Route path='/findBooking' element={<FindBooking />}/>
        </Routes>
      </Router>
      <Footer/>
    </main>
    </>
  )
}

export default App
