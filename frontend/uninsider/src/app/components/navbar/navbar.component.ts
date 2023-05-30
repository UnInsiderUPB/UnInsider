import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router, Scroll } from '@angular/router';
import { SummarizationService } from 'src/app/services/summarization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(
    public login: LoginService,
    public router: Router,
    private summarizationService: SummarizationService) {
      this.router.events.subscribe((event: any) => {
        if (event instanceof Scroll && event.anchor) {
          setTimeout(() => {
            this.scroll('#' + event.anchor);
          }, 100);
        }
      });
  }

  private scroll(query: string) {
    const targetElement = document.querySelector(query);
    if (!targetElement) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!this.isInViewport(targetElement)) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  private isInViewport = (elem: any) => {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    // Set the `sessionStorage` item for summarization module initialization
    let itemJson = {
      value: 'true',
      timestamp: new Date().getTime(),
    }
    const summStorageItem = sessionStorage.getItem('initSumm');

    if (summStorageItem == undefined || summStorageItem == '' || summStorageItem == null) {
      // Update the `sessionStorage` item
      sessionStorage.setItem('initSumm', JSON.stringify(itemJson));

      // Initialize the summarization module
      this.summarizationService.initSummarizationModule().subscribe((_) => { });
    } else {
      // Check if the `sessionStorage` item is fresh or old
      const summStorageItemJson = JSON.parse(summStorageItem);
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - summStorageItemJson.timestamp;
      const timeDiffInSeconds = Math.floor(timeDiff / 1000);

      if (timeDiffInSeconds >= 300) {
        // Update timestamp
        itemJson = {
          value: 'true',
          timestamp: new Date().getTime(),
        }

        // Update the `sessionStorage` item
        sessionStorage.setItem('initSumm', JSON.stringify(itemJson));

        // Reinitialize the summarization module
        this.summarizationService.initSummarizationModule().subscribe((_) => { });
      }
    }
  }

  public logout() {
    this.login.logout();
    window.location.reload();
  }

  public toDashboard() {
    // If the user is on the `login` or `signup` page, then redirect to the `home` page
    const currentUrl = this.router.url;
    if (currentUrl == '/login' || currentUrl == '/signup') {
      this.router.navigate(['/']).then((_) => { });
      return;
    }

    // If the user is not logged in, then redirect to the `login` page
    if (!this.login.isLoggedIn()) {
      this.router.navigate(['/login']).then((_) => { });
      return;
    }

    // If the user is logged in, then redirect to the `dashboard` page
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router.navigate(['/admin']).then((_) => { });
    else if (user_role == 'NORMAL')
      this.router.navigate(['/user-dashboard']).then((_) => { });
  }

  public toProfileSettings() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router.navigate(['/admin/profile']).then((_) => { });
    else if (user_role == 'NORMAL')
      this.router.navigate(['/user-dashboard/profile']).then((_) => { });
  }

  public removeFixedNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar != null) {
      navbar.classList.remove('fixed-top');
    }
  }
}
