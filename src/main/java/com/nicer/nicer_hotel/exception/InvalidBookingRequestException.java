package com.nicer.nicer_hotel.exception;

/**
 * @author mohamednicer
 * Date:19/12/2023
 * Time:13:25
 */
public class InvalidBookingRequestException extends RuntimeException {
    public InvalidBookingRequestException(String message) {
        super(message);
    }
}
