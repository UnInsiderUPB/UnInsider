import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UniversityService } from '../../services/university.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css'],
})
export class UniversityListComponent implements OnInit {
  user = this.login.getUser();
  universities: any = [];

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
      },
    });
  }

  public getUserRole() {
    return this.login.getUserRole();
  }

  public editUniversity(university: any) {
    Swal.fire({
      title: 'Edit university',
      html: `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${university.name}">
      <input id="swal-input2" class="swal2-input" placeholder="Location" value="${university.location}">
      <textarea id="swal-input3" class="swal2-input" placeholder="Description">${university.description}`,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById(
          'swal-input1'
        ) as HTMLInputElement).value;
        const location = (document.getElementById(
          'swal-input2'
        ) as HTMLInputElement).value;
        const description = (document.getElementById(
          'swal-input3'
        ) as HTMLInputElement).value;

        if (!name || !location || !description) {
          Swal.showValidationMessage(`Please fill in all fields`);
        }

        return { name, location, description };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        university.name = result.value.name;
        university.location = result.value.location;
        university.description = result.value.description;

        // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
        const backedUpAuthorities = university.admin.authorities;
        university.admin.authorities = undefined;

        this.universityService
          .updateUniversity(university)
          .subscribe({
            next: (_) => {
              // Restore authorities, maybe it will be needed later
              university.admin.authorities = backedUpAuthorities;

              this.universities = this.universities.map((u: any) => {
                if (u.id === university.id) {
                  u = university;
                }
                return u;
              });
              Swal.fire(
                'Edited!',
                'Your university has been edited.',
                'success'
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
    });
  }

  public deleteUniversity(university: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this university!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.universityService.deleteUniversityById(university.id).subscribe({
          next: (_) => {
            this.universities = this.universities.filter(
              (u: any) => u.id !== university.id
            );
            Swal.fire(
              'Deleted!',
              'Your university has been deleted.',
              'success'
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
    });
  }
}
