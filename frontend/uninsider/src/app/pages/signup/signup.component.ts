import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^07\\d{2}\\s\\d{3}\\s\\d{3}$')]),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: confirmPasswordValidator});


  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  public user = {
    username: this.registerForm.value.username,
    password: this.registerForm.value.password,
    firstName: this.registerForm.value.firstname,
    lastName: this.registerForm.value.lastname,
    email: this.registerForm.value.email,
    phone: this.registerForm.value.phone
  };

  ngOnInit(): void {}

  formSubmit() {

    // Add user
    this.userService.addUser(this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire('Success!', 'User created successfully', 'success').then(
          (_) => {
            this.router.navigate(['/login']).then(_ => {});
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

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value ? { confirmPassword: true } : null;
};
