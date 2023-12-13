package com.nicer.nicer_hotel.repository;

import com.nicer.nicer_hotel.model.BookedRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author mohamednicer
 * Date:12/12/2023
 * Time:05:14
 */
@Repository
public interface BookedRoomRepository extends JpaRepository<BookedRoom, Long> {
}
