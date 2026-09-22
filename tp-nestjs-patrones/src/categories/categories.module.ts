// =============================================================
// categories.module.ts
// -------------------------------------------------------------
// El MÓDULO agrupa todo lo relacionado a "categorías": su
// controller y su service. Lo exportamos (exports) por si otro
// módulo (como Products u Orders) necesita usar el
// CategoriesService para, por ejemplo, validar que una categoría
// exista antes de crear un producto.
// =============================================================

import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // lo dejamos disponible para otros módulos
})
export class CategoriesModule {}
