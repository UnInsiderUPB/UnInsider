import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  errorPassword = "Must contain lower-case, upper-case, numbers, and at least 9 chars!"
  emailError = "This field must have an email format!"
  phoneError = "Phone should only contain digits!"

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  });

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  public user = {
    username: this.registerForm.value.username,
    password: this.registerForm.value.password,
    firstName: this.registerForm.value.firstname,
    lastName: this.registerForm.value.lastname,
    email: this.registerForm.value.email,
    phone: this.registerForm.value.phone
  };

  ngOnInit(): void {
  }

  formSubmit() {
    // Check if `username` is empty
    if (this.user.username == '' || this.user.username == null) {
      this.snack.open('Username cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Check if `email` is empty
    if (this.user.email == '' || this.user.email == null) {
      this.snack.open('Email cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Check if `password` is empty
    if (this.user.password == '' || this.user.password == null) {
      this.snack.open('Password cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Validate the register form
    if (!this.registerForm.valid) {
      this.snack.open('Please complete the fields correctly!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Register the user
    this.userService.addUser(this.user).subscribe({
      next: (data) => {
        Swal.fire('Success!', 'User created successfully', 'success').then(
          (_) => {
            this.router.navigate(['/login']).then(_ => {
            });
          }
        );
      },
      error: (error) => {
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

}
