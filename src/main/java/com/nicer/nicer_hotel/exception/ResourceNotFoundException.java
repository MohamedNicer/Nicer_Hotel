package com.nicer.nicer_hotel.exception;

/**
 * @author mohamednicer
 * Date:14/12/2023
 * Time:07:00
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
