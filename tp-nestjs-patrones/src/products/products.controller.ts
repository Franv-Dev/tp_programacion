
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /products
  // GET /products?minPrice=100&maxPrice=500  (filtro opcional por precio)
  @Get()
  findAll(
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    // Si vino algún filtro de precio, filtramos; si no, devolvemos todo.
    if (minPrice !== undefined || maxPrice !== undefined) {
      return this.productsService.filterByPriceRange(
        minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice !== undefined ? Number(maxPrice) : undefined,
      );
    }
    return this.productsService.findAll();
  }

  // GET /products/search?name=algo
  // Debe declararse ANTES de "@Get(':id')" para no chocar con esa ruta.
  @Get('search')
  search(@Query('name') name: string) {
    return this.productsService.search(name ?? '');
  }

  // GET /products/category/:categoryId
  // También debe ir antes de "@Get(':id')" por el mismo motivo.
  @Get('category/:categoryId')
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.findByCategory(categoryId);
  }

  // GET /products/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // POST /products
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // PUT /products/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
