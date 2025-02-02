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

  activeAccordion: number | null = null;
  services: any[] = []; // Dynamic services from the API

  businesses = [
    {
      name: 'Sunshine Bakery',
      logo: 'https://placehold.co/600x600',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, autem? Magnam sunt nulla in. Eius nulla exercitationem mollitia doloribus? Neque eos voluptatum, voluptatibus rem dicta natus atque quae vitae qui.',
    },
    {
      name: 'Ocean Spa',
      logo: 'https://placehold.co/600x600',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, autem? Magnam sunt nulla in. Eius nulla exercitationem mollitia doloribus? Neque eos voluptatum, voluptatibus rem dicta natus atque quae vitae qui.',
    },
    {
      name: 'TechWorld',
      logo: 'https://placehold.co/600x600',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, autem? Magnam sunt nulla in. Eius nulla exercitationem mollitia doloribus? Neque eos voluptatum, voluptatibus rem dicta natus atque quae vitae qui.',
    },
    {
      name: 'Fitness Pro Gym',
      logo: 'https://placehold.co/600x600',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, autem? Magnam sunt nulla in. Eius nulla exercitationem mollitia doloribus? Neque eos voluptatum, voluptatibus rem dicta natus atque quae vitae qui.',
    }
  ];

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchServiceCategories();
  }

  toggleAccordion(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
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
