// =============================================================
// create-category.dto.ts
// -------------------------------------------------------------
// DTO = "Data Transfer Object". Define exactamente qué datos
// esperamos recibir en el body de un POST /categories, y con
// los decoradores de "class-validator" describimos las reglas
// de validación. Nest valida esto automáticamente gracias al
// ValidationPipe global que configuramos en main.ts.
// =============================================================

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;
}
