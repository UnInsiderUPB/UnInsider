import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
})
export class ReviewListComponent implements OnInit {
  user = this.login.getUser();
  ownReviews: any = [];
  allReviews: any = [];
  universityId: any;
  likedReviews: any = [];
  dislikedReviews: any = [];

  constructor(
    private login: LoginService,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityId = JSON.parse(
      this.route.snapshot.paramMap.get('universityId') || '{}'
    );

    this.reviewService.getReviewsByUniversityId(this.universityId).subscribe({
      next: (data) => {
        this.allReviews = data;
      },
    });

    this.reviewService.getReviewsByAuthorId(this.user.id).subscribe({
      next: (data) => {
        this.ownReviews = data;
      },
    });

    this.reviewService.getReviewsLikedByUser(this.user.id).subscribe({
      next: (data) => {
        this.likedReviews = data;
      },
    });

    this.reviewService.getReviewsDislikedByUser(this.user.id).subscribe({
      next: (data) => {
        this.dislikedReviews = data;
      },
    });
  }

  public getUserRole() {
    return this.login.getUserRole();
  }

  public goToAddReview() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router
        .navigate([
          '/admin/university-reviews/add',
          { universityId: this.universityId },
        ])
        .then((_) => {});
    else if (user_role == 'NORMAL')
      this.router
        .navigate([
          '/user-dashboard/university-reviews/add',
          { universityId: this.universityId },
        ])
        .then((_) => {});
  }

  public isLiked(review: any) {
    return this.likedReviews.some((r: any) => r.id == review.id);
  }

  public isDisliked(review: any) {
    return this.dislikedReviews.some((r: any) => r.id == review.id);
  }

  public likeReview(review: any) {
    this.reviewService.likeReview(review.id, this.user.id).subscribe({
      next: (updatedReview: any) => {
        if (updatedReview.likes > review.likes) {
          // Review was liked
          this.likedReviews.push(review);
        } else {
          // Review was unliked
          this.likedReviews = this.likedReviews.filter(
            (r: any) => r.id != review.id
          );
        }

        review.likes = updatedReview.likes;
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  public dislikeReview(review: any) {
    this.reviewService.likeReview(review.id, this.user.id).subscribe({
      next: (updatedReview: any) => {
        if (updatedReview.dislikes > review.dislikes) {
          // Review was disliked
          this.dislikedReviews.push(review);
        }

        review.dislikes = updatedReview.dislikes;
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  public hasEditRights(review: any) {
    return (
      this.login.getUserRole() == 'ADMIN' ||
      this.ownReviews.some((r: any) => r.id == review.id)
    );
  }

  public editReview(review: any) {
    Swal.fire({
      title: 'Edit review',
      html: `<textarea id="swal-input" class="swal2-input" placeholder="Text">${review.text}`,
      focusConfirm: false,
      preConfirm: () => {
        const text = (document.getElementById('swal-input') as HTMLInputElement)
          .value;

        if (!text) {
          Swal.showValidationMessage(`Please fill in the review text`);
        }

        return { text };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        review.text = result.value.text;

        this.reviewService.updateReview(review).subscribe({
          next: (_) => {
            this.allReviews = this.allReviews.map((r: any) => {
              if (r.id === review.id) {
                r = review;
              }
              return r;
            });
            Swal.fire('Edited!', 'The review has been edited.', 'success');
          },
          error: (error) => {
            console.log(error);
            this.snack.open(error.error.message, 'OK', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  public deleteReview(review: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this review!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReviewById(review.id).subscribe({
          next: (_) => {
            this.allReviews = this.allReviews.filter(
              (r: any) => r.id !== review.id
            );
            Swal.fire('Deleted!', 'The review has been deleted.', 'success');
          },
          error: (error) => {
            console.log(error);
            this.snack.open(error.error.message, 'OK', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
