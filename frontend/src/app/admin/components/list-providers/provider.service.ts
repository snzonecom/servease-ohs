import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiUrl = 'http://127.0.0.1:8000/api/providers';  // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Fetch the providers from the API
  getProviders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
