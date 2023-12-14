package com.nicer.nicer_hotel.service;

import com.nicer.nicer_hotel.model.BookedRoom;

import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:17
 */
public interface IBookedRoomService {
    List<BookedRoom> getAllBookingByRoomId(long roomId);
}
