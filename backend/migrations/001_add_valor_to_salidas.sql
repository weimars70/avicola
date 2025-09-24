-- Migración para agregar la columna 'valor' a la tabla 'salidas'
-- Fecha: 2025-01-23

ALTER TABLE salidas ADD COLUMN valor DECIMAL(10,2) NULL;

-- Comentario: Columna para almacenar el valor monetario de cada salida
-- Tipo: DECIMAL(10,2) para manejar valores monetarios con 2 decimales
-- Nullable: Sí, para mantener compatibilidad con registros existentes