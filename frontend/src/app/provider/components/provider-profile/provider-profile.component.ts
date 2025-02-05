import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
      },
      { name: 'Mabalacat City', barangays: [] },
      { name: 'Apalit', barangays: [] },
      { name: 'Arayat', barangays: [] },
      { name: 'Bacolor', barangays: [] },
      { name: 'Candaba', barangays: [] },
      { name: 'Floridablanca', barangays: [] },
      { name: 'Guagua', barangays: [] },
      { name: 'Lubao', barangays: [] },
      { name: 'Macabebe', barangays: [] },
      { name: 'Magalang', barangays: [] },
      { name: 'Masantol', barangays: [] },
      { name: 'Mexico', barangays: [] },
      { name: 'Minalin', barangays: [] },
      { name: 'Porac', barangays: [] },
      { name: 'San Luis', barangays: [] },
      { name: 'San Simon', barangays: [] },
      { name: 'Santa Ana', barangays: [] },
      { name: 'Santa Rita', barangays: [] },
      { name: 'Santo Tomas', barangays: [] },
      { name: 'Sasmuan', barangays: [] }
    ]
  }
];

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrl: './provider-profile.component.css'
})
export class ProviderProfileComponent implements OnInit {
  isEditing: boolean = false;
  provider: any = {};
  selectedBusinessLogo: File | null = null;

  // ✅ Location Data
  provinces = locations;
  cities: any[] = [];
  barangays: string[] = [];

  // ✅ Service Categories
  serviceCategories: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProviderProfile();
    this.fetchServiceCategories();
  }

  // ✅ Fetch Provider Profile
  fetchProviderProfile() {
    const token = localStorage.getItem('authToken');
    const providerId = localStorage.getItem('provider_id');

    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        console.log('Fetched Provider Profile:', response);
        this.provider = response.provider;
        this.provider.email = response.email;
        this.provider.profile_pic = response.profile_pic || 'https://placehold.co/600x600';
        this.provider.service_type = response.service_type;  // Make sure this holds the category_id

        // Fetch service categories to display the correct name
        this.fetchServiceCategories();

        // ✅ Auto-select Province, City, and Barangay
        if (this.provider.province) {
          this.onProvinceChange(this.provider.province);
        }
        if (this.provider.city) {
          this.onCityChange(this.provider.city);
        }
      },
      (error) => {
        console.error('Error fetching provider profile:', error);
      }
    );
  }

  // ✅ Fetch Service Categories
  fetchServiceCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/service-categories').subscribe(
      (categories) => {
        this.serviceCategories = categories;

        const currentCategory = this.serviceCategories.find(
          (category) => category.category_id === this.provider.service_type
        );
        this.provider.service_type_name = currentCategory ? currentCategory.category_name : 'N/A';
      },
      (error) => {
        console.error('Error fetching service categories:', error);
      }
    );
  }


  // ✅ Enable Edit Mode
  editProfile() {
    this.isEditing = true;
  }

  // ✅ Save Profile Changes
  saveProfile() {
    const token = localStorage.getItem('authToken');

    const updatedData = {
      email: this.provider.email,
      contact_no: this.provider.contact_no,
      office_add: this.provider.office_add,
      brgy: this.provider.brgy,
      city: this.provider.city,
      province: this.provider.province,
      contact_person: this.provider.contact_person,
      service_type: this.provider.service_type, // ✅ Make sure this is sending the category_id
      password: this.provider.new_password ? this.provider.new_password : null  // ✅ Send new password if provided
    };

    this.http.put('http://127.0.0.1:8000/api/provider/update-profile', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        Swal.fire('Success', 'Profile updated successfully!', 'success'); // ✅ Add Success Alert
        this.isEditing = false;
        this.fetchProviderProfile();
      },
      (error) => {
        console.error('Error updating profile:', error);
        Swal.fire('Error', 'Failed to update profile.', 'error'); // ✅ Add Error Alert
      }
    );
  }

  // ✅ Handle Province Change
  onProvinceChange(provinceName: string) {
    const selectedProvince = this.provinces.find((p) => p.province === provinceName);
    this.cities = selectedProvince ? selectedProvince.cities : [];

    // ✅ Retain current city and barangay
    if (this.provider.city) {
      this.onCityChange(this.provider.city);
    }
  }

  // ✅ Handle City Change
  onCityChange(cityName: string) {
    const selectedCity = this.cities.find((c) => c.name === cityName);
    this.barangays = selectedCity ? selectedCity.barangays : [];

    // ✅ Retain current barangay
    if (!this.barangays.includes(this.provider.brgy)) {
      this.provider.brgy = '';
    }
  }
}