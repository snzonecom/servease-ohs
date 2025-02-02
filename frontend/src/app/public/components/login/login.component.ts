import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  registerDialogVisible: boolean = false;
  tncDialogVisible: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  showTncDialog() {
    this.tncDialogVisible = true;
  }

  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide both email and password.';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.user.role);

        switch (response.user.role) {
          case 'admin':
            this.router.navigate(['/admin/admin-dashboard']);
            break;
          case 'customer':
            this.router.navigate(['/user/home']);
            break;
          case 'provider':
            this.router.navigate(['/provider/provider-dashboard']);
            break;
          default:
            this.errorMessage = 'User role not recognized.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password.';
        console.error(err);
      },
    });
  }

}
