import { Injectable, signal, computed } from '@angular/core';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private _customers = signal<Customer[]>([
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0101' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0102' },
    { id: 3, name: 'Michael Brown', email: 'mbrown@email.com', phone: '+1 555-0103' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1 555-0104' },
    { id: 5, name: 'Robert Wilson', email: 'rwilson@email.com', phone: '+1 555-0105' },
  ]);
  
  private _nextId = signal(6);
  
  customers = computed(() => this._customers());
  
  getById(id: number): Customer | undefined {
    return this._customers().find(c => c.id === id);
  }
  
  create(customer: Omit<Customer, 'id'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: this._nextId()
    };
    
    this._customers.update(customers => [...customers, newCustomer]);
    this._nextId.update(id => id + 1);
    
    return newCustomer;
  }
  
  update(id: number, customer: Partial<Customer>): Customer | undefined {
    const index = this._customers().findIndex(c => c.id === id);
    
    if (index === -1) return undefined;
    
    const updatedCustomer = { ...this._customers()[index], ...customer };
    
    this._customers.update(customers => {
      const newCustomers = [...customers];
      newCustomers[index] = updatedCustomer;
      return newCustomers;
    });
    
    return updatedCustomer;
  }
  
  delete(id: number): boolean {
    const index = this._customers().findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    this._customers.update(customers => customers.filter(c => c.id !== id));
    
    return true;
  }
}
