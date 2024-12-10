// src/app/carro2/carro2.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { DireccionService } from '../services/direccion.service'; // Importa el servicio de direcciones
import { CartProductDisplay } from '../models/cart-product.model';
import { Subscription } from 'rxjs';

interface PaymentMethod {
  metodo_id: number; // ID del método de pago
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  cardName?: string;
}

interface Address {
  direccion_id: number | null; // Puede ser number o null
  fullName: string;
  department: string;
  district: string;
  address: string;
  reference: string;
}

@Component({
  selector: 'app-carro2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carro2.component.html',
  styleUrls: ['./carro2.component.css']
})
export class Carro2Component implements OnInit, OnDestroy {
  // Estados para los popups
  isPopupVisible = false;
  isAddressPopupVisible = false;
  isPaymentPopupVisible = false;

  // Modelo para la dirección
  address: Address = {
    direccion_id: null,
    fullName: '',
    department: '',
    district: '',
    address: '',
    reference: ''
  };

  // Modelo para el método de pago
  payment: PaymentMethod = {
    metodo_id: 1, // Asigna el ID correspondiente según el método seleccionado
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardName: ''
  };

  paymentMethod: PaymentMethod | null = null; // Para mostrar los detalles del método de pago

  // Campo de correo electrónico para invitados
  guestEmail: string = '';

  // Estado de autenticación del usuario
  isUserLoggedIn: boolean = false; // Cambiar según la lógica de autenticación real

  // Listado de departamentos
  departments = [
    'Amazonas', 'Ancash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
    'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
    'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
    'Tumbes', 'Ucayali'
  ];

  // Mapeo de distritos por departamento
  districts: { [key: string]: string[] } = {
    'Amazonas': ['Bagua', 'Chachapoyas', 'Luya', 'Rodríguez de Mendoza', 'Utcubamba', 'Bongará', 'Condorcanqui'],
    'Ancash': ['Huaraz', 'Aija', 'Antonio Raymondi', 'Asunción', 'Bolognesi', 'Carhuaz', 'Carlos Fermín Fitzcarrald', 'Casma', 'Corongo', 'Huari', 'Huarmey', 'Huaylas', 'Mariscal Luzuriaga', 'Ocros', 'Pallasca', 'Pamparomás', 'Pomabamba', 'Recuay', 'Sihuas', 'Santa', 'Tayabamba', 'Yauli'],
    'Apurímac': ['Abancay', 'Andahuaylas', 'Antabamba', 'Aymaraes', 'Cotabambas', 'Chincheros'],
    'Arequipa': ['Arequipa', 'Camaná', 'Caravelí', 'Castilla', 'Caylloma', 'Condesuyos', 'Islay', 'La Unión'],
    'Ayacucho': ['Huamanga', 'Cangallo', 'Huanca Sancos', 'Huanta', 'La Mar', 'Lucanas', 'Parinacochas', 'Paucar del Sara Sara', 'Sucre', 'Víctor Fajardo'],
    'Cajamarca': ['Cajamarca', 'Cajabamba', 'Celendín', 'Chota', 'Contumazá', 'Cutervo', 'Hualgayoc', 'Jaén', 'San Marcos', 'San Miguel', 'San Pablo', 'Santa Cruz'],
    'Callao': ['Callao'],
    'Cusco': ['Cusco', 'Acomayo', 'Anta', 'Calca', 'Canas', 'Canchis', 'Chumbivilcas', 'Espinar', 'La Convención', 'Paruro', 'Paucartambo', 'Quispicanchi'],
    'Huancavelica': ['Huancavelica', 'Acobamba', 'Angaraes', 'Castrovirreyna', 'Churcampa', 'Huaytará', 'Tayacaja'],
    'Huánuco': ['Huánuco', 'Ambo', 'Dos de Mayo', 'Huacaybamba', 'Huamalíes', 'Leoncio Prado', 'Marañón', 'Pachitea', 'Puerto Inca', 'Lauricocha'],
    'Ica': ['Ica', 'Chincha', 'Nazca', 'Palpa', 'Pisco'],
    'Junín': ['Huancayo', 'Chancá', 'Chupaca', 'Concepción', 'Contumazá', 'Jauja', 'Junín', 'Mantaro', 'Tarma', 'Yauli'],
    'La Libertad': ['Trujillo', 'Ascope', 'Bolívar', 'Chepén', 'Julcán', 'Otuzco', 'Pacasmayo', 'Pataz', 'Sánchez Carrión', 'Santiago de Chuco', 'Gran Chimú', 'Virú'],
    'Lambayeque': ['Chiclayo', 'Ferreñafe', 'Lambayeque'],
    'Lima': [
      'Lima', 'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María',
      'La Molina', 'La Victoria', 'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana', 'Pueblo Libre',
      'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
      'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo',
      'Villa El Salvador', 'Villa María del Triunfo'
    ],
    'Loreto': ['Maynas', 'Alto Amazonas', 'Datem del Marañón', 'Loreto-Nauta', 'Mariscal Ramón Castilla', 'Requena', 'Ucayali', 'Putumayo'],
    'Madre de Dios': ['Manu', 'Tambopata'],
    'Moquegua': ['Mariscal Nieto', 'General Sánchez Cerro', 'Ilo'],
    'Pasco': ['Pasco', 'Daniel Alcides Carrión', 'Oxapampa', 'Pasco'],
    'Piura': ['Piura', 'Ayabaca', 'Huancabamba'],
    'Puno': ['Puno', 'Azángaro', 'Carabaya', 'Chucuito', 'El Collao', 'Huancané', 'Lampa', 'Melgar', 'Moho', 'San Antonio de Putina', 'San Román', 'Sandia', 'Sicuani', 'Yunguyo'],
    'San Martín': ['Tarapoto', 'Bellavista', 'El Dorado', 'Huallaga', 'Lamas', 'Mariscal Cáceres', 'Picota', 'Rioja', 'San Martín', 'Tocache'],
    'Tacna': ['Tacna', 'Candarave', 'Candarave', 'Jorge Basadre', 'Tarata'],
    'Tumbes': ['Tumbes', 'Contralmirante Villar', 'Zorritos'],
    'Ucayali': ['Coronel Portillo', 'Padre Abad', 'Atalaya', 'Purús']
  };

