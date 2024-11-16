import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CarroComponent } from './carro/carro.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ProductosComponent } from './productos/productos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'carro', component: CarroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'productos', component: ProductosComponent },
  { path: '**', redirectTo: 'inicio' } // Redirecciona a la página de inicio para rutas no encontradas
];
