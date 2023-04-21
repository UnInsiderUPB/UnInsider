package com.example.uninsider.controller;

import com.example.uninsider.exeptions.UserNotFoundException;
import com.example.uninsider.model.Role;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.service.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public User createUser(@RequestBody User user) throws Exception {
        user.setProfile("default.png");
        Set<UserRole> userRoleSet = new HashSet<>();
        Role role = new Role();
        role.setRoleId(45L);
        role.setRoleName("NORMAL");

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);

        userRoleSet.add(userRole);
        return this.userService.createUser(user, userRoleSet);
    }

    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public List<User> getAllUsers() {
        return this.userService.getUsers();
    }

    @GetMapping("/{username}")
    @ResponseStatus(code = HttpStatus.OK)
    public User getUserByUsername(@PathVariable("username") String username) {
        return this.userService.getUserByUserName(username);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable("userId") Long userid) {
        this.userService.deleteUser(userid);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> exceptionHandler(Exception ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
