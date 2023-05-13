package com.example.uninsider.repo;

import com.example.uninsider.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByUniversityId(Long universityId);

    boolean existsByAuthorId(Long authorId);

    boolean existsByUniversityIdAndAuthorId(Long universityId, Long authorId);

    List<Review> findAllByUniversityId(Long universityId);

    List<Review> findAllByAuthorId(Long authorId);

    List<Review> findAllByUniversityIdAndAuthorId(Long universityId, Long authorId);
}
