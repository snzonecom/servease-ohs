import { Component, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent implements AfterViewInit, OnInit {

  dropdownOpen = false;  // Start with the dropdown closed by default
  customerName: string = 'Guest';
  logoUrl: string = 'assets/img/servease-logo.png'; // Default logo

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchCustomerName(); // ✅ Fetch customer name on component initialization
    this.loadSystemLogo();
  }

  // Function to fetch the logo from the API
  loadSystemLogo() {
    this.http.get<any>(this.apiUrl).subscribe((data) => {
      this.logoUrl = data.logo ?? 'assets/img/servease-logo.png'; // Use API logo or fallback
    }, error => {
      console.error('Error loading system logo:', error);
      this.logoUrl = 'assets/img/servease-logo.png'; // Use default if API fails
    });
  }

  fetchCustomerName(): void {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in local storage

    if (!userId) {
      console.error('User ID not found. Please log in again.');
      return;
    }

    this.http.get<any>(`http://127.0.0.1:8000/api/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        this.customerName = response.customer_name || 'User'; // ✅ Set the fetched customer name
      },
      (error) => {
        console.error('Error fetching customer name:', error);
      }
    );
  }

  // ✅ Toggle Dropdown on Click
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // ✅ Close Dropdown When Clicking Outside
  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event): void {
    const dropdown = document.querySelector('.dropdown-menu');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdown && dropdownToggle && !dropdownToggle.contains(event.target as Node)) {
      this.dropdownOpen = false;
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

  // ✅ Logout Function
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);  // ✅ Redirect to login after logout
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }
}
