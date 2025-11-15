import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDTO {
  id?: number;
  name: string;
  role: string | null;
  mail: string;
  password?: string;
  enabled: boolean;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementApi {

  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  // SSR-safe localStorage
  private getTokenSafe(): string {
    if (typeof window === 'undefined') return '';  
    return localStorage.getItem('token') ?? '';
  }

  private authHeaders() {
    const token = this.getTokenSafe();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl, this.authHeaders());
  }

  getUser(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(
      `${this.baseUrl}/${id}`,
      this.authHeaders()
    );
  }

  createUser(data: UserDTO): Observable<any> {
    return this.http.post(
      this.baseUrl,
      data,
      this.authHeaders()
    );
  }

  updateUser(data: UserDTO): Observable<any> {
    return this.http.put(
      this.baseUrl,
      data,
      this.authHeaders()
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.authHeaders()
    );
  }

  assignRole(id: number, role: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${id}/roles?rol=${role}`,
      {},
      this.authHeaders()
    );
  }
}