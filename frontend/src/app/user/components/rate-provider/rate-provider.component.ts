import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-provider',
  templateUrl: './rate-provider.component.html',
  styleUrl: './rate-provider.component.css'
})
export class RateProviderComponent implements OnInit {

  selectedBooking: any = {};
  visible: boolean = false;
  rating: number = 0;

  bookings = [
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

  // Function to show booking details in the dialog
  showBookingDetails(booking: any): void {
    this.selectedBooking = booking; // Set the selected booking
    this.visible = true; // Open the dialog
  }

  // Set rating when a star is clicked
  setRating(star: number) {
    this.rating = star;
  }

  // Logic for submit rate
  rateSubmit() {
    console.log('Rate Accepted:', this.selectedBooking);
    this.visible = false;
  }

  ngOnInit(): void {

  }

}
