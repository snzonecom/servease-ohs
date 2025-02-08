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

  logoUrl: string = '';
  aboutText: string = '';  // Stores About information
  faqs: any[] = [];        // Stores FAQ list
  contacts: string[] = []; // Stores Contact Information

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  loginFirstDialog() {
    this.registerDialogVisible = true;
  }

  showRegisterDialog() {
    this.registerDialogVisible = true;
  }


  activeAccordion: number | null = null;

  // Toggle FAQ accordion items
  toggleAccordion(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
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
    this.loadSystemInfo();
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

  // Fetch system information from the backend
  loadSystemInfo() {
    this.http.get<any>(this.apiUrl).subscribe((data) => {
      this.logoUrl = data.logo ?? 'assets/img/servease-logo.png'; // Use API logo or fallback
      this.aboutText = data.about_text ?? 'No About Information Available';
      this.faqs = data.faqs ?? [];
      this.contacts = Array.isArray(data.contacts) ? data.contacts : [];
    }, error => {
      console.error('Error loading system info:', error);
      this.logoUrl = 'assets/img/servease-logo.png'; // Use default if API fails
    });
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
