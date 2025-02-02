import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css'
})
export class BookServiceComponent implements OnInit {
  provider: any = {};
  availableServices: any[] = [];
  displayedFeedbacks: any[] = [];
  showAllReviews = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('providerId');
    if (providerId) {
      this.fetchProviderDetails(providerId);
    }
    this.updateDisplayedFeedbacks();
  }

  // ✅ Fetch provider details
  fetchProviderDetails(providerId: string): void {
    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}`).subscribe(
      (data) => {
        this.provider = data;
        this.availableServices = data.services || []; // Ensure services is an array
      },
      (error) => {
        console.error('Error fetching provider details:', error);
      }
    );
  }

  toggleServiceSelection(service: any) {
    service.isSelected = !service.isSelected;
  }

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
    this.updateDisplayedFeedbacks();
  }

  private updateDisplayedFeedbacks() {
    if (this.showAllReviews) {
      this.displayedFeedbacks = this.provider.feedbacks || [];
    } else {
      this.displayedFeedbacks = (this.provider.feedbacks || []).slice(0, 3);
    }
  }

  // ✅ Booking Confirmation
  showConfirmation() {
    const selectedServices = this.availableServices.filter(service => service.isSelected);
    const bookingDate = (document.getElementById('booking-date') as HTMLInputElement)?.value;
    const bookingTime = (document.getElementById('booking-time') as HTMLSelectElement)?.value;

    if (selectedServices.length === 0 || !bookingDate || !bookingTime) {
      Swal.fire('Error!', 'Please select services, date, and time.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#2980b9',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitBooking(selectedServices, bookingDate, bookingTime);
      }
    });
  }

  submitBooking(services: any[], bookDate: string, bookTime: string) {
    const token = localStorage.getItem('authToken');

    const bookingData = {
      provider_id: this.provider.provider_id,
      services: services.map(service => service.service_id), // ✅ Send array of service IDs
      book_date: bookDate,
      book_time: bookTime,
    };

    console.log('Booking Data:', bookingData); // ✅ Debugging

    this.http.post('http://127.0.0.1:8000/api/bookings', bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      () => {
        this.showSuccessAlert();
        this.clearBookingForm(); // ✅ Clear form after success
      },
      (error) => {
        console.error('Booking failed:', error);
        Swal.fire('Error!', 'Failed to submit booking.', 'error');
      }
    );
  }

  // ✅ Clear Booking Form After Submission
  clearBookingForm() {
    this.availableServices.forEach(service => service.isSelected = false); // ✅ Deselect services
    (document.getElementById('booking-date') as HTMLInputElement).value = ''; // ✅ Clear date
    (document.getElementById('booking-time') as HTMLSelectElement).value = ''; // ✅ Clear time
  }


  // ✅ Show Success Alert
  showSuccessAlert() {
    Swal.fire({
      title: 'Booking Submitted!',
      text: 'Your booking has been successfully submitted.',
      icon: 'success',
      confirmButtonText: 'Okay',
      confirmButtonColor: '#2980b9',
    });
  }
}
