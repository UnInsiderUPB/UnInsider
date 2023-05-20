import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  windowScrolled: boolean = false;

  ngOnInit() { }

  constructor(private router: Router) { }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100)
      this.windowScrolled = true;
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10)
      this.windowScrolled = false;
  }

  scrollToTop() {
    // Scroll to top
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();

    // [TODO]: This is a hacky way to change the route without reloading the page
    //         Change this to a better solution if possible (wait for `smoothscroll` to finish and then change route)
    // Set route to the base route '/' without reloading the page
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => { });
    }, 800);
  }
}
