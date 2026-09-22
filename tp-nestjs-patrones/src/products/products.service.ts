

import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFactory } from './factories/product-factory';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  constructor(private readonly categoriesService: CategoriesService) {

    this.products.push(
      ProductFactory.create('physical', {
        id: this.nextId++,
        name: 'Mouse inalámbrico',
        description: 'Mouse ergonómico con batería recargable',
        price: 15000,
        stock: 20,
        categoryId: 1,
      }),
    );
    this.products.push(
      ProductFactory.create('digital', {
        id: this.nextId++,
        name: 'Curso de NestJS',
        description: 'Curso online en video sobre NestJS',
        price: 8000,
        stock: 999,
        categoryId: 1,
      }),
    );
  }

  // GET /products
  findAll(): Product[] {
    return this.products;
  }

  // GET /products/:id
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  // POST /products
  create(dto: CreateProductDto): Product {
    // Validamos que la categoría exista. Si no existe, findOne()
    // del CategoriesService ya lanza un NotFoundException (404).
    this.categoriesService.findOne(dto.categoryId);

    // Acá es donde se usa el patrón FACTORY METHOD: no hacemos
    // "new PhysicalProduct(...)" acá, sino que le delegamos la
    // decisión de qué clase instanciar a la ProductFactory.
    const newProduct = ProductFactory.create(dto.type, {
      id: this.nextId++,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      categoryId: dto.categoryId,
    });

    this.products.push(newProduct);
    return newProduct;
  }

  // PUT /products/:id
  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);

    // Si mandan un nuevo categoryId, validamos que exista.
    if (dto.categoryId !== undefined) {
      this.categoriesService.findOne(dto.categoryId);
    }

    // Si cambia el "type", tiene sentido recrear la instancia con
    // la Factory, para que sea del subtipo correcto.
    if (dto.type !== undefined && dto.type !== product.type) {
      const updated = ProductFactory.create(dto.type, {
        id: product.id,
        name: dto.name ?? product.name,
        description: dto.description ?? product.description,
        price: dto.price ?? product.price,
        stock: dto.stock ?? product.stock,
        categoryId: dto.categoryId ?? product.categoryId,
      });
      this.products = this.products.map((p) => (p.id === id ? updated : p));
      return updated;
    }

    // Si no cambia el tipo, actualizamos las propiedades in-place.
    Object.assign(product, dto);
    return product;
  }

  // DELETE /products/:id
  remove(id: number): { message: string } {
    const product = this.findOne(id);
    this.products = this.products.filter((p) => p.id !== product.id);
    return { message: `Producto ${id} eliminado correctamente` };
  }

  // GET /products/category/:categoryId
  findByCategory(categoryId: number): Product[] {
    // Validamos que la categoría exista (404 si no).
    this.categoriesService.findOne(categoryId);
    return this.products.filter((p) => p.categoryId === categoryId);
  }

  // GET /products/search?name=...
  search(name: string): Product[] {
    const term = name.toLowerCase().trim();
    return this.products.filter((p) => p.name.toLowerCase().includes(term));
  }

  // GET /products?minPrice=...&maxPrice=...
  filterByPriceRange(minPrice?: number, maxPrice?: number): Product[] {
    return this.products.filter((p) => {
      const cumpleMinimo = minPrice === undefined || p.price >= minPrice;
      const cumpleMaximo = maxPrice === undefined || p.price <= maxPrice;
      return cumpleMinimo && cumpleMaximo;
    });
  }
}
