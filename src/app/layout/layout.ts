import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Toast } from '../shared/toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  title = 'Dashboard';
  readonly date = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

  constructor(private router: Router) {
    this.updateTitle();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    this.title = route.data['title'] ?? 'Dashboard';
  }
}
