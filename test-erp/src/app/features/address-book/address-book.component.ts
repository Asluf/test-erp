import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { FormDialogComponent, FormField, FormDialogConfig } from '../../shared/components/form-dialog/form-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';
import { AddressBookService } from './address-book.service';
import { Address } from './address.model';

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    FormDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './address-book.component.html',
  styleUrl: './address-book.component.scss'
})
export class AddressBookComponent {
  addressBookService = inject(AddressBookService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '80px' },
    { field: 'name', header: 'Name', width: '200px' },
    { field: 'address', header: 'Address', width: '250px' },
    { field: 'city', header: 'City', width: '150px' }
  ];

  private formFields: FormField[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true }
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

  private editingAddress: Address | null = null;
  private deletingAddress: Address | null = null;

  openCreateDialog(): void {
    this.editingAddress = null;
    this.formDialogConfig.set({
      title: 'Create Address',
      fields: this.formFields,
      form: this.createForm(),
      submitText: 'Create'
    });
    this.formDialogVisible = true;
  }

  openEditDialog(address: Address): void {
    this.editingAddress = address;
    this.formDialogConfig.set({
      title: 'Edit Address',
      fields: this.formFields,
      form: this.createForm(address),
      submitText: 'Update'
    });
    this.formDialogVisible = true;
  }

  openDeleteDialog(address: Address): void {
    this.deletingAddress = address;
    this.confirmDialogConfig.set({
      title: 'Delete Address',
      message: `Are you sure you want to delete "${address.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    this.confirmDialogVisible = true;
  }

  handleFormSubmit(data: any): void {
    if (this.editingAddress) {
      this.addressBookService.update(this.editingAddress.id, data);
      this.toast.success('Address updated successfully');
    } else {
      this.addressBookService.create(data);
      this.toast.success('Address created successfully');
    }
  }

  handleDeleteConfirm(): void {
    if (this.deletingAddress) {
      this.addressBookService.delete(this.deletingAddress.id);
      this.toast.success('Address deleted successfully');
      this.deletingAddress = null;
    }
  }

  private createForm(address?: Address): FormGroup {
    return this.fb.group({
      name: [address?.name || '', Validators.required],
      address: [address?.address || '', Validators.required],
      city: [address?.city || '', Validators.required]
    });
  }
}
