// =============================================================
// update-order.dto.ts
// -------------------------------------------------------------
// A diferencia de Products/Categories, en Orders no tiene mucho
// sentido "editar" los items de un pedido ya creado (en un caso
// real, se cancela y se crea uno nuevo). Por eso el update solo
// permite cambiar el estado (ej: marcarlo como "paid" o "cancelled").
// =============================================================

import { IsIn } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsIn(['pending', 'paid', 'cancelled'], {
    message: 'status debe ser: pending, paid o cancelled',
  })
  status: OrderStatus;
}
