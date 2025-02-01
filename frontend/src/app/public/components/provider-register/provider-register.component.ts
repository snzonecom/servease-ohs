import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-register',
  templateUrl: './provider-register.component.html',
  styleUrls: ['./provider-register.component.css'],
})
export class ProviderRegisterComponent {
  businessLogoFile: File | null = null;
  personIDFile: File | null = null;
  businessLogoPreview: string | null = null;
  personIDPreview: string | null = null;

  tncDialogVisible: boolean = false;
  errorMessage: string | null = null;

  formData: any = {
    businessName: '',
    email: '',
    contactNumber: '',
    houseAdd: '',
    street: '',
    brgy: '',
    city: '',
    brn: '',
    contactPerson: '',
    serviceType: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  triggerBusinessLogoInput(): void {
    const fileInput = document.getElementById('businessLogo') as HTMLInputElement;
    fileInput.click();
  }

  onBusinessLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.businessLogoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.businessLogoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.businessLogoFile);
    }
  }

  triggerPersonIDInput(): void {
    const fileInput = document.getElementById('personID') as HTMLInputElement;
    fileInput.click();
  }

  onPersonIDSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.personIDFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.personIDPreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  submitRegistration(): void {
    // Validate passwords
    if (!this.formData.password || !this.formData.confirmPassword) {
      this.errorMessage = 'Password and Confirm Password are required.';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.errorMessage = null; // Reset error message if validation passes

    const formData = new FormData();
    formData.append('fullName', this.formData.businessName);
    formData.append('email', this.formData.email);
    formData.append('password', this.formData.password);
    formData.append('contactNumber', this.formData.contactNumber);
    formData.append('houseAdd', this.formData.houseAdd);
    formData.append('street', this.formData.street);
    formData.append('brgy', this.formData.brgy);
    formData.append('city', this.formData.city);
    formData.append('brn', this.formData.brn);
    formData.append('contactPerson', this.formData.contactPerson);
    formData.append('serviceType', this.formData.serviceType);

    if (this.businessLogoFile) {
      formData.append('businessLogo', this.businessLogoFile);
    }
    if (this.personIDFile) {
      formData.append('personID', this.personIDFile);
    }

    this.authService.registerProvider(formData).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        if (error.error?.errors) {
          console.log('Validation errors:', error.error.errors);
          this.errorMessage = Object.values(error.error.errors).join(' ');
        } else {
          this.errorMessage = 'Registration failed. Please check your input.';
        }
      }
    );
  }
}
