-- 1. Agregar columna id_empresa a terceros 
ALTER TABLE public.terceros 
ADD COLUMN id_empresa INTEGER NOT NULL DEFAULT 2; 

-- 2. Agregar foreign key a tabla empresa 
ALTER TABLE public.terceros 
ADD CONSTRAINT terceros_fk_empresa 
FOREIGN KEY (id_empresa) REFERENCES public.empresa(id); 

-- 3. Crear índices para mejor rendimiento 
CREATE INDEX idx_terceros_id_empresa ON public.terceros(id_empresa); 
CREATE INDEX idx_terceros_id_empresa_activo ON public.terceros(id_empresa, activo); 
CREATE INDEX idx_terceros_id_empresa_cliente ON public.terceros(id_empresa, cliente) WHERE cliente = true; 
CREATE INDEX idx_terceros_id_empresa_proveedor ON public.terceros(id_empresa, proveedor) WHERE proveedor = true; 

-- 4. Verificar que se creó correctamente 
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'terceros' AND column_name = 'id_empresa';