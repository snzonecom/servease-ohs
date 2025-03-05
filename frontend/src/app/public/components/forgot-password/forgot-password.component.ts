import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid email address.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    this.isLoading = true;

    this.http.post('http://127.0.0.1:8000/api/forgot-password', this.forgotPasswordForm.value).subscribe({
      next: () => {
        Swal.fire({
          title: "Success!",
          text: "A password reset link has been sent to your email.",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
        this.forgotPasswordForm.reset();
      },
      error: () => {
        Swal.fire({
          title: "Error!",
          text: "Email not found or server error. Try again later.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Adjust the route based on your app's login route
  }

}
