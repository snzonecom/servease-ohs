import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  goLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
  
      if (token) {
        this.authService.verifyEmail(token).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'Email verified successfully! You can now log in.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#428eba',
              customClass: {
                confirmButton: 'swal-blue-btn',
                popup: 'swal-custom-popup'
              }
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            console.error('Verification failed:', error);

            Swal.fire({
              title: 'Error!',
              text: 'Verification failed. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#428eba',
              customClass: {
                confirmButton: 'swal-blue-btn',
                popup: 'swal-custom-popup'
              }
            }).then(() => {
              this.router.navigate(['/login']);
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Invalid Link!',
          text: 'The verification link is invalid or expired.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#428eba',
          customClass: {
            confirmButton: 'swal-blue-btn',
            popup: 'swal-custom-popup'
          }
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}