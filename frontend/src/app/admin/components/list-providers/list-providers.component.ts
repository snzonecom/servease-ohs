import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.css']  // Note: Use styleUrls, not styleUrl
})
export class ListProvidersComponent implements OnInit {
  searchQuery = '';
  visible: boolean = false;
  selectedProvider: any = null;

  allProviders: any[] = [];  // Declare an empty array to store fetched providers

  constructor(
    private http: HttpClient,  // Inject HttpClient service
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchProviders();  // Call the method to fetch provider data on component initialization
  }

  // Method to fetch provider data from API
  fetchProviders(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/providers';  // Replace with your actual API URL

    this.http.get<any[]>(apiUrl)  // Make the GET request
      .subscribe(data => {
        this.allProviders = data;  // Assign fetched data to allProviders array
        this.cdr.detectChanges();  // Trigger change detection
      }, error => {
        console.error('Error fetching providers', error);  // Handle error gracefully
      });
  }

  // Filter providers based on search query
  get filteredSuspendedAccounts() {
    return this.allProviders.filter(account =>
      account.provieder_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      account.contact_no.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      account.created_at.toLocaleDateString().includes(this.searchQuery)
    );
  }

  // Show dialog with provider details
  showDialog(applicant: any) {
    this.selectedProvider = applicant;
    this.visible = true;
    this.cdr.detectChanges();
  }
}
