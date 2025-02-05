import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Locations Array
export const locations = [
  {
    province: 'Pampanga',
    cities: [
      {
        name: 'Angeles City',
        barangays: [
          'Agapito del Rosario', 'Amsic', 'Anunas', 'Balibago', 'Capaya',
          'Claro M. Recto', 'Cuayan', 'Cutcut', 'Cutud', 'Lourdes North West',
          'Lourdes Sur (Talimundoc)', 'Lourdes Sur East', 'Malabañas', 'Margot',
          'Marisol (Ninoy Aquino)', 'Mining', 'Pampang (Santo Niño)', 'Pandan',
          'Pulung Bulu', 'Pulung Cacutud', 'Pulung Maragul', 'Salapungan',
          'San José', 'San Nicolas', 'Santa Teresita', 'Santa Trinidad',
          'Santo Cristo', 'Santo Domingo', 'Santo Rosario (Población)',
          'Sapalibutad', 'Sapangbato', 'Tabun', 'Virgen Delos Remedios'
        ]
      },
      {
        name: 'City of San Fernando',
        barangays: [
          'Alasas', 'Baliti', 'Bulaon', 'Calulut', 'Dela Paz Norte',
          'Dela Paz Sur', 'Del Carmen', 'Del Pilar', 'Del Rosario',
          'Dolores', 'Juliana', 'Lara', 'Lourdes', 'Magliman',
          'Maimpis', 'Malino', 'Malpitic', 'Pandaras', 'Panipuan',
          'Pulung Bulu', 'Quebiauan', 'Saguin', 'San Agustin',
          'San Felipe', 'San Isidro', 'San Jose', 'San Juan',
          'San Nicolas', 'San Pedro', 'Santa Lucia', 'Santa Teresita',
          'Santo Niño', 'Santo Rosario', 'Sindalan', 'Telabastagan'
        ]
      }
    ]
  }
];

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  isEditing: boolean = false;
  user: any = {};
  selectedProfilePhoto: File | null = null;

  provinces = locations;
  cities: any[] = [];
  barangays: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  // ✅ Fetch User Profile Data
  fetchUserProfile() {
    const token = localStorage.getItem('authToken');

    this.http.get<any>('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data) => {
        console.log('Fetched User Profile:', data);

        // ✅ Mapping API response correctly
        this.user = {
          customer_name: data.customer_name,  // Ensure this matches API response
          email: data.email,
          contact_no: data.contact_no,
          house_add: data.house_add,
          brgy: data.brgy,
          city: data.city,
          province: data.province,
          profile_photo: data.profile_photo,
        };

        // ✅ Trigger the province and city changes to load dependent dropdowns
        if (this.user.province) {
          this.onProvinceChange(this.user.province);
        }
        if (this.user.city) {
          this.onCityChange(this.user.city);
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }


  // ✅ Enable Edit Mode
  editProfile() {
    this.isEditing = true;
    console.log('Edit mode enabled.');
  }

  // ✅ Save Profile Changes
  saveProfile() {
    const token = localStorage.getItem('authToken');
  
    const userData = {
      customer_name: this.user.customer_name,
      email: this.user.email,
      contact_no: this.user.contact_no,
      house_add: this.user.house_add,
      brgy: this.user.brgy,
      city: this.user.city,
      province: this.user.province,
      password: this.user.password ? this.user.password.trim() : null
    };
  
    console.log('Submitting User Data:', userData); // ✅ Debugging
  
    // ✅ Use PUT instead of POST
    this.http.put('http://127.0.0.1:8000/api/user/update-profile', userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  // ✅ Send as JSON
      }
    }).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        this.isEditing = false;
        this.fetchUserProfile();
      },
      (error) => {
        console.error('Validation Error:', error);
      }
    );
  }
  

  // ✅ Handle Profile Photo Selection
  onFileSelected(event: any) {
    this.selectedProfilePhoto = event.target.files[0];
  }

  // ✅ Province Change
  onProvinceChange(provinceName: string) {
    const selectedProvince = this.provinces.find(p => p.province === provinceName);
    this.cities = selectedProvince ? selectedProvince.cities : [];

    // ✅ Auto-select the user's current city if exists
    if (this.user.city) {
      const existingCity = this.cities.find(city => city.name === this.user.city);
      if (existingCity) {
        this.user.city = existingCity.name;
        this.onCityChange(existingCity.name); // Trigger barangay load
      }
    } else {
      this.user.city = '';
      this.barangays = [];
    }
  }

  // ✅ City Change
  onCityChange(cityName: string) {
    const selectedCity = this.cities.find(city => city.name === cityName);
    this.barangays = selectedCity ? selectedCity.barangays : [];

    // ✅ Auto-select the user's current barangay if exists
    if (this.user.brgy && this.barangays.includes(this.user.brgy)) {
      this.user.brgy = this.user.brgy;
    } else {
      this.user.brgy = '';
    }
  }
}
