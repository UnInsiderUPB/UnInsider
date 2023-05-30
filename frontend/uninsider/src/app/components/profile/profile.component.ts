import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  errorPassword = "Must contain lower-case, upper-case, numbers, and at least 8 chars!"
  emailError = "This field must have an email format!"
  phoneError = "Phone should only contain digits!"

  user = this.login.getUser();

  editForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    password: new FormControl('', [Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
  });

  public userInput: any = {
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
    this.userInput.firstName = this.user.firstName;
    this.userInput.lastName = this.user.lastName;
    this.userInput.email = this.user.email;
    this.userInput.phone = this.user.phone;
  }

  formSubmit() {
    // Check if `firstName` is empty
    if (this.userInput.firstName == '' || this.userInput.firstName == null) {
      this.snack.open('First name cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }
    // Check if `lastName` is empty
    if (this.userInput.lastName == '' || this.userInput.lastName == null) {
      this.snack.open('Last name cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Check if `email` is empty
    if (this.userInput.email == '' || this.userInput.email == null) {
      this.snack.open('Email cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Validate the profile editing form
    if (!this.editForm.valid) {
      this.snack.open('Please complete the fields correctly!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Infer the user object from the form
    for (const key in this.userInput) {
      if (this.userInput[key] !== this.user[key]) {
        this.user[key] = this.userInput[key];
      }
    }

    // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
    const backedUpAuthorities = this.user.authorities;
    this.user.authorities = undefined;

    this.userService.updateUser(this.user).subscribe({
      next: (data) => {
        console.log(data);

        // Restore authorities just before updating the user object in the login service
        this.user.authorities = backedUpAuthorities;
        this.login.setUser(this.user);

        Swal.fire({
          title: 'Success!',
          text: 'User profile modified successfully',
          icon: 'success',
          background: 'rgb(230, 230, 230)',
        }).then((_) => {
          const user_role = this.login.getUserRole();
          if (user_role == 'ADMIN')
            this.router.navigate(['/admin/profile']).then((_) => { });
          else if (user_role == 'NORMAL')
            this.router.navigate(['/user-dashboard/profile']).then((_) => { });
        });
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  resetForm() {
    this.userInput.firstName = this.user.firstName;
    this.userInput.lastName = this.user.lastName;
    this.userInput.email = this.user.email;
    this.userInput.phone = this.user.phone;
    this.userInput.password = '';
  }
}
