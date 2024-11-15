import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Address {
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
export class Carro2Component {
  isPopupVisible = false;
  isAddressPopupVisible = false;

  address: Address = {
    fullName: '',
    department: '',
    district: '',
    address: '',
    reference: ''
  };

  departments = [
    'SELECCIONAR',
    'Amazonas',
    'Ancash',
    'Apurímac',
    'Arequipa',
    'Ayacucho',
    'Cajamarca',
    'Callao',
    'Cusco',
    'Huancavelica',
    'Huánuco',
    'Ica',
    'Junín',
    'La Libertad',
    'Lambayeque',
    'Lima',
    'Loreto',
    'Madre de Dios',
    'Moquegua',
    'Pasco',
    'Piura',
    'Puno',
    'San Martín',
    'Tacna',
    'Tumbes',
    'Ucayali'
  ];

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
    'Lima': ['Lima', 'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lince',   
      'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra',   
      'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'],
         'Loreto': ['Maynas', 'Alto Amazonas', 'Datem del Marañón', 'Loreto-Nauta', 'Mariscal Ramón Castilla', 'Requena', 'Ucayali', 'Putumayo'],
    'Madre de Dios': ['Manu', 'Tambopata'],
    'Moquegua': ['Mariscal Nieto', 'General Sánchez Cerro', 'Ilo'],
    'Pasco': ['Pasco', 'Daniel Alcides Carrión', 'Oxapampa', 'Pasco'],
    'Piura': ['Piura', 'Ayabaca', 'Huancabamba']
  };

  availableDistricts: string[] = [];

  togglePopupVisibility(popup: 'warning' | 'address', isVisible: boolean): void {
    if (popup === 'warning') {
      this.isPopupVisible = isVisible;
    } else if (popup === 'address') {
      this.isAddressPopupVisible = isVisible;
    }
  }

  acceptWarning(): void {
    this.isPopupVisible = false;
    // Aquí puedes manejar cualquier lógica adicional si es necesario
  }

  onDepartmentChange(): void {
    if (this.address.department && this.districts[this.address.department]) {
      this.availableDistricts = this.districts[this.address.department];
      this.address.district = ''; // Resetea el distrito seleccionado
    } else {
      this.availableDistricts = [];
      this.address.district = '';
    }
  }

  saveAddress(event: Event): void {
    event.preventDefault(); // Evita la recarga de la página.
    // Aquí puedes manejar la lógica para guardar la dirección
    if (this.isAddressValid()) {
      console.log('Dirección guardada:', this.address);
      this.isAddressPopupVisible = false;
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }

  isAddressValid(): boolean {
    return (
      this.address.fullName.trim() !== '' &&
      this.address.department.trim() !== '' &&
      this.address.district.trim() !== '' &&
      this.address.address.trim() !== '' &&
      this.address.reference.trim() !== ''
    );
  }
}
