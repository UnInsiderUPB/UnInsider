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
    public Review createReview(@RequestBody Review review) throws Exception {
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

    @GetMapping("/user/{userId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getReviewsByUserId(@PathVariable("userId") Long userId) throws Exception {
        return this.reviewService.getReviewsByUserId(userId);
    }

    @GetMapping("/university/{universityId}/user/{userId}")
    public List<Review> getReviewsByUniversityIdAndUserId(@PathVariable("universityId") Long universityId,
                                                          @PathVariable("userId") Long userId) throws Exception {
        return this.reviewService.getReviewsByUniversityIdAndUserId(universityId, userId);
    }

    @GetMapping("/")
    @ResponseStatus(code = HttpStatus.OK)
    public List<Review> getAllReviews() {
        return this.reviewService.getReviews();
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable("reviewId") Long reviewId) {
        this.reviewService.deleteReview(reviewId);
    }
}
