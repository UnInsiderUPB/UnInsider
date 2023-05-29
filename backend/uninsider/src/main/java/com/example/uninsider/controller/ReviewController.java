package com.example.uninsider.controller;

import com.example.uninsider.exeptions.ReviewNotFoundException;
import com.example.uninsider.model.Review;
import com.example.uninsider.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public Review createReview(@RequestBody Review review) {
        return this.reviewService.createReview(review);
    }

    @PutMapping("/")
    @ResponseStatus(code = HttpStatus.CREATED)
    public Review updateReview(@RequestBody Review requestBodyReview) throws Exception {
        Review originalReview = this.reviewService.getReview(requestBodyReview.getId());
        if (originalReview == null) {
            System.out.println("Review with id `" + requestBodyReview.getId() + "` not found!");
            throw new ReviewNotFoundException("Review with id `" + requestBodyReview.getId() + "` not found");
        }

        originalReview.setText(requestBodyReview.getText());

        return this.reviewService.updateReview(originalReview);
    }

    @GetMapping("/{reviewId}")
    @ResponseStatus(code = HttpStatus.OK)
    public Review getReviewById(@PathVariable("reviewId") Long reviewId) throws Exception {
        return this.reviewService.getReview(reviewId);
    }

    @GetMapping("/university/{universityId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getReviewsByUniversityId(@PathVariable("universityId") Long universityId) throws Exception {
        return this.reviewService.getReviewsByUniversityId(universityId);
    }

    @GetMapping("/author/{authorId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getReviewsByAuthorId(@PathVariable("authorId") Long authorId) throws Exception {
        return this.reviewService.getReviewsByAuthorId(authorId);
    }

    @GetMapping("/university/{universityId}/author/{authorId}")
    public List<Review> getReviewsByUniversityIdAndAuthorId(@PathVariable("universityId") Long universityId,
            @PathVariable("authorId") Long authorId) throws Exception {
        return this.reviewService.getReviewsByUniversityIdAndAuthorId(universityId, authorId);
    }

    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getAllReviews() {
        return this.reviewService.getReviews();
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteReviewById(@PathVariable("reviewId") Long reviewId) {
        this.reviewService.deleteReview(reviewId);
    }

    @PutMapping("/{reviewId}/like/{userId}")
    @ResponseStatus(code = HttpStatus.CREATED)
    public Review likeReview(@PathVariable("reviewId") Long reviewId, @PathVariable("userId") Long userId)
            throws Exception {
        return this.reviewService.likeReview(reviewId, userId);
    }

    @PutMapping("/{reviewId}/dislike/{userId}")
    @ResponseStatus(code = HttpStatus.CREATED)
    public Review dislikeReview(@PathVariable("reviewId") Long reviewId, @PathVariable("userId") Long userId)
            throws Exception {
        return this.reviewService.dislikeReview(reviewId, userId);
    }

    @GetMapping("/{reviewId}/like-status/{userId}")
    @ResponseStatus(code = HttpStatus.OK)
    public boolean getLikeStatus(@PathVariable("reviewId") Long reviewId, @PathVariable("userId") Long userId)
            throws Exception {
        return this.reviewService.getLikeStatus(reviewId, userId);
    }

    @GetMapping("/{reviewId}/dislike-status/{userId}")
    @ResponseStatus(code = HttpStatus.OK)
    public boolean getDislikeStatus(@PathVariable("reviewId") Long reviewId, @PathVariable("userId") Long userId)
            throws Exception {
        return this.reviewService.getDislikeStatus(reviewId, userId);
    }

    @GetMapping("/liked-reviews/{userId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getLikedReviews(@PathVariable("userId") Long userId) throws Exception {
        return this.reviewService.getLikedReviews(userId);
    }

    @GetMapping("/disliked-reviews/{userId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getDislikedReviews(@PathVariable("userId") Long userId) throws Exception {
        return this.reviewService.getDislikedReviews(userId);
    }
}
