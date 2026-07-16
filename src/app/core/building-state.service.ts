import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
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

interface BuildingStatePayload {
  visits: Visit[];
  pendingVisits: PendingVisit[];
  rooms: Room[];
  bookings: Booking[];
  spaces: Space[];
  activity: Activity[];
}

@Injectable({ providedIn: 'root' })
export class BuildingStateService {
  private readonly apiUrl = environment.apiUrl;

  readonly visits = signal<Visit[]>([]);
  readonly pendingVisits = signal<PendingVisit[]>([]);
  readonly rooms = signal<Room[]>([]);
  readonly bookings = signal<Booking[]>([]);
  readonly spaces = signal<Space[]>([]);
  readonly activity = signal<Activity[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly activeVisits = computed(() => this.visits().filter((visit) => visit.estado === 'dentro'));
  readonly availableRooms = computed(() => this.rooms().filter((room) => room.estado === 'disponible'));
  readonly todayBookings = computed(() => this.bookings().filter((booking) => booking.fecha === 'Hoy'));

  constructor(private readonly http: HttpClient) {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const state = await firstValueFrom(this.http.get<BuildingStatePayload>(`${this.apiUrl}/state`));
      this.applyState(state);
    } catch {
      this.error.set('No se pudo cargar informacion del backend');
    } finally {
      this.loading.set(false);
    }
  }

  async registerVisit(form: VisitForm): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<Visit>(`${this.apiUrl}/visits`, form));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async checkOut(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Visit>(`${this.apiUrl}/visits/${id}/checkout`, {}));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async approveVisit(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Visit>(`${this.apiUrl}/pending-visits/${id}/approve`, {}));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async rejectVisit(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<void>(`${this.apiUrl}/pending-visits/${id}/reject`, {}));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async addBooking(form: BookingForm): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<Booking>(`${this.apiUrl}/bookings`, form));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async deleteBooking(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/bookings/${id}`));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async saveSpace(form: SpaceForm): Promise<boolean> {
    try {
      if (form.id) {
        await firstValueFrom(this.http.put<Space>(`${this.apiUrl}/spaces/${form.id}`, form));
      } else {
        await firstValueFrom(this.http.post<Space>(`${this.apiUrl}/spaces`, form));
      }
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async updateOccupancy(id: number, ocupacion: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Space>(`${this.apiUrl}/spaces/${id}/occupancy`, { ocupacion }));
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }

  private applyState(state: BuildingStatePayload): void {
    this.visits.set(state.visits);
    this.pendingVisits.set(state.pendingVisits);
    this.rooms.set(state.rooms);
    this.bookings.set(state.bookings);
    this.spaces.set(state.spaces);
    this.activity.set(state.activity);
  }
}
