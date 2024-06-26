package com.nicer.nicer_hotel.service;

import com.nicer.nicer_hotel.exception.InternalServerException;
import com.nicer.nicer_hotel.exception.ResourceNotFoundException;
import com.nicer.nicer_hotel.exception.RoomImageRetrievalException;
import com.nicer.nicer_hotel.model.Room;
import com.nicer.nicer_hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:16
 */
@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements IRoomService {
    private final RoomRepository roomRepository;
    @Override
    public Room addNewRoom(MultipartFile file, String roomType, BigDecimal roomPrice) throws IOException, SQLException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        if(!file.isEmpty()){
            byte[] roomImageBytes = file.getBytes();
            Blob roomImageBlob = new SerialBlob(roomImageBytes);
            room.setRoomImage(roomImageBlob);
        }
        return roomRepository.save(room);
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public byte[] getRoomImageByRoomId(long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null){
            Blob roomImageBlob = room.getRoomImage();
            try {
                return roomImageBlob.getBytes(1, (int) roomImageBlob.length());
            } catch (SQLException e) {
                throw new RoomImageRetrievalException("Error Retrieving Image");
            }
        } else {
            throw new ResourceNotFoundException("Sorry, Room Not Found!");
        }
    }

    @Override
    public void deleteRoom(long roomId) {
        Optional<Room> room = roomRepository.findById(roomId);
        if(room.isPresent()){
            roomRepository.deleteById(roomId);
        }
    }

    @Override
    public Room updateRoom(long roomId, String roomType, BigDecimal roomPrice, byte[] roomImageBytes){
        Room room = roomRepository.findById(roomId).get();
        if(roomType != null) {
            room.setRoomType(roomType);
        }
        if(roomPrice != null) {
            room.setRoomPrice(roomPrice);
        }
        if(roomImageBytes != null && roomImageBytes.length >0){
            try{
                Blob roomImageBlob = new SerialBlob(roomImageBytes);
                room.setRoomImage(roomImageBlob);
            }catch (SQLException e){
                throw new InternalServerException("Error Updating Room Image");
            }
        }
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> getRoomById(long roomId) {
        return roomRepository.findById(roomId);
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate,checkOutDate,roomType);
    }
}
