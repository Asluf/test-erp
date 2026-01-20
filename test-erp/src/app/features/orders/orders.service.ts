import { Injectable, signal } from '@angular/core';
import { Order } from './order.model';
import { PaginatedResponse } from '../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _orders = signal<Order[]>([
    { id: 1, orderNumber: 'ORD-2024-001', customerName: 'John Smith', orderDate: '2024-01-15', status: 'delivered', total: 1250.00, items: 5 },
    { id: 2, orderNumber: 'ORD-2024-002', customerName: 'Sarah Johnson', orderDate: '2024-01-16', status: 'shipped', total: 890.50, items: 3 },
    { id: 3, orderNumber: 'ORD-2024-003', customerName: 'Michael Brown', orderDate: '2024-01-17', status: 'processing', total: 2340.00, items: 8 },
    { id: 4, orderNumber: 'ORD-2024-004', customerName: 'Emily Davis', orderDate: '2024-01-18', status: 'pending', total: 450.75, items: 2 },
    { id: 5, orderNumber: 'ORD-2024-005', customerName: 'Robert Wilson', orderDate: '2024-01-19', status: 'delivered', total: 1780.25, items: 6 },
    { id: 6, orderNumber: 'ORD-2024-006', customerName: 'Lisa Anderson', orderDate: '2024-01-20', status: 'cancelled', total: 320.00, items: 1 },
    { id: 7, orderNumber: 'ORD-2024-007', customerName: 'David Martinez', orderDate: '2024-01-21', status: 'delivered', total: 3450.00, items: 12 },
    { id: 8, orderNumber: 'ORD-2024-008', customerName: 'Jennifer Taylor', orderDate: '2024-01-22', status: 'shipped', total: 675.50, items: 4 },
    { id: 9, orderNumber: 'ORD-2024-009', customerName: 'James Thomas', orderDate: '2024-01-23', status: 'processing', total: 1120.00, items: 7 },
    { id: 10, orderNumber: 'ORD-2024-010', customerName: 'Amanda White', orderDate: '2024-01-24', status: 'pending', total: 890.00, items: 3 },
    { id: 11, orderNumber: 'ORD-2024-011', customerName: 'Christopher Lee', orderDate: '2024-01-25', status: 'delivered', total: 2100.75, items: 9 },
    { id: 12, orderNumber: 'ORD-2024-012', customerName: 'Michelle Garcia', orderDate: '2024-01-26', status: 'shipped', total: 560.25, items: 2 },
    { id: 13, orderNumber: 'ORD-2024-013', customerName: 'Daniel Harris', orderDate: '2024-01-27', status: 'processing', total: 1890.00, items: 5 },
    { id: 14, orderNumber: 'ORD-2024-014', customerName: 'Ashley Clark', orderDate: '2024-01-28', status: 'pending', total: 740.50, items: 4 },
    { id: 15, orderNumber: 'ORD-2024-015', customerName: 'Matthew Lewis', orderDate: '2024-01-29', status: 'delivered', total: 4200.00, items: 15 },
    { id: 16, orderNumber: 'ORD-2024-016', customerName: 'Jessica Robinson', orderDate: '2024-01-30', status: 'shipped', total: 980.00, items: 6 },
    { id: 17, orderNumber: 'ORD-2024-017', customerName: 'Andrew Walker', orderDate: '2024-01-31', status: 'cancelled', total: 210.00, items: 1 },
    { id: 18, orderNumber: 'ORD-2024-018', customerName: 'Stephanie Hall', orderDate: '2024-02-01', status: 'delivered', total: 1560.75, items: 8 },
    { id: 19, orderNumber: 'ORD-2024-019', customerName: 'Joshua Allen', orderDate: '2024-02-02', status: 'processing', total: 2890.50, items: 11 },
    { id: 20, orderNumber: 'ORD-2024-020', customerName: 'Nicole Young', orderDate: '2024-02-03', status: 'pending', total: 430.00, items: 2 },
    { id: 21, orderNumber: 'ORD-2024-021', customerName: 'Kevin King', orderDate: '2024-02-04', status: 'shipped', total: 1675.25, items: 7 },
    { id: 22, orderNumber: 'ORD-2024-022', customerName: 'Rachel Wright', orderDate: '2024-02-05', status: 'delivered', total: 3120.00, items: 10 },
    { id: 23, orderNumber: 'ORD-2024-023', customerName: 'Brian Scott', orderDate: '2024-02-06', status: 'pending', total: 590.50, items: 3 },
    { id: 24, orderNumber: 'ORD-2024-024', customerName: 'Megan Green', orderDate: '2024-02-07', status: 'processing', total: 1450.00, items: 6 },
    { id: 25, orderNumber: 'ORD-2024-025', customerName: 'Ryan Adams', orderDate: '2024-02-08', status: 'delivered', total: 2780.75, items: 9 },
  ]);

  private _nextId = signal(26);

  /**
   * Simulates a paginated API call with delay
   * Returns data for the requested page with optional sorting and filtering
   */
  async getPagedOrders(params: {
    first: number;
    rows: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;
  }): Promise<PaginatedResponse<Order>> {
    // Simulate API delay (200-400ms)
    await this.simulateDelay(200 + Math.random() * 200);

    let filteredData = [...this._orders()];

    // Apply search filter
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filteredData = filteredData.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (params.sortField) {
      filteredData.sort((a, b) => {
        const aVal = a[params.sortField as keyof Order];
        const bVal = b[params.sortField as keyof Order];
        
        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;
        
        return params.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / params.rows);
    const page = Math.floor(params.first / params.rows) + 1;

    // Get page slice
    const data = filteredData.slice(params.first, params.first + params.rows);

    console.log(`[OrdersService] Fetched page ${page} of ${totalPages} (${data.length} records)`);

    return {
      data,
      totalRecords,
      page,
      pageSize: params.rows,
      totalPages
    };
  }

  getById(id: number): Order | undefined {
    return this._orders().find(o => o.id === id);
  }

  async create(order: Omit<Order, 'id' | 'orderNumber'>): Promise<Order> {
    await this.simulateDelay(300);

    const newOrder: Order = {
      ...order,
      id: this._nextId(),
      orderNumber: `ORD-2024-${String(this._nextId()).padStart(3, '0')}`
    };

    this._orders.update(orders => [...orders, newOrder]);
    this._nextId.update(id => id + 1);

    return newOrder;
  }

  async update(id: number, order: Partial<Order>): Promise<Order | undefined> {
    await this.simulateDelay(300);

    const index = this._orders().findIndex(o => o.id === id);
    if (index === -1) return undefined;

    const updatedOrder = { ...this._orders()[index], ...order };

    this._orders.update(orders => {
      const newOrders = [...orders];
      newOrders[index] = updatedOrder;
      return newOrders;
    });

    return updatedOrder;
  }

  async delete(id: number): Promise<boolean> {
    await this.simulateDelay(300);

    const index = this._orders().findIndex(o => o.id === id);
    if (index === -1) return false;

    this._orders.update(orders => orders.filter(o => o.id !== id));
    return true;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
