package com.example.uninsider.exeptions;

public class UniversityNotFoundException extends RuntimeException {
    public UniversityNotFoundException() {
        super("University with this name not found");
    }

    public UniversityNotFoundException(String message) {
        super(message);
    }
}
