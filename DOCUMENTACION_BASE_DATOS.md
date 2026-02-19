# Documentación de Almacenamiento y Flujo de Datos

Este documento detalla la estructura de base de datos, relaciones y flujo de información para los módulos de **Compras a Terceros** y **Ventas a Terceros**.

## 1. Estructura de Base de Datos

### Tabla: `compras`
Almacena la cabecera de las compras realizadas a terceros.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único de la compra |
| `fecha` | DATE | Fecha de registro de la compra |
| `numero_factura` | VARCHAR | Número de factura o remisión del proveedor |
| `id_tercero` | INT | FK a la tabla `terceros` |
| `total` | DECIMAL(10,2) | Valor total de la compra (calculado) |
| `estado` | VARCHAR | Estado: 'PENDIENTE', 'PAGADO', 'PARCIAL' |
| `forma_pago` | VARCHAR | Método de pago (Efectivo, Transferencia, etc) |
| `observaciones` | TEXT | Notas adicionales |
| `tipo_movimiento` | INT | **2** para Compras a Terceros |
| `id_empresa` | INT | Identificador de la empresa (Multi-tenancy) |
| `activo` | BOOLEAN | Soft delete (true=activo, false=eliminado) |

### Tabla: `detalle_compras`
Almacena los items individuales de cada compra.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único del detalle |
| `id_compra` | UUID | FK a `compras` |
| `canasta_id` | VARCHAR | FK a `canastas` (Tipo de producto) |
| `cantidad` | INT | Cantidad de canastas compradas |
| `precio_unitario` | DECIMAL(10,2) | Costo por unidad |
| `tipo_movimiento` | INT | **2** (Heredado de la compra) |

---

### Tabla: `ventas`
Almacena la cabecera de las ventas realizadas a terceros.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único de la venta |
| `fecha` | DATE | Fecha de la venta |
| `numero_factura` | VARCHAR | Factura de venta |
| `id_tercero` | INT | FK a `terceros` (Cliente) |
| `total` | DECIMAL(10,2) | Valor total de la venta |
| `estado` | VARCHAR | Estado de pago |
| `tipo_movimiento` | INT | **2** para Ventas a Terceros |
| `id_empresa` | INT | Identificador de la empresa |

### Tabla: `detalle_ventas`
Items de la venta.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | PK |
| `id_venta` | UUID | FK a `ventas` |
| `canasta_id` | VARCHAR | FK a `canastas` |
| `cantidad` | INT | Cantidad vendida |
| `precio_unitario` | DECIMAL(10,2) | Precio de venta |
| `inventario_origen` | INT | **1**=Propias, **2**=Terceros |

## 2. Flujo de Datos

### Creación de Compra (Frontend -> Backend)
1. **Frontend (`ComprasTercerosPage.vue`)**:
   - Recopila datos del formulario (`idTercero`, `fecha`, `detalles[]`).
   - Calcula el total visualmente sumando `cantidad * precioUnitario` de los detalles.
   - Envía POST a `/compras-terceros`.

2. **Backend (`ComprasTercerosService.create`)**:
   - Recibe el DTO.
   - Crea la entidad `Compra` con `tipoMovimiento = 2`.
   - Itera los detalles para crear entidades `DetalleCompra`.
   - **Inventario**: Por cada detalle, crea un registro en `inventario_terceros` con `tipo_movimiento = 'entrada'`. Esto actualiza el stock disponible de canastas de terceros.
   - **Finanzas**: Opcionalmente genera un registro en `gastos` si la compra se marca como pagada o genera deuda.

### Consulta de Inventario (Backend -> Frontend)
1. **Endpoint**: `GET /compras-terceros/inventario-canastas`
2. **Lógica (`getInventarioCanastas`)**:
   - **Compras**: Agrupa `detalle_compras` por `canasta_id` para sumar total unidades compradas y valor invertido.
   - **Stock**: Consulta `inventario_terceros` sumando entradas y restando salidas para obtener el stock actual disponible.
   - **Respuesta**: Combina ambos datos para devolver un objeto con `resumen`, `porCanasta` y `evolucionMensual`.

## 3. Relaciones (TypeORM)

```typescript
// Compra Entity
@OneToMany(() => DetalleCompra, detalle => detalle.compra, { cascade: true })
detalles: DetalleCompra[];

@ManyToOne(() => Tercero)
@JoinColumn({ name: 'id_tercero' })
tercero: Tercero;

// DetalleCompra Entity
@ManyToOne(() => Compra, compra => compra.detalles)
@JoinColumn({ name: 'id_compra' })
compra: Compra;

@ManyToOne(() => Canasta)
@JoinColumn({ name: 'canasta_id' })
canasta: Canasta;
```

## 4. Cálculo de Totales

- **Total Compra**: Se calcula en el backend al guardar/actualizar como la suma de `detalle.cantidad * detalle.precioUnitario`.
- **Promedio Ponderado**: Para informes, el precio promedio de una canasta se calcula como `Sum(Valor Total Invertido) / Sum(Total Unidades Compradas)`. No se usa promedio simple de precios unitarios.
- **Stock Disponible**: `Sum(Entradas en inventario_terceros) - Sum(Salidas en inventario_terceros)`.
