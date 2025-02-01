import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-suspended-accounts',
  templateUrl: './suspended-accounts.component.html',
  styleUrl: './suspended-accounts.component.css'
})
export class SuspendedAccountsComponent implements OnInit {

  searchQuery = '';
  visible: boolean = false;
  selectedReport: any = null;

  allReports = [
    {
      reportId: 'R001',
      complaintFrom: 'John Doe',
      accountReporting: 'ABC Retailers',
      dateSubmitted: new Date('2025-01-15'),
      reportRegarding: 'Missing Item',
      reportDetails: 'The delivered package was missing one item that was listed in the order summary.',
      attachedProof: 'https://example.com/proof/missing-item-R001.jpg',
    },
    {
      reportId: 'R002',
      complaintFrom: 'Jane Smith',
      accountReporting: 'XYZ Electronics',
      dateSubmitted: new Date('2025-01-16'),
      reportRegarding: 'Damaged Product',
      reportDetails: 'The product received was damaged and is not in a usable condition.',
      attachedProof: 'https://example.com/proof/damaged-product-R002.jpg',
    },
    {
      reportId: 'R003',
      complaintFrom: 'Alice Brown',
      accountReporting: 'Global Delivery Services',
      dateSubmitted: new Date('2025-01-17'),
      reportRegarding: 'Late Delivery',
      reportDetails: 'The package was delivered three days later than the promised delivery date.',
      attachedProof: 'https://example.com/proof/late-delivery-R003.jpg',
    },
    {
      reportId: 'R004',
      complaintFrom: 'Bob Johnson',
      accountReporting: 'Fast Supplies Co.',
      dateSubmitted: new Date('2025-01-14'),
      reportRegarding: 'Wrong Item',
      reportDetails: 'The package contained a completely different item than what was ordered.',
      attachedProof: 'https://example.com/proof/wrong-item-R004.jpg',
    }
  ];

  get filteredSuspendedAccounts() {
    return this.allReports.filter(account =>
      account.accountReporting.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      account.reportRegarding.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      account.dateSubmitted.toLocaleDateString().includes(this.searchQuery)
    );
  }

  constructor(private cdr: ChangeDetectorRef) { }

  showDialog(applicant: any) { this.selectedReport = applicant; this.visible = true; this.cdr.detectChanges(); } // Manually trigger change detection }


  ngOnInit(): void {
    // Initialize any required data here
  }
}