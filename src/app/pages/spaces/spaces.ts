import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuildingStateService } from '../../core/building-state.service';
import { ToastService } from '../../core/toast.service';
import { Space, SpaceForm } from '../../core/models';

@Component({
  selector: 'app-spaces',
  imports: [FormsModule],
  templateUrl: './spaces.html',
})
export class Spaces {
  readonly state = inject(BuildingStateService);
  private readonly toast = inject(ToastService);
  modalOpen = false;
  occupancyOpen = false;
  editing?: Space;
  occupancy = 0;
  form: SpaceForm = this.emptyForm();

  openAdd(): void {
    this.editing = undefined;
    this.form = this.emptyForm();
    this.modalOpen = true;
  }

  openEdit(space: Space): void {
    this.editing = space;
    this.form = { ...space };
    this.modalOpen = true;
  }

  openOccupancy(space: Space): void {
    this.editing = space;
    this.occupancy = space.ocupacion;
    this.occupancyOpen = true;
  }

  save(): void {
    if (!this.form.nombre.trim() || this.form.capacidad < 0 || this.form.ocupacion < 0 ||
        this.form.ocupacion > this.form.capacidad) {
      this.toast.show('Revisa el nombre, la capacidad y la ocupación', 'error');
      return;
    }
    this.state.saveSpace({ ...this.form });
    this.modalOpen = false;
    this.toast.show('Espacio guardado correctamente');
  }

  saveOccupancy(): void {
    if (!this.editing || !this.state.updateOccupancy(this.editing.id, Number(this.occupancy))) {
      this.toast.show('La ocupación debe estar entre 0 y la capacidad máxima', 'error');
      return;
    }
    this.occupancyOpen = false;
    this.toast.show('Ocupación actualizada');
  }

  percent(space: Space): number {
    return space.capacidad ? Math.round(space.ocupacion / space.capacidad * 100) : 0;
  }

  barColor(space: Space): string {
    const percent = this.percent(space);
    return percent > 80 ? '#EF4444' : percent > 50 ? '#F97316' : '#22C55E';
  }

  badgeClass(status: Space['estado']): string {
    return ({ disponible: 'green', ocupado: 'orange', mantenimiento: 'red', cerrado: 'gray' })[status];
  }

  statusLabel(status: Space['estado']): string {
    return ({ disponible: 'Disponible', ocupado: 'Ocupado', mantenimiento: 'En mantenimiento', cerrado: 'Cerrado' })[status];
  }

  icon(type: string): string {
    return ({ Cafetería: '☕', Estacionamiento: 'P', Gimnasio: '🏋', Terraza: '⌂', Lobby: '▥', 'Sala de espera': '▣' } as Record<string, string>)[type] || '◆';
  }

  private emptyForm(): SpaceForm {
    return { nombre: '', tipo: 'Cafetería', piso: '', capacidad: 0, ocupacion: 0, estado: 'disponible' };
  }
}
