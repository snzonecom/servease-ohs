import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Replace with your Laravel API URL

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  registerProvider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-provider`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
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
