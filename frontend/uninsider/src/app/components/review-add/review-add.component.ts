import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ReviewService } from '../../services/review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { UniversityService } from 'src/app/services/university.service';

@Component({
  selector: 'app-review-add',
  templateUrl: './review-add.component.html',
  styleUrls: ['./review-add.component.css'],
})
export class ReviewAddComponent implements OnInit {
  user = this.login.getUser();
  reviews: any = [];
  universityId: any = undefined;
  university: any = undefined;

  public review: any = {
    text: '',
    university: undefined,
    author: undefined,
  };

  public formInput: any = {
    text: '',
  };

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityId = JSON.parse(
      this.route.snapshot.paramMap.get('universityId') || '{}'
    );
    this.university = this.universityService
      .getUniversityById(this.universityId)
      .subscribe({
        next: (data) => {
          this.university = data;
        },
      });
  }

  public isFormValid() {
    return this.formInput.text.length > 0;
  }

  formSubmit() {
    this.review['text'] = this.formInput.text;

    // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
    const backedUpUserAuthorities = this.user.authorities;
    this.user.authorities = undefined;

    this.review.author = this.user;
    this.review.university = this.university;

    // Remove authorities from university admin object before sending to server, as the server cannot deserialize it (for now)
    const backedUpAdminAuthorities = this.university.admin.authorities;
    this.university.admin.authorities = undefined;

    this.reviewService.addReview(this.review).subscribe({
      next: (data) => {
        console.log(data);

        // Restore authorities, maybe it will be needed later
        this.user.authorities = backedUpUserAuthorities;
        this.university.admin.authorities = backedUpAdminAuthorities;

        Swal.fire('Success!', 'Review added successfully', 'success').then(
          (_) => {
            const user_role = this.login.getUserRole();
            if (user_role == 'ADMIN')
              this.router
                .navigate([
                  '/admin/university-reviews',
                  { universityId: this.universityId },
                ])
                .then((_) => {});
            else if (user_role == 'NORMAL')
              this.router
                .navigate([
                  '/user-dashboard/university-reviews',
                  { universityId: this.universityId },
                ])
                .then((_) => {});
          }
        );
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
