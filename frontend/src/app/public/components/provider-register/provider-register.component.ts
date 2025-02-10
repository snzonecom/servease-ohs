import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  validationErrors: { [key: string]: string } = {}; // Store validation errors

  providerData = {
    businessLogo: '',
    personID: '',
    email: '',
    password: '',
    password_confirmation: '',
    fullName: '',           // ✅ Renamed from provider_name
    description: '',
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

  constructor(private http: HttpClient, private router: Router) { }

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
    this.validationErrors = {}; // Clear old errors

    let missingFields: string[] = [];

    // Check required fields
    if (!this.providerData.businessLogo) {
      this.validationErrors['businessLogo'] = "Business Logo is required.";
      missingFields.push("Business Logo");
    }

    if (!this.providerData.personID) {
      this.validationErrors['personID'] = "Contact Person ID is required.";
      missingFields.push("Contact Person ID");
    }

    if (!this.providerData.fullName) {
      this.validationErrors['fullName'] = "Business Name is required.";
      missingFields.push("Business Name");
    }

    if (!this.providerData.description) {
      this.validationErrors['description'] = "Please describe your business.";
      missingFields.push("Business Description");
    }

    if (!this.providerData.email) {
      this.validationErrors['email'] = "Email is required.";
      missingFields.push("Email Address");
    }

    if (!this.providerData.contactNumber) {
      this.validationErrors['contactNumber'] = "Contact Number is required.";
      missingFields.push("Contact Number");
    }

    if (!this.providerData.houseAdd) {
      this.validationErrors['houseAdd'] = "Office Address is required.";
      missingFields.push("Office Address");
    }

    if (!this.providerData.province) {
      this.validationErrors['province'] = "Please select a province.";
      missingFields.push("Province");
    }

    if (!this.providerData.city) {
      this.validationErrors['city'] = "Please select a city.";
      missingFields.push("City/Municipality");
    }

    if (!this.providerData.brgy) {
      this.validationErrors['brgy'] = "Please select a barangay.";
      missingFields.push("Barangay");
    }

    if (!this.providerData.brn) {
      this.validationErrors['brn'] = "Business Registration Number is required.";
      missingFields.push("BRN");
    }

    if (!this.providerData.contactPerson) {
      this.validationErrors['contactPerson'] = "Contact Person is required.";
      missingFields.push("Contact Person");
    }

    if (!this.providerData.serviceType) {
      this.validationErrors['serviceType'] = "Please select a Service Type.";
      missingFields.push("Service Type");
    }

    if (!this.providerData.password || !this.providerData.password_confirmation) {
      this.validationErrors['password'] = "Password and confirmation are required.";
      missingFields.push("Password");
    } else if (this.providerData.password.length < 8) {
      this.validationErrors['password'] = "Password must be at least 8 characters.";
      missingFields.push("Password (Minimum 8 characters)");
    } else if (this.providerData.password !== this.providerData.password_confirmation) {
      this.validationErrors['password'] = "Passwords do not match.";
      missingFields.push("Passwords do not match!");
    }

    if (!this.providerData.acceptTerms || !this.providerData.acceptVerification) {
      missingFields.push("Terms & Conditions");
    }

    // Show Swal alert if any fields are missing
    if (missingFields.length > 0) {
      Swal.fire({
        title: "Validation Error!",
        html: `<strong>The following fields are required:</strong><br> ${missingFields.join("<br>")}`,
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    // If all validations pass, proceed with form submission
    const formData = new FormData();
    Object.entries(this.providerData).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, String(value));
      }
    });

    if (this.profilePicFile) formData.append("businessLogo", this.profilePicFile);
    if (this.attachmentFile) formData.append("personID", this.attachmentFile);

    this.isLoading = true;

    this.http.post(this.apiUrl, formData).subscribe(
      () => {
        this.isLoading = false;
        Swal.fire({
          title: "Registration Successful!",
          text: "Your registration was successful! Your account will now be processed for verification. You will receive an email notification once the verification is complete.",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
        this.resetForm();
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
        console.error("Registration Error:", error);

        if (error.status === 422 && error.error.errors) {
          this.validationErrors = {};
          Object.entries(error.error.errors).forEach(([key, value]) => {
            this.validationErrors[key] = (value as string[])[0]; // Display first error message per field
          });
          // Check if email is already taken
          if (error.error.errors.email && error.error.errors.email.includes("The email has already been taken.")) {
            Swal.fire({
              title: "Registration Failed!",
              text: "The email has already been taken. Please use a different email.",
              icon: "error",
              confirmButtonColor: "#428eba", // Red color for alert
            });
          }
        }
      }
    );
  }

  resetForm(): void {
    this.providerData = {
      businessLogo: '',
      personID: '',
      email: '',
      password: '',
      password_confirmation: '',
      fullName: '',
      description: '',
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
