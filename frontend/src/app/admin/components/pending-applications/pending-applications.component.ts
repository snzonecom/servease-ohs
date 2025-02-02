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

  private apiUrl = 'http://127.0.0.1:8000/api/pending-providers';
  private approveUrl = 'http://127.0.0.1:8000/api/providers';
  private rejectUrl = 'http://127.0.0.1:8000/api/providers';

  constructor(private http: HttpClient) {}

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
    this.http.post(`${this.approveUrl}/${providerId}/approve`, {}).subscribe(
      () => {
        Swal.fire('Success!', 'Application approved.', 'success');
        this.fetchPendingProviders();
        this.visible = false;
      },
      (error) => {
        Swal.fire('Error!', 'Failed to approve the application.', 'error');
      }
    );
  }

  // ✅ Reject Application
  rejectApplication(providerId: number): void {
    this.http.post(`${this.rejectUrl}/${providerId}/reject`, {}).subscribe(
      () => {
        Swal.fire('Success!', 'Application rejected.', 'success');
        this.fetchPendingProviders();
        this.visible = false;
      },
      (error) => {
        Swal.fire('Error!', 'Failed to reject the application.', 'error');
      }
    );
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
