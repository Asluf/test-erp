import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
}

export interface FormDialogConfig {
  title: string;
  fields: FormField[];
  form: FormGroup;
  submitText?: string;
}

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  @Input() config!: FormDialogConfig;
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  close(): void {
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

  submit(): void {
    if (this.config.form.valid) {
      this.onSubmit.emit(this.config.form.value);
      this.visibleChange.emit(false);
    }
  }

  hasError(key: string, error: string): boolean {
    const control = this.config.form.get(key);
    return control ? control.hasError(error) && control.touched : false;
  }
}
