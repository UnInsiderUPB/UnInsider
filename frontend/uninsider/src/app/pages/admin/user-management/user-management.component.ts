import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  admin = this.login.getUser();
  users: any = [];

  roles = ["ADMIN", "NORMAL"];

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data;
      }
    });
  }

  public getUserRole(user: any) {
    return user.authorities[0].authority;
  }

  public changeRole(user: any, role: string) {
    this.userService.updateUserRole(user.username, role).subscribe({
      next: (_: any) => {
        this.snack.open("Role updated successfully!", "OK", {
          duration: 3000,
        });
      }
    });
  }
}