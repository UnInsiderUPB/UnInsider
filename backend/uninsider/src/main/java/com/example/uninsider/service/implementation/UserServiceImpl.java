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
    public User createUser(User user, Set<UserRole> userRoleSet) throws UserAlreadyExists {
        // User with the same `username` already exists
        if (this.userRepository.existsByUserName(user.getUserName())) {
            System.out.println("User with username `" + user.getUserName() + "` already exists");
            throw new UserAlreadyExists("User with username `" + user.getUserName() + "` already exists");
        }

        // User with the same `email` already exists
        if (this.userRepository.existsByEmail(user.getEmail())) {
            System.out.println("User with email `" + user.getEmail() + "` already exists");
            throw new UserAlreadyExists("User with email `" + user.getEmail() + "` already exists");
        }

        // Create user
        for (UserRole role: userRoleSet)
            roleRepository.save(role.getRole());
        user.getUserRoleSet().addAll(userRoleSet);
        this.userRepository.save(user);

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
