import { Component, Input, Output, EventEmitter, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface TableColumn {
  field: string;
  header: string;
  width?: string;
  sortable?: boolean;
}

// Helper to get sortable column value
export function getSortableField(col: TableColumn, lazy: boolean): string | undefined {
  return col.sortable !== false && lazy ? col.field : undefined;
}

export interface LazyLoadParams {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    RippleModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<T> {
  @Input() title = 'Records';
  @Input() columns: TableColumn[] = [];
  
  // Simple mode - all data at once (backward compatible)
  @Input() dataSource?: Signal<T[]>;
  
  // Lazy loading mode - paginated data
  @Input() lazyData?: T[];
  @Input() totalRecords = 0;
  @Input() lazy = false;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() showSearch = false;
  @Input() loading = false;

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onLazyLoad = new EventEmitter<LazyLoadParams>();

  searchValue = '';
  private searchTimeout: any;
  private initialLoadDone = false;

  // Should we show the table? For lazy mode, always show until first load completes
  get showTable(): boolean {
    if (this.lazy) {
      // Always show table in lazy mode (so onLazyLoad can fire)
      // Only show empty state after initial load with no results
      return !this.initialLoadDone || this.totalRecords > 0;
    }
    return this.data.length > 0;
  }

  // Computed property for global filter fields
  get filterFields(): string[] {
    return this.columns.map(c => c.field);
  }

  // Get sortable column field or undefined
  getSortableColumn(col: TableColumn): string | undefined {
    return col.sortable !== false && this.lazy ? col.field : undefined;
  }

  get data(): T[] {
    if (this.lazy) {
      return this.lazyData || [];
    }
    return this.dataSource?.() || [];
  }

  get rowCount(): number {
    if (this.lazy) {
      return this.totalRecords;
    }
    return this.data.length;
  }

  onTableLazyLoad(event: TableLazyLoadEvent): void {
    if (!this.lazy) return;

    // Mark that we've done the initial load (for empty state logic)
    this.initialLoadDone = true;

    const params: LazyLoadParams = {
      first: event.first || 0,
      rows: event.rows || this.pageSize,
      sortField: event.sortField as string | undefined,
      sortOrder: event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : undefined,
      searchTerm: this.searchValue || undefined
    };

    this.onLazyLoad.emit(params);
  }

  onSearch(): void {
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.lazy) {
        this.onLazyLoad.emit({
          first: 0,
          rows: this.pageSize,
          searchTerm: this.searchValue || undefined
        });
      }
    }, 300);
  }

  clearSearch(): void {
    this.searchValue = '';
    if (this.lazy) {
      this.onLazyLoad.emit({
        first: 0,
        rows: this.pageSize
      });
    }
  }
}
