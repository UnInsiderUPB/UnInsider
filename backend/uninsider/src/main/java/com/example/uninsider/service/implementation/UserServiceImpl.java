package com.example.uninsider.service.implementation;

import com.example.uninsider.exeptions.UserAlreadyExists;
import com.example.uninsider.model.User;
import com.example.uninsider.model.UserRole;
import com.example.uninsider.repo.RoleRepository;
import com.example.uninsider.repo.UserRepository;
import com.example.uninsider.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public User createUser(User user, Set<UserRole> userRoleSet) throws UserAlreadyExists {
        // User with the same `username` already exists
        if (this.userRepository.existsByUsername(user.getUsername())) {
            System.out.println("User with username `" + user.getUsername() + "` already exists");
            throw new UserAlreadyExists("User with username `" + user.getUsername() + "` already exists");
        }

        // User with the same `email` already exists
        if (this.userRepository.existsByEmail(user.getEmail())) {
            System.out.println("User with email `" + user.getEmail() + "` already exists");
            throw new UserAlreadyExists("User with email `" + user.getEmail() + "` already exists");
        }

        // Create user
        for (UserRole role: userRoleSet)
            roleRepository.save(role.getRole());
        user.getUserRoles().addAll(userRoleSet);
        this.userRepository.save(user);

        return user;
    }

    @Override
    public User updateUser(User user) {
        if (!this.userRepository.existsById(user.getId())) {
            System.out.println("User with id `" + user.getId() + "` not found");
            return null;
        }

        return this.userRepository.save(user);
    }

    @Override
    public User getUser(String username) {
        return this.userRepository.findByUsername(username);
    }


    @Override
    public User getUserByUsername(String username) {
        return userRepository.getUserByUsername(username);
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
