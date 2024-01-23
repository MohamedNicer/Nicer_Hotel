package com.nicer.nicer_hotel.controller;

import com.nicer.nicer_hotel.exception.ResourceNotFoundException;
import com.nicer.nicer_hotel.exception.RoomImageRetrievalException;
import com.nicer.nicer_hotel.model.BookedRoom;
import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.service.IBookedRoomService;
import com.nicer.nicer_hotel.service.IRoomService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import response.BookingResponse;
import response.RoomResponse;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @PutMapping("/update/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable long roomId,
                                                   @RequestParam(required = false) String roomType,
                                                   @RequestParam(required = false) BigDecimal roomPrice,
                                                   @RequestParam(required = false) MultipartFile roomImage) throws SQLException, IOException {
        byte[] roomImageBytes = roomImage != null && !roomImage.isEmpty() ?
                roomImage.getBytes() : roomService.getRoomImageByRoomId(roomId);
        Blob roomImageBlob = roomImageBytes != null && roomImageBytes.length > 0? new SerialBlob(roomImageBytes) : null;
        Room updatedRoom = roomService.updateRoom(roomId, roomType, roomPrice, roomImageBytes);
        updatedRoom.setRoomImage(roomImageBlob);
        RoomResponse response = getRoomResponse(updatedRoom);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable long roomId) {
        Optional<Room> room = roomService.getRoomById(roomId);
        return room.map(room1 -> {
            RoomResponse roomResponse = getRoomResponse(room1);
            return ResponseEntity.ok(Optional.of(roomResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Room Not Found"));
    }


    private RoomResponse getRoomResponse(Room room) {
        List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(booking -> new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
        byte[] photoBytes = null;
        Blob photoBlob = room.getRoomImage();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new RoomImageRetrievalException("Error retrieving photo");
            }
        }
        return new RoomResponse(room.getId(),
                room.getRoomType(), room.getRoomPrice(),
                room.isBooked(), photoBytes, bookingInfo);
    }

    private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookedRoomService.getAllBookingByRoomId(roomId);

    }
}
