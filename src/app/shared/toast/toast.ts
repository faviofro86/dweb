import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    @if (toast.message(); as message) {
      <div class="toast" [class.error]="message.type === 'error'">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        {{ message.text }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 2000;
      display: flex; align-items: center; gap: 10px; padding: 12px 18px;
      border-radius: var(--radius-sm); background: var(--text); color: white;
      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md);
      border-left: 3px solid var(--green); animation: slideUp .25s ease;
    }
    .toast.error { border-left-color: var(--red); }
    svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.5; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } }
  `],
})
export class Toast {
  readonly toast = inject(ToastService);
}
