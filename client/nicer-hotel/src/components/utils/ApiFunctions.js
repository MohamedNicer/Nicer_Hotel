import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:8080"
})

/* This function is used to add new room to db */
export async function addRoom(roomImage, roomType, roomPrice){
    const formData = new FormData();
    formData.append("roomImage",roomImage);
    formData.append("roomType",roomType);
    formData.append("roomPrice",roomPrice);

    const response = await api.post("/rooms/addRoom", formData)
    if(response.status == 201){
        return true;
    }else{
        return false;
    }
}

/* This function is used to fetch all room types from db */
export async function getRoomTypes(){
    try {
        const response = await api.get("/rooms/roomTypes")
        return response.data
    } catch (error) {
        throw new Error("Error Fetching Room Types")
    }
}

/* This function is used to fetch all rooms from db */
export async function getAllRooms(){
    try {
        const result = await api.get("/rooms/allRooms")
        return result.data
    } catch (error) {
        throw new Error("Error Fetching Rooms")
    }
}

/* This function is used a room using its id */
export async function deleteRoom(roomId){
    try {
        const result = await api.delete(`/rooms/deleteRoom/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error Deleting Room ${error.message}`)
    }
}
/* This function is used to update a room using its id */
export async function updateRoom(roomId, roomData){
    const formData = new FormData()
    formData.append("roomType",roomData.roomType)
    formData.append("roomPrice",roomData.roomPrice)
    formData.append("roomImage",roomData.roomImage)
    const response = await api.put(`/rooms/update/${roomId}`,formData)
    return response
}
/* This function is used to fetch a room using its id*/
export async function getRoomById(roomId){
    try {
        const result = await api.get(`/rooms/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error Fetching Room ${error.message}`)
    }
}