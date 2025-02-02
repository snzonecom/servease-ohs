import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-provider-nav',
  templateUrl: './provider-nav.component.html',
  styleUrl: './provider-nav.component.css'
})
export class ProviderNavComponent {
  constructor(private authService: AuthService, private router: Router) { }

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
