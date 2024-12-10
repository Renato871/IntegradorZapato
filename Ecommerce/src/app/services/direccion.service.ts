// src/app/services/direccion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private apiUrl = 'http://localhost:3000'; // Asegúrate de que coincida con tu configuración

  constructor(private http: HttpClient) { }

  /**
   * Crea una nueva dirección en el backend.
   * @param direccion La dirección a crear.
   * @returns Un Observable con la respuesta del backend.
   */
  crearDireccion(direccion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/direccion`, direccion);
  }
}
