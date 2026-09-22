// Cliente en "blackFriday": 30% de descuento.
import { DiscountStrategy } from './discount-strategy.interface';

export class BlackFridayDiscountStrategy implements DiscountStrategy {
  calculate(subtotal: number): number {
    return subtotal * 0.3;
  }
}
