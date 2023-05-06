import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from 'src/app/services/login.service';
import {UserService} from 'src/app/services/user.service';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user = this.login.getUser();
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl('')
  });

  constructor(
    private login: LoginService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      phone: [this.user.phone, Validators.required],
    });
  }

  saveUser(): void {
    this.userService.updateUser(this.user.id).subscribe(() => {
      this.login.setUser(this.userForm.value);
    });
    this.router.navigate(['/user-dashboard/profile-user']);
  }
}
