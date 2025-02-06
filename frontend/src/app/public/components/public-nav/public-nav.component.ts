import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrl: './public-nav.component.css'
})
export class PublicNavComponent {

  registerDialogVisible: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  // Function to show the dialog
  showRegisterDialog() {
    this.registerDialogVisible = true;
  }

  // Function to close the dialog
  closeRegisterDialog() {
    this.registerDialogVisible = false;
  }
  
}