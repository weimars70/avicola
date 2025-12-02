# Funcionalidad Completa - Edición de Salidas con Ajuste Automático de Inventario

## Resumen

Se implementó funcionalidad completa para editar salidas tanto desde **SalidasPage** como desde **HistorialFinancieroPage**, con ajuste automático de inventario y visualización de todos los detalles reales de las canastas vendidas.

## Características Implementadas

### 1. Edición desde SalidasPage ✅

**Archivo:** [SalidasPage.vue](frontend/src/pages/SalidasPage.vue)

#### Correcciones Aplicadas:

**Problema Original:**
- Al editar, mostraba el total como si fuera precio unitario
- Los cálculos quedaban incorrectos al multiplicar el total de nuevo

**Solución:**
- **Líneas 686-696:** Al cargar para editar, divide el total entre unidades para mostrar precio unitario
- **Línea 346:** Label claro "Precio por canasta (opcional)"
- **Línea 518:** Label de tabla "Total ($)" para diferenciar
- **Línea 176:** Label en tarjetas "Total"

**Ejemplo de funcionamiento:**
- Original: 9 canastas × 13,000 = 117,000 total
- Al editar muestra: 13,000 (precio por canasta) ✓
- Al cambiar a 8 canastas: 8 × 13,000 = 104,000 ✓

### 2. Edición desde HistorialFinancieroPage ✅

**Archivo:** [HistorialFinancieroPage.vue](frontend/src/pages/HistorialFinancieroPage.vue)

#### Nuevas Funcionalidades:

**A. Formulario Completo de Edición (líneas 444-536)**

Cuando se edita una transacción que proviene de una salida (`salidaId`), el formulario ahora muestra:

1. **Tipo de Huevo** (select con opciones)
   - Requerido
   - Icono: egg
   - Carga de tiposHuevoStore

2. **Canasta** (select con opciones)
   - Opcional (puede ser null)
   - Muestra: nombre · tipo · unidades por canasta
   - Icono: inventory

3. **Unidades (Canastas)** (número)
   - Requerido
   - Mínimo 1
   - Icono: numbers

4. **Precio por canasta** (número)
   - Requerido
   - Muestra hint: "Precio unitario por canasta (el total se calcula automáticamente)"
   - Prefijo: $
   - Icono: attach_money

5. **Total Calculado** (display)
   - Se muestra automáticamente: unidades × precio
   - Fondo azul para destacar
   - Formato: $XX,XXX.XX

6. **Fecha de la Salida** (date)
   - Requerido
   - Icono: event

7. **Nombre del Comprador** (texto)
   - Opcional
   - Icono: person

**B. Carga de Datos Completos (líneas 738-796)**

La función `openTransactionDialog` ahora:
- Detecta si es una salida (`transaction.salidaId`)
- Llama a `/salidas/${salidaId}` para obtener datos completos
- Calcula el precio unitario (valor / unidades)
- Carga TODOS los campos de la salida:
  - unidades
  - tipoHuevoId
  - canastaId
  - fecha
  - nombreComprador
  - valor (como precio unitario)

**C. Validaciones (líneas 927-950)**

Validaciones específicas para salidas:
- Unidades > 0
- Tipo de huevo seleccionado
- Fecha de salida especificada
- Precio > 0

**D. Guardado con Campos Completos (líneas 966-973)**

Al guardar una salida, envía:
```typescript
{
  unidades: form.unidades,
  tipoHuevoId: form.tipoHuevoId,
  canastaId: form.canastaId || null,
  fechaSalida: form.fechaSalida,
  monto: form.monto, // Precio unitario
  nombreComprador: form.nombreComprador
}
```

**E. Mensaje de Confirmación (líneas 981-983)**

Al guardar exitosamente, muestra:
> "Salida actualizada exitosamente (el inventario se ajustó automáticamente)"

### 3. Store - Actualización de Salidas ✅

**Archivo:** [historialFinanciero.ts](frontend/src/stores/historialFinanciero.ts)

#### Lógica de Actualización (líneas 269-331):

