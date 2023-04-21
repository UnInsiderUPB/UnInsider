package com.example.uninsider.service.implementation;

import com.example.uninsider.model.User;
import com.example.uninsider.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findByUserName(username);
        if (user == null) {
            System.out.println("User `" + username + " not found!");
            throw new UsernameNotFoundException("User `" + username + " not found!");
        }
        return user;
    }
}
