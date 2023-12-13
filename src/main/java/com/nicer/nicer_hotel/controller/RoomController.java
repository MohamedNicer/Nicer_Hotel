package com.nicer.nicer_hotel.controller;

import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import response.RoomResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:12
 */
@RequiredArgsConstructor
@RequestMapping("/rooms")
@RestController
@CrossOrigin(origins = "*")
public class RoomController {

    private final IRoomService roomService;

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
}
