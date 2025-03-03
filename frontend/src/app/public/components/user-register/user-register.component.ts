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
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  tncDialogVisible: boolean = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  provinces = locations;
  cities: any[] = [];
  barangays: string[] = [];

  validationErrors: { [key: string]: string } = {}; // Store validation errors

  formData: any = {
    profile: '',
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

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

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
    // Clear previous validation errors
    this.validationErrors = {};
    let missingFields: string[] = [];

    if (!this.selectedFile) {
      this.validationErrors['profile'] = "Profile photo is required.";
      missingFields.push("Profile Photo");
    }

    if (!this.formData.fullName) {
      this.validationErrors['fullName'] = "Full Name is required.";
      missingFields.push("Full Name");
    }

    if (!this.formData.email) {
      this.validationErrors['email'] = "Email Address is required.";
      missingFields.push("Email Address");
    }

    if (!this.formData.contactNumber) {
      this.validationErrors['contactNumber'] = "Contact Number is required.";
      missingFields.push("Contact Number");
    }

    if (!this.formData.houseAdd) {
      this.validationErrors['houseAdd'] = "House and Street Address is required.";
      missingFields.push("House Address");
    }

    if (!this.formData.province) {
      this.validationErrors['province'] = "Please select a Province.";
      missingFields.push("Province");
    }

    if (!this.formData.city) {
      this.validationErrors['city'] = "Please select a City.";
      missingFields.push("City/Municipality");
    }

    if (!this.formData.brgy) {
      this.validationErrors['brgy'] = "Please select a Barangay.";
      missingFields.push("Barangay");
    }

    // Password Validation
    if (!this.formData.password || !this.formData.confirmPassword) {
      this.validationErrors['password'] = "Password and confirmation are required.";
      missingFields.push("Password");
    } else if (this.formData.password.length < 8) {
      this.validationErrors['password'] = "Password must be at least 8 characters long.";
      missingFields.push("Password (Minimum 8 characters)");
    } else if (this.formData.password !== this.formData.confirmPassword) {
      this.validationErrors['password'] = "Passwords do not match.";
      missingFields.push("Matching Passwords");
    }

    // Terms & Conditions
    if (!this.formData.acceptTerms) {
      missingFields.push("Terms & Conditions");
    }

    // Show SweetAlert2 for missing fields
    if (missingFields.length > 0) {
      Swal.fire({
        title: "Validation Error!",
        html: `<strong>The following fields are required:</strong><br> ${missingFields.join("<br>")}`,
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    // Prepare form data
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

    this.isLoading = true;
    Swal.fire({
      title: "Registering...",
      text: "Please wait while we process your registration.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // API Call
    this.authService.register(registrationData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          title: "Verify your Email!",
          text: "Check your inbox in email to verify your account!",
          icon: "success",
          confirmButtonColor: "#428eba",
        }).then(() => {
          this.resetForm(); // Reset the form after success
          this.router.navigate(['/login']);
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);

        if (err.status === 422 && err.error.errors) {
          this.validationErrors = {}; // Clear existing errors
          Object.entries(err.error.errors).forEach(([key, value]) => {
            this.validationErrors[key] = (value as string[])[0]; // Show first error per field
          });

          // Show a Swal alert if the email is already taken
          if (err.error.errors.email && err.error.errors.email.includes("The email has already been taken.")) {
            Swal.fire({
              title: "Registration Failed!",
              text: "The email has already been taken. Please use a different email.",
              icon: "error",
              confirmButtonColor: "#428eba",
            });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: `Registration failed: ${err.error.message || 'Unknown error'}`,
            icon: "error",
            confirmButtonColor: "#428eba",
          });
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
