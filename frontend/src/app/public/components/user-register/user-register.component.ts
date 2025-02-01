import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
    password: '',
    confirmPassword: '',
    role: 'customer',  // Default role as 'Customer'
  };

  constructor(private authService: AuthService, private router: Router) {}

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
      alert('Passwords do not match!');
      return;
    }
  
    // Build the form data for the API request
    const registrationData = new FormData();
    registrationData.append('email', this.formData.email);
    registrationData.append('password', this.formData.password);
    registrationData.append('role', this.formData.role);
    registrationData.append('customer_name', this.formData.fullName);
    registrationData.append('contact_no', this.formData.contactNumber);
    registrationData.append('house_add', this.formData.houseAdd);
    registrationData.append('street', this.formData.street);
    registrationData.append('brgy', this.formData.brgy);
    registrationData.append('city', this.formData.city);
  
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert(`Registration failed: ${err.error.message || 'Unknown error'}`);
      },
    });
  }
}
