import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

// Interfaces
interface SelectOption {
  id: string;
  name: string;
}

interface TaxGroup {
  id: string;
  name: string;
  rate: number;
}

interface Currency {
  id: string;
  name: string;
  symbol: string;
  rate: number;
}

interface Product {
  id: string;
  itemCode: string;
  description: string;
  unit: string;
  price: number;
}

interface InvoiceItem {
  id: number;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  price: number;
  amount: number;
  expense: number;
}

interface InvoiceHeader {
  docId: string;
  voucherNumber: string;
  date: Date;
  vendorId: string;
  vendorName: string;
  reference: string;
  buyer: string;
  shippingMethod: string;
  reference2: string;
  paymentTerm: string;
  taxGroup: string;
  currency: string;
  currencyRate: number;
  dueDate: Date;
  vendorRef: string;
}

interface InvoiceFooter {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  totalExpenses: number;
  note: string;
}

@Component({
  selector: 'app-proforma-invoice',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    TextareaModule,
    TableModule,
    TooltipModule,
    DividerModule
  ],
  templateUrl: './proforma-invoice.component.html',
  styleUrl: './proforma-invoice.component.scss'
})
export class ProformaInvoiceComponent implements OnInit {
  // Counter for auto-increment voucher number
  private voucherCounter = 1;

  // Sample Data
  docIds: SelectOption[] = [
    { id: 'IMPI', name: 'IMPI - Import Proforma Invoice' },
    { id: 'EXPI', name: 'EXPI - Export Proforma Invoice' },
    { id: 'LOPI', name: 'LOPI - Local Proforma Invoice' },
    { id: 'SRPI', name: 'SRPI - Service Proforma Invoice' },
    { id: 'GNPI', name: 'GNPI - General Proforma Invoice' }
  ];

  vendors: SelectOption[] = [
    { id: '210101A0001', name: 'Al Futtaim Trading LLC' },
    { id: '210101A0002', name: 'Emirates Steel Industries' },
    { id: '210101A0003', name: 'Dubai Building Materials Co' },
    { id: '210101A0004', name: 'Gulf Construction Supplies' },
    { id: '210101A0005', name: 'National Hardware Trading' }
  ];

  buyers: SelectOption[] = [
    { id: 'BUY001', name: 'Ahmed Hassan' },
    { id: 'BUY002', name: 'Mohammed Ali' },
    { id: 'BUY003', name: 'Sara Khan' },
    { id: 'BUY004', name: 'Fatima Omar' },
    { id: 'BUY005', name: 'Khalid Rashid' }
  ];

  paymentTerms: SelectOption[] = [
    { id: 'P-10001', name: 'Net 30 Days' },
    { id: 'P-10002', name: 'Net 60 Days' },
    { id: 'P-10003', name: 'Net 90 Days' },
    { id: 'P-10004', name: 'Cash on Delivery' },
    { id: 'P-10005', name: '50% Advance, 50% on Delivery' }
  ];

  shippingMethods: SelectOption[] = [
    { id: 'SHP001', name: 'Sea Freight' },
    { id: 'SHP002', name: 'Air Freight' },
    { id: 'SHP003', name: 'Road Transport' },
    { id: 'SHP004', name: 'Express Delivery' },
    { id: 'SHP005', name: 'Customer Pickup' }
  ];

  taxGroups: TaxGroup[] = [
    { id: 'TAX01', name: 'VAT 5%', rate: 5 },
    { id: 'TAX02', name: 'VAT 0%', rate: 0 },
    { id: 'TAX03', name: 'VAT Exempt', rate: 0 },
    { id: 'TAX04', name: 'Custom Tax 10%', rate: 10 },
    { id: 'TAX05', name: 'Service Tax 5%', rate: 5 }
  ];

  currencies: Currency[] = [
    { id: 'AED', name: 'AED - UAE Dirham', symbol: 'AED', rate: 1.00 },
    { id: 'USD', name: 'USD - US Dollar', symbol: '$', rate: 3.67 },
    { id: 'EUR', name: 'EUR - Euro', symbol: '€', rate: 4.02 },
    { id: 'GBP', name: 'GBP - British Pound', symbol: '£', rate: 4.65 },
    { id: 'SAR', name: 'SAR - Saudi Riyal', symbol: 'SAR', rate: 0.98 }
  ];

  products: Product[] = [
    { id: 'P001', itemCode: '010101040009', description: 'AGGREGATE', unit: 'MT', price: 6.00 },
    { id: 'P002', itemCode: '010102010008', description: 'CARRO JOINT TILE GROUT CJS 60', unit: 'BAG', price: 3.50 },
    { id: 'P003', itemCode: '010102050001', description: 'MASTERTILE 30 WHITE', unit: 'BAG', price: 14.00 },
    { id: 'P004', itemCode: '010102060004', description: 'NEOFIL WATERPROOF LATEX MODIFIED TILE ADHESIVE', unit: 'BAG', price: 5.00 },
    { id: 'P005', itemCode: '010102070002', description: 'CEMENT OPC 50KG', unit: 'BAG', price: 12.50 },
    { id: 'P006', itemCode: '010102080003', description: 'SAND FINE WASHED', unit: 'MT', price: 45.00 },
    { id: 'P007', itemCode: '010102090001', description: 'STEEL REBAR 12MM', unit: 'TON', price: 2500.00 },
    { id: 'P008', itemCode: '010102100005', description: 'PLYWOOD 18MM MARINE', unit: 'SHEET', price: 85.00 }
  ];

  // Header Data
  header = signal<InvoiceHeader>({
    docId: 'IMPI',
    voucherNumber: 'IMPI00001',
    date: new Date(),
    vendorId: '',
    vendorName: '',
    reference: '',
    buyer: '',
    shippingMethod: '',
    reference2: '',
    paymentTerm: '',
    taxGroup: 'TAX01',
    currency: 'AED',
    currencyRate: 1.00,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    vendorRef: ''
  });

