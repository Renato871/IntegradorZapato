import { Component } from '@angular/core';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  usuarios = [
    { usuario_id: 1, nombres: 'Juan Pérez', email: 'juan@example.com', id_rol: 2 },
    { usuario_id: 2, nombres: 'Ana Gómez', email: 'ana@example.com', id_rol: 2 }
  ];

  addUser() {
    // Lógica para añadir un usuario
  }

  editUser(id: number) {
    // Lógica para editar un usuario
  }

  deleteUser(id: number) {
    // Lógica para eliminar un usuario
  }
}
