import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { FormDialogComponent, FormField, FormDialogConfig } from '../../shared/components/form-dialog/form-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';
import { CustomersService } from './customers.service';
import { Customer } from './customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    FormDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  customersService = inject(CustomersService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '80px' },
    { field: 'name', header: 'Name', width: '200px' },
    { field: 'email', header: 'Email', width: '250px' },
    { field: 'phone', header: 'Phone', width: '150px' }
  ];

  private formFields: FormField[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel', required: true }
  ];

  // Dialog state
  formDialogVisible = false;
  confirmDialogVisible = false;
  formDialogConfig = signal<FormDialogConfig>({
    title: '',
    fields: [],
    form: this.fb.group({}),
    submitText: ''
  });
  confirmDialogConfig = signal<ConfirmDialogConfig>({
    title: '',
    message: '',
    type: 'danger'
  });

  private editingCustomer: Customer | null = null;
  private deletingCustomer: Customer | null = null;

  openCreateDialog(): void {
    this.editingCustomer = null;
    this.formDialogConfig.set({
      title: 'Create Customer',
      fields: this.formFields,
      form: this.createForm(),
      submitText: 'Create'
    });
    this.formDialogVisible = true;
  }

  openEditDialog(customer: Customer): void {
    this.editingCustomer = customer;
    this.formDialogConfig.set({
      title: 'Edit Customer',
      fields: this.formFields,
      form: this.createForm(customer),
      submitText: 'Update'
    });
    this.formDialogVisible = true;
  }

  openDeleteDialog(customer: Customer): void {
    this.deletingCustomer = customer;
    this.confirmDialogConfig.set({
      title: 'Delete Customer',
      message: `Are you sure you want to delete "${customer.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    this.confirmDialogVisible = true;
  }

  handleFormSubmit(data: any): void {
    if (this.editingCustomer) {
      this.customersService.update(this.editingCustomer.id, data);
      this.toast.success('Customer updated successfully');
    } else {
      this.customersService.create(data);
      this.toast.success('Customer created successfully');
    }
  }

  handleDeleteConfirm(): void {
    if (this.deletingCustomer) {
      this.customersService.delete(this.deletingCustomer.id);
      this.toast.success('Customer deleted successfully');
      this.deletingCustomer = null;
    }
  }

  private createForm(customer?: Customer): FormGroup {
    return this.fb.group({
      name: [customer?.name || '', Validators.required],
      email: [customer?.email || '', [Validators.required, Validators.email]],
      phone: [customer?.phone || '', Validators.required]
    });
  }
}
