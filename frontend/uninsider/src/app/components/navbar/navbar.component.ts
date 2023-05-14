import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(public login: LoginService, public router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
  }

  public logout() {
    this.login.logout();
    window.location.reload();
  }

  public toDashboard() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN') this.router.navigate(['/admin']).then((_) => {});
    else if (user_role == 'NORMAL')
      this.router.navigate(['/user-dashboard']).then((_) => {});
  }

  public toProfileSettings() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router.navigate(['/admin/profile']).then((_) => {});
    else if (user_role == 'NORMAL')
      this.router.navigate(['/user-dashboard/profile']).then((_) => {});
  }
}