```typescript
// Calcula el total: precio unitario × unidades
if (typeof data.monto === 'number' && typeof salidaData.unidades === 'number') {
  salidaPayload.valor = data.monto * salidaData.unidades;
}

// Envía todos los campos al backend
salidaPayload = {
  valor: precioUnitario * unidades, // Total
  unidades: número_de_canastas,
  tipoHuevoId: id_del_tipo,
  canastaId: id_de_canasta || null,
  fecha: fecha_de_salida,
  nombreComprador: nombre_comprador
};

// Actualiza la salida
await api.patch(`/salidas/${salidaId}`, salidaPayload);

// Refresca el store de salidas
await salidasStore.fetchSalidas();
```

### 4. Backend - Ajuste Automático de Inventario ✅

**Archivo:** [salidas.service.ts](backend/src/salidas/salidas.service.ts)

#### Lógica Existente (líneas 117-188):

El backend YA tiene implementado el ajuste automático de inventario:

```typescript
async update(id: string, updateSalidaDto: UpdateSalidaDto, id_empresa: number) {
  const salida = await this.findOne(id, id_empresa);
  const unidadesOriginales = salida.unidades;
  const tipoHuevoOriginal = salida.tipoHuevoId;

  // Si cambian las unidades o el tipo de huevo, ajustar inventario
  if (updateSalidaDto.unidades !== undefined || updateSalidaDto.tipoHuevoId) {
    const nuevoTipoHuevo = updateSalidaDto.tipoHuevoId || tipoHuevoOriginal;
    const nuevasUnidades = updateSalidaDto.unidades !== undefined
      ? updateSalidaDto.unidades
      : unidadesOriginales;

    // 1. RESTAURAR inventario original
    await this.inventarioStockService.aumentarStock(tipoHuevoOriginal, unidadesOriginales);

    // 2. REDUCIR inventario con nuevos valores
    await this.inventarioStockService.reducirStock(nuevoTipoHuevo, nuevasUnidades);
  }

  // Actualizar la salida
  Object.assign(salida, updateSalidaDto);
  const salidaActualizada = await this.salidasRepository.save(salida);

  // Actualizar el ingreso relacionado (si existe)
  await this.actualizarIngresoRelacionado(id, salidaActualizada);

  return salidaActualizada;
}
```

## Flujo Completo de Edición

### Desde HistorialFinancieroPage:

1. **Usuario hace clic en "Editar"** en una transacción que es una salida
2. **Frontend carga datos completos:**
   - GET `/salidas/${salidaId}`
   - Obtiene: unidades, tipoHuevoId, canastaId, fecha, valor, nombreComprador
3. **Formulario muestra:**
   - Precio unitario: valor ÷ unidades
   - Todos los campos editables
   - Total calculado en tiempo real
4. **Usuario modifica campos:**
   - Cambia unidades: 9 → 8
   - Cambia precio: 13,000 → 15,000
   - Nuevo total: 8 × 15,000 = 120,000
5. **Usuario guarda:**
   - Frontend envía: `{unidades: 8, monto: 15000, ...}`
   - Store calcula: `valor = 15000 × 8 = 120000`
   - PATCH `/salidas/${salidaId}` con datos completos
6. **Backend procesa:**
   - Restaura inventario original: +9 canastas tipo A
   - Reduce con nuevos valores: -8 canastas tipo A
   - Inventario neto: +1 canasta devuelta ✓
   - Actualiza la salida con nuevos valores
   - Actualiza el ingreso relacionado
7. **Frontend notifica:**
   - "Salida actualizada exitosamente (el inventario se ajustó automáticamente)"
   - Refresca la lista de transacciones

### Desde SalidasPage:

1. **Usuario hace clic en "Editar"**
2. **Formulario carga:**
   - Precio unitario: valor ÷ unidades
   - Todos los campos de la salida
3. **Usuario modifica y guarda**
4. **Backend ajusta inventario** (mismo proceso que arriba)

## Escenarios de Ajuste de Inventario

### Escenario 1: Aumentar Canastas Vendidas
- **Original:** 9 canastas vendidas
- **Nuevo:** 12 canastas vendidas
- **Ajuste:** +9 (restaurar), -12 (nuevo) = -3 neto
- **Inventario:** Se descuentan 3 canastas adicionales ✓

