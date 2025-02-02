import { Component } from '@angular/core';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrl: './my-transactions.component.css'
})
export class MyTransactionsComponent {
  pendingBookings = [
    { id: 1, availingService: 'Plumbing Repair', customerName: 'John Doe', bookingDate: '2025-02-01', bookingTime: '10:00 AM', customerAddress: '123 Main St' },
    { id: 2, availingService: 'Electrical Maintenance', customerName: 'Jane Smith', bookingDate: '2025-02-02', bookingTime: '2:00 PM', customerAddress: '456 Elm St' }
  ];

  confirmedBookings = [
    { id: 3, availingService: 'Air Conditioning Service', customerName: 'Alice Johnson', bookingDate: '2025-02-03', bookingTime: '11:00 AM', customerAddress: '789 Oak St' }
  ];

  completedBookings = [
    { id: 4, customerName: 'Bob Brown', bookingDate: '2025-01-28', bookingTime: '9:30 AM' },
    { id: 5, customerName: 'Emma Wilson', bookingDate: '2025-01-29', bookingTime: '3:00 PM' }
  ];

  pendingDialogVisible: boolean = false;
  ongoingDialogVisible: boolean = false;
  completedDialogVisible: boolean = false;
  reportDialogVisible: boolean = false;

  selectedBooking: any = {};
  reportTitle: string = '';
  reportDescription: string = '';

  // Show Pending Booking Details
  showPendingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.pendingDialogVisible = true;
  }

  // Show Ongoing Booking Details
  showOngoingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.ongoingDialogVisible = true;
  }

  // Show Completed Booking Details
  showCompletedBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.completedDialogVisible = true;
  }

  // Accept Booking
  acceptBooking() {
    console.log('Booking Accepted:', this.selectedBooking);
    this.pendingDialogVisible = false;
  }

  // Reject Booking
  rejectBooking() {
    console.log('Booking Rejected:', this.selectedBooking);
    this.pendingDialogVisible = false;
  }

  // Cancel Booking
  cancelBooking() {
    console.log('Booking Cancelled:', this.selectedBooking);
    this.ongoingDialogVisible = false;
  }

  // Mark Booking as Completed
  completeBooking() {
    console.log('Booking Completed:', this.selectedBooking);
    this.ongoingDialogVisible = false;
  }

  // Open Report Dialog
  openReportDialog() {
    this.reportDialogVisible = true;
  }

  // Close Report Dialog
  closeReportDialog() {
    this.reportDialogVisible = false;
  }

  // Submit Report
  submitReport() {
    console.log('Report Submitted:', this.reportTitle, this.reportDescription);
    this.closeReportDialog();
  }

  attachedProofs: any[] = [];

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

}