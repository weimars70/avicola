-- Migración: Mejoras a tablas de compras y ventas de terceros
-- Fecha: 2025-11-23
-- Descripción: Agregar campos faltantes para mejorar funcionalidad

-- ============================================
-- 1. MEJORAS A TABLA COMPRAS
-- ============================================

-- Agregar estado para rastrear si la compra está pendiente de pago o pagada
ALTER TABLE public.compras 
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'PENDIENTE' NOT NULL;

-- Agregar observaciones para notas adicionales
ALTER TABLE public.compras 
ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Agregar forma de pago (efectivo, transferencia, etc.)
ALTER TABLE public.compras 
ADD COLUMN IF NOT EXISTS forma_pago VARCHAR(50);

-- Comentario explicativo
COMMENT ON COLUMN public.compras.estado 
IS 'Estado de pago: PENDIENTE, PAGADO, PARCIAL';

COMMENT ON COLUMN public.compras.forma_pago 
IS 'Forma de pago: EFECTIVO, TRANSFERENCIA, CHEQUE, etc.';

-- ============================================
-- 2. MEJORAS A TABLA DETALLE_COMPRAS
-- ============================================

-- Agregar fecha de inserción para auditoría
ALTER TABLE public.detalle_compras 
ADD COLUMN IF NOT EXISTS fecha_inserta TIMESTAMP WITHOUT TIME ZONE DEFAULT now();

-- ============================================
-- 3. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

-- Índice para filtrar compras por estado
CREATE INDEX IF NOT EXISTS idx_compras_estado 
ON public.compras USING btree (estado);

-- Índice para filtrar ventas por estado (si no existe)
CREATE INDEX IF NOT EXISTS idx_ventas_estado 
ON public.ventas USING btree (estado);

-- Índice compuesto para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_compras_empresa_tipo_estado 
ON public.compras USING btree (id_empresa, tipo_movimiento, estado);

CREATE INDEX IF NOT EXISTS idx_ventas_empresa_tipo_estado 
ON public.ventas USING btree (id_empresa, tipo_movimiento, estado);

-- ============================================
-- 4. VERIFICACIÓN
-- ============================================

-- Verificar que las columnas se agregaron correctamente
DO $$
BEGIN
    -- Verificar compras.estado
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compras' 
        AND column_name = 'estado'
    ) THEN
        RAISE NOTICE '✓ Columna compras.estado agregada correctamente';
    ELSE
        RAISE EXCEPTION '✗ Error: No se pudo agregar compras.estado';
    END IF;

    -- Verificar compras.observaciones
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compras' 
        AND column_name = 'observaciones'
    ) THEN
        RAISE NOTICE '✓ Columna compras.observaciones agregada correctamente';
    ELSE
        RAISE EXCEPTION '✗ Error: No se pudo agregar compras.observaciones';
    END IF;

    -- Verificar compras.forma_pago
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compras' 
        AND column_name = 'forma_pago'
    ) THEN
        RAISE NOTICE '✓ Columna compras.forma_pago agregada correctamente';
    ELSE
        RAISE EXCEPTION '✗ Error: No se pudo agregar compras.forma_pago';
    END IF;

    -- Verificar detalle_compras.fecha_inserta
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'detalle_compras' 
        AND column_name = 'fecha_inserta'
    ) THEN
        RAISE NOTICE '✓ Columna detalle_compras.fecha_inserta agregada correctamente';
    ELSE
        RAISE EXCEPTION '✗ Error: No se pudo agregar detalle_compras.fecha_inserta';
    END IF;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migración completada exitosamente';
    RAISE NOTICE '========================================';
END $$;
