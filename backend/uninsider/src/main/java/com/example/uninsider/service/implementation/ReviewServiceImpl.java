package com.example.uninsider.service.implementation;

import com.example.uninsider.exeptions.ReviewNotFoundException;
import com.example.uninsider.model.Review;
import com.example.uninsider.repo.ReviewRepository;
import com.example.uninsider.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
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
            throw new ReviewNotFoundException("Review with id `" + review.getId() + "` not found");
        }

        return this.reviewRepository.save(review);
    }

    @Override
    public Review getReview(Long id) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException("Review with id `" + id + "` not found");
        }

        Optional<Review> optionalReview = this.reviewRepository.findById(id);
        return optionalReview.orElse(null);
    }

    @Override
    public List<Review> getReviewsByUniversityId(Long universityId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByUniversityId(universityId)) {
            throw new ReviewNotFoundException("Reviews with university id `" + universityId + "` not found");
        }

        return this.reviewRepository.findAllByUniversityId(universityId);
    }

    @Override
    public List<Review> getReviewsByAuthorId(Long authorId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByAuthorId(authorId)) {
            throw new ReviewNotFoundException("Reviews with author id `" + authorId + "` not found");
        }

        return this.reviewRepository.findAllByAuthorId(authorId);
    }

    @Override
    public List<Review> getReviewsByUniversityIdAndAuthorId(Long universityId, Long authorId) throws ReviewNotFoundException {
        if (!this.reviewRepository.existsByUniversityIdAndAuthorId(universityId, authorId)) {
            throw new ReviewNotFoundException("Reviews with university id `" + universityId + "` and author id `" + authorId + "` not found");
        }

        return this.reviewRepository.findAllByUniversityIdAndAuthorId(universityId, authorId);
    }

    @Override
    public List<Review> getReviews() {
        return this.reviewRepository.findAll();
    }

    @Override
    public void deleteReview(Long id) {
        this.reviewRepository.deleteById(id);
    }

    @Override
    public Review likeReview(Long reviewId, Long userId) throws ReviewNotFoundException {
        Review review = this.getReview(reviewId);
        if (review == null) {
            throw new ReviewNotFoundException("Review with id `" + reviewId + "` not found");
        }

        if (!review.addLike(userId)) {
            // User already liked this review, therefore the like is removed
            review.removeLike(userId);
        } else {
            // User liked this review, therefore the possibly existing dislike is removed
            review.removeDislike(userId);
        }

        this.reviewRepository.save(review);
        return review;
    }

    @Override
    public Review dislikeReview(Long reviewId, Long userId) throws ReviewNotFoundException {
        Review review = this.getReview(reviewId);
        if (review == null) {
            throw new ReviewNotFoundException("Review with id `" + reviewId + "` not found");
        }

        if (!review.addDislike(userId)) {
            // User already disliked this review, therefore the dislike is removed
            review.removeDislike(userId);
        } else {
            // User disliked this review, therefore the possibly existing like is removed
            review.removeLike(userId);
        }

        this.reviewRepository.save(review);
        return review;
    }

    @Override
    public boolean getLikeStatus(Long reviewId, Long userId) throws ReviewNotFoundException {
        Review review = this.getReview(reviewId);
        if (review == null) {
            throw new ReviewNotFoundException("Review with id `" + reviewId + "` not found");
        }

        return review.isLikedBy(userId);
    }

    @Override
    public boolean getDislikeStatus(Long reviewId, Long userId) throws ReviewNotFoundException {
        Review review = this.getReview(reviewId);
        if (review == null) {
            throw new ReviewNotFoundException("Review with id `" + reviewId + "` not found");
        }

        return review.isDislikedBy(userId);
    }

    @Override
    public List<Review> getLikedReviews(Long userId) {
        List<Review> reviews = this.reviewRepository.findAll();
        return reviews.stream().filter((review) -> review.isLikedBy(userId)).collect(Collectors.toList());
    }

    @Override
    public List<Review> getDislikedReviews(Long userId) {
        List<Review> reviews = this.reviewRepository.findAll();
        return reviews.stream().filter((review) -> review.isDislikedBy(userId)).collect(Collectors.toList());
    }
}
