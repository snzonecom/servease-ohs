import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent implements AfterViewInit {

  dropdownOpen = false;  // Start with the dropdown closed by default

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  // Close the dropdown when a link is clicked
  closeDropdown(): void {
    this.dropdownOpen = false; // Set the flag to close the dropdown
    // Optionally, also uncheck the checkbox to reflect the change
    const checkbox = document.getElementById('dropdown-active') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
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
