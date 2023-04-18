import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private userService: UserService) {}

  public user = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  }

  ngOnInit(): void {}

  formSubmit() {
    console.log(this.user);

    // Username sanity check
    if (this.user.userName == '' || this.user.userName == null) {
      alert("Username cannot be empty");
      return;
    }

    // [TODO]: Other sanity checks

    // Add user service
    // this.userService.addUser(this.user).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     alert("Success");
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     alert("Error");
    //   }
    // });

    this.userService.addUser(this.user).subscribe(
      (data) => {
        console.log(data);
        alert("Success");
      },
      (error) => {
        console.log(error);
        alert("Error");
      }
    );

  }
}
