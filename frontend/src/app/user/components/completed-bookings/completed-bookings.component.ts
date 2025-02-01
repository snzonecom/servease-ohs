import { Component, OnInit } from '@angular/core';

interface Booking {
  serviceProvider: string,
  servicesRequested: string,
  selectedDate: string,
  selectedTime: string,
  remarks: string,
  dateOfSubmission: string,
}

@Component({
  selector: 'app-completed-bookings',
  templateUrl: './completed-bookings.component.html',
  styleUrl: './completed-bookings.component.css'
})
export class CompletedBookingsComponent implements OnInit {

  allBookings: Booking[] = []; // Declare the type for allBookings
  visibleBookings: Booking[] = []; // Declare the type for visibleBookings
  cardsPerPage = 6; // Number of cards to display at a time

  visible: boolean = false;
  selectedBooking: Booking = {} as Booking;

  constructor() { }

  ngOnInit(): void {
    this.allBookings = this.bookings(); // Correctly loading the bookings
    this.loadMoreBookings(); // Initially load the first set of bookings
  }

  loadMoreBookings() {
    // Load the next set of bookings based on cardsPerPage
    const nextIndex = this.visibleBookings.length;
    const nextBookings = this.allBookings.slice(nextIndex, nextIndex + this.cardsPerPage);
    this.visibleBookings = [...this.visibleBookings, ...nextBookings];
  }

  bookings(): Booking[] {
    return [
      {
        serviceProvider: 'John Doe Services',
        servicesRequested: 'Plumbing and Repair',
        selectedDate: '2025-01-20',
        selectedTime: '10:00 AM',
        remarks: 'Please arrive on time',
        dateOfSubmission: '2025-01-18',
      },
      {
        serviceProvider: 'Jane Smith Cleaning',
        servicesRequested: 'Home Cleaning',
        selectedDate: '2025-01-21',
        selectedTime: '2:00 PM',
        remarks: 'Bring cleaning materials',
        dateOfSubmission: '2025-01-19',
      },
      {
        serviceProvider: 'John Doe Services',
        servicesRequested: 'Plumbing and Repair',
        selectedDate: '2025-01-20',
        selectedTime: '10:00 AM',
        remarks: 'Please arrive on time',
        dateOfSubmission: '2025-01-18',
      },
      {
        serviceProvider: 'Jane Smith Cleaning',
        servicesRequested: 'Home Cleaning',
        selectedDate: '2025-01-21',
        selectedTime: '2:00 PM',
        remarks: 'Bring cleaning materials',
        dateOfSubmission: '2025-01-19',
      },
      {
        serviceProvider: 'John Doe Services',
        servicesRequested: 'Plumbing and Repair',
        selectedDate: '2025-01-20',
        selectedTime: '10:00 AM',
        remarks: 'Please arrive on time',
        dateOfSubmission: '2025-01-18',
      },
      {
        serviceProvider: 'Jane Smith Cleaning',
        servicesRequested: 'Home Cleaning',
        selectedDate: '2025-01-21',
        selectedTime: '2:00 PM',
        remarks: 'Bring cleaning materials',
        dateOfSubmission: '2025-01-19',
      },
      {
        serviceProvider: 'John Doe Services',
        servicesRequested: 'Plumbing and Repair',
        selectedDate: '2025-01-20',
        selectedTime: '10:00 AM',
        remarks: 'Please arrive on time',
        dateOfSubmission: '2025-01-18',
      },
      {
        serviceProvider: 'Jane Smith Cleaning',
        servicesRequested: 'Home Cleaning',
        selectedDate: '2025-01-21',
        selectedTime: '2:00 PM',
        remarks: 'Bring cleaning materials',
        dateOfSubmission: '2025-01-19',
      },
    ];
  }

  // This function will be called when the "See Booking" button is clicked
  showBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.visible = true; // Open the dialog
  }

  // Logic for accepting a booking
  acceptBooking() {
    // Your logic for accepting the booking
    console.log('Booking Completed:', this.selectedBooking);
    this.visible = false; // Close the dialog
  }

  // Logic for rejecting a booking
  rejectBooking() {
    // Your logic for rejecting the booking
    console.log('Booking Cancelled:', this.selectedBooking);
    this.visible = false; // Close the dialog
  }
}
