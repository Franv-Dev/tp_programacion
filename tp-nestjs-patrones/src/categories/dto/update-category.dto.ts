// =============================================================
// update-category.dto.ts
// -------------------------------------------------------------
// Para actualizar (PUT), reutilizamos el CreateCategoryDto pero
// con PartialType, que hace que TODAS sus propiedades pasen a
// ser opcionales. Así evitamos duplicar las reglas de validación:
// si el usuario manda "name", se valida como string no vacío;
// si no lo manda, no pasa nada (es opcional).
// =============================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
