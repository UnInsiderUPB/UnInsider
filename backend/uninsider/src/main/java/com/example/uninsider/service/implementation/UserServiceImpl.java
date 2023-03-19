package com.example.uninsider.service.implementation;

import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.repo.RoleRepository;
import com.example.uninsider.repo.UserRepository;
import com.example.uninsider.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public User createUser(User user, Set<UserRole> userRoleSet) throws Exception {
        User userOptional = this.userRepository.findByUserName(user.getUserName());

        if (userOptional != null) {
            System.out.println("User is already here!");
            throw new Exception("user already here");
        } else {
            //create user
            for (UserRole role:userRoleSet) {
                roleRepository.save(role.getRole());
            }

            user.getUserRoleSet().addAll(userRoleSet);
            userOptional = this.userRepository.save(user);
        }

        return userOptional;
    }
}
