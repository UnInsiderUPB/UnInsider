package com.example.uninsider.service;

import com.example.uninsider.model.Review;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewService {
    // Create Review
    Review createReview(Review review);

    // Update Review
    Review updateReview(Review review) throws Exception;

    // Get review by its id
    Review getReview(Long id) throws Exception;

    // Get all reviews by university id
    List<Review> getReviewsByUniversityId(Long universityId) throws Exception;

    // Get all reviews by user id
    List<Review> getReviewsByUserId(Long userId) throws Exception;

    // Get all reviews by university id and user id
    List<Review> getReviewsByUniversityIdAndUserId(Long universityId, Long userId) throws Exception;

    // Get all reviews
    List<Review> getReviews();

    // Delete review by its id
    void deleteReview(Long id);
}
