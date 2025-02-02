import { Component } from '@angular/core';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrl: './user-transactions.component.css'
})
export class UserTransactionsComponent {

  // Dialog Visibility Flags
  reportDialogVisible: boolean = false;
  ratingDialogVisible: boolean = false;
  pendingDialogVisible: boolean = false;
  ongoingDialogVisible: boolean = false;
  completedDialogVisible: boolean = false;

  // Report Fields
  reportTitle: string = '';
  reportDescription: string = '';
  attachedProofs: any[] = [];

  // Rating Fields
  rating: number = 0;
  ratingFeedback: string = '';

  // Booking Data
  pendingBookings = [
    { id: 1, servicesRequested: 'Plumbing Repair', serviceProvider: 'John Doe Services', selectedDate: '2025-02-01', selectedTime: '10:00 AM', dateOfSubmission: '2025-01-28', remarks: 'Urgent leak repair' },
    { id: 2, servicesRequested: 'Electrical Maintenance', serviceProvider: 'Jane Smith Electricians', selectedDate: '2025-02-02', selectedTime: '2:00 PM', dateOfSubmission: '2025-01-29', remarks: 'Check wiring issues' }
  ];

  bookings = [
    { id: 3, servicesRequested: 'Air Conditioning Service', serviceProvider: 'CoolAir Experts', selectedDate: '2025-02-03', selectedTime: '11:00 AM', dateOfSubmission: '2025-01-30', remarks: 'Routine maintenance' }
  ];

  visibleBookings = [
    { id: 4, serviceProvider: 'Quick Fix Plumbing', servicesRequested: 'Pipe Replacement', selectedDate: '2025-01-28', remarks: 'Pipe burst repair' },
    { id: 5, serviceProvider: 'SafeHome Electricals', servicesRequested: 'Outlet Installation', selectedDate: '2025-01-29', remarks: 'Additional power outlet' }
  ];

  selectedBooking: any = {};

  /**
   * Opens the Report Dialog
   */
  openReportDialog() {
    this.reportDialogVisible = true;
  }

  /**
   * Closes the Report Dialog
   */
  closeReportDialog() {
    this.reportDialogVisible = false;
  }

  /**
   * Opens the Rating Dialog
   */
  openRatingDialog() {
    this.ratingDialogVisible = true;
  }

  /**
   * Closes the Rating Dialog
   */
  closeRatingDialog() {
    this.ratingDialogVisible = false;
  }

  /**
   * Shows details for a pending booking
   */
  showPendingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.pendingDialogVisible = true;
  }

  /**
   * Shows details for an ongoing booking
   */
  showOngoingBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.ongoingDialogVisible = true;
  }

  /**
   * Shows details for a completed booking
   */
  showCompletedBookingDetails(booking: any) {
    this.selectedBooking = { ...booking };
    this.completedDialogVisible = true;
  }

  /**
   * Accepts the pending booking
   */
  acceptBooking() {
    console.log('✅ Booking Accepted:', this.selectedBooking);
    this.pendingDialogVisible = false;
  }

  /**
   * Rejects the pending booking
   */
  rejectBooking() {
    console.log('❌ Booking Rejected:', this.selectedBooking);
    this.pendingDialogVisible = false;
  }

  /**
   * Cancels an ongoing booking
   */
  cancelBooking() {
    console.log('⚠️ Booking Cancelled:', this.selectedBooking);
    this.ongoingDialogVisible = false;
  }

  /**
   * Marks an ongoing booking as completed
   */
  completeBooking() {
    console.log('✅ Booking Completed:', this.selectedBooking);
    this.ongoingDialogVisible = false;
  }

  /**
   * Submits the report
   */
  submitReport() {
    console.log('📢 Report Submitted:', {
      title: this.reportTitle,
      description: this.reportDescription,
      attachments: this.attachedProofs
    });
    this.closeReportDialog();
  }

  /**
   * Handles file upload and previews attachments
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
   * Removes an attached proof image
   */
  removeAttachment(index: number) {
    this.attachedProofs.splice(index, 1);
  }

  /**
   * Sets the rating based on user click
   */
  setRating(star: number) {
    this.rating = star;
  }

  /**
   * Submits the rating
   */
  submitRating() {
    console.log('⭐ Rating Submitted:', {
      rating: this.rating,
      feedback: this.ratingFeedback
    });
    this.closeRatingDialog();
  }
}