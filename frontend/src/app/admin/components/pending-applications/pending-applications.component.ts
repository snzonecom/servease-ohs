import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pending-applications',
  templateUrl: './pending-applications.component.html',
  styleUrls: ['./pending-applications.component.css']
})
export class PendingApplicationsComponent implements OnInit {
  searchQuery = '';
  visible: boolean = false;
  selectedApplicant: any = null;

  applicants = [
    { name: 'John Doe', category: 'Plumber', dateOfApplication: new Date('2025-01-01') },
    { name: 'Jane Smith', category: 'Electrician', dateOfApplication: new Date('2025-01-15') },
    { name: 'Tom Brown', category: 'Carpenter', dateOfApplication: new Date('2025-01-10') }
  ];

  // This filters applicants based on search query
  get filteredApplicants() {
    return this.applicants.filter(applicant =>
      applicant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      applicant.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      applicant.dateOfApplication.toLocaleDateString().includes(this.searchQuery)
    );
  }

  constructor(private cdr: ChangeDetectorRef) {}

  showDialog(applicant: any) { this.selectedApplicant = applicant; this.visible = true; this.cdr.detectChanges();} // Manually trigger change detection }

  ngOnInit(): void {}
}