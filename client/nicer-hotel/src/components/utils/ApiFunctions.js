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