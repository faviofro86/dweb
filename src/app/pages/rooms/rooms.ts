import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuildingStateService } from '../../core/building-state.service';
import { ToastService } from '../../core/toast.service';
import { Booking, BookingForm, Room } from '../../core/models';

type RoomTab = 'mapa' | 'reservas' | 'timeline';

@Component({
  selector: 'app-rooms',
  imports: [FormsModule],
  templateUrl: './rooms.html',
})
export class Rooms {
  readonly state = inject(BuildingStateService);
  private readonly toast = inject(ToastService);
  readonly hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
  tab: RoomTab = 'mapa';
  modalOpen = false;
  form: BookingForm = this.emptyForm();

  openBooking(room?: Room): void {
    this.form = this.emptyForm();
    if (room) this.form.sala = room.nombre;
    this.modalOpen = true;
  }

  async save(): Promise<void> {
    if (!this.form.sala || !this.form.org.trim() || !this.form.fecha || !this.form.inicio || !this.form.fin) {
      this.toast.show('Completa todos los campos obligatorios', 'error');
      return;
    }
    if (!await this.state.addBooking({ ...this.form })) {
      this.toast.show('Revisa disponibilidad, horario y capacidad de la sala', 'error');
      return;
    }
    this.modalOpen = false;
    this.toast.show('Reserva confirmada');
  }

  async cancel(id: number): Promise<void> {
    if (await this.state.deleteBooking(id)) {
      this.toast.show('Reserva cancelada');
    } else {
      this.toast.show('No se pudo cancelar la reserva', 'error');
    }
  }

  roomClass(status: Room['estado']): string {
    return ({ disponible: 'available', ocupado: 'occupied', reservado: 'reserved', mantenimiento: 'maintenance' })[status];
  }

  badgeClass(status: Room['estado']): string {
    return ({ disponible: 'green', ocupado: 'red', reservado: 'orange', mantenimiento: 'gray' })[status];
  }

  roomLabel(status: Room['estado']): string {
    return ({ disponible: 'Disponible', ocupado: 'Ocupado', reservado: 'Reservado', mantenimiento: 'Mantenimiento' })[status];
  }

  bookingAt(room: Room, hour: string): Booking | undefined {
    return this.state.bookings().find((booking) =>
      booking.sala === room.nombre && booking.fecha === 'Hoy' && Number(booking.inicio.slice(0, 2)) === Number(hour));
  }

  private emptyForm(): BookingForm {
    return { sala: '', org: '', fecha: this.state.todayIso(), inicio: '09:00', fin: '10:00', asistentes: 1, desc: '' };
  }
}
