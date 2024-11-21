// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { CarroComponent } from './carro/carro.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ProductosComponent } from './productos/productos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CarroComponent,
    LoginComponent,
    RegistrarComponent,
    UsuarioComponent,
    ProductosComponent,
    NavbarComponent,
    FooterComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
