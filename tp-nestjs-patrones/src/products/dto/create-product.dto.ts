
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor que cero' })
  price: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock debe ser mayor o igual a cero' })
  stock: number;

  @IsInt({ message: 'La categoría debe ser un id numérico' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoryId: number;

  // Tipo de producto: usado por la ProductFactory (patrón Factory Method)
  // para decidir qué subclase de Product instanciar.
  @IsIn(['physical', 'digital', 'service'], {
    message: 'El tipo debe ser: physical, digital o service',
  })
  type: ProductType;
}
