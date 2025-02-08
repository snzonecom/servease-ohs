import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false; // For showing loading state

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      Swal.fire('Error', 'Please enter a valid email address', 'error');
      return;
    }

    this.isLoading = true;

    this.http.post('http://your-backend-url.com/api/forgot-password', this.forgotPasswordForm.value).subscribe({
      next: (res: any) => {
        Swal.fire('Success', 'Password reset link has been sent to your email', 'success');
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to send reset link. Please try again later.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
