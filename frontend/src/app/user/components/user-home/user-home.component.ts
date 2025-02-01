import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements AfterViewInit {

  activeAccordion: number | null = null;

  toggleAccordion(index: number): void {
    // Toggle between open and closed for the clicked section
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    // Listen to router events to handle fragment-based scrolling
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // After navigation, check if there's a fragment
      const fragment = this.activatedRoute.snapshot.fragment;
      if (fragment) {
        // Scroll to the element with the given fragment
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  services = [
    { name: 'Cleaning', description: 'Professional cleaning services for your home and office.' },
    { name: 'Plumbing', description: 'Expert plumbers to handle all your plumbing needs.' },
    { name: 'Electrician', description: 'Licensed electricians for repairs and installations.' },
    { name: 'Gardening', description: 'Gardening services to keep your yard in top condition.' },
    { name: 'Pest Control', description: 'Get rid of pests quickly with reliable pest control experts.' },
  ];

  businesses = [
    {
      name: 'Sunshine Bakery',
      logo: 'https://placehold.co/600x600', // Replace with actual logo URLs
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

}
