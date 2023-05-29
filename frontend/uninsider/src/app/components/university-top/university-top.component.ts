import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UniversityService } from '../../services/university.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-university-top',
  templateUrl: './university-top.component.html',
  styleUrls: ['./university-top.component.css'],
})
export class UniversityTopComponent implements OnInit {
  user = this.login.getUser();
  universities: any = [];
  sortedUniversities: any = [];

  constructor(
    private login: LoginService,
    private router: Router,
    private reviewService: ReviewService,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.user = this.login.getUser();

    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;

        const observables = [];
        for (const university of this.universities) {
          const observable = this.reviewService.getReviewsByUniversityId(
            university.id
          );

          observable.subscribe({
            next: (data) => {
              university.reviews = data || [];

              const initialValue = 0;

              university.totalReviewLikes = university.reviews.reduce(
                (total: number, review: any) => total + review.likes,
                initialValue
              );

              university.totalReviewDislikes = university.reviews.reduce(
                (total: number, review: any) => total + review.dislikes,
                initialValue
              );
            },
            error: (_) => {},
          });

          observables.push(observable);
        }

        forkJoin(observables).subscribe({
          next: (_) => {
            // Sort universities by number of reviews in descending order
            this.universities.sort((a: any, b: any) => {
              return b.reviews.length - a.reviews.length;
            });

            // Get top 10 universities
            this.universities = this.universities.slice(0, 10);

            // Time to display the sorted universities
            this.sortedUniversities = this.universities;
          },
          error: (_) => {},
        });
      },
    });
  }

  public goToReviews(university: any) {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router
        .navigate([
          '/admin/university-reviews',
          { universityId: university.id },
        ])
        .then((_) => {});
    else if (user_role == 'NORMAL')
      this.router
        .navigate([
          '/user-dashboard/university-reviews',
          { universityId: university.id },
        ])
        .then((_) => {});
  }
}
