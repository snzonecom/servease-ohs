import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.css']
})
export class BookServiceComponent implements OnInit {
  provider: any = {};
  availableServices: any[] = [];
  bookingDate: string = '';
  bookingTime: string = '';
  agreedToTnC: boolean = false;
  showAllReviews = false;

  tncDialogVisible: boolean = false;


  feedbacks: any[] = [];
  displayedFeedbacks: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
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

  fetchProviderFeedbacks(providerId: string) {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/provider/${providerId}/feedbacks`).subscribe(
      (feedbacks) => {
        this.feedbacks = feedbacks.map(feedback => ({
          clientName: feedback.clientName || 'Anonymous',
          reviewText: feedback.reviewText || '',
          rating: Math.round(feedback.rating),
        }));
        this.displayedFeedbacks = this.feedbacks.slice(0, 3);
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
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

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#428eba',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitBooking();
      }
    });
  }

  submitBooking() {
    const token = localStorage.getItem('authToken');

    const bookingData = {
      provider_id: this.provider.provider_id,
      services: this.availableServices.filter(s => s.isSelected).map(s => s.service_id),
      book_date: this.bookingDate,
      book_time: this.bookingTime,
    };

    console.log('Booking Data:', bookingData);

    // ✅ Show Loading Indicator
    Swal.fire({
      title: 'Submitting Booking...',
      text: 'Please wait while we process your booking.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.http.post('http://127.0.0.1:8000/api/bookings', bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      () => {
        this.showSuccessAlert();
        this.clearBookingForm();
      },
      (error) => {
        console.error('Booking failed:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to submit booking.",
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
