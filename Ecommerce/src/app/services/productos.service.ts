import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/productos'; // URL del backend
  private apiUrl2 = 'http://localhost:3000/item'; // URL del backend
  constructor(private http: HttpClient) { }

  // Método para obtener todos los productos
  getProductos(genero: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${genero}`);
  }

  // Método para obtener un producto específico por su ID
  getProductoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl2}/${id}`);
  }

  // Método para obtener productos filtrados por categoría
  getProductosByCategoria(categoria: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/categoria/${categoria}`);
  }

}
