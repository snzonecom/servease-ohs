import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{

  isEditing: boolean = false;

  fullName: string = 'John Doe';
  emailAddress: string = 'johndoe@example.com';
  contactNumber: string = '(123) 456-7890';
  birthday: string = '1990-01-01';
  houseAdd: string = '123 Lorem Ipsum';
  street: string = "Street Name";
  brgy: string = "Brgy Name";
  city: string = "City";
  province: string = "Province Name";
  password: string = "password";

  editProfile() {
    this.isEditing = true;
  }

  saveProfile() {
    this.isEditing = false;
    // Logic to save updated profile details
    console.log('Profile saved:', {
      fullName: this.fullName,
      emailAddress: this.emailAddress,
      contactNumber: this.contactNumber,
      birthday: this.birthday,
      houseAdd: this.houseAdd,
      street: this.street,
      brgy: this.brgy,
      city: this.city,
      province: this.province,
      password: this.password
    });
  }

  ngOnInit(): void {
      
  }

}
