// discount-context.ts
//
// Es el "contexto" del patrón Strategy: sabe qué estrategia usar
// según el tipo de cliente, pero no sabe cómo cada una calcula
// el descuento (eso lo decide cada clase por su cuenta).

import { Injectable } from '@nestjs/common';
import { DiscountStrategy } from './discount-strategy.interface';
import { NoDiscountStrategy } from './no-discount.strategy';
import { StudentDiscountStrategy } from './student-discount.strategy';
import { PremiumDiscountStrategy } from './premium-discount.strategy';
import { BlackFridayDiscountStrategy } from './black-friday-discount.strategy';
import { CustomerType } from '../entities/order.entity';

@Injectable()
export class DiscountContext {
  // Para agregar un tipo de cliente/descuento nuevo: se crea la
  // clase y se agrega acá. No hay que tocar ninguna otra estrategia.
  private readonly strategies: Record<CustomerType, DiscountStrategy> = {
    regular: new NoDiscountStrategy(),
    student: new StudentDiscountStrategy(),
    premium: new PremiumDiscountStrategy(),
    blackFriday: new BlackFridayDiscountStrategy(),
  };

  calculateDiscount(customerType: CustomerType, subtotal: number): number {
    const strategy = this.strategies[customerType];
    return strategy.calculate(subtotal);
  }
}
