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
      {
        name: 'Mabalacat City',
        barangays: [
          'Atlu-Bola', 'Bical', 'Bundagul', 'Cacutud', 'Calumpang',
          'Camachiles', 'Dapdap', 'Dau', 'Dolores', 'Duquit',
          'Lakandula', 'Mabiga', 'Macapagal Village', 'Mamatitang',
          'Mangalit', 'Marcos Village', 'Mawaque', 'Paralayunan',
          'Poblacion', 'San Francisco', 'San Joaquin', 'Santa Ines',
          'Santa Maria', 'Santo Rosario', 'Sapang Balen',
          'Sapang Biabas', 'Tabun'
        ]
      },
      {
        name: 'Apalit',
        barangays: [
          'Balucuc', 'Calantipe', 'Cansinala', 'Capalangan', 'Colgante',
          'Paligui', 'Sampaloc', 'San Juan', 'San Vicente', 'Sucad',
          'Sulipan', 'Tabuyuc'
        ]
      },
      {
        name: 'Arayat',
        barangays: [
          'Arenas', 'Baliti', 'Batasan', 'Buensuceso', 'Candating',
          'Gatiawin', 'Guemasan', 'La Paz (Turu)', 'Lacmit', 'Lacquios',
          'Mangga-Cacutud', 'Mapalad', 'Palinlang', 'Paralaya',
          'Plazang Luma', 'Poblacion', 'San Agustin Norte',
          'San Agustin Sur', 'San Antonio', 'San Jose Mesulo',
          'San Juan Bano', 'San Mateo', 'San Nicolas',
          'San Roque Bitas', 'Cupang (Santa Lucia)',
          'Matamo (Santa Lucia)', 'Santo Niño Tabuan',
          'Suclayin', 'Telapayong', 'Kaledian (Camba)'
        ]
      },
      {
        name: 'Bacolor',
        barangays: [
          'Balas', 'Cabalantian', 'Cabambangan (Poblacion)', 'Cabetican',
          'Calibutbut', 'Concepcion', 'Dolores', 'Duat', 'Macabacle',
          'Magliman', 'Maliwalu', 'Mesalipit', 'Parulog', 'Potrero',
          'San Antonio', 'San Isidro', 'San Vicente', 'Santa Barbara',
          'Santa Ines', 'Talba', 'Tinajero'
        ]
      },
      {
        name: 'Candaba',
        barangays: [
          'Bahay Pare', 'Bambang', 'Barangca', 'Barit', 'Buas (Poblacion)',
          'Cuayang Bugtong', 'Dalayap', 'Dulong Ilog', 'Gulap', 'Lanang',
          'Lourdes', 'Magumbali', 'Mandasig', 'Mandili', 'Mangga',
          'Mapaniqui', 'Paligui', 'Pangclara', 'Pansinao', 'Paralaya (Poblacion)',
          'Pasig', 'Pescadores (Poblacion)', 'Pulong Gubat', 'Pulong Palazan',
          'Salapungan', 'San Agustin (Poblacion)', 'Santo Rosario',
          'Tagulod', 'Talang', 'Tenejero', 'Vizal San Pablo',
          'Vizal Santo Cristo', 'Vizal Santo Niño'
        ]
      },
      {
        name: 'Floridablanca',
        barangays: [
          'Anon', 'Apalit', 'Basa Air Base', 'Benedicto', 'Bodega',
          'Cabangcalan', 'Calantas', 'Carmencita', 'Consuelo', 'Dampe',
          'Del Carmen', 'Fortuna', 'Gutad', 'Mabical', 'Malabo',
          'Maligaya', 'Nabuclod', 'Pabanlag', 'Paguiruan', 'Palmayo',
          'Pandaguirig', 'Población', 'San Antonio', 'San Isidro',
          'San Jose', 'San Nicolas', 'San Pedro', 'San Ramon',
          'San Roque', 'Santa Monica', 'Solib', 'Valdez', 'Mawacat'
        ]
      },
      {
        name: 'Guagua',
        barangays: [
          'Bancal', 'Plaza Burgos', 'San Nicolas 1st', 'San Pedro',
          'San Rafael', 'San Roque', 'Santa Filomena', 'Santo Cristo',
          'Santo Niño', 'San Vicente (Ebus)', 'Lambac', 'Magsaysay',
          'Maquiapo', 'Natividad', 'Pulungmasle', 'Rizal', 'Ascomo',
          'Jose Abad Santos (Siran)', 'San Pablo', 'San Juan 1st',
          'San Jose', 'San Matias', 'San Isidro', 'San Antonio',
          'San Agustin', 'San Juan Bautista', 'San Juan Nepomuceno',
          'San Miguel', 'San Nicolas 2nd', 'Santa Ines',
          'Santa Ursula'
        ]
      },
      {
        name: 'Lubao',
        barangays: [
          'San Isidro', 'Santiago', 'Santo Niño (Prado Saba)',
          'San Roque Arbol', 'Baruya (San Rafael)', 'Lourdes (Lauc Pau)',
          'Prado Siongco', 'San Jose Gumi', 'Balantacan',
          'Santa Teresa 2nd', 'Bancal Sinubli', 'Bancal Pugad',
          'Calangain', 'San Pedro Palcarangan', 'San Pedro Saug',
          'San Pablo 1st', 'San Pablo 2nd', 'De La Paz', 'Santa Cruz'
        ]
      },
      {
        name: 'Macabebe',
        barangays: [
          'Batasan', 'Caduang Tete', 'Candelaria', 'Castuli',
          'Consuelo', 'Dalayap', 'Mataguiti', 'San Esteban',
          'San Francisco', 'San Gabriel (Poblacion)',
          'San Isidro (Poblacion)', 'San Jose', 'San Juan',
          'San Rafael', 'San Roque (Poblacion)', 'San Vicente',
          'Santa Cruz (Poblacion)', 'Santa Lutgarda',
          'Santa Maria', 'Santa Rita (Poblacion)', 'Santo Niño',
          'Santo Rosario (Poblacion)', 'Saplad David',
          'Tacasan', 'Telacsan'
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
  
    // ✅ Send user profile details as JSON (excluding profile photo)
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
  
    console.log('Submitting User Data:', userData); // ✅ Debug JSON data
  
    this.http.put('http://127.0.0.1:8000/api/user/update-profile', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
  
        // ✅ If a profile photo is selected, upload it separately
        if (this.selectedProfilePhoto) {
          this.uploadProfilePhoto();
        } else {
          Swal.fire('Success', 'Profile updated successfully!', 'success');
          this.isEditing = false;
          this.fetchUserProfile();
        }
      },
      (error) => {
        console.error('Validation Error:', error);
        Swal.fire('Error', 'Failed to update profile.', 'error');
      }
    );
  }

  uploadProfilePhoto() {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
  
    formData.append('profile_photo', this.selectedProfilePhoto!);
  
    console.log('Uploading Profile Photo:', this.selectedProfilePhoto); // ✅ Debug Image Upload
  
    this.http.post('http://127.0.0.1:8000/api/user/upload-profile-photo', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        console.log('Profile photo uploaded:', response);
        Swal.fire('Success', 'Profile photo updated successfully!', 'success');
        this.isEditing = false;
        this.fetchUserProfile();
      },
      (error) => {
        console.error('Error uploading profile photo:', error);
        Swal.fire('Error', 'Failed to upload profile photo.', 'error');
      }
    );
  }
  
  


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      this.selectedProfilePhoto = file;
  
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profile_photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
