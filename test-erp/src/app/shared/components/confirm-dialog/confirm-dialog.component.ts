import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() config!: ConfirmDialogConfig;
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  get iconClass(): string {
    switch (this.config?.type) {
      case 'danger': return 'pi pi-trash';
      case 'info': return 'pi pi-info-circle';
      default: return 'pi pi-exclamation-triangle';
    }
  }

  get iconBgClass(): string {
    switch (this.config?.type) {
      case 'danger': return 'icon-danger';
      case 'info': return 'icon-info';
      default: return 'icon-warning';
    }
  }

  get confirmSeverity(): 'danger' | 'info' | 'warn' {
    switch (this.config?.type) {
      case 'danger': return 'danger';
      case 'info': return 'info';
      default: return 'warn';
    }
  }

  close(): void {
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
    this.visibleChange.emit(false);
  }
}
