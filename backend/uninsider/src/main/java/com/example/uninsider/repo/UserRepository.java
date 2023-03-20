package com.example.uninsider.repo;

import com.example.uninsider.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
     User findByUserName(String username);

     User getUserByUserName(String username);

     User findByEmail(String email);

     boolean existsByEmail(String email);

     boolean existsByUserName(String username);

}
