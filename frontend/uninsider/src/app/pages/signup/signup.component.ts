import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  public user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  ngOnInit(): void {}

  formSubmit() {
    console.log(this.user);

    // Username sanity check
    if (this.user.username == '' || this.user.username == null) {
      this.snack.open('Username cannot be empty!', 'OK', {
        duration: 3000,
      });
      return;
    }

    // [TODO]: Sanity checks for other fields

    // [TODO]: Validate

    // Add user
    this.userService.addUser(this.user).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire('Success!', 'User created successfully', 'success').then(
          (_) => {
            this.router.navigate(['/login']);
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
