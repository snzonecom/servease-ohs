import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  tncDialogVisible: boolean = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  formData: any = {
    fullName: '',
    email: '',
    contactNumber: '',
    houseAdd: '',
    street: '',
    brgy: '',
    city: '',
    province: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false // ✅ Added to prevent undefined errors
  };

  constructor(private authService: AuthService, private router: Router) { }

  triggerProfileInput(): void {
    const fileInput = document.getElementById('profile') as HTMLInputElement;
    fileInput.click();
  }

  onProfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  registerUser(): void {
    if (this.formData.password !== this.formData.confirmPassword) {
      Swal.fire('Error!', 'Passwords do not match.', 'error');
      return;
    }

    if (!this.formData.acceptTerms) {
      Swal.fire('Warning!', 'You must accept the Terms and Conditions.', 'warning');
      return;
    }

    const registrationData = new FormData();
    registrationData.append('email', this.formData.email);
    registrationData.append('password', this.formData.password);
    registrationData.append('customer_name', this.formData.fullName);
    registrationData.append('contact_no', this.formData.contactNumber);
    registrationData.append('house_add', this.formData.houseAdd);
    registrationData.append('street', this.formData.street);
    registrationData.append('brgy', this.formData.brgy);
    registrationData.append('city', this.formData.city);
    registrationData.append('province', this.formData.province);

    if (this.selectedFile) {
      registrationData.append('profile_photo', this.selectedFile);
    }

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        Swal.fire('Success!', 'Registration successful!', 'success').then(() => {
          this.resetForm(); // ✅ Reset the form after successful registration
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error(err);

        if (err.status === 422 && err.error.errors) {
          const validationErrors = Object.values(err.error.errors).flat();
          Swal.fire('Validation Error!', validationErrors.join('<br>'), 'error');
        } else {
          Swal.fire('Error!', `Registration failed: ${err.error.message || 'Unknown error'}`, 'error');
        }
      }
    });
  }

  // ✅ Reset the form fields
  resetForm(): void {
    this.formData = {
      fullName: '',
      email: '',
      contactNumber: '',
      houseAdd: '',
      street: '',
      brgy: '',
      city: '',
      province: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
    this.photoPreview = null;
    this.selectedFile = null;
  }
}
