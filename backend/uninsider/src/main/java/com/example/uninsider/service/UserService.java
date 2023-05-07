package com.example.uninsider.service;

import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;

import java.util.List;
import java.util.Set;

public interface UserService {

    //create user
     User createUser(User user, Set<UserRole> userRoleSet) throws Exception;

     //get user
    User getUser(String username);

    //get all users
    List<User> getUsers();

    //get user by username
    User getUserByUsername(String username);


    void updateUser(Long userId, User user);

    //delete user by id
    void deleteUser(Long userId);
}
