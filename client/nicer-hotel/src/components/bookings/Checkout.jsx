import React, { useState, useEffect } from 'react'
import BookingForm from './BookingForm'
import { getRoomById } from '../utils/ApiFunctions'
import { useParams } from 'react-router-dom'
import { FaWifi, FaTv, FaUtensils, FaWineGlassAlt, FaCar, FaParking, FaTshirt } from 'react-icons/fa'
import RoomCarousel from '../common/RoomCarousel'

const Checkout = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState({roomImage: "", roomType: "", roomPrice: ""})
  const {roomId} = useParams()

  useEffect(() => {
    setTimeout(()=>{
      getRoomById(roomId).then((response) =>{
        setRoomInfo(response)
        setIsLoading(false)
      }).catch((error)=>{
        setError(error)
        setIsLoading(false)
      })
    },2000)
  }, [roomId])
  

  return (
    <div>
      <section className='container'>
        <div className='row flex-column flex-md-row align-items-center'>
          <div className='col-md-4 mt-5 mb-5'>
            {isLoading ? (
              <p>Loading Room Info...</p>
            ): error? (
            <p>{error}</p>
            ):(
              <div className='room-info'>
                <img src={`data:image/png;base64,${roomInfo.roomImage}`} 
                alt="Room Image"
                style={{width:"100%",height:"200px"}} />
                <table className='table table-bordered'>
                  <tbody>
                    <tr>
                      <th>Room Type </th>
                      <th>{roomInfo.roomType}</th>
                    </tr>
                    <tr>
                      <th>Price Per Night </th>
                      <th>{roomInfo.roomPrice}</th>
                    </tr>
                    <tr>
                      <th>Room Service</th>
                      <td>
                        <ul>
                          <li><FaWifi/> WiFi </li>
                          <li><FaTv/> Netflix Premium </li>
                          <li><FaUtensils/> Breakfast </li>
                          <li><FaWineGlassAlt/> Mini Bar Refreshment </li>
                          <li><FaCar/> Car Service </li>
                          <li><FaParking/> Parking Space </li>
                          <li><FaTshirt/> Laundry </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className='col-md-6'>
          <BookingForm/>
          </div>
        </div>
      </section>
      <div className='container'>
        <RoomCarousel/>
      </div>
    </div>
  )
}

export default Checkout