import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableComponent, TableColumn, LazyLoadParams } from '../../shared/components/data-table/data-table.component';
import { FormDialogComponent, FormField, FormDialogConfig } from '../../shared/components/form-dialog/form-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';
import { OrdersService } from './orders.service';
import { Order } from './order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    FormDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  columns: TableColumn[] = [
    { field: 'orderNumber', header: 'Order #', width: '140px', sortable: true },
    { field: 'customerName', header: 'Customer', width: '180px', sortable: true },
    { field: 'orderDate', header: 'Date', width: '120px', sortable: true },
    { field: 'status', header: 'Status', width: '120px', sortable: true },
    { field: 'items', header: 'Items', width: '80px', sortable: true },
    { field: 'total', header: 'Total ($)', width: '120px', sortable: true }
  ];

  private formFields: FormField[] = [
    { key: 'customerName', label: 'Customer Name', type: 'text', required: true },
    { key: 'orderDate', label: 'Order Date', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'text', required: true },
    { key: 'items', label: 'Number of Items', type: 'text', required: true },
    { key: 'total', label: 'Total Amount', type: 'text', required: true }
  ];

  // Lazy loading state
  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  
  // Current pagination state (for refresh after CRUD)
  private currentParams: LazyLoadParams = { first: 0, rows: 10 };

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

  private editingOrder: Order | null = null;
  private deletingOrder: Order | null = null;

  ngOnInit(): void {
    // Initial load is triggered by p-table via onLazyLoad
  }

  async loadOrders(params: LazyLoadParams): Promise<void> {
    this.loading.set(true);
    this.currentParams = params;

    try {
      const response = await this.ordersService.getPagedOrders({
        first: params.first,
        rows: params.rows,
        sortField: params.sortField,
        sortOrder: params.sortOrder,
        searchTerm: params.searchTerm
      });

      this.orders.set(response.data);
      this.totalRecords.set(response.totalRecords);
    } catch (error) {
      this.toast.error('Failed to load orders');
    } finally {
      this.loading.set(false);
    }
  }

  openCreateDialog(): void {
    this.editingOrder = null;
    this.formDialogConfig.set({
      title: 'Create Order',
      fields: this.formFields,
      form: this.createForm(),
      submitText: 'Create'
    });
    this.formDialogVisible = true;
  }

  openEditDialog(order: Order): void {
    this.editingOrder = order;
    this.formDialogConfig.set({
      title: 'Edit Order',
      fields: this.formFields,
      form: this.createForm(order),
      submitText: 'Update'
    });
    this.formDialogVisible = true;
  }

  openDeleteDialog(order: Order): void {
    this.deletingOrder = order;
    this.confirmDialogConfig.set({
      title: 'Delete Order',
      message: `Are you sure you want to delete order "${order.orderNumber}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    this.confirmDialogVisible = true;
  }

  async handleFormSubmit(data: any): Promise<void> {
    const orderData = {
      ...data,
      items: parseInt(data.items, 10),
      total: parseFloat(data.total)
    };

    try {
      if (this.editingOrder) {
        await this.ordersService.update(this.editingOrder.id, orderData);
        this.toast.success('Order updated successfully');
      } else {
        await this.ordersService.create(orderData);
        this.toast.success('Order created successfully');
      }
      // Refresh the current page
      await this.loadOrders(this.currentParams);
    } catch (error) {
      this.toast.error('Operation failed');
    }
  }

  async handleDeleteConfirm(): Promise<void> {
    if (this.deletingOrder) {
      try {
        await this.ordersService.delete(this.deletingOrder.id);
        this.toast.success('Order deleted successfully');
        this.deletingOrder = null;
        // Refresh the current page
        await this.loadOrders(this.currentParams);
      } catch (error) {
        this.toast.error('Failed to delete order');
      }
    }
  }

  private createForm(order?: Order): FormGroup {
    return this.fb.group({
      customerName: [order?.customerName || '', Validators.required],
      orderDate: [order?.orderDate || new Date().toISOString().split('T')[0], Validators.required],
      status: [order?.status || 'pending', Validators.required],
      items: [order?.items?.toString() || '1', Validators.required],
      total: [order?.total?.toString() || '0', Validators.required]
    });
  }
}
