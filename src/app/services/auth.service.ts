import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticaApi } from '../api/authenticate.api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(
    private api: AuthenticaApi,
    private router: Router
  ) {}


  login(data: { mail: string; password: string }): Observable<any> {
    return this.api.authenticate(data).pipe(
      tap(res => {
        const tk = res.token ?? res.jwttoken; 
        if (tk) {
          localStorage.setItem(this.TOKEN_KEY, tk);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.router.navigate(['/login']);
  }
}
