import { Component, inject } from '@angular/core';
import { BuildingStateService } from '../../core/building-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly state = inject(BuildingStateService);

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  }
}
