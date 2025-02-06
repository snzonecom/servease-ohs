import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  registerDialogVisible: boolean = false;
  loginFirstVisible: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  loginFirstDialog() {
    this.registerDialogVisible = true;
  }

  showRegisterDialog() {
    this.registerDialogVisible = true;
  }


  activeAccordion: number | null = null;

  toggleAccordion(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  services: any[] = []; // Dynamic services from API
  topProviders: any[] = []; // ✅ For Top Providers

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit(): void {
    this.fetchServiceCategories();
    this.fetchTopProviders(); // ✅ Fetch top providers
  }

  navigateTo(route: string): void {
    this.registerDialogVisible = false;  // Ensure the dialog is closed

    setTimeout(() => {
      // Remove any lingering scroll lock after dialog closes
      document.body.classList.remove('ui-overflow-hidden');

      // Navigate to the selected registration page
      this.router.navigate([route]);
    }, 100); // Slight delay ensures the dialog is fully closed before navigating
  }


  fetchServiceCategories(): void {
    this.http.get('http://127.0.0.1:8000/api/service-categories').subscribe(
      (data: any) => {
        this.services = data; // Assuming API returns an array of categories
      },
      (error) => {
        console.error('Error fetching service categories:', error);
      }
    );
  }

  // ✅ Fetch Top Providers
  fetchTopProviders(): void {
    this.http.get('http://127.0.0.1:8000/api/top-providers').subscribe(
      (data: any) => this.topProviders = data,
      (error) => console.error('Error fetching top providers:', error)
    );
  }
}
