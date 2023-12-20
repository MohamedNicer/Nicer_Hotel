package com.nicer.nicer_hotel.service;

import com.nicer.nicer_hotel.exception.InvalidBookingRequestException;
import com.nicer.nicer_hotel.model.BookedRoom;
import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.repository.BookedRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:17
 */
@Service
@RequiredArgsConstructor
public class BookedRoomService implements IBookedRoomService{

    private final BookedRoomRepository bookedRoomRepository;
    private final IRoomService roomService;

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookedRoomRepository.findAll();
    }
    @Override
    public List<BookedRoom> getAllBookingByRoomId(long roomId) {
        return bookedRoomRepository.findByRoomId(roomId);
    }

    @Override
    public void cancelBooking(long bookingId) {
        bookedRoomRepository.deleteById(bookingId);
    }

    @Override
    public String saveBooking(long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-out date must be after check-in date.");
        }
        Room room = roomService.getRoomById(roomId).get();
        List<BookedRoom> existingBookings = room.getBookings();
        boolean isAvailable = roomIsAvailable(bookingRequest,existingBookings);
        if (isAvailable) {
            room.addBooking(bookingRequest);
            bookedRoomRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("Sorry, Room is not available for the requested dates.");
        }
        return bookingRequest.getBookingConfirmationCode(); // Return the confirmation code for the booking. This will be used to confirm the booking.
    }

    @Override
    public BookedRoom getBookingByConfirmationCode(String confirmationCode) {
        return bookedRoomRepository.findByBookingConfirmationCode(confirmationCode);
    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream().noneMatch(existingBooking ->
                bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                ||  bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                        && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                        && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                        && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                        && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                        && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
        );

    }
}
