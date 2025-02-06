import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-provider-nav',
  templateUrl: './provider-nav.component.html',
  styleUrl: './provider-nav.component.css'
})
export class ProviderNavComponent implements OnInit {
  providerName: string = 'Loading...'; // Default text

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

  // ✅ Logout Function
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // ✅ Redirect to login after logout
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }
}
