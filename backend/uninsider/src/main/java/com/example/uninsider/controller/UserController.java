package com.example.uninsider.controller;

import com.example.uninsider.model.Role;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    //creating user
    @PostMapping("/")
    public User createUser(@RequestBody User user) throws Exception {

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

    @GetMapping("/{username}")
    public User getUser(@PathVariable("username") String username) {
        return this.userService.getUserByUserName(username);
    }
    
    @DeleteMapping("/{userId}")
    public void deleteUserById(@PathVariable("userId") Long userid) {
        this.userService.deleteUser(userid);
    }
}
