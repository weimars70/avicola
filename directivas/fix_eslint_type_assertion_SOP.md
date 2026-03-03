# SOP: Corrección de Aserciones de Tipo Innecesarias en TypeScript

## Objetivo
Eliminar aserciones de tipo (`as Type`) que son redundantes porque TypeScript ya infiere el tipo correctamente, cumpliendo con la regla de ESLint `@typescript-eslint/no-unnecessary-type-assertion`.

## Entradas
- Archivo TypeScript con errores de ESLint.
- Línea específica del error.

## Lógica de Corrección
1. Identificar la expresión que tiene la aserción `as ...`.
2. Verificar si el tipo inferido por la expresión coincide con el tipo de la aserción.
3. Si coinciden, eliminar la cláusula `as ...`.

## Paso a Paso
1. Leer el archivo fuente.
2. Localizar la línea reportada por el error.
3. Modificar el archivo eliminando la aserción redundante.
4. Guardar los cambios.

## Restricciones / Casos Borde
- **Nota:** No eliminar aserciones si el tipo es una unión más amplia y se requiere un tipo específico para una asignación (aunque ESLint suele detectar esto).
- **Nota:** Asegurarse de no dejar paréntesis huérfanos si la expresión estaba envuelta solo para la aserción.

## Verificación
- Ejecutar `eslint` o revisar que el servidor de desarrollo no reporte el error.
