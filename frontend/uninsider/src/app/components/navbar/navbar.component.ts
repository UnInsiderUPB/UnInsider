import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
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
    private summarizationService: SummarizationService) {}

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
      
      console.log('Initializing the summarization module');

      // Initialize the summarization module
      this.summarizationService.initSummarizationModule().subscribe((_) => { });
    } else {
      // Check if the `sessionStorage` item is fresh or old
      const summStorageItemJson = JSON.parse(summStorageItem);
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - summStorageItemJson.timestamp;
      const timeDiffInSeconds = Math.floor(timeDiff / 1000);

      // console.log('Time difference in seconds: ' + timeDiffInSeconds);
      // console.log('Intialization timestamp: ' + summStorageItemJson.timestamp);
      // console.log('Current timestamp: ' + currentTime);
      
      if (timeDiffInSeconds >= 300) {
        console.log('Reinitializing the summarization module');
        
        // Update timestamp
        itemJson = {
          value: 'true',
          timestamp: new Date().getTime(),
        }

        // Update the `sessionStorage` item
        sessionStorage.setItem('initSumm', JSON.stringify(itemJson));

        // Reinitialize the summarization module
        this.summarizationService.initSummarizationModule().subscribe((_) => { });
      } else {
        console.log('Summarization module is already initialized and fresh');
      }
    }
  }

  public logout() {
    this.login.logout();
    window.location.reload();
  }

  public toDashboard() {
    // Check if the user is not logged in
    if (!this.login.isLoggedIn()) {
      this.router.navigate(['/']).then((_) => {});
      return;
    }

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

  public removeFixedNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar != null) {
      navbar.classList.remove('fixed-top');
    }
  }
}
