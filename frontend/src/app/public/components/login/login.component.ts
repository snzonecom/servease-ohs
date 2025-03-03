import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  registerDialogVisible: boolean = false;
  isPasswordVisible: boolean = false;
  tncDialogVisible: boolean = false;
  errorMessage: string = '';

  logoUrl: string = 'assets/img/servease-logo.png'; // Default logo

  private apiUrl = 'http://localhost:8000/api/system-info';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
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

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

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
