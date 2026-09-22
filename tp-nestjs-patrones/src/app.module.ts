
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ProductsModule, // Todo lo relacionado a productos (CRUD, factory, etc.)
    CategoriesModule, // Todo lo relacionado a categorías (CRUD)
    OrdersModule, // Todo lo relacionado a pedidos (CRUD + Adapter + Strategy)
  ],
})
export class AppModule {}