  availableDistricts: string[] = [];

  // Resumen del carrito y productos
  cartItems: CartProductDisplay[] = [];
  envio: number = 10.00; // Monto de envío fijo
  subtotal: number = 0.00; // Subtotal calculado
  total: number = 0.00; // Total calculado

  // Suscripción al monto de envío
  private envioSubscription!: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private direccionService: DireccionService // Inyecta el servicio de direcciones
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotal();

    // Suscribirse a los cambios en el monto de envío
    this.envioSubscription = this.cartService.envio$.subscribe(envio => {
      this.envio = envio;
      this.calculateTotal();
    });

    // Aquí puedes verificar el estado de autenticación real del usuario
    // Por ejemplo, mediante un servicio de autenticación
    // this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.envioSubscription) {
      this.envioSubscription.unsubscribe();
    }
  }

  /**
   * Alterna la visibilidad de los popups.
   * @param popup Tipo de popup ('warning', 'address', 'payment').
   * @param isVisible Booleano para mostrar u ocultar el popup.
   */
  togglePopupVisibility(popup: 'warning' | 'address' | 'payment', isVisible: boolean): void {
    if (popup === 'warning') {
      this.isPopupVisible = isVisible;
    } else if (popup === 'address') {
      this.isAddressPopupVisible = isVisible;
    } else if (popup === 'payment') {
      this.isPaymentPopupVisible = isVisible;
    }
  }

  /**
   * Acepta la advertencia y cierra el popup.
   */
  acceptWarning(): void {
    this.isPopupVisible = false;
    // Aquí puedes manejar cualquier lógica adicional si es necesario
  }

  /**
   * Maneja el cambio de departamento para actualizar los distritos disponibles.
   */
  onDepartmentChange(): void {
    if (this.address.department && this.districts[this.address.department]) {
      this.availableDistricts = this.districts[this.address.department];
      this.address.district = ''; // Resetea el distrito seleccionado
    } else {
      this.availableDistricts = [];
      this.address.district = '';
    }
  }

  /**
   * Guarda la dirección ingresada por el usuario.
   * @param form El formulario de dirección.
   */
  saveAddress(form: NgForm): void {
    if (this.isAddressValid()) {
      // Preparar los datos de la dirección para enviar al backend
      const direccionPayload = {
        usuario_id: this.isUserLoggedIn ? 1 : null, // Reemplaza '1' con el ID real del usuario si está autenticado
        fullName: this.address.fullName,
        department: this.address.department,
        district: this.address.district,
        address: this.address.address,
        reference: this.address.reference
      };

      // Enviar la dirección al backend para guardarla y obtener el direccion_id real
      this.direccionService.crearDireccion(direccionPayload).subscribe(
        (response) => {
          if (response && response.direccion_id) {
            this.address.direccion_id = response.direccion_id; // Asigna el ID real
            this.isAddressPopupVisible = false;
            console.log('Dirección guardada:', this.address);
          } else {
            console.error('Respuesta inválida del backend al guardar la dirección:', response);
            alert('Hubo un error al guardar la dirección. Por favor, inténtalo nuevamente.');
          }
        },
        (error) => {
          console.error('Error al guardar la dirección:', error);
          alert('Hubo un error al guardar la dirección. Por favor, inténtalo nuevamente.');
        }
      );
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
  }

  /**
   * Valida que todos los campos de la dirección estén completos.
   * @returns Booleano indicando si la dirección es válida.
   */
  isAddressValid(): boolean {
    return (
      this.address.fullName.trim() !== '' &&
      this.address.department.trim() !== '' &&
      this.address.district.trim() !== '' &&
      this.address.address.trim() !== '' &&
      this.address.reference.trim() !== ''
    );
  }

  /**
   * Guarda el método de pago ingresado por el usuario.
   * @param form El formulario de pago.
   */
  savePayment(form: NgForm): void {
    if (this.isPaymentValid()) {
      this.paymentMethod = { ...this.payment };
      this.isPaymentPopupVisible = false;
      console.log('Método de pago guardado:', this.paymentMethod);
      // Aquí puedes integrar con un servicio para manejar el método de pago
    } else {
      alert('Por favor, completa todos los campos obligatorios y válidos.');
    }
  }

  /**
   * Valida que todos los campos del método de pago estén completos y sean válidos.
   * @returns Booleano indicando si el método de pago es válido.
   */
  isPaymentValid(): boolean {
    const cardNumberValid = /^\d{16}$/.test(this.payment.cardNumber || '');
    const expirationDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(this.payment.expirationDate || '');
    const cvvValid = /^\d{3,4}$/.test(this.payment.cvv || '');
    const cardNameValid = (this.payment.cardName || '').trim() !== '';

    return cardNumberValid && expirationDateValid && cvvValid && cardNameValid;
  }

  /**
   * Carga los productos del carrito desde el servicio.
   */
  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (products: CartProductDisplay[]) => {
        // Asegura que cada producto tenga 'cantidad' asignada
        this.cartItems = products.map(item => ({
          ...item,
          cantidad: item.cantidad || 1, // Asigna 1 si 'cantidad' es undefined o 0
          precio: Number(item.precio) || 0 // Asegura que 'precio' es un número
        }));
        console.log('Productos cargados en el carrito:', this.cartItems);
        this.calculateTotal();
      },
      (error) => {
        console.error('Error al cargar los productos del carrito:', error);
      }
    );
  }

  /**
   * Calcula el subtotal y total del carrito.
   */
  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    this.total = this.subtotal + this.envio;
    console.log(`Subtotal: S/. ${this.subtotal}, Total: S/. ${this.total}`);
  }

  /**
   * Procesa la compra cuando el usuario hace clic en "Pagar".
   */
  procesarCompra(): void {
    // Verificar si la dirección ha sido guardada y direccion_id está disponible
    if (!this.address.direccion_id) {
      alert('Por favor, guarda una dirección antes de proceder con la compra.');
      return;
    }

    if (!this.isUserLoggedIn && this.guestEmail.trim() === '') {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (!this.isUserLoggedIn && !this.paymentMethod) {
      alert('Por favor, agrega un método de pago.');
      return;
    }

    if (!this.isUserLoggedIn && !this.isAddressValid()) {
      alert('Por favor, completa tu dirección.');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // Preparar los datos del pedido
    const pedido = {
      usuario_id: this.isUserLoggedIn ? 1 : null, // Reemplaza '1' con el ID real del usuario si está autenticado
      guest_email: this.isUserLoggedIn ? null : this.guestEmail,
      monto_total: this.total,
      metodo_id: this.paymentMethod ? this.paymentMethod.metodo_id : null, // Reemplaza según tu lógica de métodos de pago
      direccion_id: this.address.direccion_id, // Utiliza el direccion_id real
      productos: this.cartItems.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      }))
    };

    // Validar que metodo_id esté disponible
    if (!pedido.metodo_id) {
      alert('Método de pago inválido.');
      return;
    }

    // Enviar el pedido al backend
    this.cartService.checkout(pedido).subscribe(
      (response) => {
        console.log('Pedido procesado exitosamente:', response);
        // Limpiar el carrito después de la compra
        this.cartService.clearCart();
        // Resetear el monto de envío a S/.10.00
        this.cartService.setEnvio(10.00);
        // Redirigir a la página de confirmación
        this.router.navigate(['/confirmado']);
      },
      (error) => {
        console.error('Error al procesar el pedido:', error);
        if (error.error && error.error.error) {
          alert(`Hubo un error al procesar tu pedido: ${error.error.error}`);
        } else {
          alert('Hubo un error al procesar tu pedido. Por favor, inténtalo nuevamente.');
        }
      }
    );
  }

  /**
   * Habilita el botón de pagar si todas las condiciones se cumplen.
   */
  get canProceed(): boolean {
    if (this.isUserLoggedIn) {
      return this.paymentMethod !== null && this.isAddressValid() && this.cartItems.length > 0 && this.address.direccion_id !== null;
    } else {
      return this.guestEmail.trim() !== '' && this.paymentMethod !== null && this.isAddressValid() && this.cartItems.length > 0 && this.address.direccion_id !== null;
    }
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
}
