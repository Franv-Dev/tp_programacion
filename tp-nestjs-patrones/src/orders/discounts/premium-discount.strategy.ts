// Cliente "premium": 20% de descuento.
import { DiscountStrategy } from './discount-strategy.interface';

export class PremiumDiscountStrategy implements DiscountStrategy {
  calculate(subtotal: number): number {
    return subtotal * 0.2;
  }
}
