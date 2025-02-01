import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-service-categories',
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.css']
})
export class ServiceCategoriesComponent implements OnInit {

  addDialogVisible: boolean = false;   // Controls the visibility of the Add dialog
  editDialogVisible: boolean = false;  // Controls the visibility of the Edit dialog
  searchQuery = '';

  allServiceCategory: any[] = [];  // Declare an empty array to store fetched providers

  constructor(
    private http: HttpClient,  // Inject HttpClient service
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchProviders();  // Call the method to fetch provider data on component initialization
  }

  // Method to fetch provider data from API
  fetchProviders(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/service-category';  // Replace with your actual API URL

    this.http.get<any[]>(apiUrl)  // Make the GET request
      .subscribe(data => {
        this.allServiceCategory = data;  // Assign fetched data to allProviders array
        this.cdr.detectChanges();  // Trigger change detection
      }, error => {
        console.error('Error fetching providers', error);  // Handle error gracefully
      });
  }

  // Getter for filtered services


  get filteredServices() {
    return this.allServiceCategory.filter(account =>
      account.category_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      account.category_description.toLocaleDateString().includes(this.searchQuery)
    );
  }

  // Function to handle "Add a New Category" button click
  showAddDialog() {
    this.addDialogVisible = true;
  }

  // Function to handle "Edit this Service Category" button click
  showEditDialog(service: any) {
    // You can pass the selected service and show the details in the dialog
    // For static content, you don't need to change this for now
    this.editDialogVisible = true;
  }


}
