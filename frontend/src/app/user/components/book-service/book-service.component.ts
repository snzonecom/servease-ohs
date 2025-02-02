import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css'
})
export class BookServiceComponent implements OnInit {
  provider: any = {};
  availableServices: any[] = [];
  displayedFeedbacks: any[] = [];
  showAllReviews = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('providerId');
    if (providerId) {
      this.fetchProviderDetails(providerId);
    }
    this.updateDisplayedFeedbacks();
  }

  // ✅ Fetch provider details
  fetchProviderDetails(providerId: string): void {
    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}`).subscribe(
      (data) => {
        this.provider = data;
        this.availableServices = data.services; // Assuming services are included in the response
      },
      (error) => {
        console.error('Error fetching provider details:', error);
      }
    );
  }

  toggleServiceSelection(service: any) {
    service.isSelected = !service.isSelected;
  }

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
    this.updateDisplayedFeedbacks();
  }

  private updateDisplayedFeedbacks() {
    if (this.showAllReviews) {
      this.displayedFeedbacks = this.provider.feedbacks || [];
    } else {
      this.displayedFeedbacks = (this.provider.feedbacks || []).slice(0, 3);
    }
  }

  // ✅ Booking Confirmation
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
        this.showSuccessAlert();
      }
    });
  }

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
