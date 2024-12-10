// src/app/carro/carro.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartProductDisplay } from '../models/cart-product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css']
})
export class CarroComponent implements OnInit, OnDestroy {
  cartItems: CartProductDisplay[] = [];
  envio: number = 10.00; // Monto de envío fijo
  isLoading: boolean = true; // Indicador de carga

  isPopupVisible = false;
  termsAccepted: boolean = false; // Nueva propiedad

  // Usar definite assignment assertion '!'
  private envioSubscription!: Subscription;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();

    // Suscribirse a los cambios en el monto de envío
    this.envioSubscription = this.cartService.envio$.subscribe(envio => {
      this.envio = envio;
      this.calculateTotal();
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.envioSubscription) {
      this.envioSubscription.unsubscribe();
    }
  }

  /**
   * Carga los detalles de los productos en el carrito desde el backend.
   */
  loadCartItems(): void {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe(
      (products: CartProductDisplay[]) => {
        const cartWithQuantities = this.cartService.getCartWithQuantities();
        this.cartItems = products.map(product => ({
          ...product,
          cantidad: cartWithQuantities[product.producto_id] || 1
        }));
        this.isLoading = false;
        console.log('Carrito:', this.cartItems);
        this.calculateTotal();
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
    this.calculateTotal();
  }

  /**
   * Incrementa la cantidad de un producto en el carrito.
   * @param item El producto a incrementar.
   */
  increaseQuantity(item: CartProductDisplay): void {
    this.cartService.addToCart(item.producto_id);
    item.cantidad++;
    this.calculateTotal();
  }

  /**
   * Decrementa la cantidad de un producto en el carrito.
   * @param item El producto a decrementar.
   */
  decreaseQuantity(item: any): void {
    if (item.cantidad > 1) {
      this.cartService.removeSingleFromCart(item.producto_id);
      item.cantidad--;
      this.calculateTotal();
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
    } else {
      // Si se desmarca la donación, volver a cobrar el envío
      this.cartService.setEnvio(10.00);
    }
  }

  /**
   * Acepta la donación y cierra el popup.
   */
  acceptDonation(): void {
    this.isPopupVisible = false;
    // Al aceptar la donación, el envío es gratuito
    this.cartService.setEnvio(0.00);
  }

  /**
   * Redirige al usuario a la página de checkout.
   */
  continuarCompra(): void {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (!this.termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    // Redirigir al usuario a la página de checkout
    this.router.navigate(['/checkout']);
  }

  /**
   * Calcula el subtotal y total del carrito.
   */
  calculateTotal(): void {
    // Ya se recalculan automáticamente a través de los getters
    // Esta función puede ser usada si se requiere lógica adicional
    // Actualmente, solo se llama para actualizar el estado después de cambios
  }
}
