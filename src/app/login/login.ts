import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

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
      mail: this.form.value.email || '',
      password: this.form.value.password || ''
    };

    this.authService.login(payload).subscribe({
      next: () => {
        // si el guard puso returnUrl, vuelves ahí; si no, vas a /app/chat
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/app/chat';
        this.router.navigateByUrl(returnUrl);
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
