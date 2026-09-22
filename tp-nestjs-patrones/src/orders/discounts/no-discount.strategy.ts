// Cliente "regular": no aplica descuento.
import { DiscountStrategy } from './discount-strategy.interface';

export class NoDiscountStrategy implements DiscountStrategy {
  calculate(_subtotal: number): number {
    return 0;
  }
}
