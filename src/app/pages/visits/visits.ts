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

  checkOut(id: number): void {
    this.state.checkOut(id);
    this.toast.show('Salida registrada correctamente');
  }

  approve(id: number): void {
    this.state.approveVisit(id);
    this.toast.show('Visita aprobada y registrada');
  }

  reject(id: number): void {
    this.state.rejectVisit(id);
    this.toast.show('Visita rechazada', 'error');
  }

  save(): void {
    if (!this.form.nombre.trim() || !/^\d{8}$/.test(this.form.dni) ||
        !this.form.destino || !this.form.persona.trim() || !this.form.motivo) {
      this.toast.show('Completa los campos obligatorios y usa un DNI de 8 dígitos', 'error');
      return;
    }
    this.state.registerVisit({ ...this.form });
    this.form = this.emptyForm();
    this.modalOpen = false;
    this.toast.show('Visita registrada correctamente');
  }

  private emptyForm(): VisitForm {
    return { nombre: '', dni: '', empresa: '', destino: '', persona: '', motivo: '', obs: '' };
  }
}
