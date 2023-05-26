import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  windowScrolled: boolean = false;
  isLoggedIn = false;
  user: any = null;

  constructor(public router: Router, public login: LoginService) { }

  ngOnInit() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100)
      this.windowScrolled = true;
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10)
      this.windowScrolled = false;
  }

  smoothScroll() {
    return new Promise<void>((_) => {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(() => {
          this.smoothScroll().then(_);
        });
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    });
  }

  navigateToBase() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => { });
  }

  async scrollToTop() {
    // Wait for smooth scrolling to complete
    await this.smoothScroll();

    // Navigate to the `/` route
    this.navigateToBase();
  }

  public toDashboard() {
    if (this.login.getUser() === null)
      this.router.navigate(['/login']).then(() => { });
    else if (this.login.getUserRole() === 'ADMIN')
      this.router.navigate(['/admin']).then(() => { });
    else if (this.login.getUserRole() === 'NORMAL')
      this.router.navigate(['/user-dashboard']).then(() => { });
  }
}
