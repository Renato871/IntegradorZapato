// src/app/carro/carro.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css']
})
export class CarroComponent {
  cartItems: any[] = [];
  envio: number = 10.00; // Monto de envío fijo

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  increaseQuantity(item: any) {
    item.cantidad++;
    this.updateCart();
  }

  decreaseQuantity(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.updateCart();
    }
  }

  updateCart() {
    this.cartService.updateCart(this.cartItems);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.envio;
  }

  isPopupVisible = false;

  togglePopup(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.isPopupVisible = true;
    }
  }

  acceptDonation(): void {
    this.isPopupVisible = false;
    // Aquí puedes manejar cualquier lógica adicional si es necesario, como confirmar la selección
  }
}
