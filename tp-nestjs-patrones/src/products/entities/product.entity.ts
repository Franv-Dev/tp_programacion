
export type ProductType = 'physical' | 'digital' | 'service';

export abstract class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  readonly type: ProductType;

  protected constructor(params: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    type: ProductType;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.price = params.price;
    this.stock = params.stock;
    this.categoryId = params.categoryId;
    this.type = params.type;
  }

  // Cada subtipo define cómo calcular/describir su propio envío.
  abstract getShippingInfo(): string;
}
