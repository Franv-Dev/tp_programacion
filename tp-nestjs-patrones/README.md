# TP NestJS + Patrones de Diseño

API REST desarrollada con **NestJS** y **TypeScript** para gestionar un sistema de **productos**, **categorías** y **pedidos**, aplicando tres patrones de diseño integrados a la lógica real de la aplicación (no como ejercicios aislados).

## Objetivo

Aplicar los conceptos fundamentales de NestJS (módulos, controllers, services, inyección de dependencias, DTOs con validación) junto con patrones de diseño creacionales, estructurales y de comportamiento, resolviendo problemas concretos de arquitectura dentro de una API real.

---

## Instalación

Requisitos: Node.js 18+ y npm.

```bash
# 1) Clonar el repositorio
git clone <url-del-repo>
cd tp-nestjs-patrones

# 2) Instalar dependencias
npm install
```

## Ejecución

```bash
# Modo desarrollo (se reinicia solo al guardar cambios)
npm run start:dev

# Modo build + producción
npm run build
npm run start:prod
```

La API queda disponible en `http://localhost:3000`.

---

## Estructura del proyecto

```
src/
├── main.ts                        # Punto de entrada (bootstrap, ValidationPipe global)
├── app.module.ts                  # Módulo raíz, importa los 3 módulos de negocio
│
├── categories/                    # Módulo Categories
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── categories.module.ts
│   ├── dto/
│   └── entities/
│
├── products/                      # Módulo Products
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   ├── dto/
│   ├── entities/
│   │   └── product.entity.ts      # Clase abstracta Product
│   └── factories/                 # PATRÓN CREACIONAL: Factory Method
│       ├── product-factory.ts
│       └── product-types.ts       # PhysicalProduct, DigitalProduct, ServiceProduct
│
└── orders/                        # Módulo Orders
    ├── orders.controller.ts
    ├── orders.service.ts          # Integra Strategy + Adapter
    ├── orders.module.ts
    ├── dto/
    ├── entities/
    ├── discounts/                 # PATRÓN DE COMPORTAMIENTO: Strategy
    │   ├── discount-strategy.interface.ts
    │   ├── no-discount.strategy.ts
    │   ├── student-discount.strategy.ts
    │   ├── premium-discount.strategy.ts
    │   ├── black-friday-discount.strategy.ts
    │   └── discount-context.ts
    └── payment/                   # PATRÓN ESTRUCTURAL: Adapter
        ├── payment.adapter.ts     # incluye el "proveedor externo" simulado
        └── payment.service.ts
```

Cada archivo tiene comentarios explicando **qué hace y por qué** — pensado para poder leerlo y entenderlo paso a paso.

---

## Endpoints disponibles

### Categories

| Método | Ruta               | Descripción             |
|--------|--------------------|--------------------------|
| GET    | `/categories`      | Lista todas las categorías |
| GET    | `/categories/:id`  | Obtiene una categoría por id |
| POST   | `/categories`      | Crea una categoría |
| PUT    | `/categories/:id`  | Actualiza una categoría |
| DELETE | `/categories/:id`  | Elimina una categoría |

### Products

| Método | Ruta                                   | Descripción |
|--------|-----------------------------------------|--------------|
| GET    | `/products`                             | Lista todos los productos |
| GET    | `/products?minPrice=X&maxPrice=Y`       | Filtra productos por rango de precio |
| GET    | `/products/search?name=texto`           | Busca productos por nombre |
| GET    | `/products/category/:categoryId`        | Lista productos de una categoría |
| GET    | `/products/:id`                         | Obtiene un producto por id |
| POST   | `/products`                             | Crea un producto (usa Factory Method) |
| PUT    | `/products/:id`                         | Actualiza un producto |
| DELETE | `/products/:id`                         | Elimina un producto |

Campos de un producto: `id`, `name`, `description`, `price`, `stock`, `categoryId`, `type` (`physical` | `digital` | `service`).

### Orders

