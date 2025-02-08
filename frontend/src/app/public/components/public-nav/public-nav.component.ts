import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.css']
})
export class PublicNavComponent implements OnInit {
  logoUrl: string = 'assets/img/servease-logo.png'; // Default logo
  registerDialogVisible: boolean = false;

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.loadSystemLogo();
  }

  // Function to fetch the logo from the API
  loadSystemLogo() {
    this.http.get<any>(this.apiUrl).subscribe((data) => {
      this.logoUrl = data.logo ?? 'assets/img/servease-logo.png'; // Use API logo or fallback
    }, error => {
      console.error('Error loading system logo:', error);
      this.logoUrl = 'assets/img/servease-logo.png'; // Use default if API fails
    });
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
