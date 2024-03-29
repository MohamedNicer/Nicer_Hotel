import React, { useState } from 'react'
import moment from 'moment'
import RoomTypeSelector from './RoomTypeSelector'
import { getAvailableRooms } from '../utils/ApiFunctions'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import RoomSearchResult from './RoomSearchResult'

const RoomSearch = () => {
    const[searchQuery, setSearchQuery] = useState({
        checkInDate: "",
        checkOutDate: "",
        roomType: ""
    })

    const[errorMessage, setErrorMessage] = useState("")
    const[availableRooms, setAvailableRooms] = useState([])
    const[isLoading, setIsLoading] = useState(false)

    const handleSearch = (e) => {
      e.preventDefault();
      const checkIn = moment(searchQuery.checkInDate)
      const checkOut = moment(searchQuery.checkOutDate)
      if(!checkIn.isValid() || !checkOut.isValid()){
        setErrorMessage("Please Enter a Valid Date Range")
        return 
      }
      if(!checkOut.isSameOrAfter(checkIn)){
        setErrorMessage("Check-In Date must be before Check-Out Date")
        return
      }
      setIsLoading(true)
      getAvailableRooms(searchQuery.checkInDate,searchQuery.checkOutDate,
        searchQuery.roomType).then((response) =>{
          setAvailableRooms(response.data)
          setTimeout(()=>{
            setIsLoading(false)
          }, 2000)
        }).catch((error) =>{
          console.error(error)
        }).finally(()=>{
          setIsLoading(false)
        })
    }
    const handleInputChange = (e) =>{
      const {name, value} = e.target
      const checkIn = moment(searchQuery.checkInDate)
      const checkOut = moment(searchQuery.checkOutDate)
      if(checkIn.isValid() && checkOut.isValid()){
        setErrorMessage("")
      }
    }

    const clearSearch = () =>{
      setSearchQuery({
        checkInDate:"",
        checkOutDate:"",
        roomType:""
      })
    }

  return (
    <>
    <Container className='mt-5 mb-5 py-5 shadow'>
      <Form onSubmit={handleSearch}>
        <Row className='justify-content-center'>
          <Col xs={12} md={3}>
            <Form.Group controlId='checkInDate'>
              <Form.Label>Check-In-Date</Form.Label>
              <Form.Control
              type='date'
              name='checkInDate'
              value={searchQuery.checkInDate}
              onChange={handleInputChange}
              min={moment().format("YYYY-MM-DD")}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group controlId='checkOutDate'>
              <Form.Label>Check-Out-Date</Form.Label>
              <Form.Control
              type='date'
              name='checkOutDate'
              value={searchQuery.checkOutDate}
              onChange={handleInputChange}
              min={moment().format("YYYY-MM-DD")}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label>Room Type</Form.Label>
              <div className='d-flex'>
                <RoomTypeSelector 
                handleRoomInputChange={handleInputChange} 
                newRoom={searchQuery}
                />
                <Button variant='secondary' type='submit'>Search</Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {isLoading? (
        <p>Looking for Available Rooms ...</p>
      ): availableRooms ?(
        <RoomSearchResult results={availableRooms}
        onClearSearch={clearSearch}/>
      ):(
        <p>Not Rooms Available for this Specific Query</p>
      )}
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
    </Container>
    </>
  )
}

export default RoomSearch