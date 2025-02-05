import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.css'
})
export class GenerateReportComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  selectedBooking: any = {};

  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';
  ongoingDialogVisible: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  // ✅ Fetch all bookings for the service provider
  fetchTransactions() {
    const token = localStorage.getItem('authToken');
    const providerId = localStorage.getItem('provider_id');

    this.http.get<any[]>(`http://127.0.0.1:8000/api/provider/${providerId}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        this.transactions = response;
        this.filteredTransactions = response;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const searchQuery = this.searchQuery?.toLowerCase() || '';

      // ✅ Fields to search: Customer Name, Booking Date, and Services
      const customerName = transaction.customer?.customer_name?.toLowerCase() || '';
      const bookingDate = transaction.book_date ? new Date(transaction.book_date).toISOString().split('T')[0] : '';
      const serviceNames = transaction.service_details
        ?.map((service: { service_name: string; }) => service.service_name.toLowerCase())
        .join(', ') || '';

      // ✅ Search Matching Logic
      const matchesSearch =
        searchQuery === '' ||
        customerName.includes(searchQuery) ||
        bookingDate.includes(searchQuery) ||
        serviceNames.includes(searchQuery);

      // ✅ Date Filters
      const bookingDateObj = new Date(transaction.book_date);
      const startDateValid = this.startDate ? new Date(this.startDate) <= bookingDateObj : true;
      const endDateValid = this.endDate ? bookingDateObj <= new Date(this.endDate) : true;

      return matchesSearch && startDateValid && endDateValid;
    });

    console.log('📊 Filtered Transactions:', this.filteredTransactions); // ✅ Logs the filtered results
  }





  // ✅ View Transaction Details
  viewTransaction(transaction: any) {
    this.selectedBooking = {
      ...transaction,
      customer: transaction.customer || { customer_name: 'N/A', contact_no: 'N/A', profile_photo: '' },
      user: transaction.user || { email: 'N/A' },
      service_details: transaction.service_details || [],
      price: transaction.price || 'N/A'
    };

    this.ongoingDialogVisible = true;
  }

  getServiceNames(services: any[]): string {
    if (!services || !Array.isArray(services)) {
      return 'N/A';  // ✅ Return 'N/A' if services are undefined or not an array
    }
    return services.map(service => service.service_name).join(', ') || 'N/A';
  }


}