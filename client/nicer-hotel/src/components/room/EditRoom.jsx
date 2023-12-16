import React, { useEffect, useState } from 'react'
import { getRoomById, updateRoom } from '../utils/ApiFunctions'
import { Link, useParams } from 'react-router-dom'

const EditRoom = () => {
  const [room, setRoom] = useState({
		roomImage: null,
		roomType: "",
		roomPrice: ""
	})

	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [imagePreview, setImagePreview] = useState("")
  const {roomId} = useParams()

  const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setRoom({ ...room, roomImage: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

  const handleInputChange = (e) => {
		const {name, value} = e.target
		setRoom({ ...room, [name]: value })
	}

  useEffect(() => {
    const fetchRoom = async () =>{
      try {
        const roomData = await getRoomById(roomId)
        setRoom(roomData)
        setImagePreview(roomData.roomImage)
      } catch (error) {
        console.error(error)
      }
    }
    fetchRoom()
  }, [roomId])
  

  const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await updateRoom(roomId, room)
			if (response.status === 200) {
				setSuccessMessage("Room Updated Successfully!")
				const updatedRoomData = await getRoomById(roomId)
        setRoom(updatedRoomData)
				setImagePreview(updatedRoomData.roomImage)
				setErrorMessage("")
			} else {
				setErrorMessage("Error Updating Room")
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}
  return (
    <>
			<section className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 col-lg-6">
						<h2 className="mt-5 mb-2">Edit Room</h2>
						{successMessage && (
							<div className="alert alert-success" role='alert'> {successMessage}</div>
						)}

						{errorMessage && <div className="alert alert-danger" role='alert'> {errorMessage}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="roomType" className="form-label hotel-color">
									Room Type
								</label>
								<input type="text" name="roomType" id="roomType" className='form-control' 
                value={room.roomType} onChange={handleInputChange}/>
							</div>
							<div className="mb-3">
								<label htmlFor="roomPrice" className="form-label hotel-color">
									Room Price
								</label>
								<input
									type="number"
									className="form-control"
									id="roomPrice"
									name="roomPrice"
									value={room.roomPrice}
									onChange={handleInputChange}
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="roomImage" className="form-label hotel-color">
									Room Image
								</label>
								<input
									required
									name="roomImage"
									id="roomImage"
									type="file"
									className="form-control"
									onChange={handleImageChange}
								/>
								{imagePreview && (
									<img
										src={`data:image/jpeg;base64,${imagePreview}`}
										alt="Preview Room Image"
										style={{ maxWidth: "400px", maxHeight: "400px" }}
										className="mt-3" />
								)}
							</div>
                    <div className='d-grid gap-2 d-md-flex mt-2'>
                      <Link to={"/existingRooms"} className='btn btn-outline-info ml-5'>
                        Back
                      </Link>
                        <button type='submit' className='btn btn-outline-warning'>
                            Edit Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
    </>
  )
}

export default EditRoom