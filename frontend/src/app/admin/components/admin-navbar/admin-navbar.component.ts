import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { adminLinks } from './admin-links';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(2turn)', offset: 1 })
        ]))
      ])
    ])
  ]
})

export class AdminNavbarComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = adminLinks;
  logoUrl: string = 'assets/img/servease-logo.png'; // Default logo

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
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

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  logout(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",  // Red color for confirmation
      cancelButtonColor: "#428eba",  // Blue color for cancel
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
            Swal.fire({
              title: "Logged Out",
              text: "You have successfully logged out.",
              icon: "success",
              confirmButtonColor: "#428eba",
            });
          },
          error: (err) => {
            console.error("Logout failed:", err);
            Swal.fire({
              title: "Logout Failed!",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonColor: "#e74c3c",
            });
          }
        });
      }
    });
  }
}