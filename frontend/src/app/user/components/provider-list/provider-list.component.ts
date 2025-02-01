import { Component } from '@angular/core';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.css'
})
export class ProviderListComponent {
  registerDialogVisible: boolean = false;
  loginFirstVisible: boolean = false;

  // Function to show the dialog
  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  loginFirstDialog() {
    this.registerDialogVisible = true;
  }

  providers = [
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 1',
      rating: 4.0,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    },
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 2',
      rating: 4.5,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    },
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 3',
      rating: 3.5,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    },
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 4',
      rating: 5.0,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    },
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 5',
      rating: 4.5,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    },
    {
      logo: 'https://placehold.co/600x600',
      businessName: 'Business 6',
      rating: 3.0,
      location: 'City, Province',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nulla sit amet odio posuere fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer egestas, ligula nec faucibus interdum.'
    }
  ];

}
