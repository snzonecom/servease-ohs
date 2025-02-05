import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrl: './my-transactions.component.css'
})
export class MyTransactionsComponent implements OnInit {
  pendingBookings: any[] = [];
  ongoingBookings: any[] = [];
  completedBookings: any[] = [];

  pendingDialogVisible: boolean = false;
  ongoingDialogVisible: boolean = false;
  completedDialogVisible: boolean = false;
  reportDialogVisible: boolean = false;

  selectedBooking: any = {};
  reportTitle: string = '';
  reportDescription: string = '';

  servicesMap: { [key: number]: string } = {};

  attachedProofs: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProviderBookings();
    this.fetchServices();
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
        console.log('Fetched Provider Bookings:', response);

        // ✅ Parse services immediately after fetching
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
      },
      (error) => {
        console.error('Error fetching provider bookings:', error);
      }
    );
  }


  // ✅ Show Booking Details
  showPendingBookingDetails(booking: any) {  // ✅ Explicitly typed as 'any'
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services) // ✅ Parse services if needed
    };
    this.pendingDialogVisible = true;
  }

  showOngoingBookingDetails(booking: any) {  // ✅ Explicitly typed as 'any'
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services)
    };
    this.ongoingDialogVisible = true;
  }

  showCompletedBookingDetails(booking: any) {  // ✅ Explicitly typed as 'any'
    this.selectedBooking = {
      ...booking,
      provider: booking.provider || { provider_name: 'N/A' },
      services: this.parseServices(booking.services)
    };
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

    this.savePriceAndComplete();  // ✅ Save the price first, then mark as completed
  }

  savePriceAndComplete() {
    const token = localStorage.getItem('authToken');

    this.http.put(`http://127.0.0.1:8000/api/bookings/${this.selectedBooking.booking_id}/set-price`,
      { price: this.selectedBooking.price },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      () => {
        console.log('Price saved successfully.');
        this.updateBookingStatus('Completed');  // ✅ Mark as completed after price is saved
      },
      (error) => {
        console.error('Error saving price:', error);
        alert('❌ Failed to set price. Please try again.');
      }
    );
  }

  updateBookingStatus(book_status: string) {
    const token = localStorage.getItem('authToken');

    this.http.put(`http://127.0.0.1:8000/api/bookings/${this.selectedBooking.booking_id}/status`,
      { book_status },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      () => {
        console.log(`Booking marked as ${book_status} successfully.`);
        alert(`✅ Booking marked as ${book_status}`);
        this.closeAllDialogs();
        this.fetchProviderBookings();
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
}
