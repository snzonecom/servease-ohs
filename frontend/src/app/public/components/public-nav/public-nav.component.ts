import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrl: './public-nav.component.css'
})
export class PublicNavComponent implements AfterViewInit {

  registerDialogVisible: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  // Function to show the dialog
  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  // Function to close the dialog
  closeRegisterDialog() {
    this.registerDialogVisible = false;
  }

  ngAfterViewInit(): void {
    // Listen to router events to handle fragment-based scrolling
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // After navigation, check if there's a fragment
      const fragment = this.activatedRoute.snapshot.fragment;
      if (fragment) {
        // Scroll to the element with the given fragment
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}