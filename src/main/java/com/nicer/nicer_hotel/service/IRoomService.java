package com.nicer.nicer_hotel.service;

import com.nicer.nicer_hotel.model.Room;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:16
 */
public interface IRoomService {
    Room addNewRoom(MultipartFile roomImage, String roomType, BigDecimal roomPrice) throws IOException, SQLException;

    List<String> getAllRoomTypes();

    List<Room> getAllRooms();

    byte[] getRoomImageByRoomId(long roomId);
}
