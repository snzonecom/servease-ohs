import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  services: any[] = [];
  serviceCategories: any[] = [];
  displayDialog = false;
  displayEditDialog = false;
  editMode = false;
  searchTerm: string = '';

  newService = { category_id: null, service_name: '', service_description: '' };
  selectedService: any = { offered_service_id: null, category_id: null, service_name: '', service_description: '' };

  private serviceApiUrl = 'http://127.0.0.1:8000/api/offered-services';
  private categoryApiUrl = 'http://127.0.0.1:8000/api/service-category';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServices();
    this.fetchServiceCategories();
  }

  fetchServices(): void {
    this.http.get<any[]>(this.serviceApiUrl).subscribe(
      (data) => this.services = data,
      (error) => console.error('Error fetching services:', error)
    );
  }

  fetchServiceCategories(): void {
    this.http.get<any[]>(this.categoryApiUrl).subscribe(
      (data) => this.serviceCategories = data,
      (error) => console.error('Error fetching service categories:', error)
    );
  }

  openAddServiceDialog(): void {
    this.displayDialog = true;
    this.editMode = false;
    this.newService = { category_id: null, service_name: '', service_description: '' };
  }

  openEditServiceDialog(service: any): void {
    this.displayEditDialog = true;
    this.selectedService = { ...service }; // Load selected service data
  }

  saveService(): void {
    if (!this.newService.category_id || !this.newService.service_name) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    this.http.post(this.serviceApiUrl, this.newService).subscribe(
      () => {
        Swal.fire({
          title: "Success",
          text: "Service added successfully!",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
        this.displayDialog = false;
        this.fetchServices();
      },
      (error) => {
        console.error("Error response:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to add service.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      }
    );
  }

  updateService(): void {
    if (!this.selectedService.category_id || !this.selectedService.service_name) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    this.http.put(`${this.serviceApiUrl}/${this.selectedService.offered_service_id}`, this.selectedService).subscribe(
      () => {
        Swal.fire({
          title: "Success",
          text: "Service updated successfully!",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
        this.displayEditDialog = false;
        this.fetchServices();
      },
      (error) => {
        console.error("Error response:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update service.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      }
    );
  }

  deleteService(serviceId: number): void {
    this.displayEditDialog = false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#428eba',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.serviceApiUrl}/${serviceId}`).subscribe(
          () => {
            Swal.fire({
              title: "Deleted!",
              text: "Service has been deleted.",
              icon: "success",
              confirmButtonColor: "#428eba",
            });
            this.fetchServices();
          },
          (error) => {
            console.error("Error response:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to delete service.",
              icon: "error",
              confirmButtonColor: "#428eba",
            });
          }
        );
      }
    });
  }

  filteredServices(): any[] {
    if (!this.searchTerm) {
      return this.services;
    }
    return this.services.filter(service =>
      service.service_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
