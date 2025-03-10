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
        Swal.fire({
          title: "Success!",
          text: "Application approved.",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
        this.fetchPendingProviders(); // Refresh the list
        this.visible = false;
      },
      (error) => {
        // ✅ Error: Hide loading, show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to approve the application.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      },
      () => {
        this.isLoading = false; // ✅ Reset loading state
      }
    );
  }

  // ✅ Soft Delete (Reject Application)
  rejectApplication(providerId: number): void {
    if (!this.selectedRejectionReason) {
      Swal.fire({
        title: "Missing Reason!",
        text: "Please select a reason for rejection.",
        icon: "warning",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will reject the application and send an email notification.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#428eba',
      cancelButtonColor: '#d33',
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

        // ✅ Send rejection reason and additional note
        const rejectionData = {
          reject_type: this.selectedRejectionReason,
          reject_description: this.rejectionNote,
        };

        this.http.post(`${this.rejectUrl}/${providerId}/reject`, rejectionData).subscribe(
          () => {
            this.visible = false;
            Swal.fire({
              title: "Success!",
              text: "Application rejected, soft deleted, and email sent.",
              icon: "success",
              confirmButtonColor: "#428eba",
            });
            this.fetchPendingProviders(); // Refresh list
            this.rejectDialogVisible = false; // Close dialog
          },
          (error) => {
            this.visible = false;
            console.error('Rejection failed', error);
            Swal.fire({
              title: "Error!",
              text: error?.error?.message || "Failed to reject the application.",
              icon: "error",
              confirmButtonColor: "#428eba",
            });
          },
          () => {
            this.isRejecting = false; // ✅ Reset loading state
          }
        );
      }
    });
  }

  rejectDialogVisible: boolean = false;
  selectedRejectionReason: string = '';
  rejectionNote: string = '';
  rejectionReasons = [
    { label: 'Incomplete documents', value: 'Incomplete documents' },
    { label: 'Business details mismatch', value: 'Business details mismatch' },
    { label: 'Invalid credentials', value: 'Invalid credentials' },
  ];

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
