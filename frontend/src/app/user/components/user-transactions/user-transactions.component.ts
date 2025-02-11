import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrl: './user-transactions.component.css'
})
export class UserTransactionsComponent implements OnInit {

  // ✅ Dialog Visibility Flags
  reportDialogVisible: boolean = false;
  ratingDialogVisible: boolean = false;
  pendingDialogVisible: boolean = false;
  ongoingDialogVisible: boolean = false;
  completedDialogVisible: boolean = false;

  // ✅ Report Fields
  reportTitle: string = '';
  reportDescription: string = '';
  attachedProofs: any[] = [];

  // ✅ Rating Fields
  rating: number = 0;
  ratingFeedback: string = '';

  // ✅ Booking Data
  pendingBookings: any[] = [];
  ongoingBookings: any[] = [];
  completedBookings: any[] = [];

  selectedBooking: any = {};

  // ✅ Service Mapping for Service Names
  servicesMap: { [key: number]: string } = {};  // Maps service ID to service name

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBookings();
    this.fetchServices(); // ✅ Fetch all services on init
  }

  /**
   * ✅ Fetch Bookings for Logged-in User
   */
  fetchBookings() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found. Please log in again.');
      return;
    }

    this.http.get<any[]>(`http://127.0.0.1:8000/api/user/${userId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (bookings) => {
        console.log('Fetched Bookings:', bookings);
        this.categorizeBookings(bookings);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  /**
   * ✅ Fetch All Services (for mapping service IDs to names)
   */
  fetchServices() {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/services`).subscribe(
      (services) => {
        services.forEach(service => {
          this.servicesMap[service.service_id] = service.service_name; // ✅ Corrected key
        });
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }


  /**
   * ✅ Categorize Bookings Based on Status
   */
  categorizeBookings(bookings: any[]) {
    this.pendingBookings = bookings.filter(b => b.book_status === 'Pending');
    this.ongoingBookings = bookings.filter(b => b.book_status === 'Ongoing');
    this.completedBookings = bookings.filter(b => b.book_status === 'Completed');
  }

  /**
   * ✅ Show Booking Details Based on Status
   */
  showPendingBookingDetails(booking: any) {
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services) // ✅ Parse services if needed
    };
    this.pendingDialogVisible = true;
  }

  showOngoingBookingDetails(booking: any) {
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services)
    };
    this.ongoingDialogVisible = true;
  }

  showCompletedBookingDetails(booking: any) {
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services)
    };
    this.completedDialogVisible = true;
  }

  isCancelling = false; // ✅ Define loader state

  cancelBooking(bookingId: number) {
    const token = localStorage.getItem('authToken');
  
    this.pendingDialogVisible = false; // Close the dialog before processing
    this.isCancelling = true; // ✅ Start loader
  
    Swal.fire({
      title: 'Cancelling Booking...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // ✅ Show loading indicator
      }
    });
  
    this.http.post(`http://127.0.0.1:8000/api/bookings/${bookingId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response: any) => {
        console.log('Booking cancelled successfully:', response);
  
        Swal.fire({
          title: 'Cancelled!',
          text: 'Booking has been cancelled successfully.',
          icon: 'success',
          confirmButtonColor: '#428eba',
          confirmButtonText: 'OK'
        }).then(() => {
          this.fetchBookings(); // ✅ Refresh the bookings list
          this.pendingDialogVisible = false; // ✅ Close the dialog
          this.isCancelling = false; // ✅ Reset loader
        });
      },
      (error) => {
        console.error('Error cancelling booking:', error);
        Swal.fire('Error', 'Failed to cancel booking.', 'error');
        this.isCancelling = false; // ✅ Reset loader
      }
    );
  }
  



  /**
   * ✅ Parse services if it's a JSON string
   */
  parseServices(services: any): any[] {
    if (typeof services === 'string') {
      try {
        return JSON.parse(services); // ✅ Convert JSON string to an array
      } catch (error) {
        console.error('Error parsing services:', error);
        return [];
      }
    }
    return Array.isArray(services) ? services : [];
  }

  /**
   * ✅ Get Service Name by ID
   */
  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId] || `Service ID: ${serviceId}`; // ✅ Fallback if service name not found
  }

  /**
   * ✅ Submit Report
   */
  submitReport() {
    console.log('📢 Report Submitted:', {
      title: this.reportTitle,
      description: this.reportDescription,
      attachments: this.attachedProofs
    });
    this.reportDialogVisible = false;
  }

  /**
   * ✅ Handle File Upload
   */
  handleFileUpload(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.attachedProofs.push({ file: file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * ✅ Remove Attachment
   */
  removeAttachment(index: number) {
    this.attachedProofs.splice(index, 1);
  }

  /**
   * ✅ Set Rating
   */
  setRating(star: number) {
    this.rating = star;
  }

  /**
   * ✅ Submit Rating
   */
  submitRating() {
    const token = localStorage.getItem('authToken');

    if (!this.selectedBooking.booking_id) {
      console.error('Booking ID is missing.');
      Swal.fire('Error!', 'Booking ID is missing.', 'error');
      return;
    }

    const ratingData = {
      provider_rate: this.rating,
      provider_feedback: this.ratingFeedback
    };

    this.http.post(`http://127.0.0.1:8000/api/bookings/${this.selectedBooking.booking_id}/rate`, ratingData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        console.log('⭐ Rating Submitted:', response);
        this.ratingDialogVisible = false;
        Swal.fire({
          title: 'Success!',
          text: 'Your rating has been submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#428eba',
          confirmButtonText: 'OK'
        }).then(() => {
          // ✅ Reset inputs after successful submission
          this.rating = 0;
          this.ratingFeedback = '';
        });
      },
      (error) => {
        console.error('Error submitting rating:', error);
        Swal.fire('Error', 'Failed to submit rating. Please try again later.', 'error');
      }
    );
  }


  /**
   * Opens the Rating Dialog
   */
  openRatingDialog() {
    // ✅ Close the completed booking dialog if it's open
    this.completedDialogVisible = false;

    // ✅ Reset the rating inputs
    this.rating = 0;
    this.ratingFeedback = '';

    // ✅ Open the rating dialog
    this.ratingDialogVisible = true;
  }


  /**
   * Closes the Rating Dialog
   */
  closeRatingDialog() {
    this.ratingDialogVisible = false;
  }
}
