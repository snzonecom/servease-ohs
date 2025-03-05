import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-nav',
  templateUrl: './provider-nav.component.html',
  styleUrls: ['./provider-nav.component.css']
})
export class ProviderNavComponent implements OnInit {
  providerName: string = 'Loading...'; // Default text
  dropdownOpen = false; // Tracks dropdown state

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProviderDetails();
  }

  // ✅ Fetch Provider Details to Get Name
  fetchProviderDetails(): void {
    const providerId = localStorage.getItem('provider_id'); // Get provider ID from localStorage
    const token = localStorage.getItem('authToken'); // Get auth token

    if (!providerId || !token) {
      this.providerName = 'Unknown';
      return;
    }

    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        this.providerName = response.provider?.provider_name || 'Provider'; // ✅ Set provider's name
      },
      (error) => {
        console.error('Error fetching provider details:', error);
        this.providerName = 'Unknown'; // Fallback name
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

  // ✅ Logout Function with Swal Confirmation
  logout(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#428eba",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
            Swal.fire({
              title: "Logged Out",
              text: "You have successfully logged out.",
              icon: "success",
              confirmButtonColor: "#428eba",
            });
          },
          error: (err) => {
            console.error("Logout failed:", err);
            Swal.fire({
              title: "Logout Failed!",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonColor: "#428eba",
            });
          }
        });
      }
    });
  }
}
