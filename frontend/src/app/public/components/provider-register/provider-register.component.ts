import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-register',
  templateUrl: './provider-register.component.html',
  styleUrls: ['./provider-register.component.css']
})
export class ProviderRegisterComponent implements OnInit {
  businessLogoPreview: string | null = null;
  personIDPreview: string | null = null;
  tncDialogVisible: boolean = false;
  profilePicFile: File | null = null;
  attachmentFile: File | null = null;
  isLoading: boolean = false;

  providerData = {
    email: '',
    password: '',
    password_confirmation: '',
    fullName: '',           // ✅ Renamed from provider_name
    contactNumber: '',      // ✅ Renamed from contact_no
    houseAdd: '',           // ✅ Renamed from office_add
    street: '',
    brgy: '',
    city: '',
    province: '',
    brn: '',
    contactPerson: '',      // ✅ Renamed from contact_person
    serviceType: null,      // ✅ Renamed from service_type
    acceptTerms: false,
    acceptVerification: false,
  };

  serviceCategories: { category_id: number; category_name: string }[] = [];
  private apiUrl = 'http://127.0.0.1:8000/api/register-provider';
  private categoriesApiUrl = 'http://127.0.0.1:8000/api/service-categories';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServiceCategories();
  }

  fetchServiceCategories(): void {
    this.http.get<{ category_id: number; category_name: string }[]>(this.categoriesApiUrl).subscribe(
      (data) => this.serviceCategories = data,
      (error) => console.error('Error fetching service categories', error)
    );
  }

  registerProvider(): void {
    if (!this.providerData.serviceType) {
      Swal.fire('Warning!', 'Please select a Service Type.', 'warning');
      return;
    }

    if (!this.providerData.acceptTerms || !this.providerData.acceptVerification) {
      Swal.fire('Warning!', 'You must agree to the Terms & Conditions and Verification Process.', 'warning');
      return;
    }

    if (this.providerData.password !== this.providerData.password_confirmation) {
      Swal.fire('Error!', 'Passwords do not match.', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.providerData).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, String(value));
      }
    });

    if (this.profilePicFile) formData.append('businessLogo', this.profilePicFile);   // ✅ Updated
    if (this.attachmentFile) formData.append('personID', this.attachmentFile);       // ✅ Updated

    this.isLoading = true;

    this.http.post(this.apiUrl, formData).subscribe(
      () => {
        this.isLoading = false;
        Swal.fire('Success!', 'Your registration was successful.', 'success');
        this.resetForm();
      },
      (error) => {
        this.isLoading = false;
        console.error('Registration Error:', error);

        if (error.status === 422 && error.error.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          Swal.fire('Validation Error!', validationErrors.join('<br>'), 'error');
        } else {
          Swal.fire('Error!', 'There was an error with your registration.', 'error');
        }
      }
    );
  }

  resetForm(): void {
    this.providerData = {
      email: '',
      password: '',
      password_confirmation: '',
      fullName: '',
      contactNumber: '',
      houseAdd: '',
      street: '',
      brgy: '',
      city: '',
      province: '',
      brn: '',
      contactPerson: '',
      serviceType: null,
      acceptTerms: false,
      acceptVerification: false,
    };
    this.businessLogoPreview = null;
    this.personIDPreview = null;
    this.profilePicFile = null;
    this.attachmentFile = null;
  }

  triggerBusinessLogoInput(): void {
    document.getElementById('businessLogo')?.click();
  }

  onBusinessLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.profilePicFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.businessLogoPreview = e.target?.result as string;
      reader.readAsDataURL(this.profilePicFile);
    }
  }

  triggerPersonIDInput(): void {
    document.getElementById('personID')?.click();
  }

  onPersonIDSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.attachmentFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.personIDPreview = e.target?.result as string;
      reader.readAsDataURL(this.attachmentFile);
    }
  }
}
