import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrl: './my-transactions.component.css'
})
export class MyTransactionsComponent implements OnInit {
  pendingBookings: any[] = [];
  ongoingBookings: any[] = [];
  completedBookings: any[] = [];

  filteredPendingBookings: any[] = [];
  filteredOngoingBookings: any[] = [];
  filteredCompletedBookings: any[] = [];
  filteredRatedBookings: any[] = [];
  ratedDialogVisible: boolean = false; // Add this line to declare the property
  commentDialogVisible: boolean = false;
  ratingFeedback: string = '';
  bookingId: number | null = null;


  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';

  pendingDialogVisible: boolean = false;
  ongoingDialogVisible: boolean = false;
  completedDialogVisible: boolean = false;
  reportDialogVisible: boolean = false;

  selectedBooking: any = {};
  reportTitle: string = '';
  reportDescription: string = '';
  ratedBookings: any[] = [];

  servicesMap: { [key: number]: string } = {};

  attachedProofs: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProviderBookings();
    this.fetchServices();
  }

  openCommentDialog(bookingId: number): void {
    this.bookingId = bookingId;  // Store the selected booking ID
    this.commentDialogVisible = true;  // Open the comment dialog
  }

  submitRating() {
    const commentData = {
      bookingId: this.bookingId,
      comment: this.ratingFeedback
    };

    // Send the comment to the backend API
    this.http.post('http://127.0.0.1:8000/api/submit-comment', commentData).subscribe(
      (response) => {
        this.commentDialogVisible = false;  // Close the dialog
        this.ratedDialogVisible = false;
        Swal.fire({
          title: 'Success!',
          text: 'Your comment has been submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#428eba',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error submitting your comment. Please try again.',
          icon: 'error',
          confirmButtonColor: '#428eba',
          confirmButtonText: 'OK'
        });
      }
    );
  }



  // ✅ Fetch Bookings for Service Provider
  fetchProviderBookings() {
    const token = localStorage.getItem('authToken');
    const providerId = localStorage.getItem('provider_id');

    if (!providerId) {
      console.error('Provider ID is missing. Please log in again.');
      return;
    }

    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        this.pendingBookings = response.pending.map((booking: any) => ({
          ...booking,
          services: this.parseServices(booking.services)
        }));
        this.ongoingBookings = response.ongoing.map((booking: any) => ({
          ...booking,
          services: this.parseServices(booking.services)
        }));
        this.completedBookings = response.completed.map((booking: any) => ({
          ...booking,
          services: this.parseServices(booking.services)
        }));

        this.initializeFilteredBookings();
      },
      (error) => {
        console.error('Error fetching provider bookings:', error);
      }
    );
  }

  // ✅ Initialize filtered lists
  initializeFilteredBookings() {
    this.filteredPendingBookings = [...this.pendingBookings];
    this.filteredOngoingBookings = [...this.ongoingBookings];
    this.filteredCompletedBookings = [...this.completedBookings];
    this.ratedBookings = this.completedBookings.filter((booking) => booking.book_status === 'Completed' && booking.isRated === 1);
  }

  filterBookings() {
    const searchLower = this.searchQuery.trim().toLowerCase();

    const matchesCriteria = (booking: any) => {
      // Ensure all values exist before searching
      const customerName = booking.customer?.customer_name?.toLowerCase() || '';
      const serviceNames = booking.services.map((serviceId: number) => this.getServiceName(serviceId).toLowerCase()).join(', ');
      const bookingDate = booking.book_date || ''; // Keep date as string
      const bookingTime = booking.book_time || ''; // Keep time as string
      const status = booking.book_status?.toLowerCase() || ''; // Ensure lowercase

      // ✅ Match Search Query (Customer Name, Service Name, Booking Date, Booking Time, or Status)
      const matchesSearch =
        searchLower === '' ||
        customerName.includes(searchLower) ||
        serviceNames.includes(searchLower) ||
        bookingDate.includes(searchLower) ||
        bookingTime.includes(searchLower) ||
        status.includes(searchLower);

      // ✅ Match Date Range
      const matchesStartDate = !this.startDate || new Date(booking.book_date) >= new Date(this.startDate);
      const matchesEndDate = !this.endDate || new Date(booking.book_date) <= new Date(this.endDate);

      return matchesSearch && matchesStartDate && matchesEndDate;
    };

    this.filteredPendingBookings = this.pendingBookings.filter(matchesCriteria);
    this.filteredOngoingBookings = this.ongoingBookings.filter(matchesCriteria);
    this.filteredCompletedBookings = this.completedBookings.filter(matchesCriteria);
  }

  showRatedBookingDetails(booking: any) {
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services)
    };

    // Fetch and populate the rating data for the selected booking
    this.getBookingRating(this.selectedBooking.booking_id);

    // Open the rated booking details dialog
    this.ratedDialogVisible = true;
  }

  getBookingRating(bookingId: string) {
    // Using fetch API to get the rating data
    fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/rating`)
      .then(response => response.json())
      .then(ratingData => {
        // Populate the selectedBooking object with rating info
        this.selectedBooking = {
          ...this.selectedBooking,
          provider_rate: ratingData.provider_rate || 0,
          provider_feedback: ratingData.provider_feedback || '',
          proof: ratingData.proof || null
        };
        console.log('Existing Rating Data:', ratingData);
      })
      .catch(error => {
        console.error('Error fetching rating:', error);
      });
  }


  // ✅ Show Booking Details
  showPendingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.pendingDialogVisible = true;
  }

  showOngoingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.ongoingDialogVisible = true;
  }

  showCompletedBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.completedDialogVisible = true;
  }

  // ✅ Booking Actions
  acceptBooking() {
    this.updateBookingStatus('Ongoing');
  }

  rejectBooking() {
    this.updateBookingStatus('Rejected');
  }

  cancelBooking() {
    this.updateBookingStatus('Cancelled');
  }

  completeBooking() {
    if (!this.selectedBooking.price) {
      alert('❌ Please set a price before completing the booking.');
      return;
    }
    this.savePriceAndComplete();
  }

  savePriceAndComplete() {
    const token = localStorage.getItem('authToken');

    this.http.put(`http://127.0.0.1:8000/api/bookings/${this.selectedBooking.booking_id}/set-price`,
      { price: this.selectedBooking.price },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      () => {
        console.log('Price saved successfully.');
        this.updateBookingStatus('Completed');
      },
      (error) => {
        console.error('Error saving price:', error);
        alert('❌ Failed to set price. Please try again.');
      }
    );
  }

  isUpdatingStatus: boolean = false; // ✅ Declare the loader state

  updateBookingStatus(book_status: string) {
    const token = localStorage.getItem('authToken');

    this.pendingDialogVisible = false;
    this.ongoingDialogVisible = false;
    this.completedDialogVisible = false;

    this.isUpdatingStatus = true;

    Swal.fire({
      title: `Updating Booking Status to ${book_status}...`,
      text: 'Please wait while we process the update.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.put(`http://127.0.0.1:8000/api/bookings/${this.selectedBooking.booking_id}/status`,
      { book_status },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      () => {
        this.isUpdatingStatus = false;
        this.closeAllDialogs();
        Swal.fire({
          title: 'Success!',
          text: `Booking marked as ${book_status}!`,
          icon: 'success',
          confirmButtonColor: '#428eba',
          confirmButtonText: 'OK'
        }).then(() => {
          this.fetchProviderBookings();
        });
      },
      (error) => {
        console.error(`Error updating booking status to ${book_status}:`, error);
      }
    );
  }

  // ✅ Report Handling
  openReportDialog() {
    this.reportDialogVisible = true;
  }

  closeReportDialog() {
    this.reportDialogVisible = false;
  }

  submitReport() {
    const token = localStorage.getItem('authToken');

    const reportData = {
      title: this.reportTitle,
      description: this.reportDescription,
      booking_id: this.selectedBooking.booking_id,
    };

    this.http.post('http://127.0.0.1:8000/api/reports', reportData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        console.log('Report submitted successfully.');
        this.closeReportDialog();
      },
      (error) => {
        console.error('Error submitting report:', error);
      }
    );
  }

  // ✅ File Upload Handling
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

  removeAttachment(index: number) {
    this.attachedProofs.splice(index, 1);
  }

  // ✅ Close All Dialogs
  closeAllDialogs() {
    this.pendingDialogVisible = false;
    this.ongoingDialogVisible = false;
    this.completedDialogVisible = false;
    this.reportDialogVisible = false;
  }

  // ✅ Fetch Services
  fetchServices() {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/services`).subscribe(
      (services) => {
        services.forEach(service => {
          this.servicesMap[service.service_id] = service.service_name;
        });
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  // ✅ Parse services
  parseServices(services: any): any[] {
    return typeof services === 'string' ? JSON.parse(services) : Array.isArray(services) ? services : [];
  }

  // ✅ Get Service Name by ID
  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId] || `Service ID: ${serviceId}`;
  }
}
