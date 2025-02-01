import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrl: './provider-profile.component.css'
})
export class ProviderProfileComponent implements OnInit {
  isEditing: boolean = false;

  // Initial values
  businessName: string = 'Sample Business Name';
  businessEmail: string = 'contact@business.com';
  businessContact: number = 1234567890;
  businessAddress: string = '123 Business St, Business City';
  contactPerson: string = 'John Doe';
  serviceType: string = 'Online Services';

  editProfile() {
    this.isEditing = true;
  }

  saveProfile() {
    this.isEditing = false;
  }

  ngOnInit(): void {

  }

}
