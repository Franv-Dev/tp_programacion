// =============================================================
// orders.module.ts
// -------------------------------------------------------------
// Este módulo agrupa TODO lo relacionado a pedidos:
//   - El CRUD (controller + service).
//   - El patrón Strategy (DiscountContext).
//   - El patrón Adapter (PaymentService + PaymentAdapter).
// Y además importa ProductsModule para poder validar productos
// y descontar stock al crear un pedido.
// =============================================================

import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';
import { DiscountContext } from './discounts/discount-context';
import { PaymentService } from './payment/payment.service';
import { PaymentAdapter } from './payment/payment.adapter';

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    DiscountContext, // Strategy
    PaymentService, // Adapter (capa de negocio)
    PaymentAdapter, // Adapter (traductor hacia el servicio externo)
  ],
})
export class OrdersModule {}
