# Bug Fix - Edición de Salidas

## Problema Reportado

Al editar salidas existentes, los valores se calculaban incorrectamente:

**Ejemplo del error:**
- Se crea una salida: **9 canastas a 13,000 c/u = 117,000 total**
- Al editar y cambiar a 8 canastas → El sistema guardaba: **8 canastas a 120,000 total** ❌

Los datos no se editaban correctamente y al abrir el formulario no mostraba la información correcta del precio y nombre del comprador.

## Causa Raíz

### Backend (cómo funciona)
- El campo `valor` en la base de datos guarda el **TOTAL** de la venta, no el precio unitario
- Ejemplo: 9 canastas × 13,000 = **117,000** (esto se guarda en BD)

### Frontend (el bug)

**Al cargar para editar** (línea 689 original):
```typescript
valor: salida.valor || 0  // Cargaba 117,000 (total)
```

**Al guardar** (línea 763):
```typescript
updateData.valor = parseFloat(String(form.value.valor)) * unidadesNum;
// 117,000 × 8 = 936,000 ❌
```

### El problema:
1. El formulario mostraba el **total** (117,000) como si fuera el **precio por canasta**
2. Al cambiar las unidades, multiplicaba ese total de nuevo
3. Los cálculos quedaban completamente incorrectos

## Solución Implementada

### 1. Calcular precio unitario al cargar (líneas 686-696)

```typescript
// IMPORTANTE: El campo 'valor' en BD es el TOTAL, pero en el formulario debe mostrarse como PRECIO UNITARIO
// Por eso dividimos el total entre las unidades para que el usuario vea el precio por canasta
const precioUnitario = (salida.unidades > 0 && salida.valor)
  ? (salida.valor / salida.unidades)
  : 0;

form.value = {
  tipoHuevoId: salida.tipoHuevoId,
  canastaId: salida.canastaId || null,
  unidades: salida.unidades,
  valor: precioUnitario, // Mostrar precio unitario, no total
  fecha: fechaOriginal || '',
  nombreComprador: salida.nombreComprador || ''
};
```

**Ahora al editar:**
- Total en BD: 117,000
- Unidades: 9
- Precio unitario mostrado: 117,000 / 9 = **13,000** ✓

### 2. Labels claros para evitar confusión

**Formulario (línea 346):**
```typescript
label="Precio por canasta (opcional)"
```

**Tabla (línea 518):**
```typescript
label: 'Total ($)'
```

**Tarjetas (línea 176):**
```html
<div class="detail-label">Total</div>
```

### 3. Comportamiento correcto

**Al crear:**
- Usuario ingresa: 9 canastas a 13,000
- Frontend envía: valor = 13,000 × 9 = 117,000
- BD guarda: 117,000

**Al editar:**
- BD tiene: 117,000 total, 9 unidades
- Formulario muestra: 13,000 (precio por canasta) ✓
- Usuario cambia a 8 canastas manteniendo 13,000
- Frontend envía: valor = 13,000 × 8 = 104,000 ✓
- BD guarda: 104,000 ✓

**Al editar solo el precio:**
- BD tiene: 117,000 total, 9 unidades
- Formulario muestra: 13,000 (precio por canasta)
- Usuario cambia precio a 15,000 y mantiene 9 unidades
- Frontend envía: valor = 15,000 × 9 = 135,000 ✓
- BD guarda: 135,000 ✓

## Archivos Modificados

### [SalidasPage.vue](frontend/src/pages/SalidasPage.vue)

**Líneas 686-696:** Función `openDialog` - Calcula precio unitario al cargar
```typescript
const precioUnitario = (salida.unidades > 0 && salida.valor)
  ? (salida.valor / salida.unidades)
  : 0;
```

**Línea 346:** Label del input
```typescript
label="Precio por canasta (opcional)"
```

**Línea 518:** Label de la columna en tabla
```typescript
label: 'Total ($)'
```

**Línea 176:** Label en tarjetas
```html
<div class="detail-label">Total</div>
```

## Validación

### Caso 1: Crear nueva salida
- Ingreso: 10 canastas × 12,000 = 120,000
- Guardado: ✓ 120,000 total
- Visualización: ✓ "Total: $120,000"

### Caso 2: Editar cantidad
- Original: 10 canastas × 12,000 = 120,000
- Edición: Cambio a 8 canastas (mantiene 12,000)
- Cálculo: 8 × 12,000 = 96,000
- Guardado: ✓ 96,000 total

### Caso 3: Editar precio
- Original: 10 canastas × 12,000 = 120,000
- Edición: Cambio precio a 15,000 (mantiene 10 canastas)
- Cálculo: 10 × 15,000 = 150,000
- Guardado: ✓ 150,000 total

### Caso 4: Editar ambos
- Original: 10 canastas × 12,000 = 120,000
- Edición: Cambio a 5 canastas × 20,000
- Cálculo: 5 × 20,000 = 100,000
- Guardado: ✓ 100,000 total

## Notas Importantes

1. **Compatibilidad:** La corrección no afecta registros existentes, solo corrige cómo se visualizan y editan
2. **Backend sin cambios:** El backend ya funcionaba correctamente, el error estaba solo en el frontend
3. **Consistencia:** Ahora el campo "valor" en el formulario SIEMPRE representa precio por canasta (unitario)
4. **Claridad:** Los labels distinguen claramente entre "Precio por canasta" (formulario) y "Total" (visualización)

## Resultado

✅ **Las ediciones ahora funcionan correctamente**
✅ **Los valores se calculan de forma precisa**
✅ **El formulario muestra siempre los datos correctos (precio unitario y nombre del comprador)**
✅ **No se inventan valores, todo se calcula consistentemente**
