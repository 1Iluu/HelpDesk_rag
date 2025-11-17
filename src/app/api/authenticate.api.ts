import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticaApi {

  baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  authenticate(data: any) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, data);
  }
}
