package com.example.uninsider.exeptions;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException() {
        super("Review with this id not found");
    }

    public ReviewNotFoundException(String message) {
        super(message);
    }
}
