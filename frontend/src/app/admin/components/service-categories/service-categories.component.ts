import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-categories',
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.css']
})
export class ServiceCategoriesComponent implements OnInit {

  addDialogVisible: boolean = false;
  editDialogVisible: boolean = false;
  searchQuery = '';

  allServiceCategory: any[] = [];
  selectedCategory: any = {};  // For editing
  newCategory = { category_name: '', category_description: '' };  // For adding

  private apiUrl = 'http://127.0.0.1:8000/api/service-category';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchServiceCategories();
  }

  fetchServiceCategories(): void {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(data => {
        this.allServiceCategory = data;
        this.cdr.detectChanges();
      }, error => {
        console.error('Error fetching categories', error);
      });
  }

  // Create a new Service Category
  addServiceCategory(): void {
    this.http.post(this.apiUrl, this.newCategory)
      .subscribe(response => {
        this.fetchServiceCategories();
        this.addDialogVisible = false;
        this.newCategory = { category_name: '', category_description: '' };
      }, error => {
        console.error('Error adding category', error);
      });
  }

  // Open edit dialog and set selected category
  showEditDialog(category: any) {
    this.selectedCategory = { ...category }; // Clone object
    this.editDialogVisible = true;
  }

  // Update Service Category
  updateServiceCategory(): void {
    const updateUrl = `${this.apiUrl}/${this.selectedCategory.category_id}`;
    this.http.put(updateUrl, this.selectedCategory)
      .subscribe(response => {
        this.fetchServiceCategories();
        this.editDialogVisible = false;
      }, error => {
        console.error('Error updating category', error);
      });
  }

  // Delete Service Category
  deleteServiceCategory(category_id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#428eba',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUrl = `${this.apiUrl}/${category_id}`;
        this.http.delete(deleteUrl)
          .subscribe(response => {
            this.fetchServiceCategories(); // Refresh list after deletion
            this.editDialogVisible = false; // Close edit dialog

            Swal.fire({
              title: 'Deleted!',
              text: 'The category has been deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#428eba'
            });
          }, error => {
            console.error('Error deleting category', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the category.',
              icon: 'error',
              confirmButtonColor: '#428eba'
            });
          });
      }
    });
  }

  get filteredServices() {
    return this.allServiceCategory.filter(category =>
      category.category_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      category.category_description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  showAddDialog() {
    this.addDialogVisible = true;
  }
}