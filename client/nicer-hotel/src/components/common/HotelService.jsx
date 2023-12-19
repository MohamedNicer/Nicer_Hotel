import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import Header from './Header'
import { FaClock, FaUtensils, FaWifi, FaTshirt, FaCocktail, FaParking, FaSnowflake } from 'react-icons/fa'

const HotelService = () => {
  return (
    <>
    <Container className='mb-2'>
        <Header title={"Our Services"}/>
        <Row className='mt-4'>
            <h4 className='text-center'>
                Services at <span className='hotel-color'>Nicer </span>Hotel
                <span className='gap-2'>
                    <FaClock className='ml-3'/> - 24-Hour Front Desk
                </span>
            </h4>
        </Row>
        <hr />
        <Row xs={1} md={2} lg={3} className='g-4 mt-2'>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaWifi /> WiFi
                    </Card.Title>
                    <Card.Text>Stay Connected with High-Speed Internet Access.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaUtensils /> Breakfast
                    </Card.Title>
                    <Card.Text>Start Your Day with a Delicious Breakfast Buffet.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaTshirt /> Laundry
                    </Card.Title>
                    <Card.Text>Keep your Clothes Clean and Fresh with our Laundry Service.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaCocktail /> Mini-Bar
                    </Card.Title>
                    <Card.Text>Enjoy a Refreshing Drink/Snack from our In-Room Mini-Bar.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaParking /> Parking
                    </Card.Title>
                    <Card.Text>Park your Car Conveniently in Our On-Site Parking Lot.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card>
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaSnowflake /> Air Conditioning
                    </Card.Title>
                    <Card.Text>Stay Cool and Comfortable with our Air Conditioning System.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default HotelService