| Método | Ruta            | Descripción |
|--------|-----------------|--------------|
| GET    | `/orders`       | Lista todos los pedidos |
| GET    | `/orders/:id`   | Obtiene un pedido por id |
| POST   | `/orders`       | Crea un pedido (usa Strategy + Adapter) |
| PUT    | `/orders/:id`   | Actualiza el estado de un pedido |
| DELETE | `/orders/:id`   | Elimina un pedido |

---

## Ejemplos de uso (cURL)

### Crear una categoría
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electrónica","description":"Dispositivos y gadgets"}'
```

### Crear un producto digital (Factory Method)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Curso de NestJS",
        "description": "Curso online en video",
        "price": 8000,
        "stock": 999,
        "categoryId": 1,
        "type": "digital"
      }'
```

### Filtrar productos por precio
```bash
curl "http://localhost:3000/products?minPrice=5000&maxPrice=20000"
```

### Buscar productos por nombre
```bash
curl "http://localhost:3000/products/search?name=mouse"
```

### Crear un pedido (Strategy + Adapter)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
        "items": [{ "productId": 1, "quantity": 2 }],
        "customerType": "premium"
      }'
```

Respuesta esperada (el descuento del 20% lo calculó la `PremiumDiscountStrategy` y el pago fue procesado a través del `PaymentAdapter`):
```json
{
  "id": 1,
  "items": [{ "productId": 1, "quantity": 2, "unitPrice": 15000 }],
  "customerType": "premium",
  "subtotal": 30000,
  "discount": 6000,
  "total": 24000,
  "status": "paid",
  "paymentTransactionId": "EXT-...",
  "createdAt": "..."
}
```

> El proyecto ya viene "sembrado" con 2 productos y 2 categorías de ejemplo para poder probar todo apenas se levanta el servidor, sin tener que crear datos a mano.

---

## Patrones implementados

### 1. Patrón creacional — Factory Method

**Ubicación:** `src/products/factories/product-factory.ts`

**Problema que resuelve:** evita que `ProductsService` tenga que decidir con un `if/else` qué clase concreta instanciar (`PhysicalProduct`, `DigitalProduct`, `ServiceProduct`) cada vez que se crea un producto.

**Por qué se eligió:** porque hay una jerarquía clara de tipos de producto con comportamiento propio (cada uno calcula su información de envío distinto), y el sistema necesita crear el tipo correcto en tiempo de ejecución según un dato (`type`) que llega en el request.

```
ProductFactory.create(type, data)
      │
      ├── "physical" → PhysicalProduct
      ├── "digital"  → DigitalProduct
      └── "service"  → ServiceProduct
```

**Ventajas frente a `new` directo:** desacopla al service de las clases concretas, cumple Open/Closed (agregar un tipo nuevo no modifica el service) y centraliza la lógica de creación en un solo lugar.

**Dónde se usa:** `ProductsService.create()` y `ProductsService.update()` (`src/products/products.service.ts`).

---

### 2. Patrón estructural — Adapter

**Ubicación:** `src/orders/payment/payment.adapter.ts`

**Problema que resuelve:** el "proveedor de pagos externo" (`ExternalPaymentService`, simulado) tiene una interfaz totalmente distinta a la que necesita nuestra app (recibe centavos y código de moneda, devuelve campos como `approved`/`refId`). El `Adapter` traduce entre ambos mundos sin que el resto de la app conozca los detalles del proveedor.

```
OrdersService
     │
     ▼
PaymentService
     │
     ▼
PaymentAdapter   (implementa PaymentProcessor)
     │
     ▼
