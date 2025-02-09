import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      token: ['']
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.email = this.route.snapshot.queryParams['email'] || '';
  
    console.log('Extracted Token:', this.token); // ✅ Debugging
    console.log('Extracted Email:', this.email); // ✅ Debugging
  
    if (!this.token || !this.email) {
      Swal.fire('Error', 'Invalid password reset link.', 'error');
      this.router.navigate(['/forgot-password']);
      return;
    }
  
    // ✅ Make sure the values are being set properly
    this.resetPasswordForm.patchValue({
      token: this.token,
      email: this.email
    });
  
    console.log('Form After Patch:', this.resetPasswordForm.value); // ✅ Debugging
  }
  

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      let errorMessage = 'Please fill in all required fields.';
  
      // ✅ Check for specific password errors
      if (this.resetPasswordForm.get('password')?.hasError('minlength')) {
        errorMessage = 'Password must be at least 8 characters long.';
      } else if (this.resetPasswordForm.get('password_confirmation')?.hasError('required')) {
        errorMessage = 'Please confirm your password.';
      } else if (this.resetPasswordForm.hasError('notMatching')) {
        errorMessage = 'Passwords do not match.';
      }
  
      Swal.fire('Error', errorMessage, 'error');
      return;
    }
  
    this.isLoading = true;
  
    this.http.post('http://127.0.0.1:8000/api/reset-password', this.resetPasswordForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Your password has been reset. You can now log in.', 'success');
        this.router.navigate(['/login']);
      },
      error: () => {
        Swal.fire('Error', 'Invalid token or email. Try again.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  
}
