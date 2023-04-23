package com.example.uninsider.repo;

import com.example.uninsider.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
     User findByUsername(String username);

     User getUserByUsername(String username);

     User findByEmail(String email);

     boolean existsByEmail(String email);

     boolean existsByUsername(String username);

}
