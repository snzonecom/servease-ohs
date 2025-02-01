import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
  topProviders = [
    { rank: 1, name: 'Provider A', serviceCategory: 'Cleaning', acquiredBookings: 500 },
    { rank: 2, name: 'Provider B', serviceCategory: 'Plumbing', acquiredBookings: 350 },
    { rank: 3, name: 'Provider C', serviceCategory: 'Electrical Repairs', acquiredBookings: 270 },
    { rank: 4, name: 'Provider D', serviceCategory: 'Painting', acquiredBookings: 150 },
    { rank: 5, name: 'Provider E', serviceCategory: 'Landscaping', acquiredBookings: 450 },
    { rank: 6, name: 'Provider F', serviceCategory: 'Carpentry', acquiredBookings: 320 },
    { rank: 7, name: 'Provider G', serviceCategory: 'Pest Control', acquiredBookings: 200 },
    { rank: 8, name: 'Provider H', serviceCategory: 'Air Conditioning', acquiredBookings: 180 },
    { rank: 9, name: 'Provider I', serviceCategory: 'Housekeeping', acquiredBookings: 150 },
    { rank: 10, name: 'Provider J', serviceCategory: 'Plumbing', acquiredBookings: 130 },
  ];

  // Data for popular services chart
  popularServicesData: any;
  chartOptions: any;

  // New data for accumulated bookings
  accumulatedBookingsData: any;

  constructor() {
    // Populating the data for popular services chart
    this.popularServicesData = {
      labels: ['Cleaning', 'Plumbing', 'Electrical', 'Painting'], // Service categories
      datasets: [
        {
          label: 'Acquired Bookings',
          data: [500, 350, 270, 150], // Corresponding accumulated bookings for each service
          backgroundColor: '#66b9e1', // Bar color
          borderColor: '#005f7f',
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

    // Accumulated bookings data for the graph
    this.accumulatedBookingsData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        {
          label: 'Accumulated Bookings (per Week)',
          data: [150, 200, 300, 400, 450, 500], // Number of bookings in each week
          backgroundColor: '#66b9e1',
          borderColor: '#005f7f',
          borderWidth: 1
        }
      ]
    };
  }
}
