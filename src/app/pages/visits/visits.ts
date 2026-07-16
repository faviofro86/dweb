import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuildingStateService } from '../../core/building-state.service';
import { ToastService } from '../../core/toast.service';
import { VisitForm } from '../../core/models';

type VisitTab = 'activas' | 'pendientes' | 'historial';

@Component({
  selector: 'app-visits',
  imports: [FormsModule],
  templateUrl: './visits.html',
})
export class Visits {
  readonly state = inject(BuildingStateService);
  private readonly toast = inject(ToastService);
  tab: VisitTab = 'activas';
  query = '';
  modalOpen = false;
  form: VisitForm = this.emptyForm();

  get filteredVisits() {
    const query = this.query.trim().toLowerCase();
    return this.state.activeVisits().filter((visit) =>
      !query || Object.values(visit).some((value) => String(value ?? '').toLowerCase().includes(query)));
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  }

  async checkOut(id: number): Promise<void> {
    if (await this.state.checkOut(id)) {
      this.toast.show('Salida registrada correctamente');
    } else {
      this.toast.show('No se pudo registrar la salida', 'error');
    }
  }

  async approve(id: number): Promise<void> {
    if (await this.state.approveVisit(id)) {
      this.toast.show('Visita aprobada y registrada');
    } else {
      this.toast.show('No se pudo aprobar la visita', 'error');
    }
  }

  async reject(id: number): Promise<void> {
    if (await this.state.rejectVisit(id)) {
      this.toast.show('Visita rechazada', 'error');
    } else {
      this.toast.show('No se pudo rechazar la visita', 'error');
    }
  }

  async save(): Promise<void> {
    if (!this.form.nombre.trim() || !/^\d{8}$/.test(this.form.dni) ||
        !this.form.destino || !this.form.persona.trim() || !this.form.motivo) {
      this.toast.show('Completa los campos obligatorios y usa un DNI de 8 digitos', 'error');
      return;
    }
    if (!await this.state.registerVisit({ ...this.form })) {
      this.toast.show('No se pudo registrar la visita', 'error');
      return;
    }
    this.form = this.emptyForm();
    this.modalOpen = false;
    this.toast.show('Visita registrada correctamente');
  }

  private emptyForm(): VisitForm {
    return { nombre: '', dni: '', empresa: '', destino: '', persona: '', motivo: '', obs: '' };
  }
}
