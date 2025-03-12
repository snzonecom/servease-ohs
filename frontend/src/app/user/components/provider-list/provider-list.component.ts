import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.css'
})
export class ProviderListComponent implements OnInit {
  registerDialogVisible: boolean = false;
  loginFirstVisible: boolean = false;
  providers: any[] = [];

  categoryName: string = '';
  categoryDescription: string = '';
  categoryId: number | null = null;
  filteredProviders: any[] = [];
  selectedFilter: string = '';
  searchQuery: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;
    this.fetchProvidersByCategory(this.categoryId);
  }

  // ✅ Fetch providers based on the selected category
  fetchProvidersByCategory(categoryId: number): void {
    this.http.get<any>(`http://127.0.0.1:8000/api/providers-by-category/${categoryId}`).subscribe(
      (data) => {
        this.categoryName = data.category_name; // ✅ Store category name
        this.categoryDescription = data.category_description; // ✅ Store category description
        this.providers = data.providers; // ✅ Store providers list
        this.filteredProviders = [...this.providers];
      },
      (error) => {
        console.error('Error fetching providers:', error);
      }
    );
  }

  filterProviders(): void {
    this.filteredProviders = this.providers.filter(provider =>
      provider.businessName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.sortProviders(); // Keep sorting after filtering
  }

  sortProviders(): void {
    if (this.selectedFilter === 'az') {
      this.filteredProviders.sort((a, b) => a.businessName.localeCompare(b.businessName));
    } else if (this.selectedFilter === 'za') {
      this.filteredProviders.sort((a, b) => b.businessName.localeCompare(a.businessName));
    } else if (this.selectedFilter === 'highestRating') {
      this.filteredProviders.sort((a, b) => b.rating - a.rating);
    } else if (this.selectedFilter === 'lowestRating') {
      this.filteredProviders.sort((a, b) => a.rating - b.rating);
    }
  }

  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  loginFirstDialog() {
    this.loginFirstVisible = true;
  }
}
