export type VisitStatus = 'dentro' | 'salió';
export type RoomStatus = 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento';
export type BookingStatus = 'en curso' | 'confirmada' | 'cancelada';
export type SpaceStatus = 'disponible' | 'ocupado' | 'mantenimiento' | 'cerrado';
export type ActivityType = 'visita' | 'reserva' | 'espacio' | 'sistema';

export interface Visit {
  id: number;
  nombre: string;
  dni: string;
  empresa: string;
  destino: string;
  persona: string;
  motivo: string;
  entrada: string;
  salida: string | null;
  estado: VisitStatus;
  obs: string;
}

export interface PendingVisit {
  id: number;
  nombre: string;
  empresa: string;
  destino: string;
  fecha: string;
  motivo: string;
}

export interface Room {
  id: number;
  nombre: string;
  piso: string;
  capacidad: number;
  estado: RoomStatus;
  ocupante: string | null;
  hora: string | null;
  desc: string;
}

export interface Booking {
  id: number;
  sala: string;
  org: string;
  fecha: string;
  inicio: string;
  fin: string;
  asistentes: number;
  estado: BookingStatus;
  desc: string;
}

export interface Space {
  id: number;
  nombre: string;
  tipo: string;
  piso: string;
  capacidad: number;
  ocupacion: number;
  estado: SpaceStatus;
}

export interface Activity {
  fecha: string;
  tipo: ActivityType;
  desc: string;
  user: string;
}

export interface VisitForm {
  nombre: string;
  dni: string;
  empresa: string;
  destino: string;
  persona: string;
  motivo: string;
  obs: string;
}

export interface BookingForm {
  sala: string;
  org: string;
  fecha: string;
  inicio: string;
  fin: string;
  asistentes: number;
  desc: string;
}

export interface SpaceForm {
  id?: number;
  nombre: string;
  tipo: string;
  piso: string;
  capacidad: number;
  ocupacion: number;
  estado: SpaceStatus;
}
