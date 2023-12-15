package com.nicer.nicer_hotel.controller;

import com.nicer.nicer_hotel.exception.RoomImageRetrievalException;
import com.nicer.nicer_hotel.model.BookedRoom;
import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.service.IBookedRoomService;
import com.nicer.nicer_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import response.RoomResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:12
 */

@RequestMapping("/rooms")
@RestController
@CrossOrigin(origins = "*")
public class RoomController {

    private final IRoomService roomService;
    private final IBookedRoomService bookedRoomService;

    public RoomController(IRoomService roomService, IBookedRoomService bookedRoomService) {
        this.roomService = roomService;
        this.bookedRoomService = bookedRoomService;
    }

    @PostMapping("/addRoom")
    public ResponseEntity<RoomResponse> addNewRoom(@RequestParam("roomImage")MultipartFile  roomImage, @RequestParam("roomType") String roomType, @RequestParam("roomPrice") BigDecimal roomPrice) throws SQLException, IOException {
        Room savedRoom = roomService.addNewRoom(roomImage,roomType,roomPrice);
        RoomResponse response = new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/roomTypes")
    public List<String> getRoomTypes() {
        return roomService.getAllRoomTypes();
    }
    @GetMapping("/allRooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room: rooms){
            byte[] roomImageBytes = roomService.getRoomImageByRoomId(room.getId());
            if(roomImageBytes != null && roomImageBytes.length > 0){
                String roomImageBase64 = Base64.encodeBase64String(roomImageBytes);
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setRoomImage(roomImageBase64);
                roomResponses.add(roomResponse);
            }
        }
        return ResponseEntity.ok(roomResponses);
    }

    @DeleteMapping("/deleteRoom/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.ok().build(); //204 No Content
    }
    private RoomResponse getRoomResponse(Room room) {
        List<BookedRoom> bookedRooms = getAllBookingByRoomId(room.getId());
        /*List<BookingResponse> bookingResponses = bookedRooms
                .stream()
                .map(bookedRoom -> new BookingResponse(bookedRoom.getBookingId(),
                        bookedRoom.getCheckInDate(), bookedRoom.getCheckOutDate(),
                        bookedRoom.getBookingConfirmationCode()))
                .toList();*/
        byte[] roomImageBytes = null;
        Blob roomImageBlob = room.getRoomImage();
        if(roomImageBlob != null){
            try {
                roomImageBytes = roomImageBlob.getBytes(1,(int) roomImageBlob.length());
            } catch (SQLException e) {
                throw new RoomImageRetrievalException("Error Retrieving Image");
            }
        }
        return new RoomResponse(room.getId(), room.getRoomType(),
                room.getRoomPrice(), room.isBooked(),
                roomImageBytes);
    }

    private List<BookedRoom> getAllBookingByRoomId(long roomId) {
        return bookedRoomService.getAllBookingByRoomId(roomId);
    }
}
