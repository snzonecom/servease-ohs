import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.css']
})
export class ListProvidersComponent implements OnInit {
  searchQuery = '';
  visible: boolean = false;
  selectedProvider: any = null;
  approvedProviders: any[] = [];
  serviceCategories: { category_id: number; category_name: string }[] = [];

  private providersApiUrl = 'http://127.0.0.1:8000/api/approved-providers';
  private categoriesApiUrl = 'http://127.0.0.1:8000/api/service-categories';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchServiceCategories();
  }

  // ✅ Fetch categories and then fetch providers
  fetchServiceCategories(): void {
    this.http.get<{ category_id: number; category_name: string }[]>(this.categoriesApiUrl).subscribe(
      (data) => {
        this.serviceCategories = data;
        this.fetchApprovedProviders(); // Fetch providers only after categories are loaded
      },
      (error) => {
        console.error('Error fetching service categories', error);
      }
    );
  }

  // ✅ Fetch approved providers and map category ID to category name
  fetchApprovedProviders(): void {
    this.http.get<any[]>(this.providersApiUrl).subscribe(
      (data) => {
        this.approvedProviders = data; // ✅ Directly use the data with service_type_name included
      },
      (error) => {
        console.error('Error fetching approved providers', error);
      }
    );
  }

  // ✅ Convert service_type ID to category name
  getCategoryName(categoryId: number): string {
    const category = this.serviceCategories.find(cat => cat.category_id === categoryId);
    return category ? category.category_name : 'Unknown';
  }

  // ✅ Search function
  get filteredProviders() {
    if (!this.searchQuery) {
      return this.approvedProviders;
    }

    const query = this.searchQuery.toLowerCase();
    return this.approvedProviders.filter(provider => {
      const providerName = provider.provider_name?.toLowerCase() || '';
      const contactNo = provider.contact_no?.toLowerCase() || '';
      const categoryName = provider.service_type_name?.toLowerCase() || '';
      const formattedDate = provider.created_at ? new Date(provider.created_at).toLocaleDateString() : '';

      return providerName.includes(query) || contactNo.includes(query) || categoryName.includes(query) || formattedDate.includes(query);
    });
  }

  // ✅ Show details modal
  showDialog(provider: any) {
    this.selectedProvider = provider;
    this.visible = true;
    this.cdr.detectChanges();
  }

  deleteProvider(providerId: number) {
    if (confirm('Are you sure you want to delete this provider?')) {
      this.http.delete(`http://127.0.0.1:8000/api/providers/${providerId}`).subscribe(
        () => {
          this.approvedProviders = this.approvedProviders.filter(p => p.provider_id !== providerId);
          this.visible = false;  // ✅ Close modal after deletion
          alert('Provider deleted successfully!');
        },
        (error) => {
          console.error('❌ Error deleting provider:', error);
        }
      );
    }
  }
  
}
