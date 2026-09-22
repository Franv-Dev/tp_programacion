
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable() // Marca la clase como "inyectable": Nest puede crearla y pasarla a quien la necesite.
export class CategoriesService {
  // "Base de datos" en memoria. Empieza con un par de categorías de ejemplo.
  private categories: Category[] = [
    { id: 1, name: 'Electrónica', description: 'Dispositivos y gadgets' },
    { id: 2, name: 'Ropa', description: 'Indumentaria en general' },
  ];

  // Contador simple para generar IDs incrementales.
  private nextId = 3;

  // GET /categories
  findAll(): Category[] {
    return this.categories;
  }

  // GET /categories/:id
  findOne(id: number): Category {
    const category = this.categories.find((c) => c.id === id);
    if (!category) {
      // NotFoundException => Nest responde automáticamente con status 404.
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return category;
  }

  // POST /categories
  create(dto: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: this.nextId++,
      name: dto.name,
      description: dto.description,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  // PUT /categories/:id
  update(id: number, dto: UpdateCategoryDto): Category {
    const category = this.findOne(id); // ya lanza 404 si no existe
    Object.assign(category, dto); // solo pisa las propiedades que vinieron en el body
    return category;
  }

  // DELETE /categories/:id
  remove(id: number): { message: string } {
    const category = this.findOne(id); // valida que exista
    this.categories = this.categories.filter((c) => c.id !== category.id);
    return { message: `Categoría ${id} eliminada correctamente` };
  }
}
