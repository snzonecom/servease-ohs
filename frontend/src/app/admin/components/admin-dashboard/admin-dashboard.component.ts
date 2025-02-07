import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  dashboardStats = {
    pending_providers: 0,
    registered_providers: 0,
    service_categories: 0,
    registered_users: 0
  };

  topProviders: any[] = [];
  popularServicesData: any = {}; // ✅ Ensure it's initialized
  accumulatedBookingsData: any = {}; // ✅ Ensure it's initialized
  chartOptions: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardStats();
    this.fetchTopProviders();
    this.fetchPopularServices();
    this.fetchAccumulatedBookings();

    // ✅ Initialize Chart Options (Fix issue where chart does not render)
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { enabled: true }
      },
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true }
      }
    };
  }

  /**
   * ✅ Fetch Dashboard Stats
   */
  fetchDashboardStats() {
    this.http.get<any>('http://127.0.0.1:8000/api/admin/dashboard-stats').subscribe(
      (data) => {
        this.dashboardStats = data;
      },
      (error) => {
        console.error('❌ Error fetching dashboard stats:', error);
      }
    );
  }

  /**
   * ✅ Fetch Top Providers
   */
  fetchTopProviders() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/top-providers').subscribe(
      (data) => {
        this.topProviders = data;
      },
      (error) => {
        console.error('❌ Error fetching top providers:', error);
      }
    );
  }

  /**
   * ✅ Fetch Popular Services for Chart
   */
  fetchPopularServices() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/popular-services').subscribe(
      (data) => {
        this.popularServicesData = {
          labels: data.map(service => service.service_name), // ✅ Extract service names
          datasets: [
            {
              label: 'Acquired Bookings',
              data: data.map(service => service.total_bookings), // ✅ Extract total bookings
              backgroundColor: ['#66b9e1', '#ffa726', '#ff7043', '#42a5f5'], // Colors for bars
              borderColor: '#005f7f',
              borderWidth: 1
            }
          ]
        };
      },
      (error) => {
        console.error('❌ Error fetching popular services:', error);
      }
    );
  }

  /**
   * ✅ Fetch Accumulated Bookings for Chart
   */
  fetchAccumulatedBookings() {
    this.http.get<any>('http://127.0.0.1:8000/api/admin/accumulated-bookings').subscribe(
      (data) => {
        this.accumulatedBookingsData = {
          labels: data.weeks,
          datasets: [
            {
              label: 'Accumulated Bookings (per Week)',
              data: data.accumulatedBookings,
              backgroundColor: '#66b9e1',
              borderColor: '#005f7f',
              borderWidth: 1
            }
          ]
        };
      },
      (error) => {
        console.error('❌ Error fetching accumulated bookings:', error);
      }
    );
  }
}