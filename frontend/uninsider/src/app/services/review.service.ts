import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import baseUrl from "./helper";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http: HttpClient) { }

  // Add review
  public addReview(review: any) {
    return this.http.post(`${baseUrl}/review/`, review);
  }

  // Update review
  public updateReview(review: any) {
    return this.http.put(`${baseUrl}/review/`, review);
  }

  // Get all reviews
  public getAllReviews() {
    return this.http.get(`${baseUrl}/review/`);
  }

  // Get review by id
  public getReviewById(id: number) {
    return this.http.get(`${baseUrl}/review/${id}`);
  }

  // Get reviews by university id
  public getReviewsByUniversityId(universityId: number) {
    return this.http.get(`${baseUrl}/review/university/${universityId}`);
  }

  // Get reviews by author id
  public getReviewsByAuthorId(authorId: number) {
    return this.http.get(`${baseUrl}/review/author/${authorId}`);
  }

  // Get reviews by university id and author id
  public getReviewsByUniversityIdAndAuthorId(universityId: number, authorId: number) {
    return this.http.get(`${baseUrl}/review/university/${universityId}/author/${authorId}`);
  }

  // Delete review by id
  public deleteReviewById(id: number) {
    return this.http.delete(`${baseUrl}/review/${id}`);
  }

  // Like review with review id `reviewId` by user with user id `userId`
  public likeReview(reviewId: number, userId: number) {
    return this.http.put(`${baseUrl}/review/${reviewId}/like/${userId}`, null);
  }

  // Dislike review with review id `reviewId` by user with user id `userId`
  public dislikeReview(reviewId: number, userId: number) {
    return this.http.put(`${baseUrl}/review/${reviewId}/dislike/${userId}`, null);
  }

  // Get like status for review with id `reviewId` by user with id `userId`
  public getLikeStatus(reviewId: number, userId: number) {
    return this.http.get(`${baseUrl}/review/${reviewId}/like-status/${userId}`);
  }

  // Get dislike status for review with id `reviewId` by user with id `userId`
  public getDislikeStatus(reviewId: number, userId: number) {
    return this.http.get(`${baseUrl}/review/${reviewId}/dislike-status/${userId}`);
  }

  // Get reviews liked by user with id `userId`
  public getReviewsLikedByUser(userId: number) {
    return this.http.get(`${baseUrl}/review/liked-reviews/${userId}`);
  }

  // Get reviews disliked by user with id `userId`
  public getReviewsDislikedByUser(userId: number) {
    return this.http.get(`${baseUrl}/review/disliked-reviews/${userId}`);
  }
}
