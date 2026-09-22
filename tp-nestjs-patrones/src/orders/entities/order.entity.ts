// =============================================================
// order.entity.ts
// -------------------------------------------------------------
// Representa un pedido ya creado en el sistema.
// =============================================================

export type CustomerType = 'regular' | 'student' | 'premium' | 'blackFriday';
export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number; // precio del producto al momento de comprar (snapshot)
}

export class Order {
  id: number;
  items: OrderItem[];
  customerType: CustomerType;
  subtotal: number; // suma de (precio unitario * cantidad) sin descuento
  discount: number; // monto de descuento aplicado (calculado con Strategy)
  total: number; // subtotal - discount
  status: OrderStatus;
  paymentTransactionId?: string; // id devuelto por el Adapter de pago
  createdAt: Date;
}
