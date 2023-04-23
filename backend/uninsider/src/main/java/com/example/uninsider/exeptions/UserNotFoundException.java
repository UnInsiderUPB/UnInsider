package com.example.uninsider.exeptions;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException() {
        super("User with this username not found");
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
