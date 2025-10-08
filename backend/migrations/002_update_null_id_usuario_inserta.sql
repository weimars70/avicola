-- Actualizar los registros existentes con valores NULL en id_usuario_inserta
UPDATE gastos SET id_usuario_inserta = 1 WHERE id_usuario_inserta IS NULL;