ExternalPaymentService   (interfaz distinta: centavos, "approved", "refId")
```

**Por qué es necesario:** porque no podemos (ni debemos) modificar la librería externa para que "encaje" con nuestro código; el Adapter es el punto único de traducción.

**Componentes que participan:** `PaymentProcessor` (interfaz esperada), `PaymentAdapter` (traductor), `ExternalPaymentService` (proveedor externo simulado), `PaymentService` (capa de negocio que consume el Adapter).

**Ventajas:** si mañana se cambia de proveedor de pagos, solo se reemplaza el Adapter — `OrdersService` y `PaymentService` no se enteran del cambio.

**Dónde se usa:** `OrdersService.create()` (`src/orders/orders.service.ts`), a través de `PaymentService.processPayment()`.

---

### 3. Patrón de comportamiento — Strategy

**Ubicación:** `src/orders/discounts/`

**Problema que resuelve:** evita un `if/else` gigante en `OrdersService` para calcular el descuento según el tipo de cliente (`regular`, `student`, `premium`, `blackFriday`).

```
DiscountStrategy (interfaz)
      │
      ├── NoDiscountStrategy         (regular)
      ├── StudentDiscountStrategy    (10%)
      ├── PremiumDiscountStrategy    (20%)
      └── BlackFridayDiscountStrategy (30%)
```

**Por qué se eligió:** porque cada regla de descuento es independiente, puede evolucionar por separado y el sistema necesita elegir el comportamiento correcto en tiempo de ejecución según `customerType`.

**Ventajas frente a múltiples `if/else`:** cada estrategia se testea aislada, el `OrdersService` no conoce las reglas de negocio de descuentos, y agregar un nuevo tipo de descuento no requiere tocar código existente (Open/Closed).

**Cómo agregar una nueva estrategia sin modificar código existente:** crear una nueva clase que implemente `DiscountStrategy` y registrarla en el mapa de `DiscountContext` (`discount-context.ts`). Ninguna clase existente se modifica.

**Dónde se usa:** `OrdersService.create()`, a través de `DiscountContext.calculateDiscount()`.

---

## Integración de los patrones (flujo real)

```
HTTP Request
     │
     ▼
OrdersController
     │
     ▼
OrdersService
     │
     ├── ProductsService.findOne()   → valida producto y stock
     │
     ├── DiscountContext.calculateDiscount()   [STRATEGY]
     │        └── elige la estrategia según customerType
     │
     └── PaymentService.processPayment()       [ADAPTER]
              └── PaymentAdapter → ExternalPaymentService
```

El `ProductFactory` [FACTORY METHOD] se usa un paso antes, cuando se crea el producto vía `POST /products`.

---

## Validaciones (DTOs)

- **Producto:** `name` obligatorio, `description` obligatoria, `price` mayor a 0, `stock` mayor o igual a 0, `categoryId` obligatorio, `type` debe ser `physical`, `digital` o `service`.
- **Categoría:** `name` y `description` obligatorios.
- **Pedido:** `items` debe tener al menos un producto válido, `customerType` debe ser uno de los valores permitidos.

Las validaciones se aplican automáticamente gracias al `ValidationPipe` global configurado en `main.ts`. Si un dato no cumple las reglas, la API responde `400 Bad Request` con el detalle del error.

---

## Extensiones posibles (desafío adicional)

Este proyecto usa almacenamiento en memoria a propósito, para mantener el foco en NestJS y los patrones de diseño. Como extensión futura se podría incorporar:

- Persistencia real con TypeORM/Prisma (PostgreSQL o MongoDB).
- Documentación interactiva con Swagger/OpenAPI.
- Tests unitarios (Jest) para services y estrategias.
- Un cuarto patrón: **Chain of Responsibility** para encadenar validadores de pedido (`StockValidator → PriceValidator → UserValidator → PaymentValidator`).
- Autenticación y autorización (JWT).
- Dockerización del proyecto.

---

## Evidencia de funcionamiento

El proyecto fue compilado (`npm run build`) y ejecutado localmente, probando los endpoints principales con `curl`:

- `GET /products` devuelve los productos sembrados de ejemplo.
- `POST /orders` con `customerType: "premium"` calcula correctamente el descuento (20%) y procesa el pago simulado, devolviendo `status: "paid"` y un `paymentTransactionId`.
- Las validaciones de DTOs rechazan datos inválidos (ej: precio negativo) con `400 Bad Request` y un mensaje descriptivo.

Se recomienda importar la colección de endpoints en Postman/Insomnia/Thunder Client para probar el resto de los casos (categorías, filtros de productos, actualización y borrado, etc.).
