// =============================================================
// create-order.dto.ts
// -------------------------------------------------------------
// Datos necesarios para crear un pedido (POST /orders):
//   - items: qué productos y cuántas unidades de cada uno.
//   - customerType: define qué DiscountStrategy se va a aplicar
//     (ver src/orders/discounts). Este campo es el "disparador"
//     del patrón Strategy.
// =============================================================

import {
  ArrayMinSize,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { CustomerType } from '../entities/order.entity';

export class CreateOrderDto {
  @IsArray({ message: 'items debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un producto' })
  @ValidateNested({ each: true }) // valida cada OrderItemDto dentro del array
  @Type(() => OrderItemDto) // necesario para que class-validator sepa qué clase instanciar
  items: OrderItemDto[];

  @IsIn(['regular', 'student', 'premium', 'blackFriday'], {
    message: 'customerType debe ser: regular, student, premium o blackFriday',
  })
  customerType: CustomerType;
}
