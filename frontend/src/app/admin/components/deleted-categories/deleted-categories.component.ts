import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deleted-categories',
  templateUrl: './deleted-categories.component.html',
  styleUrl: './deleted-categories.component.css'
})
export class DeletedCategoriesComponent implements OnInit {
  deletedCategories: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDeletedCategories();
  }

  /**
   * ✅ Fetch Soft-Deleted Service Categories
   */
  fetchDeletedCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/service-categories/deleted').subscribe(
      (data) => {
        console.log("🔥 Deleted Categories:", data); // ✅ Debugging
        this.deletedCategories = data;
      },
      (error) => {
        console.error('❌ Error fetching deleted categories:', error);
      }
    );
  }

  /**
   * ✅ Restore a Soft-Deleted Category
   */
  restoreCategory(categoryId: number) {
    this.http.post(`http://127.0.0.1:8000/api/service-category/${categoryId}/restore`, {}).subscribe(
      () => {
        console.log(`✅ Category ${categoryId} restored successfully`);
        this.fetchDeletedCategories(); // Refresh list after restore
      },
      (error) => {
        console.error('❌ Error restoring category:', error);
      }
    );
  }

  /**
   * ✅ Permanently Delete a Category
   */
  permanentlyDeleteCategory(categoryId: number) {
    if (!confirm('Are you sure you want to permanently delete this category?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/service-category/${categoryId}/force-delete`).subscribe(
      () => {
        console.log(`✅ Category ${categoryId} permanently deleted`);
        this.fetchDeletedCategories(); // Refresh list after deletion
      },
      (error) => {
        console.error('❌ Error permanently deleting category:', error);
      }
    );
  }

    /**
   * ✅ Getter: Filtered Categories Based on Search Query
   */
    get filteredCategories() {
      return this.deletedCategories.filter(category =>
        category.category_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
}