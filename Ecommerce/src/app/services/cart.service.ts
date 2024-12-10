// src/app/services/cart.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CartProductDisplay } from '../models/cart-product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  private apiUrl = 'http://localhost:3000'; // Asegúrate de que coincida con tu configuración

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los IDs de los productos en el carrito desde localStorage.
   */
  getCart(): number[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  /**
   * Agrega un producto al carrito.
   * @param productId El ID del producto a agregar.
   */
  addToCart(productId: number): void {
    const cart = this.getCart();
    cart.push(productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  /**
   * Remueve un producto del carrito.
   * @param productId El ID del producto a remover.
   */
  removeFromCart(productId: number): void {
    let cart = this.getCart();
    cart = cart.filter(id => id !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  /**
   * Remueve una sola ocurrencia de un producto del carrito.
   * @param productId El ID del producto a remover.
   */
  removeSingleFromCart(productId: number): void {
    const cart = this.getCart();
    const index = cart.indexOf(productId);
    if (index > -1) {
      cart.splice(index, 1);
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
    }
  }

  /**
   * Limpia todo el carrito.
   */
  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  /**
   * Actualiza el carrito con una lista nueva de IDs de productos.
   * @param cart La nueva lista de IDs de productos.
   */
  updateCart(cart: number[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  /**
   * Obtiene los productos en el carrito con sus cantidades.
   * @returns Un objeto que mapea cada ID de producto a su cantidad.
   */
  getCartWithQuantities(): { [key: number]: number } {
    const cart = this.getCart();
    return cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });
  }

  /**
   * Obtiene los detalles de los productos en el carrito desde el backend.
   * @returns Un Observable de un arreglo de productos con cantidad.
   */
  getCartItems(): Observable<CartProductDisplay[]> {
    const cart = this.getCart();
    if (cart.length === 0) {
      return of([]); // Retorna un observable de un arreglo vacío si el carrito está vacío
    }

    return this.http.post<CartProductDisplay[]>(`${this.apiUrl}/cart/items`, { productIds: cart });
  }
  checkout(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pedido`, pedido);
  }
}

