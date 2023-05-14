package com.example.uninsider.exeptions;

public class UniversityAlreadyExists extends RuntimeException {
    public UniversityAlreadyExists() {
        super("University with this name already exists");
    }

    public UniversityAlreadyExists(String message) {
        super(message);
    }
}