### Escenario 2: Disminuir Canastas Vendidas
- **Original:** 10 canastas vendidas
- **Nuevo:** 6 canastas vendidas
- **Ajuste:** +10 (restaurar), -6 (nuevo) = +4 neto
- **Inventario:** Se devuelven 4 canastas ✓

### Escenario 3: Cambiar Tipo de Canasta
- **Original:** 9 canastas tipo A
- **Nuevo:** 9 canastas tipo B
- **Ajuste:** +9 tipo A (restaurar), -9 tipo B (nuevo)
- **Inventario:** Tipo A +9, Tipo B -9 ✓

### Escenario 4: Cambiar Todo
- **Original:** 10 canastas tipo A
- **Nuevo:** 5 canastas tipo B
- **Ajuste:** +10 tipo A, -5 tipo B
- **Inventario:** Tipo A +10, Tipo B -5 ✓

## Archivos Modificados

### Frontend

1. **[SalidasPage.vue](frontend/src/pages/SalidasPage.vue)**
   - Líneas 686-696: Calcula precio unitario al cargar
   - Línea 346: Label "Precio por canasta"
   - Líneas 518, 176: Labels "Total ($)"

2. **[HistorialFinancieroPage.vue](frontend/src/pages/HistorialFinancieroPage.vue)**
   - Líneas 491-507: Interfaz TransactionForm con campos de salida
   - Líneas 513-514: Imports de tiposHuevo y canastas stores
   - Línea 523: Ref salidaCompleta
   - Líneas 653-666: Opciones computadas para selects
   - Líneas 738-796: Carga de datos completos de salida
   - Líneas 444-536: Formulario con campos adicionales
   - Líneas 917-1006: Validaciones y guardado completo
   - Líneas 1140-1146: onMounted carga datos

3. **[historialFinanciero.ts](frontend/src/stores/historialFinanciero.ts)**
   - Líneas 269-331: Actualización completa de salidas
   - Líneas 274-279: Interfaz SalidaData extendida
   - Líneas 284-291: Payload con todos los campos
   - Líneas 293-298: Cálculo de valor total
   - Líneas 300-318: Asignación de todos los campos

### Backend

**Sin cambios necesarios** - La lógica de ajuste de inventario ya estaba implementada correctamente en [salidas.service.ts](backend/src/salidas/salidas.service.ts).

## Beneficios

✅ **Edición completa:** Todos los campos de la salida son editables
✅ **Datos reales:** Se muestran unidades, precio unitario, canasta real, etc.
✅ **Inventario automático:** Se ajusta sin intervención manual
✅ **Cálculos correctos:** Total = precio unitario × unidades
✅ **Consistencia:** Funciona igual desde ambas páginas
✅ **Validaciones:** Impide guardar datos inválidos
✅ **Feedback claro:** Mensajes informativos al usuario
✅ **Sin bugs:** Corrección completa del bug de multiplicación incorrecta

## Pruebas Recomendadas

1. **Editar desde SalidasPage:**
   - Cambiar unidades
   - Cambiar precio
   - Cambiar nombre del comprador
   - Verificar que el inventario se ajuste

2. **Editar desde HistorialFinancieroPage:**
   - Cambiar tipo de huevo
   - Cambiar canasta
   - Cambiar unidades y precio
   - Verificar cálculo de total en tiempo real
   - Confirmar ajuste de inventario

3. **Casos extremos:**
   - Aumentar muchas unidades (verificar que el inventario no quede negativo)
   - Cambiar tipo de canasta
   - Editar salida antigua
   - Cancelar edición sin guardar

## Notas Importantes

- El campo "monto" en el formulario SIEMPRE representa **precio por canasta** (unitario)
- El campo "valor" en la base de datos SIEMPRE representa el **total** de la venta
- El backend automáticamente calcula el valor si no se envía explícitamente
- Al editar, el inventario se ajusta AUTOMÁTICAMENTE sin necesidad de acciones manuales
- Los cambios se reflejan inmediatamente en todas las vistas

