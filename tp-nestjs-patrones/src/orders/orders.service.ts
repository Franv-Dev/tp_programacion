// orders.service.ts
//
// Acá se integran los patrones en un flujo real: valida stock,
// calcula el subtotal, aplica el descuento con Strategy y procesa
// el pago con Adapter. Al final descuenta stock y guarda el pedido.

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { DiscountContext } from './discounts/discount-context';
import { PaymentService } from './payment/payment.service';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private nextId = 1;

  constructor(
    private readonly productsService: ProductsService, // para validar productos y stock
    private readonly discountContext: DiscountContext, // Strategy: cálculo de descuento
    private readonly paymentService: PaymentService, // Adapter: procesamiento de pago
  ) {}

  // GET /orders
  findAll(): Order[] {
    return this.orders;
  }

  // GET /orders/:id
  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return order;
  }

  // POST /orders
  create(dto: CreateOrderDto): Order {
    // 1) Armamos los items del pedido validando producto y stock.
    const items: OrderItem[] = dto.items.map((itemDto) => {
      const product = this.productsService.findOne(itemDto.productId); // 404 si no existe

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${itemDto.quantity}`,
        );
      }

      return {
        productId: product.id,
        quantity: itemDto.quantity,
        unitPrice: product.price, // guardamos el precio "de hoy" como snapshot
      };
    });

    // 2) Calculamos el subtotal.
    const subtotal = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    // 3) STRATEGY: el DiscountContext elige la estrategia correcta
    //    según dto.customerType y calcula el descuento. Ni este
    //    service ni el DiscountContext saben "cómo" se calcula
    //    cada descuento puntual: eso vive en cada Strategy.
    const discount = this.discountContext.calculateDiscount(
      dto.customerType,
      subtotal,
    );

    const total = subtotal - discount;

    // 4) ADAPTER: procesamos el pago a través del PaymentService,
    //    que por dentro usa el PaymentAdapter para hablar con el
    //    "proveedor externo" simulado.
    const paymentResult = this.paymentService.processPayment(total);

    if (!paymentResult.success) {
      throw new BadRequestException('El pago fue rechazado por el proveedor');
    }

    // 5) Descontamos stock de cada producto comprado.
    items.forEach((item) => {
      const product = this.productsService.findOne(item.productId);
      product.stock -= item.quantity;
    });

    // 6) Creamos y guardamos el pedido.
    const newOrder: Order = {
      id: this.nextId++,
      items,
      customerType: dto.customerType,
      subtotal,
      discount,
      total,
      status: 'paid',
      paymentTransactionId: paymentResult.transactionId,
      createdAt: new Date(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  // PUT /orders/:id  (solo permite cambiar el status)
  update(id: number, dto: UpdateOrderDto): Order {
    const order = this.findOne(id);

    // si se cancela el pedido, devuelvo el stock
    if (dto.status === 'cancelled' && order.status !== 'cancelled') {
      order.items.forEach((item) => {
        const product = this.productsService.findOne(item.productId);
        product.stock += item.quantity;
      });
    }

    order.status = dto.status;
    return order;
  }

  // DELETE /orders/:id
  remove(id: number): { message: string } {
    const order = this.findOne(id);
    this.orders = this.orders.filter((o) => o.id !== order.id);
    return { message: `Pedido ${id} eliminado correctamente` };
  }
}
