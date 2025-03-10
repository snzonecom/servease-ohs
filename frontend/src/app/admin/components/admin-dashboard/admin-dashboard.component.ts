import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  providerCategoryData: any;

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
  chartDoughnutOptions: any;
  newApplications: any[] = [];

  startDate: string = ''; // Initialize it properly
  endDate: string = '';   // Initialize it properly

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchDashboardStats();
    this.fetchTopProviders();
    this.fetchPopularServices();
    this.fetchAccumulatedBookings();
    this.fetchNewApplications();
    this.fetchProviderCategories();

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
        console.log("🔥 Top Providers Data:", data); // ✅ Debug API response
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
          labels: data.map(service => service.service_name), // ✅ Use service names
          datasets: [
            {
              label: 'Total Bookings',
              data: data.map(service => service.total_bookings), // ✅ Number of bookings per service (top 5)
              backgroundColor: '#66b9e1', // Colors for bars
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

  fetchNewApplications() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/new-applications').subscribe(
      (data) => {
        this.newApplications = data;
      },
      (error) => {
        console.error('❌ Error fetching new applications:', error);
      }
    );
  }

  /**
   * ✅ Fetch Count of Approved Providers per Category
   */
  fetchProviderCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/approved-providers-per-category').subscribe(
      (data) => {
        this.providerCategoryData = {
          labels: data.map(category => category.category_name), // Category names
          datasets: [
            {
              data: data.map(category => category.total_providers), // Count per category
              backgroundColor: [
                '#67b9e1',
                '#91ccea',
                '#b8ddf0',
                '#dbf2ff'
              ],
              hoverBackgroundColor: [
                '#2196f3',
              ]
            }
          ]
        };

        this.chartDoughnutOptions = {
          responsive: true,
          maintainAspectRatio: false, // ✅ Allow custom sizing
          cutout: '60%', // Adjusts the size of the hole in the center
          plugins: {
            legend: {
              position: 'bottom', // Move legend below the chart
              labels: {
                color: '#333', // Legend text color
                font: {
                  size: 14 // Adjust legend font size
                }
              }
            }
          }
        };

      },
      (error) => {
        console.error('❌ Error fetching provider categories:', error);
      }
    );
  }


  /**
   * ✅ Redirect to Pending Applications Page
   */
  goToPendingApplications() {
    this.router.navigate(['/admin/pending-applications']); // ✅ Redirect to Pending Applications Page
  }

  generatePDFReport() {
    const url = `http://127.0.0.1:8000/api/generate-report-pdf?start_date=${this.startDate}&end_date=${this.endDate}`;

    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Service_Report_${this.startDate}_to_${this.endDate}.pdf`;
        link.click();
      },
      (error) => {
        console.error('❌ Error generating report:', error);
        alert('Failed to generate PDF. Check console for details.');
      }
    );
  }



}