import { Component } from '@angular/core';
import Swal from 'sweetalert2';

interface Feedback {
  clientName: string;
  rating: number[];
  emptyStars: number[];
  reviewText: string;
}

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css'
})
export class BookServiceComponent {
  registerDialogVisible: boolean = false;
  showAllReviews = false;
  displayedFeedbacks: Feedback[] = [];

  feedbacks: Feedback[] = [
    {
      clientName: 'Client 1',
      rating: [1, 1, 1, 1], // Filled stars
      emptyStars: [1],
      reviewText: 'Excellent service, highly recommended! The provider was very professional and delivered exactly what was promised.'
    },
    {
      clientName: 'Client 2',
      rating: [1, 1, 1], // Filled stars
      emptyStars: [1, 1], // Empty stars
      reviewText: 'Good service but could improve response time. The team was helpful but a bit delayed in addressing some queries.'
    },
    {
      clientName: 'Client 3',
      rating: [1, 1, 1, 1], // Filled stars
      emptyStars: [0],
      reviewText: 'Very satisfied with the service provided. Would definitely come back for more services.'
    },
    {
      clientName: 'Client 4',
      rating: [1, 1, 1], // Filled stars
      emptyStars: [1, 1],
      reviewText: 'The service was average. The communication could have been better, but the quality was good.'
    },
  ];

  availableServices = [
    { name: 'Service 1', description: 'Description for Service 1', price: '$100', isSelected: false },
    { name: 'Service 2', description: 'Description for Service 2', price: '$150', isSelected: false },
    { name: 'Service 3', description: 'Description for Service 3', price: '$200', isSelected: false }
  ];

  toggleServiceSelection(service: any) {
    service.isSelected = !service.isSelected;
  }

  // Function to show the dialog
  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  ngOnInit() {
    this.updateDisplayedFeedbacks();
  }

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
    this.updateDisplayedFeedbacks();
  }

  private updateDisplayedFeedbacks() {
    if (this.showAllReviews) {
      this.displayedFeedbacks = this.feedbacks;
    } else {
      this.displayedFeedbacks = this.feedbacks.slice(0, 3); // Show only the first 3 feedbacks initially
    }
  }

  // Method to show confirmation dialog
  showConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      confirmButtonColor: '#2980b9',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user confirms, show success alert
        this.showSuccessAlert();
      }
    });
  }

  // Method to show success alert after confirmation
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

