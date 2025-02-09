import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deleted-providers',
  templateUrl: './deleted-providers.component.html',
  styleUrl: './deleted-providers.component.css'
})
export class DeletedProvidersComponent implements OnInit {
  deletedProviders: any[] = [];
  searchQuery: string = '';
  visible: boolean = false;
  selectedProvider: any = null;
  private apiUrl = 'http://127.0.0.1:8000/api/deleted-providers'; // ✅ Updated API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDeletedProviders();
  }

  // ✅ Fetch Soft-Deleted Providers
  fetchDeletedProviders() {
    this.http.get<any[]>(`${this.apiUrl}/`).subscribe(
      (data) => {
        console.log("✅ Deleted Providers API Response:", data); // 🔍 Debugging Log
        this.deletedProviders = data;
      },
      (error) => {
        console.error('❌ Error fetching deleted providers:', error);
        this.deletedProviders = []; // ✅ Prevent UI errors by setting an empty array
      }
    );
  }

  // ✅ Filter providers based on search query
  get filteredProviders() {
    return this.deletedProviders.filter(provider =>
      provider.provider_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // ✅ Show Provider Details
  showDialog(provider: any) {
    this.selectedProvider = provider;
    this.visible = true;
  }

  // ✅ Restore Soft-Deleted Provider
  restoreProvider(providerId: number) {
    this.http.post(`http://127.0.0.1:8000/api/providers/restore`, { id: providerId }).subscribe(
      () => {
        this.deletedProviders = this.deletedProviders.filter(p => p.provider_id !== providerId);
        this.visible = false;
        Swal.fire('Success!', 'Provider restored and set to pending.', 'success');
      },
      (error) => {
        Swal.fire('Error!', error?.error?.message || 'Failed to restore the provider.', 'error');
      }
    );
  }
  
}
