import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<ToastMessage | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string, type: ToastMessage['type'] = 'success'): void {
    clearTimeout(this.timer);
    this.message.set({ text, type });
    this.timer = setTimeout(() => this.message.set(null), 3000);
  }
}
