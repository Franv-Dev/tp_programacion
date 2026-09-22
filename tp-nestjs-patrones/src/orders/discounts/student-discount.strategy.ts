// Cliente "student": 10% de descuento.
import { DiscountStrategy } from './discount-strategy.interface';

export class StudentDiscountStrategy implements DiscountStrategy {
  calculate(subtotal: number): number {
    return subtotal * 0.1;
  }
}
