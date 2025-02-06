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


  provinces = locations;
  cities: any[] = [];
  barangays: string[] = [];

  providerData = {
    email: '',
    password: '',
    password_confirmation: '',
    fullName: '',           // ✅ Renamed from provider_name
    contactNumber: '',      // ✅ Renamed from contact_no
    houseAdd: '',           // ✅ Renamed from office_add
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

  // Handle Province Selection
  onProvinceChange(): void {
    const selectedProvince = this.provinces.find(p => p.province === this.providerData.province);
    this.cities = selectedProvince ? selectedProvince.cities : [];
    this.providerData.city = '';
    this.barangays = [];
    this.providerData.brgy = '';
  }

  // Handle City Selection
  onCityChange(): void {
    const selectedCity = this.cities.find(c => c.name === this.providerData.city);
    this.barangays = selectedCity ? selectedCity.barangays : [];
    this.providerData.brgy = '';
  }

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
    this.cities = [];
    this.barangays = [];
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
