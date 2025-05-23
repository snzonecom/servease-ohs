import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


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
      },
      {
        name: "Magalang",
        barangays: [
          "Ayala", "Bucanan", "Camias", "Dolores", "Escaler", "La Paz", "Navaling",
          "San Agustin", "San Antonio", "San Francisco", "San Ildefonso",
          "San Isidro", "San Jose", "San Miguel", "San Nicolas 1st",
          "San Nicolas 2nd", "San Pablo", "San Pedro I", "San Pedro II",
          "San Roque", "San Vicente", "Santa Cruz", "Santa Lucia", "Santa Maria",
          "Santo Niño", "Santo Rosario", "Turu"
        ]
      },
      {
        name: "Masantol",
        barangays: [
          "Alauli", "Bagang", "Balibago", "Bebe Anac", "Bebe Matua", "Bulacus",
          "Cambasi", "Malauli", "Nigui", "Palimpe", "Puti", "Sagrada",
          "San Agustin", "San Isidro Anac", "San Isidro Matua", "San Nicolas",
          "San Pedro", "Santa Cruz", "Santa Lucia Anac", "Santa Lucia Matua",
          "Santa Lucia Paguiba", "Santa Lucia Wakas", "Santa Monica",
          "Santo Niño", "Sapang Kawayan", "Sua"
        ]
      },
      {
        name: "Mexico",
        barangays: [
          "Acli", "Anao", "Balas", "Buenavista", "Camuning", "Cawayan",
          "Concepcion", "Culubasa", "Divisoria", "Dolores", "Eden", "Gandus",
          "Lagundi", "Laput", "Laug", "Masamat", "Masangsang", "Nueva Victoria",
          "Pandacaqui", "Pangatlan", "Panipuan", "Parian", "Sabanilla",
          "San Antonio", "San Carlos", "San Jose Malino", "San Jose Matulid",
          "San Juan", "San Lorenzo", "San Miguel", "San Nicolas", "San Pablo",
          "San Patricio", "San Rafael", "San Roque", "San Vicente", "Santa Cruz",
          "Santa Maria", "Santo Domingo", "Santo Rosario", "Sapang Maisac",
          "Suclaban", "Tangle"
        ]
      },
      {
        name: "Minalin",
        barangays: [
          "Bulac", "Dawe", "Lourdes", "Maniango", "San Francisco 1st",
          "San Francisco 2nd", "San Isidro", "San Nicolas", "San Pedro",
          "Santa Catalina", "Santa Maria", "Santa Rita", "Santo Domingo",
          "Santo Rosario", "Saplad"
        ]
      },
      {
        name: "Porac",
        barangays: [
          "Babo Pangulo", "Babo Sacan", "Balubad", "Calzadang Bayu", "Camias",
          "Cangatba", "Diaz", "Dolores", "Inararo", "Jalung", "Mancatian",
          "Manibaug Libutad", "Manibaug Paralaya", "Manibaug Pasig",
          "Manuali", "Mitla Proper", "Palat", "Pias", "Pio", "Planas",
          "Poblacion", "Pulong Santol", "Salu", "San Jose Mitla",
          "Santa Cruz", "Sapang Uwak", "Sepung Bulaun", "Sinura", "Villa Maria"
        ]
      },
      {
        name: "San Luis",
        barangays: [
          "San Agustin", "San Carlos", "San Isidro", "San Jose", "San Juan",
          "San Nicolas", "San Roque", "San Sebastian", "Santa Catalina",
          "Santa Cruz Pambilog", "Santa Cruz Poblacion", "Santa Lucia",
          "Santa Monica", "Santa Rita", "Santo Niño", "Santo Rosario",
          "Santo Tomas"
        ]
      },
      {
        name: "San Simon",
        barangays: [
          "Concepcion", "De La Paz", "San Agustin", "San Isidro", "San Jose",
          "San Juan", "San Miguel", "San Nicolas", "San Pablo Libutad",
          "San Pablo Proper", "San Pedro", "Santa Cruz", "Santa Monica",
          "Santo Niño"
        ]
      },
      {
        name: "Santa Ana",
        barangays: [
          "Concepcion", "De La Paz", "San Agustin", "San Isidro", "San Jose",
          "San Juan", "San Miguel", "San Nicolas", "San Pablo Libutad",
          "San Pablo Proper", "San Pedro", "Santa Cruz", "Santa Monica",
          "Santo Niño"
        ]
      },
      {
        name: "Santa Rita",
        barangays: [
          "Becuran", "Dila-dila", "San Agustin", "San Basilio", "San Isidro",
          "San Jose", "San Juan", "San Matias", "San Vicente", "Santa Monica"
        ]
      },
      {
        name: "Santo Tomas",
        barangays: [
          "Moras de La Paz", "Poblacion", "San Bartolome", "San Matias",
          "San Vicente", "Santo Rosario", "Sapa"
        ]
      },
      {
        name: "Sasmuan",
        barangays: [
          "Batang 1st", "Batang 2nd", "Mabuanbuan", "Malusac", "Sabitanan",
          "San Antonio", "San Nicolas", "San Pedro", "Santa Lucia",
          "Santa Monica", "Santo Tomas"
        ]
      }
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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

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

  // ✅ Validate Fields
  validateProfile(): boolean {
    let missingFields: string[] = [];

    if (!this.provider.email) missingFields.push('Email Address');
    if (!this.provider.contact_no) missingFields.push('Contact Number');
    if (!this.provider.office_add) missingFields.push('Office Address');
    if (!this.provider.brgy) missingFields.push('Barangay');
    if (!this.provider.city) missingFields.push('City');
    if (!this.provider.province) missingFields.push('Province');
    if (!this.provider.contact_person) missingFields.push('Contact Person');

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Validation Error!",
        html: `<strong>The following fields are required:</strong><br> ${missingFields.join("<br>")}`,
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return false;
    }

    if (this.provider.new_password && this.provider.new_password.length < 8) {
      Swal.fire({
        title: "Invalid Password",
        text: "Password must be at least 8 characters long.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return false;
    }

    return true;
  }

  // ✅ Save Profile Changes
  saveProfile() {
    const token = localStorage.getItem('authToken');

    if (this.provider.new_password && this.provider.new_password.length < 8) {
      Swal.fire({
        title: 'Warning!',
        text: 'Password must be at least 8 characters long.',
        icon: 'warning',
        confirmButtonColor: '#428eba',
        confirmButtonText: 'OK'
      });
      return; // Stop execution if validation fails
    }

    // ✅ Send profile data as JSON
    const updatedData = {
      email: this.provider.email || '',
      contact_no: this.provider.contact_no || '',
      office_add: this.provider.office_add || '',
      brgy: this.provider.brgy || '',
      city: this.provider.city || '',
      province: this.provider.province || '',
      contact_person: this.provider.contact_person || '',
      description: this.provider.description || '',
      password: this.provider.new_password ? this.provider.new_password : null
    };

    console.log('Sending JSON Data:', updatedData); // ✅ Debug JSON data

    this.http.put('http://127.0.0.1:8000/api/provider/update-profile', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response) => {
        // ✅ If image is selected, upload it separately
        if (this.selectedBusinessLogo) {
          this.uploadProfilePicture();
        } else {
          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully!',
            icon: 'success',
            confirmButtonColor: '#428eba',
            confirmButtonText: 'OK'
          }).then(() => {
            this.isEditing = false;
            this.fetchProviderProfile();
          });
        }
      },
      (error) => {
        console.error('Error updating profile:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update profile.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      }
    );
  }

  uploadProfilePicture() {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('profile_pic', this.selectedBusinessLogo!);

    console.log('Uploading Image:', this.selectedBusinessLogo); // ✅ Debug Image Upload

    this.http.post('http://127.0.0.1:8000/api/provider/upload-profile-picture', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Profile picture updated successfully!',
          icon: 'success',
          confirmButtonColor: '#428eba', // ✅ Set the button color
          confirmButtonText: 'OK'
        });
        this.isEditing = false;
        this.fetchProviderProfile();
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to upload profile picture.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedBusinessLogo = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.provider.profile_pic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

}