// =============================================================
// categories.controller.ts
// -------------------------------------------------------------
// El CONTROLLER define las RUTAS HTTP. Su única responsabilidad
// es: recibir la petición, extraer los datos (params, body,
// query) y llamar al método correspondiente del service.
// NO debe tener lógica de negocio acá adentro.
// =============================================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories') // Todas las rutas de este controller empiezan con /categories
export class CategoriesController {
  // Inyección de dependencias: Nest crea el CategoriesService
  // automáticamente y lo "inyecta" acá. Nosotros no hacemos
  // "new CategoriesService()" en ningún lado.
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get() // GET /categories
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id') // GET /categories/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe convierte el param (que llega como string) a number
    // y devuelve 400 automáticamente si no es un número válido.
    return this.categoriesService.findOne(id);
  }

  @Post() // POST /categories
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id') // PUT /categories/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id') // DELETE /categories/:id
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
