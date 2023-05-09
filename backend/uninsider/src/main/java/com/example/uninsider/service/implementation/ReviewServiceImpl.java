package com.example.uninsider.service.implementation;

import com.example.uninsider.exeptions.ReviewNotFoundException;
import com.example.uninsider.model.Review;
import com.example.uninsider.repo.ReviewRepository;
import com.example.uninsider.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review createReview(Review review) {
        // Create review
        return this.reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Review review) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsById(review.getId())) {
            System.out.println("Review with id `" + review.getId() + "` not found");
            throw new ReviewNotFoundException("Review with id `" + review.getId() + "` not found");
        }

        return this.reviewRepository.save(review);
    }

    @Override
    public Review getReview(Long id) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsById(id)) {
            System.out.println("Review with id `" + id + "` not found");
            throw new ReviewNotFoundException("Review with id `" + id + "` not found");
        }

        Optional<Review> optionalReview = this.reviewRepository.findById(id);
        return optionalReview.orElse(null);
    }

    @Override
    public List<Review> getReviewsByUniversityId(Long universityId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByUniversityId(universityId)) {
            System.out.println("Reviews with university id `" + universityId + "` not found");
            throw new ReviewNotFoundException("Reviews with university id `" + universityId + "` not found");
        }

        return this.reviewRepository.findAllByUniversityId(universityId);
    }

    @Override
    public List<Review> getReviewsByUserId(Long userId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByUserId(userId)) {
            System.out.println("Reviews with user id `" + userId + "` not found");
            throw new ReviewNotFoundException("Reviews with user id `" + userId + "` not found");
        }

        return this.reviewRepository.findAllByUserId(userId);
    }

    @Override
    public List<Review> getReviewsByUniversityIdAndUserId(Long universityId, Long userId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByUniversityIdAndUserId(universityId, userId)) {
            System.out.println("Reviews with university id `" + universityId + "` and user id `" + userId + "` not found");
            throw new ReviewNotFoundException("Reviews with university id `" + universityId + "` and user id `" + userId + "` not found");
        }

        return this.reviewRepository.findAllByUniversityIdAndUserId(universityId, userId);
    }

    @Override
    public List<Review> getReviews() {
        return this.reviewRepository.findAll();
    }

    @Override
    public void deleteReview(Long id) {
        this.reviewRepository.deleteById(id);
    }
}
