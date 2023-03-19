package com.example.uninsider.service;

import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;

import java.util.Set;

public interface UserService {

    //create user
    public User createUser(User user, Set<UserRole> userRoleSet) throws Exception;


}
