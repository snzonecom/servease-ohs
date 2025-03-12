import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

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
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.css']
})
export class BookServiceComponent implements OnInit, AfterViewInit {
  provider: any = {};
  availableServices: any[] = [];
  bookingDate: string = '';
  bookingTime: string = '';
  agreedToTnC: boolean = false;
  showAllReviews = false;

  tncDialogVisible: boolean = false;

  addressType: string = 'current';
  useCurrentAddress: boolean = true;
  homeAddress: string = '';
  provinces: any[] = [];
  cities: any[] = [];
  barangays: string[] = [];
  selectedProvince: string = '';
  selectedCity: string = '';
  selectedBarangay: string = '';

  feedbacks: any[] = [];
  displayedFeedbacks: any[] = [];

  minDate: string = '';

  // Define time slots
  timeSlots: string[] = [
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (1:00 PM - 4:00 PM)",
    "Evening (5:00 PM - 8:00 PM)"
  ];

  availableSlots: string[] = []; // Stores available time slots
  fullyBookedDates: string[] = []; // Stores dates that are fully booked
  private dateInputElement: HTMLInputElement | null = null;

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.setMinDate();
    this.fetchFullyBookedDates();
    this.provinces = locations;
    const providerId = this.route.snapshot.paramMap.get('providerId');

    console.log("✅ Retrieved Provider ID:", providerId);

    if (providerId) {
      console.log("✅ Provider ID Retrieved:", providerId);
      this.fetchProviderDetails(providerId);
      this.fetchProviderFeedbacks(providerId);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Provider ID is missing from the URL.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
    }

