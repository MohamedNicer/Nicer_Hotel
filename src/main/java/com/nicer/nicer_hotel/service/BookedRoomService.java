package com.nicer.nicer_hotel.service;

import com.nicer.nicer_hotel.model.BookedRoom;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:17
 */
@Service
public class BookedRoomService implements IBookedRoomService{
    @Override
    public List<BookedRoom> getAllBookingByRoomId(long roomId) {
        return null;
    }
}
