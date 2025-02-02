import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Replace with your Laravel API URL

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  registerProvider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-provider`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.user.role);

        // ✅ Store provider_id if available
        if (response.provider_id) {
          localStorage.setItem('provider_id', response.provider_id);
        }
      })
    );
  }


  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  logout(): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`  // ✅ Send the auth token
      }
    }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');  // ✅ Clear tokens after successful logout
        localStorage.removeItem('userRole');
      })
    );
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  verifyEmail(data: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/verify/${data.id}/${data.hash}`);
  }
}
