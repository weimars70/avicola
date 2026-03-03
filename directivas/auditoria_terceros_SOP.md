# Directiva Técnica: Integración Terceros con Inventario y Finanzas

## Objetivo
Documentar cómo el flujo de gestión de Terceros interactúa de forma transversal con Finanzas e Inventario para mantener un aislamiento adecuado por Empresa y evitar regresiones al momento de actualizar o crear compras/ventas.

## Entradas y Salidas
- **Compras-Terceros**: `POST /compras-terceros` toma canastas y cantidades del usuario, creando la compra, los detalles e ingresando al `inventario_terceros` a base de las sumas/restas controladas transaccionalmente. Adicionalmente, si la compra está como "PAGADA", impacta a Gastos (`gastosService`).
- **Ventas-Terceros**: `POST /ventas-terceros` repite este proceso pero validando que el inventario origen no sobrepase la demanda. Si se vende, impacta el `inventario_terceros` como `salida` y asíncronamente impacta los Ingresos (`ingresosService`).

## Reglas y Lógica Estrictas (CRITICO)

1. **Aislamiento Multi-tenant (`id_empresa`)**:
   - Tanto Compras como Ventas aseguran inyectar a nivel servicio el `id_empresa` del token. 
   - Cualquier cálculo de stock mediante `getRawOne()` aplica obligatoriamente la regla `WHERE i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo`. Nunca se calcula de manera global ni agnóstica a la cuenta usuaria.
   
2. **Cálculos de Inventario y Finanzas**:
   - Inventario está modelado por Eventos `entrada`/`salida`. El cálculo es SIEMPRE la suma de ambos con este query: `SELECT COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)`. 
   - Finanzas de Ventas usa `setImmediate(async () => { ... createIngresoDesdeVenta })` para evitar demorar el Request.
   - Estos métodos ya están enlazados. Modificarlos afectará Finanzas e Inventario en tiempo real.

## Restricciones y Casos Borde (Memoria)

- **Asegurar Sincronización al Actualizar/Eliminar**: Si una compra o venta de terceros se elimina (o actualiza su estado o monto), obligatoriamente sus dependencias pasivas (como `gastoRelacionado` o `ingresoRelacionado`) así como el registro anterior del inventario deben marcarse como `activo: false`. No usar Hard Delete. La base de datos es orientada a auditoria y soft-delete completo.
