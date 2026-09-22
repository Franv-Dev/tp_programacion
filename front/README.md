# Front del TP

Front simple hecho con Vite + React + Material UI para probar la API del TP.

## Cómo correrlo

1. Levantar la API (en otra terminal):

```bash
cd tp-nestjs-patrones
npm install
npm run start:dev
```

2. Levantar el front:

```bash
cd front
npm install
npm run dev
```

3. Abrir http://localhost:5173

La API tiene que estar corriendo en http://localhost:3000.

## Qué se puede hacer

- **Productos**: crear productos (nombre, descripción, precio, stock, categoría y tipo), buscarlos por nombre, filtrarlos por rango de precio o por categoría, ver el listado y borrarlos.
- **Categorías**: crear categorías, ver el listado y borrarlas.
- **Pedidos**: crear un pedido eligiendo producto, cantidad y tipo de cliente (Regular, Estudiante, Premium o Black Friday) para ver el descuento aplicado, cancelar un pedido (devuelve el stock) y borrarlo.
