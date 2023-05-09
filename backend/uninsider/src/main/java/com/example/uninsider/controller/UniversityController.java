package com.example.uninsider.controller;

import com.example.uninsider.exeptions.UniversityNotFoundException;
import com.example.uninsider.exeptions.UserNotFoundException;
import com.example.uninsider.model.Role;
import com.example.uninsider.model.University;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/university")
@CrossOrigin("*")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @PostMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public University createUniversity(@RequestBody University university) throws Exception {
        return this.universityService.createUniversity(university);
    }

    @PutMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public University updateUniversity(@RequestBody University requestBodyUniversity) throws Exception {
        University originalUniversity = this.universityService.getUniversity(requestBodyUniversity.getName());
        if (originalUniversity == null) {
            System.out.println("University with name `" + requestBodyUniversity.getName() + "` not found!");
            throw new UniversityNotFoundException("University with name `" + requestBodyUniversity.getName() + "` not found");
        }

        originalUniversity.setName(requestBodyUniversity.getName());
        originalUniversity.setDescription(requestBodyUniversity.getDescription());
        originalUniversity.setLocation(requestBodyUniversity.getLocation());

        return this.universityService.updateUniversity(originalUniversity);
    }

    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public List<University> getAllUniversities() {
        return this.universityService.getUniversities();
    }

    @GetMapping("/{universityId}")
    @ResponseStatus(code = HttpStatus.OK)
    public University getUniversityById(@PathVariable("universityId") Long universityId) throws Exception {
        return this.universityService.getUniversity(universityId);
    }

    @DeleteMapping("/{universityId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteUniversityById(@PathVariable("universityId") Long universityId) {
        this.universityService.deleteUniversity(universityId);
    }
}
