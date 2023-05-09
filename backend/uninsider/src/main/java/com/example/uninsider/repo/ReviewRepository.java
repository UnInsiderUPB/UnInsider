package com.example.uninsider.repo;

import com.example.uninsider.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByUniversityId(Long universityId);

    boolean existsByUserId(Long userId);

    boolean existsByUniversityIdAndUserId(Long universityId, Long userId);

    List<Review> findAllByUniversityId(Long universityId);

    List<Review> findAllByUserId(Long userId);

    List<Review> findAllByUniversityIdAndUserId(Long universityId, Long userId);
}
