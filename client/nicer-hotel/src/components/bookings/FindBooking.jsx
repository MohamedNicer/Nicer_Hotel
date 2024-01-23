import React, { useState } from 'react'
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [bookingInfo, setBookingInfo] = useState({
        id:"",
        room: {id: ""},
        bookingConfirmationCode: "",
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        guestFullName: "",
        guestEmail: "",
        numberOfAdults: "",
        numberOfChildren: "",
        totalNumOfGuests: ""
    })

    const [isDeleted, setIsDeleted] = useState(false)

    const clearBookingInfo = {
        id:"",
        room: {id: ""},
        bookingConfirmationCode: "",
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        guestFullName: "",
        guestEmail: "",
        numberOfAdults: "",
        numberOfChildren: "",
        totalNumOfGuests: ""
    }

    const handleInputChange = (e) =>{
        setConfirmationCode(e.target.value)
    }

    const handleFormSubmit = async(e) =>{
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBookingInfo(data)
        } catch (error) {
            setBookingInfo(clearBookingInfo)
            if(error.response && error.response.status === 404){
                setError(error.response.data.message)
            }else{
                setError(error.response)
            }
        }
        setTimeout(()=>{
            setIsLoading(false)
        },2000)
    }

    const handleBookingCancellation = async(bookingId) =>{
        try {
            await cancelBooking(bookingInfo.id)
            setIsDeleted(true)
            setBookingInfo(clearBookingInfo)
            setConfirmationCode("")
            setError("")
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <>
    <div className='container mt-5 d-flex flex-column 
    justify-content-center align-items-center'>
        <h2>Find My Booking</h2>
        <form action="" onSubmit={handleFormSubmit} className='col-md-6'>
            <div className='input-group mb-3'>
                <input type="text" 
                className='form-control'
                id='confirmationCode'
                name='confirmationCode'
                value={confirmationCode}
                onChange={handleInputChange}
                placeholder='Enter Booking Confirmation Code'/>
                <button className='btn btn-hotel input-group-text'>Search Booking</button>
            </div>
        </form>
        {isLoading ? (
            <div>Searching Booking...</div>
        ): error ? (
            <div className='text-danger'>{error}</div>
        ): bookingInfo.bookingConfirmationCode ? (
            <div className='col-md-6 mt-4 mb-5'>
                <h3>Booking Information</h3>
                <p>Booking Confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
                <p>Booking ID: {bookingInfo.id}</p>
                <p>Room Number: {bookingInfo.room.id}</p>
                <p>Check-In Date: {bookingInfo.checkInDate}</p>
                <p>Check-Out Date: {bookingInfo.checkOutDate}</p>
                <p>Guest Name: {bookingInfo.guestFullName}</p>
                <p>Guest Email: {bookingInfo.guestEmail}</p>
                <p>Adults: {bookingInfo.numberOfAdults}</p>
                <p>Children: {bookingInfo.numberOfChildren}</p>
                <p>Total Guests: {bookingInfo.totalNumOfGuests}</p>

                {!isDeleted && (
                    <button className='btn btn-danger' onClick={handleBookingCancellation(bookingInfo.id)}>Cancel Booking</button>
                )}
            </div>
        ): (
            <div>Search Booking</div>
        )}

        {isDeleted && (
            <div className='alert alert-success mt-3' role='alert'>Booking Cancelled Successfully!</div>
        )}

    </div>
    </>
  )
}

export default FindBooking