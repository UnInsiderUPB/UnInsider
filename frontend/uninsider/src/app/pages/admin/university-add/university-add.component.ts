import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { UniversityService } from '../../../services/university.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-university-add',
  templateUrl: './university-add.component.html',
  styleUrls: ['./university-add.component.css'],
})
export class UniversityAddComponent implements OnInit {
  user = this.login.getUser();
  universities: any = [];

  public university: any = {
    name: '',
    description: '',
    location: '',
    admin: undefined,
  };

  public formInput: any = {
    name: '',
    location: '',
    description: ''
  };

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private router: Router,
    private universityService: UniversityService,
  ) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityService.getAllUniversities().subscribe({
      next: (data: any) => {
        this.universities = data;
      },
    });
  }

  public isFormValid() {
    return this.formInput.name && this.formInput.location && this.formInput.description;
  }

  formSubmit() {
    for (const key in this.formInput) {
      this.university[key] = this.formInput[key];
    }

    // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
    const backedUpAuthorities = this.user.authorities;
    this.user.authorities = undefined;

    this.university.admin = this.user;

    this.universityService.addUniversity(this.university).subscribe({
      next: (data) => {
        // Restore authorities, maybe it will be needed later
        this.user.authorities = backedUpAuthorities;

        Swal.fire({
          title: 'Success!',
          text: 'University added successfully',
          icon: 'success',
          background: 'rgb(230, 230, 230)',
        }).then((_) => {
          this.router.navigate(['/admin/universities']).then((_) => {});
        });
      },
      error: (error) => {
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
