

import { Product, ProductType } from '../entities/product.entity';

export class PhysicalProduct extends Product {
  constructor(params: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
  }) {
    super({ ...params, type: 'physical' as ProductType });
  }

  getShippingInfo(): string {
    return 'Requiere envío postal. Se despacha en 24-48hs.';
  }
}

export class DigitalProduct extends Product {
  constructor(params: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
  }) {
    super({ ...params, type: 'digital' as ProductType });
  }

  getShippingInfo(): string {
    return 'Entrega por descarga digital. No requiere envío.';
  }
}

export class ServiceProduct extends Product {
  constructor(params: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
  }) {
    super({ ...params, type: 'service' as ProductType });
  }

  getShippingInfo(): string {
    return 'Es un servicio, no aplica envío.';
  }
}
