import { Component, inject } from '@angular/core';
import { BuildingStateService } from '../../core/building-state.service';
import { ActivityType } from '../../core/models';

@Component({
  selector: 'app-history',
  templateUrl: './history.html',
})
export class History {
  readonly state = inject(BuildingStateService);

  badgeClass(type: ActivityType): string {
    return ({ visita: 'blue', reserva: 'green', espacio: 'orange', sistema: 'gray' })[type];
  }
}
