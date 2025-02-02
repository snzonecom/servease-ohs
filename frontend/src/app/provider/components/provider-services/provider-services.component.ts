import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-services',
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.css']
})
export class ProviderServicesComponent {
  services = [
    { id: 1, name: 'Plumbing', description: 'Fix leaks and install pipes', startingPrice: 50 },
    { id: 2, name: 'Electrical Work', description: 'Fix electrical issues and installations', startingPrice: 75 }
  ];
  searchTerm: string = '';
  dialogVisible: boolean = false;
  editDialogVisible: boolean = false;
  selectedService: any = {};

  filteredServices() {
    return this.services.filter(service =>
      service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddDialog() {
    this.selectedService = { name: '', description: '', startingPrice: 0 };
    this.dialogVisible = true;
  }

  openEditDialog(service: any) {
    this.selectedService = { ...service };
    this.editDialogVisible = true;
  }

  saveService() {
    this.dialogVisible = false;
    this.editDialogVisible = false;
  }

  deleteService(id: number) {
    this.services = this.services.filter(service => service.id !== id);
  }
}