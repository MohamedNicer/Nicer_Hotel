package com.nicer.nicer_hotel.exception;

/**
 * @author mohamednicer
 * Date:16/12/2023
 * Time:13:47
 */
public class InternalServerException extends RuntimeException {
    public InternalServerException(String message) {
        super(message);
    }
}
