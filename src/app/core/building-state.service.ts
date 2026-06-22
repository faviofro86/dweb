import { Injectable, computed, signal } from '@angular/core';
import {
  Activity,
  Booking,
  BookingForm,
  PendingVisit,
  Room,
  Space,
  SpaceForm,
  Visit,
  VisitForm,
} from './models';

@Injectable({ providedIn: 'root' })
export class BuildingStateService {
  readonly visits = signal<Visit[]>([
    { id: 1, nombre: 'Luis Quispe', dni: '45678901', empresa: 'TechPe SAC', destino: 'Piso 3 – Gerencia', persona: 'María Torres', motivo: 'Reunión de negocios', entrada: '08:32', salida: null, estado: 'dentro', obs: '' },
    { id: 2, nombre: 'Ana Flores', dni: '32109876', empresa: '—', destino: 'Piso 4 – RRHH', persona: 'Pedro Salas', motivo: 'Entrevista', entrada: '09:15', salida: null, estado: 'dentro', obs: '' },
    { id: 3, nombre: 'Carlos Ramos', dni: '56789012', empresa: 'MegaCorp', destino: 'Piso 2 – Administración', persona: 'Rosa Díaz', motivo: 'Entrega de documentos', entrada: '09:45', salida: '10:10', estado: 'salió', obs: '' },
  ]);

  readonly pendingVisits = signal<PendingVisit[]>([
    { id: 4, nombre: 'Jorge Lara', empresa: 'LogiPe', destino: 'Piso 5 – TI', fecha: 'Hoy 11:00', motivo: 'Soporte técnico' },
    { id: 5, nombre: 'Sofía Chávez', empresa: '—', destino: 'Piso 3 – Gerencia', fecha: 'Hoy 14:30', motivo: 'Reunión de negocios' },
  ]);

  readonly rooms = signal<Room[]>([
    { id: 1, nombre: 'Sala Libertad', piso: 'Piso 2', capacidad: 8, estado: 'disponible', ocupante: null, hora: null, desc: 'Proyector 4K, videoconferencia' },
    { id: 2, nombre: 'Sala Inca', piso: 'Piso 2', capacidad: 12, estado: 'ocupado', ocupante: 'Gerencia General', hora: '09:00–11:00', desc: 'TV 65", pizarrón' },
    { id: 3, nombre: 'Sala Miraflores', piso: 'Piso 3', capacidad: 6, estado: 'reservado', ocupante: 'Dept. RRHH', hora: '11:00–12:00', desc: 'Videoconferencia' },
    { id: 4, nombre: 'Sala Amazonas', piso: 'Piso 3', capacidad: 20, estado: 'disponible', ocupante: null, hora: null, desc: 'Auditorio, micrófono, proyector doble' },
    { id: 5, nombre: 'Sala Lima', piso: 'Piso 4', capacidad: 4, estado: 'disponible', ocupante: null, hora: null, desc: 'Reuniones pequeñas, TV 43"' },
    { id: 6, nombre: 'Sala Andina', piso: 'Piso 4', capacidad: 10, estado: 'mantenimiento', ocupante: null, hora: null, desc: 'En mantenimiento hasta 18:00' },
  ]);

  readonly bookings = signal<Booking[]>([
    { id: 1, sala: 'Sala Inca', org: 'Gerencia General', fecha: 'Hoy', inicio: '09:00', fin: '11:00', asistentes: 10, estado: 'en curso', desc: '' },
    { id: 2, sala: 'Sala Miraflores', org: 'Dept. RRHH', fecha: 'Hoy', inicio: '11:00', fin: '12:00', asistentes: 4, estado: 'confirmada', desc: '' },
    { id: 3, sala: 'Sala Libertad', org: 'Juan Pérez', fecha: 'Hoy', inicio: '14:00', fin: '15:30', asistentes: 6, estado: 'confirmada', desc: '' },
    { id: 4, sala: 'Sala Lima', org: 'Ana López', fecha: 'Mañana', inicio: '09:00', fin: '10:00', asistentes: 3, estado: 'confirmada', desc: '' },
  ]);

  readonly spaces = signal<Space[]>([
    { id: 1, nombre: 'Lobby Principal', tipo: 'Lobby', piso: 'Piso 1', capacidad: 40, ocupacion: 12, estado: 'disponible' },
    { id: 2, nombre: 'Cafetería', tipo: 'Cafetería', piso: 'Piso 1', capacidad: 60, ocupacion: 35, estado: 'disponible' },
    { id: 3, nombre: 'Estacionamiento', tipo: 'Estacionamiento', piso: 'Sótano', capacidad: 50, ocupacion: 42, estado: 'disponible' },
    { id: 4, nombre: 'Gimnasio', tipo: 'Gimnasio', piso: 'Piso 5', capacidad: 25, ocupacion: 8, estado: 'disponible' },
    { id: 5, nombre: 'Terraza', tipo: 'Terraza', piso: 'Azotea', capacidad: 30, ocupacion: 0, estado: 'cerrado' },
    { id: 6, nombre: 'Sala de espera', tipo: 'Sala de espera', piso: 'Piso 2', capacidad: 15, ocupacion: 5, estado: 'disponible' },
  ]);

