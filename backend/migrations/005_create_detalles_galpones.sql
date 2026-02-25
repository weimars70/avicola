-- Create table detalles_galpones
CREATE TABLE IF NOT EXISTS detalles_galpones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_galpon UUID NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('SUMA', 'RESTA')),
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    comentario TEXT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_empresa INTEGER NOT NULL,
    id_usuario_inserta UUID NOT NULL,
    id_usuario_actualiza UUID,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_galpon FOREIGN KEY (id_galpon) REFERENCES galpones(id),
    CONSTRAINT fk_usuario_inserta FOREIGN KEY (id_usuario_inserta) REFERENCES users(id),
    CONSTRAINT fk_usuario_actualiza FOREIGN KEY (id_usuario_actualiza) REFERENCES users(id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_detalles_galpones_galpon ON detalles_galpones(id_galpon);
CREATE INDEX IF NOT EXISTS idx_detalles_galpones_empresa ON detalles_galpones(id_empresa);
