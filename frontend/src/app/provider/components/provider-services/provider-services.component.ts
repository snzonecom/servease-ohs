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

  private apiUrl = 'http://127.0.0.1:8000/api/provider/services';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  // ✅ Get Token from localStorage
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');  // Make sure you save the token on login
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Fetch services
  fetchServices() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe(
      (data) => this.services = data,
      (error) => console.error('Error fetching services', error)
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

    if (this.isEditMode) {
      this.http.put(`${this.apiUrl}/${this.selectedService.service_id}`, this.selectedService, { headers }).subscribe(
        () => {
          Swal.fire('Success!', 'Service updated successfully!', 'success');
          this.fetchServices();
          this.dialogVisible = false;
        },
        (error) => {
          console.error(error);
          Swal.fire('Error!', 'Failed to update service.', 'error');
        }
      );
    } else {
      this.http.post(this.apiUrl, this.selectedService, { headers }).subscribe(
        () => {
          Swal.fire('Success!', 'Service added successfully!', 'success');
          this.fetchServices();
          this.dialogVisible = false;
        },
        (error) => {
          console.error(error);
          Swal.fire('Error!', 'Failed to add service.', 'error');
        }
      );
    }
  }

  deleteService(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This service will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).subscribe(
          () => {
            Swal.fire('Deleted!', 'Service has been deleted.', 'success');
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