  readonly activity = signal<Activity[]>([
    { fecha: '10:12', tipo: 'visita', desc: 'Entrada registrada: Luis Quispe → Piso 3', user: 'Recepción' },
    { fecha: '09:45', tipo: 'reserva', desc: 'Reserva confirmada: Sala Libertad – Juan Pérez (14:00)', user: 'Sistema' },
    { fecha: '09:15', tipo: 'visita', desc: 'Entrada registrada: Ana Flores → Piso 4', user: 'Recepción' },
    { fecha: '08:32', tipo: 'visita', desc: 'Entrada registrada: Luis Quispe → Piso 3', user: 'Recepción' },
  ]);

  readonly activeVisits = computed(() => this.visits().filter((visit) => visit.estado === 'dentro'));
  readonly availableRooms = computed(() => this.rooms().filter((room) => room.estado === 'disponible'));
  readonly todayBookings = computed(() => this.bookings().filter((booking) => booking.fecha === 'Hoy'));
  private nextId = 10;

  registerVisit(form: VisitForm): void {
    this.visits.update((visits) => [...visits, {
      id: this.nextId++, ...form, empresa: form.empresa || '—',
      entrada: this.nowTime(), salida: null, estado: 'dentro',
    }]);
    this.log('visita', `Entrada registrada: ${form.nombre} → ${form.destino}`, 'Recepción');
  }

  checkOut(id: number): void {
    const visit = this.visits().find((item) => item.id === id);
    if (!visit) return;
    this.visits.update((visits) => visits.map((item) =>
      item.id === id ? { ...item, salida: this.nowTime(), estado: 'salió' } : item));
    this.log('visita', `Salida registrada: ${visit.nombre} → ${visit.destino}`, 'Recepción');
  }

  approveVisit(id: number): void {
    const pending = this.pendingVisits().find((item) => item.id === id);
    if (!pending) return;
    this.pendingVisits.update((items) => items.filter((item) => item.id !== id));
    this.visits.update((visits) => [...visits, {
      id: pending.id, nombre: pending.nombre, dni: '—', empresa: pending.empresa,
      destino: pending.destino, persona: '—', motivo: pending.motivo,
      entrada: this.nowTime(), salida: null, estado: 'dentro', obs: '',
    }]);
    this.log('visita', `Visita aprobada: ${pending.nombre} → ${pending.destino}`, 'Recepción');
  }

  rejectVisit(id: number): void {
    const pending = this.pendingVisits().find((item) => item.id === id);
    if (!pending) return;
    this.pendingVisits.update((items) => items.filter((item) => item.id !== id));
    this.log('visita', `Visita rechazada: ${pending.nombre}`, 'Recepción');
  }

  addBooking(form: BookingForm): boolean {
    const room = this.rooms().find((item) => item.nombre === form.sala);
    if (!room || room.estado === 'ocupado' || form.inicio >= form.fin || form.asistentes > room.capacidad) return false;
    const dateLabel = form.fecha === this.todayIso() ? 'Hoy' : form.fecha;
    this.bookings.update((items) => [...items, {
      id: this.nextId++, ...form, fecha: dateLabel, asistentes: form.asistentes || 1, estado: 'confirmada',
    }]);
    this.rooms.update((rooms) => rooms.map((item) => item.id === room.id
      ? { ...item, estado: 'reservado', ocupante: form.org, hora: `${form.inicio}–${form.fin}` }
      : item));
    this.log('reserva', `Reserva confirmada: ${form.sala} – ${form.org} (${form.inicio})`, 'Sistema');
    return true;
  }

  deleteBooking(id: number): void {
    const booking = this.bookings().find((item) => item.id === id);
    this.bookings.update((items) => items.filter((item) => item.id !== id));
    if (booking) {
      this.rooms.update((rooms) => rooms.map((room) =>
        room.nombre === booking.sala && room.estado === 'reservado'
          ? { ...room, estado: 'disponible', ocupante: null, hora: null }
          : room));
      this.log('reserva', `Reserva cancelada: ${booking.sala} – ${booking.org}`, 'Sistema');
    }
  }

  saveSpace(form: SpaceForm): void {
    if (form.id) {
      this.spaces.update((items) => items.map((item) => item.id === form.id ? { ...item, ...form } : item));
    } else {
      this.spaces.update((items) => [...items, { ...form, id: this.nextId++ }]);
    }
    this.log('espacio', `Espacio actualizado: ${form.nombre}`, 'Admin');
  }

  updateOccupancy(id: number, occupancy: number): boolean {
    const space = this.spaces().find((item) => item.id === id);
    if (!space || occupancy < 0 || occupancy > space.capacidad) return false;
    this.spaces.update((items) => items.map((item) =>
      item.id === id ? { ...item, ocupacion: occupancy } : item));
    this.log('espacio', `Ocupación actualizada: ${space.nombre} → ${occupancy}/${space.capacidad}`, 'Sistema');
    return true;
  }

  todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }

  private nowTime(): string {
    return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  private log(tipo: Activity['tipo'], desc: string, user: string): void {
    this.activity.update((items) => [{ fecha: this.nowTime(), tipo, desc, user }, ...items]);
  }
}
