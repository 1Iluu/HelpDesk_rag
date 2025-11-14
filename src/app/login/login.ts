import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
    private router = inject(Router);

  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
     this.router.navigate(['/app/chat']);
     /*
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Login payload', this.form.value);
   */
  }

  // helpers para template
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
