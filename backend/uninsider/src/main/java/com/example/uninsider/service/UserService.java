package com.example.uninsider.service;

import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;

import java.util.List;
import java.util.Set;

public interface UserService {

    //create user
     User createUser(User user, Set<UserRole> userRoleSet) throws Exception;

    //get all users
    List<User> getUsers();

    //get user by username
    User getUserByUserName(String username);

    //delete user by id
    void deleteUser(Long userId);
}
