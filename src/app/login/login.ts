import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticaApi } from '../api/authenticate.api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApi = inject(AuthenticaApi);

  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      mail: this.form.value.email,
      password: this.form.value.password
    };

    this.authApi.authenticate(payload).subscribe({
      next: (res: any) => {
        const tk = res.token ?? res.jwttoken;
        console.log('TOKEN:', tk);
        localStorage.setItem('token', tk);
        this.router.navigate(['/app/chat']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Credenciales incorrectas');
      }
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}