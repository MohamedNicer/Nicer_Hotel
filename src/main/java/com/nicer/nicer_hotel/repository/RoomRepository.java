package com.nicer.nicer_hotel.repository;

import com.nicer.nicer_hotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:14
 */
@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {
    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> findDistinctRoomTypes();
}
