

import { BadRequestException } from '@nestjs/common';
import { Product, ProductType } from '../entities/product.entity';
import { PhysicalProduct, DigitalProduct, ServiceProduct } from './product-types';

export interface ProductCreationData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
}

export class ProductFactory {
  static create(type: ProductType, data: ProductCreationData): Product {
    switch (type) {
      case 'physical':
        return new PhysicalProduct(data);
      case 'digital':
        return new DigitalProduct(data);
      case 'service':
        return new ServiceProduct(data);
      default:
        throw new BadRequestException(
          `Tipo de producto "${type}" no soportado. Use: physical, digital o service.`,
        );
    }
  }
}
