import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-applications',
  templateUrl: './pending-applications.component.html',
  styleUrls: ['./pending-applications.component.css']
})
export class PendingApplicationsComponent implements OnInit {
  searchQuery = '';
  visible: boolean = false;
  selectedApplicant: any = null;
  applicants: any[] = [];

  isLoading: boolean = false;
  isRejecting: boolean = false;

  private apiUrl = 'http://127.0.0.1:8000/api/pending-providers';
  private approveUrl = 'http://127.0.0.1:8000/api/providers';
  private rejectUrl = 'http://127.0.0.1:8000/api/providers';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPendingProviders();
  }

  // ✅ Fetch Pending Service Providers
  fetchPendingProviders(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.applicants = data;
      },
      (error) => {
        console.error('Error fetching pending providers', error);
      }
    );
  }

  // ✅ Approve Application
  approveApplication(providerId: number): void {
    // ✅ Show loading spinner
    this.isLoading = true;

    Swal.fire({
      title: 'Approving...',
      text: 'Please wait while we process the approval.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // ✅ Show SweetAlert2 loading
      }
    });

    this.http.post(`${this.approveUrl}/${providerId}/approve`, {}).subscribe(
      () => {
        // ✅ Success: Hide loading, show success message
        Swal.fire('Success!', 'Application approved.', 'success');
        this.fetchPendingProviders(); // Refresh the list
        this.visible = false;
      },
      (error) => {
        // ✅ Error: Hide loading, show error message
        Swal.fire('Error!', 'Failed to approve the application.', 'error');
      },
      () => {
        this.isLoading = false; // ✅ Reset loading state
      }
    );
  }

  // ✅ Soft Delete (Reject Application)
  rejectApplication(providerId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will reject the application and send an email notification.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Reject'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRejecting = true; // ✅ Start loading state
  
        Swal.fire({
          title: 'Rejecting...',
          text: 'Please wait while we process the rejection.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // ✅ Show SweetAlert2 loading
          }
        });
  
        // ✅ Use POST instead of DELETE
        this.http.post(`${this.rejectUrl}/${providerId}/reject`, {}).subscribe(
          () => {
            Swal.fire('Success!', 'Application rejected, soft deleted, and email sent.', 'success');
            this.fetchPendingProviders(); // Refresh list
            this.visible = false;
          },
          (error) => {
            console.error('Rejection failed', error);
            Swal.fire('Error!', error?.error?.message || 'Failed to reject the application.', 'error');
          },
          () => {
            this.isRejecting = false; // ✅ Reset loading state
          }
        );
      }
    });
  }
  
  

  // ✅ Open Application Details Dialog
  showDialog(applicant: any): void {
    this.selectedApplicant = applicant;
    this.visible = true;
  }

  // ✅ Filter Pending Applications
  get filteredApplicants() {
    return this.applicants.filter(applicant =>
      applicant.provider_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      applicant.service_type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      applicant.created_at.includes(this.searchQuery)
    );
  }
}
