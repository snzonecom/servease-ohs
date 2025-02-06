import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
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
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  tncDialogVisible: boolean = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  provinces = locations;
  cities: any[] = [];
  barangays: string[] = [];

  formData: any = {
    fullName: '',
    email: '',
    contactNumber: '',
    houseAdd: '',
    brgy: '',
    city: '',
    province: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false // ✅ Added to prevent undefined errors
  };

  constructor(private authService: AuthService, private router: Router) { }

  // Handle Province Selection
  onProvinceChange(): void {
    const selectedProvince = this.provinces.find(p => p.province === this.formData.province);
    this.cities = selectedProvince ? selectedProvince.cities : [];
    this.formData.city = '';
    this.barangays = [];
    this.formData.brgy = '';
  }

  // Handle City Selection
  onCityChange(): void {
    const selectedCity = this.cities.find(c => c.name === this.formData.city);
    this.barangays = selectedCity ? selectedCity.barangays : [];
    this.formData.brgy = '';
  }


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
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
    this.photoPreview = null;
    this.selectedFile = null;
    this.cities = [];
    this.barangays = [];
  }
}
