// =============================================================
// category.entity.ts
// -------------------------------------------------------------
// Una "entidad" es la forma que tiene el dato dentro de nuestro
// sistema (lo que se guarda/lee). No tiene decoradores de
// validación porque las validaciones viven en los DTOs de
// entrada (create/update), no en la entidad en sí.
// =============================================================

export class Category {
  id: number;
  name: string;
  description: string;
}
