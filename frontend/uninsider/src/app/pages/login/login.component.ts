import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    username: '',
    password: '',
  };

  constructor(private snack: MatSnackBar, private login: LoginService) { }

  ngOnInit(): void {}

  formSubmit() {
    console.log("Login button clicked");

    // Check if `username` is empty
    if (this.loginData.username.trim() == '' || this.loginData.username == null) {
      this.snack.open("Username is required!", "", {duration: 3000});
      return;
    }

    // Check if `password` is empty
    if (this.loginData.password.trim() == '' || this.loginData.password == null) {
      this.snack.open("Password is required!", "", {duration: 3000});
      return;
    }

    // Request to server to generate a JWT token
    this.login.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log("Succes!");
        console.log(data);
      },
      (error) => {
        console.log("Error!");
        console.log(error);
      }
    );
  }
}
