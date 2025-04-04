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
  offeredServices: any[] = [];

  private apiUrl = 'http://127.0.0.1:8000/api/provider';
  private offeredUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServices();
    this.fetchOfferedServices();
    this.fetchOfferedServicesByProvider();
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
      Swal.fire({
        title: "Error!",
        text: "Provider ID not found. Please log in again.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
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
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch services. Please try again later.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
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
    this.selectedService = { service_name: '', service_description: '' };
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
      Swal.fire({
        title: "Error!",
        text: "Provider ID not found.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    this.selectedService.provider_id = providerId;

    if (this.isEditMode) {
      // ✅ Updated API endpoint for updating a service
      this.http.put(`${this.apiUrl}/${providerId}/services/${this.selectedService.service_id}`, this.selectedService, { headers }).subscribe(
        () => {
          this.dialogVisible = false;
          Swal.fire({
            title: 'Success!',
            text: 'Service updated successfully!',
            icon: 'success',
            confirmButtonColor: '#428eba', // ✅ Custom blue button color
            confirmButtonText: 'OK'
          });
          this.fetchServices();
        },
        (error) => {
          console.error(error);
          this.dialogVisible = false;
          Swal.fire({
            title: "Error!",
            text: "Failed to update service.",
            icon: "error",
            confirmButtonColor: "#428eba",
          });
        }
      );
    } else {
      // ✅ API for adding remains the same
      this.http.post(`${this.apiUrl}/${providerId}/services`, this.selectedService, { headers }).subscribe(
        () => {
          this.dialogVisible = false;
          Swal.fire({
            title: 'Success!',
            text: 'Service added successfully!',
            icon: 'success',
            confirmButtonColor: '#428eba', // ✅ Custom blue button color
            confirmButtonText: 'OK'
          });

          this.fetchServices();
        },
        (error) => {
          console.error(error);
          this.dialogVisible = false;
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add service.',
            icon: 'error',
            confirmButtonColor: '#428eba', // ✅ Custom blue button color
            confirmButtonText: 'OK'
          });

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
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#428eba',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${providerId}/services/${serviceId}`, { headers: this.getAuthHeaders() }).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Service has been deleted.',
              icon: 'success',
              confirmButtonColor: '#428eba', // ✅ Custom blue button color
              confirmButtonText: 'OK'
            });

            // ✅ Refetch services after deletion (even if 0 remain)
            this.fetchServices();
          },
          (error) => {
            console.error(error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete service.",
              icon: "error",
              confirmButtonColor: "#428eba",
            });
          }
        );
      }
    });
  }

  fetchOfferedServices(): void {
    this.http.get<any[]>(`${this.offeredUrl}/offered-services`).subscribe(
      (data) => {
        console.log("Retrieved Offered Services:", data);
        this.offeredServices = data;
      },
      (error) => {
        console.error('Error fetching offered services:', error);
        Swal.fire("Error!", "Failed to fetch offered services.", "error");
      }
    );
  }

  onServiceSelect(event: Event): void {
    const selectedServiceId = Number((event.target as HTMLSelectElement).value);
    this.selectedService = this.offeredServices.find(service => service.offered_service_id === selectedServiceId) || {};
    console.log("Selected Service:", this.selectedService); // ✅ Debugging line
  }

  fetchOfferedServicesByProvider(): void {
    const providerId = localStorage.getItem('provider_id');

    if (!providerId) {
      Swal.fire({
        title: "Error!",
        text: "Provider ID not found. Please log in again.",
        icon: "error",
        confirmButtonColor: "#428eba",
      });
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/${providerId}/offered-services`, { headers: this.getAuthHeaders() }).subscribe(
      (data) => {
        console.log("Filtered Offered Services:", data);
        this.offeredServices = data;
      },
      (error) => {
        console.error('Error fetching offered services:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch offered services. Please try again later.",
          icon: "error",
          confirmButtonColor: "#428eba",
        });
      }
    );
  }
}
