-- Crear tabla estratos
CREATE TABLE IF NOT EXISTS public.estratos (
  codigo serial4 NOT NULL,
  nombre text NOT NULL,
  CONSTRAINT estratos_pkey PRIMARY KEY (codigo),
  CONSTRAINT estratos_nombre_key UNIQUE (nombre)
);

-- Insertar estratos comunes
INSERT INTO public.estratos (codigo, nombre) VALUES
(1, 'Estrato 1'),
(2, 'Estrato 2'),
(3, 'Estrato 3'),
(4, 'Estrato 4'),
(5, 'Estrato 5'),
(6, 'Estrato 6')
ON CONFLICT DO NOTHING;

-- Agregar foreign key a terceros
ALTER TABLE public.terceros
ADD CONSTRAINT terceros_fk_estrato
FOREIGN KEY (estrato_codigo) REFERENCES public.estratos(codigo);
