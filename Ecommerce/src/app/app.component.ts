import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from "./footer/footer.component";
import { InicioComponent } from "./inicio/inicio.component";
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { ItemComponent } from './item/item.component';
import { CarroComponent } from './carro/carro.component';
import { Carro2Component } from './carro2/carro2.component';
import { Carro3Component } from './carro3/carro3.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, InicioComponent, ProductosComponent, LoginComponent, RegistrarComponent,ItemComponent, CarroComponent,Carro2Component, Carro3Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ecommerce';
}
