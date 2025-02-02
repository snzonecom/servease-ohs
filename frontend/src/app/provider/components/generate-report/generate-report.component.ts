import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.css'
})
export class GenerateReportComponent implements OnInit {
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';

  // Dialog Variables
  ongoingDialogVisible: boolean = false;
  selectedBooking: any = {};

  // Booking Fields Configuration
  bookingFields = [
    { label: 'Customer Name', icon: 'pi pi-user', model: 'customerName', isTextarea: false },
    { label: 'Contact Number', icon: 'pi pi-phone', model: 'contactNumber', isTextarea: false },
    { label: 'Email Address', icon: 'pi pi-envelope', model: 'customerEmail', isTextarea: false },
    { label: 'Availing Service/s', icon: 'pi pi-wrench', model: 'availingService', isTextarea: false },
    { label: 'Booking Date', icon: 'pi pi-calendar', model: 'bookingDate', isTextarea: false },
    { label: 'Booking Time', icon: 'pi pi-clock', model: 'bookingTime', isTextarea: false },
    { label: 'Remarks', icon: 'pi pi-comment', model: 'remarks', isTextarea: true },
    { label: 'Price', icon: 'pi pi-wallet', model: 'bookingPrice', isTextarea: false },
  ];

  // Transactions Data
  transactions = [
    {
      transaction_id: 'TXN001',
      service_type: 'Plumbing',
      customer_name: 'John Doe',
      date_of_booking: new Date('2024-01-15'),
      status: 'Completed',
      customerPhoto: 'https://via.placeholder.com/150', // Sample Photo
      contact_number: '+1 234 567 890',
      email: 'johndoe@example.com',
      booking_time: '10:00 AM',
      remarks: 'Please bring all necessary tools.',
      price: '$150.00'
    },
    {
      transaction_id: 'TXN002',
      service_type: 'Electrical',
      customer_name: 'Jane Smith',
      date_of_booking: new Date('2024-01-20'),
      status: 'Pending',
      customerPhoto: '',
      contact_number: '+1 987 654 321',
      email: 'janesmith@example.com',
      booking_time: '2:00 PM',
      remarks: '',
      price: '$200.00'
    },
    {
      transaction_id: 'TXN003',
      service_type: 'Cleaning',
      customer_name: 'Alice Johnson',
      date_of_booking: new Date('2024-02-05'),
      status: 'Cancelled',
      customerPhoto: 'https://via.placeholder.com/150',
      contact_number: '+1 555 123 456',
      email: 'alicejohnson@example.com',
      booking_time: '9:00 AM',
      remarks: 'Reschedule requested.',
      price: '$100.00'
    }
  ];

  filteredTransactions = [...this.transactions];

  constructor() { }

  ngOnInit(): void { }

  // Filter Transactions Based on Search Query
  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      return (
        transaction.transaction_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.service_type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  // Generate Report Based on Date Range
  generateReport() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date_of_booking).getTime();
      const start = this.startDate ? new Date(this.startDate).getTime() : null;
      const end = this.endDate ? new Date(this.endDate).getTime() : null;

      return (
        (!start || transactionDate >= start) &&
        (!end || transactionDate <= end)
      );
    });
  }

  // Function to Open Dialog with Transaction Details
  viewTransaction(transaction: any): void {
    this.selectedBooking = {
      customerPhoto: transaction.customerPhoto || '',
      customerName: transaction.customer_name,
      contactNumber: transaction.contact_number,
      customerEmail: transaction.email,
      availingService: transaction.service_type,
      bookingDate: transaction.date_of_booking.toDateString(),
      bookingTime: transaction.booking_time,
      remarks: transaction.remarks || 'No remarks',
      bookingPrice: transaction.price || 'N/A'
    };
    this.ongoingDialogVisible = true;
  }
}