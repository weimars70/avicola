# Directiva Técnica: Gestión de Terceros

## Objetivo
Guiar la creación, listado y edición de terceros (clientes y proveedores) asegurando la flexibilidad de los datos de contacto y el estricto aislamiento por empresa.

## Entradas y Salidas
- **Entrada Frontend**: Formularios correspondientes a `FormularioTerceroPage.vue`.
- **Salida Backend**: Endpoints bajo `/terceros` que gestionan la lógica de base de datos en `TercerosService`, manejando la respuesta y el mapeo.

## Reglas y Lógica Estrictas (CRITICO)

1. **Aislamiento Multi-tenant (`id_empresa`)**:
   - Cualquier acción relacionada a la creación o listado de terceros (Visualización normal en listado y selects de clientes) DEBE estar mediada por el decorador backend `@IdEmpresa()`.
   - La inyección de `idEmpresa` se realiza directamente a nivel controlador/servicio (`{ ...dto, idEmpresa }`), previniendo choques con lo que envíe el cliente. Esto asegura que solo aparezcan terceros relacionados a la cuenta.

## Restricciones y Casos Borde (Memoria)

- **Error 500 en la Creación (Internal Server Error)**:
  - *Nota: No configurar columnas opcionales del frontend (como `estrato_codigo` y `ciudad_codigo`) con restricciones NOT NULL en la base de datos, porque causa un error 500 al guardar. En su lugar, hacer que las columnas `estrato_codigo` y `ciudad_codigo` de la tabla `terceros` acepten `NULL` mediante sentencias ALTER TABLE (DROP NOT NULL), permitiendo que el insert transaccione exitosamente aunque el usuario no especifique estos datos en el formulario.*
