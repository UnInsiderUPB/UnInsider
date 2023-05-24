package com.example.uninsider.controller;

import com.example.uninsider.exeptions.UserNotFoundException;
import com.example.uninsider.model.Role;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public User createUser(@RequestBody User user) throws Exception {
        user.setProfile("default.png");

        // Encode password with BCrypt
        user.setPassword(this.bCryptPasswordEncoder.encode(user.getPassword()));

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

    @PutMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public User updateUser(@RequestBody User requestBodyUser) throws Exception {
        User originalUser = getUserByUsername(requestBodyUser.getUsername());
        if (originalUser == null) {
            throw new UserNotFoundException("User with username `" + requestBodyUser.getUsername() + "` not found");
        }

        originalUser.setFirstName(requestBodyUser.getFirstName());
        originalUser.setLastName(requestBodyUser.getLastName());
        originalUser.setEmail(requestBodyUser.getEmail());
        originalUser.setPhone(requestBodyUser.getPhone());

        if (requestBodyUser.getPassword() != null && !requestBodyUser.getPassword().isEmpty()) {
            originalUser.setPassword(this.bCryptPasswordEncoder.encode(requestBodyUser.getPassword()));
        }

        return this.userService.updateUser(originalUser);
    }

    @PutMapping("/{username}/role/{roleName}")
    @ResponseStatus(code = HttpStatus.CREATED)
    public User updateUserRole(@PathVariable("username") String username, @PathVariable("roleName") String roleName) throws Exception {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new UserNotFoundException("User with username `" + username + "` not found");
        }

        Set<UserRole> userRoleSet = new HashSet<>();
        Role role = new Role();

        role.setRoleId((roleName.equals("ADMIN")) ? 0L : 45L);
        role.setRoleName(roleName);

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);

        userRoleSet.add(userRole);

        return this.userService.updateUserRole(user, userRoleSet);
    }

    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public List<User> getAllUsers() {
        return this.userService.getUsers();
    }

    @GetMapping("/{username}")
    @ResponseStatus(code = HttpStatus.OK)
    public User getUserByUsername(@PathVariable("username") String username) {
        return this.userService.getUserByUsername(username);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable("userId") Long userid) {
        this.userService.deleteUser(userid);
    }
}
