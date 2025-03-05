import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

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

  servicesMap: { [key: number]: string } = {}; // Maps service_id to service_name

  ngOnInit(): void {
    this.fetchTransactions();
    this.fetchServices();
  }

  fetchServices() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/services').subscribe(
      (services) => {
        services.forEach(service => {
          this.servicesMap[service.service_id] = service.service_name; // ✅ Map service_id to service_name
        });
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
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

  // ✅ Generate PDF Report
  generateReport() {
    if (!this.startDate || !this.endDate) {
      Swal.fire({
        title: "Missing Date",
        text: "Please select both Start Date and End Date to generate the report.",
        icon: "warning",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    const pdf = new jsPDF();

    // ✅ Title Formatting
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Service Provider Transaction Report', 105, 15, { align: 'center' });

    // ✅ Date Range Subheading
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Report Duration: ${this.startDate} to ${this.endDate}`, 105, 22, { align: 'center' });

    const filteredData = this.filteredTransactions.filter(transaction => {
      const bookingDate = new Date(transaction.book_date);
      return new Date(this.startDate) <= bookingDate && bookingDate <= new Date(this.endDate);
    });

    const tableData = filteredData.map((transaction, index) => {
      // ✅ Handle services as array or JSON string
      const serviceIds = typeof transaction.services === 'string'
        ? JSON.parse(transaction.services)
        : transaction.services;

      // ✅ Map service IDs to names using servicesMap
      const serviceNames = Array.isArray(serviceIds)
        ? serviceIds.map((id: number) => this.servicesMap[id] || `Service ID: ${id}`).join(', ')
        : 'N/A';

      return [
        index + 1,
        transaction.book_date,
        transaction.customer?.customer_name || 'N/A',
        serviceNames,
        transaction.book_status || 'N/A',
        transaction.price
          ? `${Number(transaction.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
          : '₱0.00'
      ];
    });

    // ✅ Improved Table Styling
    autoTable(pdf, {
      startY: 30,
      head: [['#', 'Booking Date', 'Customer Name', 'Availed Services', 'Status', 'Price']],
      body: tableData,
      styles: {
        fontSize: 10, // ✅ Smaller, readable font
        halign: 'center',
        cellPadding: 2
      },
      headStyles: {
        fillColor: [104, 184, 225],
        textColor: 255,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: 50
      },
      columnStyles: {
        0: { cellWidth: 10 },  // # (Index)
        1: { cellWidth: 30 },  // Booking Date
        2: { cellWidth: 45 },  // Customer Name
        3: { cellWidth: 50 },  // Availed Services
        4: { cellWidth: 25 },  // ✅ Booking Status
        5: { cellWidth: 25 }   // Price
      }
    });

    const finalY = pdf.lastAutoTable.finalY || 40; // Get last Y position of the table

    // ✅ Summary Section
    const totalBookings = filteredData.length;
    const totalPrice = filteredData.reduce((sum, transaction) => sum + (parseFloat(transaction.price) || 0), 0);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Summary`, 14, finalY + 10);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Bookings: ${totalBookings}`, 14, finalY + 18);
    pdf.text(`Total Price: ${totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, 14, finalY + 26);

    pdf.save(`Transaction_Report_${this.startDate}_to_${this.endDate}.pdf`);
  }






}