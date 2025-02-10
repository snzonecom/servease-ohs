import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements AfterViewInit, OnInit {
  services: any[] = []; // Dynamic services from the API

  logoUrl: string = '';
  aboutText: string = '';  // Stores About information
  faqs: any[] = [];        // Stores FAQ list
  contacts: string[] = []; // Stores Contact Information

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  recommendedProviders: any[] = [];

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchServiceCategories();
    this.fetchRecommendedProviders();
    this.loadSystemInfo();
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

  activeAccordion: number | null = null;

  toggleAccordion(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  fetchRecommendedProviders(): void {
    const token = localStorage.getItem('authToken');

    this.http.get('http://127.0.0.1:8000/api/recommended-providers', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data: any) => this.recommendedProviders = data,
      (error) => console.error('Error fetching recommended providers:', error)
    );
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

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.activatedRoute.snapshot.fragment;
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
