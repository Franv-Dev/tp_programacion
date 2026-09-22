// =============================================================
// order-item.dto.ts
// -------------------------------------------------------------
// Representa cada línea del pedido tal como llega en el body:
// qué producto y cuántas unidades.
// =============================================================

import { IsInt, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsInt({ message: 'productId debe ser un número entero' })
  @IsPositive({ message: 'productId debe ser un id válido' })
  productId: number;

  @IsInt({ message: 'quantity debe ser un número entero' })
  @IsPositive({ message: 'quantity debe ser mayor que cero' })
  quantity: number;
}
