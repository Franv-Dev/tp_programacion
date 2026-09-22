// discount-strategy.interface.ts
//
// PATRÓN DE COMPORTAMIENTO: STRATEGY
//
// Problema: calcular el descuento de un pedido depende del tipo
// de cliente. Sin este patrón, terminaríamos con un if/else
// gigante en el OrdersService con todas las reglas mezcladas.
//
// Solución: cada regla de descuento se separa en su propia clase,
// todas cumpliendo este mismo contrato (calculate). El
// OrdersService no conoce las reglas, solo le pide a "una
// estrategia" que calcule el descuento.
//
// Ventaja: agregar un nuevo tipo de descuento = crear una clase
// nueva y registrarla en discount-context.ts. No se toca nada
// del código existente.

export interface DiscountStrategy {
  calculate(subtotal: number): number;
}
