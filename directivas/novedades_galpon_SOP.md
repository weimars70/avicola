# SOP: Implementación de Detalles Galpones (CRUD)

## Objetivo
Gestionar de forma integral las actividades, novedades y movimientos de aves en los galpones, permitiendo un historial auditable y editable.

## Pasos de Implementación

### 1. Backend (Renombramiento y CRUD)
- **Entidad `DetalleGalpon`**: 
    - Atributos: `id`, `id_galpon`, `tipo` (Suma/Resta), `cantidad`, `motivo`, `comentario`, `fecha`, `id_empresa`, `id_usuario_inserta`.
    - Tabla: `detalles_galpones`.
- **Endpoints CRUD**:
    - `POST /movimientos-galpon`: Crear.
    - `GET /movimientos-galpon/galpon/:id`: Listar por galpón.
    - `PATCH /movimientos-galpon/:id`: Actualizar detalle.
    - `DELETE /movimientos-galpon/:id`: Eliminar detalle.
- **Validaciones**:
    - Todos los endpoints deben validar `id_empresa`.
    - Las eliminaciones y ediciones deben recalcular la población en la vista del frontend.

### 2. Frontend (Interacción Completa)
- **Store Pinia**:
    - Implementar acciones `fetch`, `create`, `update`, `delete`.
- **Componentes**:
    - `NovedadesGalponSection.vue`: Mejorar visualmente para incluir acciones de edición y eliminación.
    - `DialogDetalleGalpon.vue`: Reutilizar el diálogo de registro para edición.

## Restricciones y Casos Borde
- No permitir eliminar registros que dejen la población en negativo (si se implementa validación estricta).
- Mantener rastro de quién creó y quién actualizó (opcional).

## Trampas Conocidas
- Desincronización de la población mostrada después de una eliminación o edición.
- No filtrar correctamente por `id_empresa` en las rutas de eliminación/actualización.
- **Strict Linting**: El linter de este proyecto es muy estricto. Evitar:
    - Comparar Enums con strings literales directamente si la variable está estrictamente tipada (usar union types o castear).
    - Declarar variables de error en `catch` si no se van a usar (usar `catch {}` o `_` de prefijo si es permitido, aunque `catch {}` es más seguro aquí).
    - Dejar interfaces vacías (usar `type` si solo extiende de `Partial`).

