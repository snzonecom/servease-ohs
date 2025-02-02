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
  categoryId: number | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;
    this.fetchProvidersByCategory(this.categoryId);
  }

  // ✅ Fetch providers based on the selected category
  fetchProvidersByCategory(categoryId: number): void {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/providers-by-category/${categoryId}`).subscribe(
      (data) => {
        this.providers = data;
      },
      (error) => {
        console.error('Error fetching providers:', error);
      }
    );
  }

  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  loginFirstDialog() {
    this.loginFirstVisible = true;
  }
}
