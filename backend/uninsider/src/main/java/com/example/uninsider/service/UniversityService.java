package com.example.uninsider.service;

import com.example.uninsider.model.University;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UniversityService {

    // Create University
    University createUniversity(University university) throws Exception;

    // Update University
    University updateUniversity(University university) throws Exception;

    // Get university by its id
    University getUniversity(Long id) throws Exception;

    // Get university by its name
    University getUniversity(String name);

    // Get all universities
    List<University> getUniversities();

    // Delete university by its id
    void deleteUniversity(Long id);
}