  // Items Data
  items = signal<InvoiceItem[]>([]);
  private itemIdCounter = 0;

  // Footer Data
  footer = signal<InvoiceFooter>({
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    totalExpenses: 0,
    note: ''
  });

  // Computed values
  selectedCurrency = computed(() => {
    const curr = this.currencies.find(c => c.id === this.header().currency);
    return curr || this.currencies[0];
  });

  selectedTaxRate = computed(() => {
    const tax = this.taxGroups.find(t => t.id === this.header().taxGroup);
    return tax?.rate || 0;
  });

  ngOnInit(): void {
    this.calculateTotals();
  }

  // Vendor selection handler
  onVendorChange(vendorId: string): void {
    const vendor = this.vendors.find(v => v.id === vendorId);
    this.header.update(h => ({
      ...h,
      vendorId: vendorId,
      vendorName: vendor?.name || ''
    }));
  }

  // Currency change handler
  onCurrencyChange(currencyId: string): void {
    const currency = this.currencies.find(c => c.id === currencyId);
    this.header.update(h => ({
      ...h,
      currency: currencyId,
      currencyRate: currency?.rate || 1
    }));
  }

  // Doc ID change handler - updates voucher number prefix
  onDocIdChange(docId: string): void {
    this.header.update(h => ({
      ...h,
      docId: docId,
      voucherNumber: `${docId}${String(this.voucherCounter).padStart(5, '0')}`
    }));
  }

  // Add new row
  addNewRow(): void {
    const newItem: InvoiceItem = {
      id: ++this.itemIdCounter,
      itemCode: '',
      description: '',
      unit: '',
      quantity: 0,
      price: 0,
      amount: 0,
      expense: 0
    };
    this.items.update(items => [...items, newItem]);
  }

  // Remove row
  removeRow(item: InvoiceItem): void {
    this.items.update(items => items.filter(i => i.id !== item.id));
    this.calculateTotals();
  }

  // Product selection handler
  onProductSelect(item: InvoiceItem, productId: string): void {
    const product = this.products.find(p => p.itemCode === productId);
    if (product) {
      // Direct mutation to avoid re-render
      item.itemCode = product.itemCode;
      item.description = product.description;
      item.unit = product.unit;
      item.price = product.price;
      item.quantity = 0;
      item.amount = 0;
    }
    this.calculateTotals();
  }

  // Quantity/Price change handler
  onItemChange(item: InvoiceItem): void {
    // Direct mutation to avoid re-render
    item.amount = item.quantity * item.price;
    this.calculateTotals();
  }

  // Calculate totals and distribute expenses
  calculateTotals(): void {
    const currentItems = this.items();
    const currentFooter = this.footer();

    // Calculate subtotal
    const subtotal = currentItems.reduce((sum, item) => sum + item.amount, 0);

    // Calculate discount amount
    const discountAmount = (subtotal * currentFooter.discountPercent) / 100;

    // Calculate tax
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * this.selectedTaxRate()) / 100;

    // Calculate total
    const total = taxableAmount + taxAmount;

    // Distribute expenses proportionally based on quantity (direct mutation)
    const totalQuantity = currentItems.reduce((sum, item) => sum + item.quantity, 0);
    currentItems.forEach(item => {
      item.expense = (totalQuantity > 0 && currentFooter.totalExpenses > 0)
        ? (item.quantity / totalQuantity) * currentFooter.totalExpenses
        : 0;
    });

    this.footer.update(f => ({
      ...f,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  }

  // Discount change handler
  onDiscountChange(): void {
    this.calculateTotals();
  }

  // Total Expenses change handler
  onTotalExpensesChange(): void {
    this.calculateTotals();
  }

  // Update header field
  updateHeader(field: keyof InvoiceHeader, value: any): void {
    this.header.update(h => ({ ...h, [field]: value }));
    if (field === 'taxGroup') {
      this.calculateTotals();
    }
  }

  // Update footer field
  updateFooter(field: keyof InvoiceFooter, value: any): void {
    this.footer.update(f => ({ ...f, [field]: value }));
    if (field === 'discountPercent' || field === 'totalExpenses') {
      this.calculateTotals();
    }
  }

  // Save handler
  save(): void {
    const invoiceData = {
      header: this.header(),
      items: this.items(),
      footer: this.footer(),
      metadata: {
        createdAt: new Date().toISOString(),
        currency: this.selectedCurrency(),
        taxRate: this.selectedTaxRate()
      }
    };

    console.log('=== PROFORMA INVOICE DATA ===');
    console.log(JSON.stringify(invoiceData, null, 2));
    console.log('=============================');

    // Show in alert for visibility
    // alert('Invoice saved! Check console for the full data object.');
  }

  // Clear handler
  clear(): void {
    this.voucherCounter++;

    this.header.set({
      docId: 'IMPI',
      voucherNumber: `IMPI${String(this.voucherCounter).padStart(5, '0')}`,
      date: new Date(),
      vendorId: '',
      vendorName: '',
      reference: '',
      buyer: '',
      shippingMethod: '',
      reference2: '',
      paymentTerm: '',
      taxGroup: 'TAX01',
      currency: 'AED',
      currencyRate: 1.00,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      vendorRef: ''
    });

    this.items.set([]);
    this.itemIdCounter = 0;

    this.footer.set({
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
      totalExpenses: 0,
      note: ''
    });
  }

  // Helper to get vendor name by ID
  getVendorName(vendorId: string): string {
    const vendor = this.vendors.find(v => v.id === vendorId);
    return vendor?.name || '';
  }
}
