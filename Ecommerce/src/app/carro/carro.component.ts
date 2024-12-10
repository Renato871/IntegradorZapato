// src/app/carro/carro.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartProduct, CartProductDisplay } from '../models/cart-product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css']
})
export class CarroComponent implements OnInit {
  cartItems: CartProductDisplay[] = [];
  envio: number = 10.00; // Monto de envío fijo
  isLoading: boolean = true; // Indicador de carga

  isPopupVisible = false;
  termsAccepted: boolean = false; // Nueva propiedad

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  /**
   * Carga los detalles de los productos en el carrito desde el backend.
   */
  
  loadCartItems(): void {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe(
      (products: CartProduct[]) => {
        const cartWithQuantities = this.cartService.getCartWithQuantities();
        this.cartItems = products.map(product => ({
          ...product,
          cantidad: cartWithQuantities[product.producto_id] || 1
        }));
        this.isLoading = false;
        console.log('los cart'+ this.cartItems);
      },
      (error) => {
        console.error('Error al cargar los productos del carrito:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Remueve un producto del carrito.
   * @param productId El ID del producto a remover.
   */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCartItems();
  }

  /**
   * Limpia todo el carrito.
   */
  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  /**
   * Incrementa la cantidad de un producto en el carrito.
   * @param item El producto a incrementar.
   */
  increaseQuantity(item: CartProductDisplay): void {
    this.cartService.addToCart(item.producto_id);
    item.cantidad++;
  }

  /**
   * Decrementa la cantidad de un producto en el carrito.
   * @param item El producto a decrementar.
   */
  // src/app/carro/carro.component.ts

// src/app/carro/carro.component.ts

decreaseQuantity(item: any): void {
  if (item.cantidad > 1) {
    this.cartService.removeSingleFromCart(item.producto_id);
    item.cantidad--;
  }
}


  /**
   * Remueve una sola ocurrencia de un producto del carrito.
   * @param productId El ID del producto a remover.
   */
  private removeSingleItem(productId: number): void {
    const cart = this.cartService.getCart();
    const index = cart.indexOf(productId);
    if (index > -1) {
      cart.splice(index, 1);
      this.cartService.updateCart(cart);
    }
  }

  /**
   * Calcula el subtotal del carrito.
   * @returns El subtotal.
   */
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  /**
   * Calcula el total del carrito incluyendo el envío.
   * @returns El total.
   */
  getTotal(): number {
    return this.getSubtotal() + this.envio;
  }

  /**
   * Alterna la visibilidad del popup de donación.
   * @param event El evento de cambio del checkbox.
   */
  togglePopup(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.isPopupVisible = true;
    }
  }

  /**
   * Acepta la donación y cierra el popup.
   */
  acceptDonation(): void {
    this.isPopupVisible = false;
    // Aquí puedes manejar cualquier lógica adicional si es necesario, como confirmar la selección
  }
  continuarCompra(): void {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (!this.termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    // Aquí se puede redirigir al usuario a la página de checkout
    this.router.navigate(['/checkout']);
  }
}


