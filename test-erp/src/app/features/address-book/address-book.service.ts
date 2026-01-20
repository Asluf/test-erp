import { Injectable, signal, computed } from '@angular/core';
import { Address } from './address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
  private _addresses = signal<Address[]>([
    { id: 1, name: 'Headquarters', address: '123 Main Street', city: 'New York' },
    { id: 2, name: 'West Office', address: '456 Oak Avenue', city: 'Los Angeles' },
    { id: 3, name: 'Tech Hub', address: '789 Innovation Blvd', city: 'San Francisco' },
    { id: 4, name: 'Distribution Center', address: '321 Warehouse Rd', city: 'Chicago' },
    { id: 5, name: 'Support Office', address: '654 Help Lane', city: 'Austin' },
  ]);
  
  private _nextId = signal(6);
  
  addresses = computed(() => this._addresses());
  
  getById(id: number): Address | undefined {
    return this._addresses().find(a => a.id === id);
  }
  
  create(address: Omit<Address, 'id'>): Address {
    const newAddress: Address = {
      ...address,
      id: this._nextId()
    };
    
    this._addresses.update(addresses => [...addresses, newAddress]);
    this._nextId.update(id => id + 1);
    
    return newAddress;
  }
  
  update(id: number, address: Partial<Address>): Address | undefined {
    const index = this._addresses().findIndex(a => a.id === id);
    
    if (index === -1) return undefined;
    
    const updatedAddress = { ...this._addresses()[index], ...address };
    
    this._addresses.update(addresses => {
      const newAddresses = [...addresses];
      newAddresses[index] = updatedAddress;
      return newAddresses;
    });
    
    return updatedAddress;
  }
  
  delete(id: number): boolean {
    const index = this._addresses().findIndex(a => a.id === id);
    
    if (index === -1) return false;
    
    this._addresses.update(addresses => addresses.filter(a => a.id !== id));
    
    return true;
  }
}
