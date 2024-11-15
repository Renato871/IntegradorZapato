import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.css'
})
export class CarroComponent {
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
