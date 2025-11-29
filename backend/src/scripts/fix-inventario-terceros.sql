-- Script para diagnosticar y limpiar inconsistencias en inventario_terceros
-- Ejecutar este script para identificar y corregir problemas

-- 1. Ver todos los movimientos activos
SELECT
    id,
    id_empresa,
    id_tercero,
    tipo_huevo_codigo,
    tipo_movimiento,
    cantidad,
    stock_anterior,
    stock_actual,
    concepto,
    descripcion,
    activo,
    fecha_movimiento
FROM inventario_terceros
WHERE id_empresa = 2
ORDER BY tipo_huevo_codigo, fecha_movimiento;

-- 2. Calcular stock real consolidado por canasta
SELECT
    tipo_huevo_codigo,
    SUM(CASE
        WHEN tipo_movimiento = 'entrada' THEN cantidad
        WHEN tipo_movimiento = 'salida' THEN -cantidad
        ELSE 0
    END) as stock_real,
    COUNT(*) as total_movimientos,
    SUM(CASE WHEN tipo_movimiento = 'entrada' THEN cantidad ELSE 0 END) as total_entradas,
    SUM(CASE WHEN tipo_movimiento = 'salida' THEN cantidad ELSE 0 END) as total_salidas
FROM inventario_terceros
WHERE id_empresa = 2 AND activo = true
GROUP BY tipo_huevo_codigo
ORDER BY tipo_huevo_codigo;

-- 3. Identificar movimientos con stock_actual negativo (PROBLEMA)
SELECT
    id,
    tipo_huevo_codigo,
    tipo_movimiento,
    cantidad,
    stock_anterior,
    stock_actual,
    concepto,
    descripcion,
    fecha_movimiento
FROM inventario_terceros
WHERE id_empresa = 2
  AND activo = true
  AND stock_actual < 0
ORDER BY fecha_movimiento;

-- 4. OPCIONAL: Desactivar todos los movimientos problemáticos (ejecutar con cuidado)
-- DESCOMENTAR SOLO SI QUIERES LIMPIAR TODO Y EMPEZAR DE CERO
-- UPDATE inventario_terceros
-- SET activo = false
-- WHERE id_empresa = 2;

-- 5. Ver canastas disponibles
SELECT id, nombre, unidades_por_canasta, id_tipo_huevo
FROM canastas
ORDER BY nombre;
