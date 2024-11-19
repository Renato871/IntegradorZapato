// src/app/services/cart.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';

  constructor() { }

  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: any) {
    let cart = this.getCart();
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].cantidad += 1; // Incrementar la cantidad si ya existe
    } else {
      product.cantidad = 1; // Agregar cantidad inicial si es nuevo
      cart.push(product);
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  removeFromCart(productId: number) {
    let cart = this.getCart();
    cart = cart.filter((product: any) => product.id !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
  }

  updateCart(cart: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
}
