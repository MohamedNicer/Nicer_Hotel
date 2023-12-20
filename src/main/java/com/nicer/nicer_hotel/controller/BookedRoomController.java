package com.nicer.nicer_hotel.controller;

import com.nicer.nicer_hotel.exception.InvalidBookingRequestException;
import com.nicer.nicer_hotel.exception.ResourceNotFoundException;
import com.nicer.nicer_hotel.model.BookedRoom;
import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.service.IBookedRoomService;
import com.nicer.nicer_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import response.BookingResponse;
import response.RoomResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:13
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*") // Allows cross-origin requests from any origin. This is a security measure to prevent cross-site scripting attacks.
public class BookedRoomController {

    private final IBookedRoomService bookedRoomService;
    private final IRoomService roomService;

    @GetMapping("/allBookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookedRoom> bookedRooms = bookedRoomService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom bookedRoom : bookedRooms) {
            BookingResponse bookingResponse = getBookingResponse(bookedRoom);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        try {
            BookedRoom bookedRoom = bookedRoomService.getBookingByConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(bookedRoom);
            return ResponseEntity.ok(bookingResponse);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/room/{roomId}/booking")  // roomId is the path variable for the roomId parameter in the URL. The @RequestBody annotation is used to bind the request body to the BookedRoom object. The BookedRoom object is passed to the saveBooking() method of the BookedRoom
    public ResponseEntity<?> saveBooking(@PathVariable long roomId, @RequestBody BookedRoom bookingRequest) {
        try{
            String confirmationCode = bookedRoomService.saveBooking(roomId, bookingRequest);
            return ResponseEntity.ok("Room Booked Successfully! Your Booking Confirmation Code is:" + confirmationCode);
        }catch (InvalidBookingRequestException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(long bookingId) {
        bookedRoomService.cancelBooking(bookingId);
    }

    private BookingResponse getBookingResponse(BookedRoom bookedRoom) {
        Room room = roomService.getRoomById(bookedRoom.getRoom().getId()).get();
        RoomResponse roomResponse = new RoomResponse(room.getId(),
                room.getRoomType(),
                room.getRoomPrice());
        return new BookingResponse(bookedRoom.getBookingId(),
                bookedRoom.getCheckInDate(),
                bookedRoom.getCheckOutDate(),
                bookedRoom.getGuestFullName(),
                bookedRoom.getGuestEmail(),
                bookedRoom.getNumOfAdults(),
                bookedRoom.getNumOfChildren(),
                bookedRoom.getTotalNumOfGuest(),
                bookedRoom.getBookingConfirmationCode(),roomResponse);
    }
}