    this.updateDisplayedFeedbacks();
  }

  ngAfterViewInit(): void {
    // Find the date input element after view is initialized
    this.dateInputElement = document.getElementById('booking-date') as HTMLInputElement;
    if (this.dateInputElement) {
      this.setupDateInputListener();
    }
  }

  setupDateInputListener(): void {
    if (!this.dateInputElement) return;

    // Override the input event to intercept date selections
    this.dateInputElement.addEventListener('input', (event) => {
      const selectedDate = this.dateInputElement?.value;

      // Check if the selected date is in the fully booked list
      if (selectedDate && this.fullyBookedDates.includes(selectedDate)) {
        // If fully booked, clear the input and prevent selection
        setTimeout(() => {
          // We use setTimeout to ensure this runs after Angular's change detection
          this.bookingDate = '';
          if (this.dateInputElement) {
            this.dateInputElement.value = '';
          }

          // Provide feedback to the user
          Swal.fire({
            icon: 'warning',
            title: 'Fully Booked!',
            text: 'This date is fully booked. Please select another date.',
            confirmButtonText: 'OK',
            confirmButtonColor: "#428eba",
            allowOutsideClick: false,
          });
        }, 0);
      }
    });

    // Also handle the change event to properly update available slots
    this.dateInputElement.addEventListener('change', (event) => {
      const selectedDate = this.dateInputElement?.value;

      if (selectedDate && !this.fullyBookedDates.includes(selectedDate)) {
        // Only fetch slots if it's a valid date that's not fully booked
        this.getBookedSlots(selectedDate);
      }
    });
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  getFullyBookedDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/booked-dates`);
  }

  fetchFullyBookedDates() {
    this.getFullyBookedDates().subscribe(
      (dates) => {
        this.fullyBookedDates = dates; // Store the fully booked dates
        console.log("Fully booked dates:", this.fullyBookedDates);

        // After loading fully booked dates, set up the date input validator
        if (this.dateInputElement) {
          this.setupDateInputListener();
        }
      },
      (error) => {
        console.error("Error fetching fully booked dates:", error);
      }
    );
  }

  getBookedSlots(date: string) {
    if (!date) return;

    this.http.get<string[]>(`${this.apiUrl}/booked-slots?date=${date}`).subscribe(
      (bookedSlots) => {
        console.log("Booked Slots:", bookedSlots);
        // Only keep available slots
        this.availableSlots = this.timeSlots.filter(slot => !bookedSlots.includes(slot));
      },
      (error) => {
        console.error("Error fetching booked slots:", error);
        this.availableSlots = [];
      }
    );
  }

  // Add a method to check date validity for the HTML attribute
  isValidDate(date: string): boolean {
    // Return true if the date is not fully booked
    return !this.fullyBookedDates.includes(date);
  }

  fetchProviderFeedbacks(providerId: string) {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/provider/${providerId}/feedbacks`).subscribe(
      (feedbacks) => {
        this.feedbacks = feedbacks.map(feedback => ({
          clientName: feedback.clientName || 'Anonymous',
          reviewText: feedback.reviewText || '',
          comment: feedback.comment || '',
          rating: Math.round(feedback.rating),
          proof: feedback.proof || null,
        }));
        this.displayedFeedbacks = this.feedbacks.slice(0, 3);
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  // When a province is selected, filter cities
  onProvinceChange() {
    this.selectedCity = ''; // Reset city selection
    this.selectedBarangay = ''; // Reset barangay selection

    const provinceData = this.provinces.find(
      (prov) => prov.province === this.selectedProvince
    );

    this.cities = provinceData ? provinceData.cities : [];
  }

  // When a city is selected, filter barangays
  onCityChange() {
    this.selectedBarangay = ''; // Reset barangay selection

    const cityData = this.cities.find((city) => city.name === this.selectedCity);

    this.barangays = cityData ? cityData.barangays : [];
  }

  getFilledStars(rating: number): any[] {
    return Array(Math.round(rating)).fill(1);
  }

  getEmptyStars(rating: number): any[] {
    return Array(5 - Math.round(rating)).fill(1);
  }

  fetchProviderDetails(providerId: string): void {
    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}`).subscribe(
      (data) => {
        this.provider = data;
        this.availableServices = data.services || [];
      },
      (error) => {
        console.error('Error fetching provider details:', error);
      }
    );
  }

  get isServiceSelected(): boolean {
    return this.availableServices.some(service => service.isSelected);
  }

  get canSubmitBooking(): boolean {
    return this.isServiceSelected && !!this.bookingDate && !!this.bookingTime && this.agreedToTnC;
  }

  toggleServiceSelection(service: any) {
    service.isSelected = !service.isSelected;
  }

  toggleReviews() {
    if (this.displayedFeedbacks.length === 3) {
      this.displayedFeedbacks = this.feedbacks;
    } else {
      this.displayedFeedbacks = this.feedbacks.slice(0, 3);
    }
  }

  private updateDisplayedFeedbacks() {
    if (this.showAllReviews) {
      this.displayedFeedbacks = this.provider.feedbacks || [];
    } else {
      this.displayedFeedbacks = (this.provider.feedbacks || []).slice(0, 3);
    }
  }

  showConfirmation() {
    if (!this.isServiceSelected) {
      Swal.fire({
        title: "Warning!",
        text: "Please select at least one service before proceeding.",
        icon: "warning",
        confirmButtonColor: "#428eba",
      });
      return;
    }
    if (!this.bookingDate) {
      Swal.fire({
        title: "Warning!",
        text: "Please select a booking date before proceeding.",
        icon: "warning",
        confirmButtonColor: "#428eba",
      });
      return;
    }
    if (!this.bookingTime) {
      Swal.fire({
        title: "Warning!",
        text: "Please select a booking time before proceeding.",
        icon: "warning",
        confirmButtonColor: "#428eba",
      });
      return;
    }
    if (!this.agreedToTnC) {
      Swal.fire({
        title: 'Warning!',
        text: 'You must agree to the Terms and Conditions before submitting.',
        icon: 'warning',
        confirmButtonColor: '#428eba',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.submitBooking();
  }

  submitBooking() {
    const token = localStorage.getItem('authToken');

    const selectedServices = this.availableServices
      .filter(s => s.isSelected)
      .map(s => s.service_id);

    if (selectedServices.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select at least one service.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    // Base booking data
    const bookingData: any = {
      provider_id: this.provider.provider_id,
      services: selectedServices,
      book_date: this.bookingDate,
      book_time: this.bookingTime,
      use_another_address: this.addressType === 'another',
    };

    // ✅ Validate and Include Address If "Use Another Address" is Selected
    if (this.addressType === 'another') {
      if (!this.homeAddress || !this.selectedProvince || !this.selectedCity || !this.selectedBarangay) {
        Swal.fire({
          title: "Incomplete Address!",
          text: "Please fill out all required address fields.",
          icon: "warning",
          confirmButtonColor: "#428eba",
        });
        return;
      }

      bookingData.new_address = this.homeAddress;
      bookingData.new_province = this.selectedProvince;
      bookingData.new_city = this.selectedCity;
      bookingData.new_brgy = this.selectedBarangay;
    }

    console.log('Booking Data:', bookingData);

    Swal.fire({
      title: 'Processing Payment...',
      text: 'Please wait while we generate your payment link.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // ✅ Step 1: Request Payment Link from Laravel API
    const paymentData = {
      amount: 10000, // Amount in cents (₱100)
      description: 'Service Booking Payment',
      remarks: 'Booking Convenience Fee'
    };

    this.http.post<{ success: boolean, data: any }>(
      'http://127.0.0.1:8000/api/payment/create-link',
      paymentData,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      response => {
        if (response.success) {
          const paymentUrl = response.data.data.attributes.checkout_url;

          Swal.fire({
            title: "Payment Required",
            text: "You will be redirected to PayMongo to complete your down payment.",
            icon: "info",
            confirmButtonText: "Proceed to Payment",
            confirmButtonColor: "#428eba",
            showCancelButton: true,
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              // Show loader while booking is being processed
              Swal.fire({
                title: "Processing...",
                text: "Please wait while your payment portal is being generated.",
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },
              });

              // First, send the booking data to your backend
              this.http.post('http://127.0.0.1:8000/api/bookings', bookingData, {
                headers: { Authorization: `Bearer ${token}` },
              }).subscribe(
                () => {
                  // Redirect to PayMongo after successful booking
                  window.location.href = paymentUrl;
                },
                (error) => {
                  console.error('Booking failed:', error);
                  Swal.fire({
                    title: "Error!",
                    text: error.error?.message || "Failed to submit booking.",
                    icon: "error",
                    confirmButtonColor: "#428eba",
                  });
                }
              );
            }
          });
        } else {
          Swal.fire({
            title: "Payment Error!",
            text: "Failed to generate a payment link. Please try again.",
            icon: "error",
            confirmButtonColor: "#428eba",
          });
        }
      },
      error => {
        console.error('Payment link generation failed:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to process your payment. Please try again.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      }
    );
  }

  clearBookingForm() {
    this.availableServices.forEach(service => service.isSelected = false);
    this.bookingDate = '';
    this.bookingTime = '';
    this.agreedToTnC = false;
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Booking Submitted!',
      text: 'Your booking has been successfully submitted.',
      icon: 'success',
      confirmButtonText: 'Okay',
      confirmButtonColor: '#428eba',
    });
  }

  displayCount = 3; // Initially show only 3 services

  showMore() {
    this.displayCount = this.availableServices.length; // Show all services
  }

  displayFeedbackCount = 3; // Initially show only 3 feedbacks

  showMoreFeedbacks() {
    this.displayFeedbackCount = this.feedbacks.length; // Show all feedbacks
  }
}
