import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

const endpoint = 'https://us-central1-bart-proj.cloudfunctions.net/uninsider-bart-cnn-cors-all-global'

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
    // [TODO]: Uncomment this when deploying to production
    //         Make a request to the `nodejs` backend instead
    // this.initSummarization();
  }

  private async initSummarization(): Promise<any> {
    let response = null;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({article: 'init'}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        }
      });
    } catch (e) {
      console.log(e);
      alert('Could not initialize the summarization model');
      return;
    }

    if (response.ok) {
      console.log('Successfully initialized the summarization model');
    }
  }

  public logout() {
    this.login.logout();
    // window.location.reload();
  }

  public toDashboard() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router.navigate(['/admin']).then((_) => {});
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
