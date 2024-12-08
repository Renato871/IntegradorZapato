import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CarroComponent } from './carro/carro.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ConfigComponent } from './usuario/config/config.component';
import { DirComponent } from './usuario/dir/dir.component';
import { DPComponent } from './usuario/dp/dp.component';
import { MpComponent } from './usuario/mp/mp.component';
import { ProductosComponent } from './productos/productos.component';
import { ItemComponent } from './item/item.component';
export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'carro', component: CarroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'productos/:genero', component: ProductosComponent },
    { path: 'item/:id', component: ItemComponent },

        { 
      path: 'usuario',
      component: UsuarioComponent,
      children: [
        { path: '', component: DPComponent, outlet: 'secundario' },
        { path: 'config', component: ConfigComponent, outlet: 'secundario' },
        { path: 'dir', component: DirComponent, outlet: 'secundario' },
        { path: 'dp', component: DPComponent, outlet: 'secundario' },
        { path: 'mp', component: MpComponent, outlet: 'secundario' },
      ]
    },
    { path: '**', redirectTo: 'inicio' } // Redirección en caso de rutas no encontradas
  ];