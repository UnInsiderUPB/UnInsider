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

    // Get all reviews by author id
    List<Review> getReviewsByAuthorId(Long authorId) throws Exception;

    // Get all reviews by university id and author id
    List<Review> getReviewsByUniversityIdAndAuthorId(Long universityId, Long authorId) throws Exception;

    // Get all reviews
    List<Review> getReviews();

    // Delete review by its id
    void deleteReview(Long id);

    // Process a like for review with id `reviewId` by user with id `userId`
    Review likeReview(Long reviewId, Long userId) throws Exception;

    // Process a dislike for review with id `reviewId` by user with id `userId`
    Review dislikeReview(Long reviewId, Long userId) throws Exception;

    // Get like status for review with id `reviewId` by user with id `userId`
    boolean getLikeStatus(Long reviewId, Long userId) throws Exception;

    // Get dislike status for review with id `reviewId` by user with id `userId`
    boolean getDislikeStatus(Long reviewId, Long userId) throws Exception;

    // Get all liked reviews by user with id `userId`
    List<Review> getLikedReviews(Long userId) throws Exception;

    // Get all disliked reviews by user with id `userId`
    List<Review> getDislikedReviews(Long userId) throws Exception;
}
