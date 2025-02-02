import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];   // Get the expected role from the route
    const userRole = this.authService.getRole();  // Get the logged-in user's role
    const isLoggedIn = this.authService.isLoggedIn();  // Check if user is logged in

    // Allow access if the user is logged in and has the correct role
    if (isLoggedIn && expectedRole === userRole) {
      return true;
    }

    // Redirect to login if not logged in
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Redirect to unauthorized page if the role doesn't match
    this.router.navigate(['/unauthorized']);
    return false;
  }
}