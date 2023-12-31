import React, { useEffect, useState } from 'react'
import { deleteRoom, getAllRooms } from '../utils/ApiFunctions'
import { Col, Row } from "react-bootstrap"
import RoomFilter from "../common/RoomFilter"
import RoomPaginator from "../common/RoomPaginator"
import { Link } from "react-router-dom"
import { FaPlus } from 'react-icons/fa6'

const ExistingRooms = () => {
    const[rooms , setRooms] = useState([])
    const[currentPage, setCurrentPage] = useState(1)
    const[roomsPerPage] = useState(8)
    const[isLoading, setIsLoading] = useState(false)
    const[filteredRooms, setFilteredRooms] = useState([])
    const[selectedRoomType, setSelectedRoomType] = useState("")
    const[successMessage, setSuccessMessage] = useState("")
    const[errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
      fetchRooms()
    }, [])
    

    const fetchRooms= async() =>{
        setIsLoading(true)
        try {
            const result = await getAllRooms()
            setRooms(result)
            setIsLoading(false)
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
    
    useEffect(() =>{
        if(selectedRoomType === ""){
            setFilteredRooms(rooms)
        }else{
            const filtered = rooms.filter((room)=> room.roomType === selectedRoomType)
            setFilteredRooms(filtered)
        }
        setCurrentPage(1)
    }, [rooms, selectedRoomType])

    const handlePaginationClick = (pageNumber) =>{
        setCurrentPage(pageNumber)
    }

    const handleDelete = async(roomId) =>{
        try {
            const result = await deleteRoom(roomId)
            if(result === ""){
                setSuccessMessage(`Room N° ${roomId} was Deleted Successfully!`)
                fetchRooms()
            }else{
                console.error(`Error Deleting Room: ${result.message}`)
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
        setTimeout(() => {
           setSuccessMessage("")
           setErrorMessage("")
        }, 3000);
    }

    const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) =>{
        const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length
        return Math.ceil(totalRooms/roomsPerPage)
    }

    const indexOfLastRoom = currentPage * roomsPerPage
    const indexOfFirstRoom = currentPage - roomsPerPage
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)


  return (
    <>
    {isLoading ?(
        <p>Loading Existing Rooms</p>
    ): (
        <>
        <section className='mt-5 mb-5 container'>
            <div className='d-flex justify-content-center mb-3 mt-5'>
                <h2>Existing Rooms</h2>
            </div>
            <Row>
                <Col md={6} className='mb-3 mb-md-0'>
                    <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
                </Col>
                <Col md={6} className='d-flex justify-content-end'>
                    <Link to={"/addRoom"}>
                        <FaPlus/> Add New Room
                    </Link>
                </Col>
            </Row>
            <table className='table table-bordered table-hover'>
                <thead>
                    <tr className='text-center'>
                        <th>Id</th>
                        <th>Room Type</th>
                        <th>Room Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRooms.map((room)=>(
                        <tr key={room.id} className='text-center'>
                            <td>{room.id}</td>
                            <td>{room.roomType}</td>
                            <td>{room.roomPrice}</td>
                            <td className='gap-2'>
                                <Link to={`/editRoom/${room.id}`}>
                                    <span style={{paddingRight: "10px"}} className="material-symbols-outlined">
                                        visibility
                                    </span>
                                    <span style={{paddingRight: "10px"}} className="material-symbols-outlined">
                                        edit
                                    </span>
                                </Link>
                                <span className="material-symbols-outlined" onClick={()=>handleDelete(room.id)}>
                                    delete
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <RoomPaginator 
            currentPage={currentPage}
            totalPages = {calculateTotalPages(filteredRooms,roomsPerPage,rooms)} 
            onPageChange={handlePaginationClick}/>
        </section>
        </>
    )}
    </>
  )
}

export default ExistingRooms