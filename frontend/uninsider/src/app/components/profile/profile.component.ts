import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user = this.login.getUser();

  public formInput: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  };

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.formInput.firstName = this.user.firstName;
    this.formInput.lastName = this.user.lastName;
    this.formInput.email = this.user.email;
    this.formInput.phone = this.user.phone;
  }

  formSubmit() {
    for (const key in this.formInput) {
      if (this.formInput[key] !== this.user[key]) {
        this.user[key] = this.formInput[key];
      }
    }

    // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
    const backedUpAuthorities = this.user.authorities;
    this.user.authorities = undefined;

    this.userService.updateUser(this.user).subscribe({
      next: (data) => {
        // Restore authorities just before updating the user object in the login service
        this.user.authorities = backedUpAuthorities;
        this.login.setUser(this.user);

        Swal.fire(
          'Success!',
          'User profile modified successfully',
          'success'
        ).then((_) => {
          const user_role = this.login.getUserRole();
          if (user_role == 'ADMIN')
            this.router.navigate(['/admin/profile']).then((_) => { });
          else if (user_role == 'NORMAL')
            this.router.navigate(['/user-dashboard/profile']).then((_) => { });
        });
      },
      error: (error) => {
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  resetForm() {
    this.formInput.firstName = this.user.firstName;
    this.formInput.lastName = this.user.lastName;
    this.formInput.email = this.user.email;
    this.formInput.phone = this.user.phone;
    this.formInput.password = '';
  }
}
