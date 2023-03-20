package com.example.uninsider.service.implementation;

import com.example.uninsider.exeptions.UserAlreadyExists;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.repo.RoleRepository;
import com.example.uninsider.repo.UserRepository;
import com.example.uninsider.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.beans.Transient;
import java.util.List;
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

        //check if there is another user created this the same email
        if (this.userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExists("user with email " + user.getEmail() + " already here");

            //check if there is another user created this the same username
        } else if (this.userRepository.existsByUserName(user.getUserName())) {
            throw new UserAlreadyExists("user with username " + user.getUserName() + " already here");

            //create user
        } else {
            for (UserRole role : userRoleSet) {
                roleRepository.save(role.getRole());
            }

            user.getUserRoleSet().addAll(userRoleSet);
            this.userRepository.save(user);
        }

        return user;
    }

    @Override
    public User getUserByUserName(String username) {
        return userRepository.getUserByUserName(username);
    }

    @Override
    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    @Override
    public void deleteUser(Long userId) {
        this.userRepository.deleteById(userId);
    }
}
