// payment.service.ts
//
// Sigue el flujo que pide la consigna:
//   OrdersService -> PaymentService -> PaymentAdapter -> proveedor externo
//
// PaymentService es la capa "de negocio" del pago: solo sabe que
// tiene un PaymentAdapter al que pedirle que procese el pago.
// No conoce nada del proveedor externo.

import { Injectable } from '@nestjs/common';
import { PaymentAdapter, PaymentResult } from './payment.adapter';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentAdapter: PaymentAdapter) {}

  processPayment(amount: number): PaymentResult {
    return this.paymentAdapter.pay(amount);
  }
}
