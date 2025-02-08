import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  pendingCount: number = 0;
  ongoingCount: number = 0;
  completedCount: number = 0;

  todaysBookings: any[] = [];
  morningBookings: any[] = [];
  afternoonBookings: any[] = [];
  eveningBookings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const providerId = localStorage.getItem('provider_id');
    if (providerId) {
      this.fetchDashboardStats(providerId);
      this.fetchTodaysBookings(providerId);
    }
  }

  fetchDashboardStats(providerId: string) {
    this.http.get<any>(`http://127.0.0.1:8000/api/provider/${providerId}/dashboard-stats`)
      .subscribe(
        (response) => {
          this.pendingCount = response.pending;
          this.ongoingCount = response.ongoing;
          this.completedCount = response.completed;
        },
        (error) => {
          console.error('Error fetching dashboard stats:', error);
        }
      );
  }

  fetchTodaysBookings(providerId: string) {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/provider/${providerId}/todays-bookings`).subscribe(
      (bookings) => {
        this.todaysBookings = bookings;
        this.categorizeBookings();
      },
      (error) => {
        console.error('Error fetching today\'s bookings:', error);
      }
    );
  }

  categorizeBookings() {
    this.morningBookings = this.todaysBookings.filter(booking =>
      booking.book_time.includes('Morning')
    );

    this.afternoonBookings = this.todaysBookings.filter(booking =>
      booking.book_time.includes('Afternoon')
    );

    this.eveningBookings = this.todaysBookings.filter(booking =>
      booking.book_time.includes('Evening')
    );
  }

}