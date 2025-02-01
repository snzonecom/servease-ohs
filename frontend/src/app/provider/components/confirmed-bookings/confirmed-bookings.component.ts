import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmed-bookings',
  templateUrl: './confirmed-bookings.component.html',
  styleUrl: './confirmed-bookings.component.css'
})
export class ConfirmedBookingsComponent implements OnInit {

  visible: boolean = false;
  selectedBooking: any = {};

  // Array of booking details
  bookings = [
    {
      customerName: 'John Doe',
      contactNumber: '+321 654 9870',
      customerEmail: 'john.doe@example.com',
      customerAddress: '123 Business St.',
      availingService: 'Cleaning, Laundry',
      bookingDate: '2025-01-22',
      bookingTime: '10:00 AM',
      remarks: 'Please bring necessary cleaning supplies.'
    },
    {
      customerName: 'Jane Smith',
      contactNumber: '+321 654 9871',
      customerEmail: 'jane.smith@example.com',
      customerAddress: '456 Oak Ave.',
      availingService: 'Plumbing, Electrical',
      bookingDate: '2025-01-23',
      bookingTime: '11:00 AM',
      remarks: 'Requires urgent service.'
    },
    {
      customerName: 'Alice Brown',
      contactNumber: '+321 654 9872',
      customerEmail: 'alice.brown@example.com',
      customerAddress: '789 Pine Rd.',
      availingService: 'Painting',
      bookingDate: '2025-01-24',
      bookingTime: '02:00 PM',
      remarks: 'Paint the living room and kitchen.'
    },
    {
      customerName: 'Bob White',
      contactNumber: '+321 654 9873',
      customerEmail: 'bob.white@example.com',
      customerAddress: '101 Maple Ln.',
      availingService: 'Landscaping',
      bookingDate: '2025-01-25',
      bookingTime: '09:00 AM',
      remarks: 'Trim the bushes and mow the lawn.'
    },
    {
      customerName: 'Charlie Green',
      contactNumber: '+321 654 9874',
      customerEmail: 'charlie.green@example.com',
      customerAddress: '202 Birch Dr.',
      availingService: 'Cleaning, Painting',
      bookingDate: '2025-01-26',
      bookingTime: '12:00 PM',
      remarks: 'Deep clean and repaint the kitchen.'
    },
    {
      customerName: 'Diana Blue',
      contactNumber: '+321 654 9875',
      customerEmail: 'diana.blue@example.com',
      customerAddress: '303 Cedar Blvd.',
      availingService: 'Electrical, HVAC',
      bookingDate: '2025-01-27',
      bookingTime: '03:00 PM',
      remarks: 'Fix the air conditioning unit.'
    },
    {
      customerName: 'Ethan Black',
      contactNumber: '+321 654 9876',
      customerEmail: 'ethan.black@example.com',
      customerAddress: '404 Elm St.',
      availingService: 'Carpentry, Plumbing',
      bookingDate: '2025-01-28',
      bookingTime: '04:00 PM',
      remarks: 'Repair the door frame and plumbing leaks.'
    },
    {
      customerName: 'John Doe',
      contactNumber: '+321 654 9870',
      customerEmail: 'john.doe@example.com',
      customerAddress: '123 Business St.',
      availingService: 'Cleaning, Laundry',
      bookingDate: '2025-01-22',
      bookingTime: '10:00 AM',
      remarks: 'Please bring necessary cleaning supplies.'
    },
  ];

  // This function will be called when the "See Booking" button is clicked
  showBookingDetails(booking: any) {
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

  ngOnInit(): void {

  }

}
