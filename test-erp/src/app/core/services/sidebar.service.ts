import { Injectable, signal, effect } from '@angular/core';

const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _collapsed = signal(this.getStoredState());

  collapsed = this._collapsed.asReadonly();

  constructor() {
    // Persist state to localStorage when it changes
    effect(() => {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(this._collapsed()));
    });
  }

  toggle(): void {
    this._collapsed.update(v => !v);
  }

  collapse(): void {
    this._collapsed.set(true);
  }

  expand(): void {
    this._collapsed.set(false);
  }

  private getStoredState(): boolean {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored ? JSON.parse(stored) : false;
  }
}
