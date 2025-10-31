import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [],
})
export class Login {
  constructor(private router: Router) {}

  iniciarSesionTest() {
    console.log('Navegando a /chat...');

    this.router.navigate(['/chat']);
  }

}


