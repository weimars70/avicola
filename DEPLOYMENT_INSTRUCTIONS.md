# Instrucciones de Despliegue - Funcionalidad Ajustes de Inventario

## Problema
El endpoint `GET /ajustes-inventario/lotes/all` devuelve 404 Not Found porque las entidades `AjusteInventario` y `AjusteLote` no están registradas en el servidor de producción.

## Archivos que deben desplegarse al servidor

### 1. Entidades (CRÍTICO)
```
backend/src/inventario/entities/ajuste-inventario.entity.ts
backend/src/inventario/entities/ajuste-lote.entity.ts
```

### 2. DatabaseModule actualizado (CRÍTICO)
```
backend/src/database/database.module.ts
```
**Cambio importante:** Se agregaron las importaciones y registros de `AjusteInventario` y `AjusteLote` en el array de entidades.

### 3. Controlador y Servicio (ACTUALIZADOS CON CRUD COMPLETO)
```
backend/src/inventario/ajustes-inventario.controller.ts
backend/src/inventario/ajustes-inventario.service.ts
```
**Nuevas funcionalidades agregadas:**
- Métodos PUT y DELETE para ajustes individuales
- Métodos PUT y DELETE para lotes de ajustes
- Validaciones de stock en actualizaciones
- Reversión automática de ajustes al eliminar

### 4. DTOs (NUEVOS)
```
backend/src/inventario/dto/update-ajuste-lote.dto.ts
```

### 5. Módulo de Inventario actualizado
```
backend/src/inventario/inventario.module.ts
```

## Pasos de despliegue

1. **Subir todos los archivos listados arriba al servidor**
2. **Reiniciar el servidor backend** para que TypeORM reconozca las nuevas entidades
3. **Verificar que las tablas se crean automáticamente** (si synchronize está habilitado)

## Verificación
Después del despliegue, probar:
```bash
curl -H "Authorization: Bearer [TOKEN]" http://2.58.80.90:3012/ajustes-inventario/lotes/all
```

## Endpoints disponibles después del despliegue

### Gestión de Lotes de Ajustes
- `GET /ajustes-inventario/lotes/all` - Obtener todos los lotes de ajustes
- `POST /ajustes-inventario/lotes` - Crear un nuevo lote de ajustes
- `GET /ajustes-inventario/lotes/:id` - Obtener un lote específico
- `PUT /ajustes-inventario/lotes/:id` - Actualizar descripción de un lote
- `DELETE /ajustes-inventario/lotes/:id` - Eliminar un lote (y todos sus ajustes)

### Gestión de Ajustes Individuales
- `GET /ajustes-inventario` - Obtener todos los ajustes
- `POST /ajustes-inventario` - Crear un ajuste individual
- `GET /ajustes-inventario/:id` - Obtener un ajuste específico
- `PUT /ajustes-inventario/:id` - Actualizar un ajuste (revierte y aplica nuevo)
- `DELETE /ajustes-inventario/:id` - Eliminar un ajuste (revierte cambios en inventario)
- `GET /ajustes-inventario/tipo-huevo/:tipoHuevoId` - Obtener ajustes por tipo de huevo

## Nota importante
Sin estos archivos desplegados en el servidor, la funcionalidad de ajustes de inventario no funcionará correctamente.