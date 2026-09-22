// payment.adapter.ts
//
// PATRÓN ESTRUCTURAL: ADAPTER
//
// Problema: "ExternalPaymentService" simula un proveedor de
// pagos externo (tipo Mercado Pago). Tiene una interfaz distinta
// a la que usa el resto de nuestra app: trabaja en centavos, con
// código de moneda, y devuelve nombres de campo raros (approved,
// refId). No podemos modificar una librería externa para que
// nos quede cómoda.
//
// Solución: el PaymentAdapter "traduce" entre los dos mundos.
// Hacia afuera expone un método simple, pay(amount), en pesos.
// Por dentro llama al proveedor externo y adapta su respuesta.
//
// Ventaja: si el día de mañana cambiamos de proveedor de pagos,
// solo tocamos este archivo. El resto de la app ni se entera.

import { Injectable } from '@nestjs/common';

// --- "Librería externa" simulada (interfaz distinta a la nuestra) ---
class ExternalPaymentService {
  chargeCard(amountInCents: number, currencyCode: string) {
    const refId = `EXT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return {
      approved: true,
      refId,
      message: `Pago de ${amountInCents} centavos (${currencyCode}) aprobado`,
    };
  }
}

// --- Resultado en el formato que espera NUESTRA app ---
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

@Injectable()
export class PaymentAdapter {
  private readonly externalPaymentService = new ExternalPaymentService();

  pay(amount: number): PaymentResult {
    // pesos -> centavos, que es lo que pide el proveedor externo
    const amountInCents = Math.round(amount * 100);

    const response = this.externalPaymentService.chargeCard(amountInCents, 'ARS');

    // traducimos la respuesta externa a nuestro formato
    return {
      success: response.approved,
      transactionId: response.refId,
      message: response.message,
    };
  }
}
