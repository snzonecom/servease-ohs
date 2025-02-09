import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-services',
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.css']
})
export class ProviderServicesComponent implements OnInit {
  services: any[] = [];
  searchTerm: string = '';
  dialogVisible: boolean = false;
  isEditMode: boolean = false;
  selectedService: any = {};

  private apiUrl = 'http://127.0.0.1:8000/api/provider';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  // ✅ Get Token from localStorage
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Fetch services for the logged-in provider
  fetchServices(): void {
    const providerId = localStorage.getItem('provider_id');

    if (!providerId) {
      Swal.fire('Error!', 'Provider ID not found. Please log in again.', 'error');
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/${providerId}/services`, { headers: this.getAuthHeaders() }).subscribe(
      (data) => {
        this.services = data;

        // ✅ Check if the services are empty
        if (this.services.length === 0) {
          console.log('No services found for this provider.');
        }
      },
      (error) => {
        console.error('Error fetching services:', error);

        // ✅ Improved error handling
        Swal.fire('Error!', 'Failed to fetch services. Please try again later.', 'error');
      }
    );
  }


  filteredServices() {
    return this.services.filter(service =>
      service.service_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddDialog() {
    this.isEditMode = false;
    this.selectedService = { service_name: '', service_description: '', price_start: 0 };
    this.dialogVisible = true;
  }

  openEditDialog(service: any) {
    this.isEditMode = true;
    this.selectedService = { ...service };
    this.dialogVisible = true;
  }

  // ✅ Save Service (Add or Update)
  saveService() {
    const headers = this.getAuthHeaders();
    const providerId = localStorage.getItem('provider_id');

    if (!providerId) {
      this.dialogVisible = false;
      Swal.fire('Error!', 'Provider ID not found.', 'error');
      return;
    }

    this.selectedService.provider_id = providerId;

    if (this.isEditMode) {
      // ✅ Updated API endpoint for updating a service
      this.http.put(`${this.apiUrl}/${providerId}/services/${this.selectedService.service_id}`, this.selectedService, { headers }).subscribe(
        () => {
          this.dialogVisible = false;
          Swal.fire('Success!', 'Service updated successfully!', 'success');
          this.fetchServices();
        },
        (error) => {
          console.error(error);
          this.dialogVisible = false;
          Swal.fire('Error!', 'Failed to update service.', 'error');
        }
      );
    } else {
      // ✅ API for adding remains the same
      this.http.post(`${this.apiUrl}/${providerId}/services`, this.selectedService, { headers }).subscribe(
        () => {
          this.dialogVisible = false;
          Swal.fire('Success!', 'Service added successfully!', 'success');
          this.fetchServices();
        },
        (error) => {
          console.error(error);
          this.dialogVisible = false;
          Swal.fire('Error!', 'Failed to add service.', 'error');
        }
      );
    }
  }

  // ✅ Delete Service (with providerId in the URL)
  deleteService(serviceId: number) {
    const providerId = localStorage.getItem('provider_id');

    Swal.fire({
      title: 'Are you sure?',
      text: 'This service will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${providerId}/services/${serviceId}`, { headers: this.getAuthHeaders() }).subscribe(
          () => {
            Swal.fire('Deleted!', 'Service has been deleted.', 'success');

            // ✅ Refetch services after deletion (even if 0 remain)
            this.fetchServices();
          },
          (error) => {
            console.error(error);
            Swal.fire('Error!', 'Failed to delete service.', 'error');
          }
        );
      }
    });
  }



}
