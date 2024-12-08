import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.id_rol === 1) {
          this.router.navigate(['/admin']); // Redirige al perfil administrador
        } else if (user.id_rol === 2) {
          this.router.navigate(['/cliente']); // Redirige al perfil usuario
        }
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas. Intente nuevamente.';
      },
    });
  }
}