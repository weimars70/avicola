# Directiva: Sistema de Tutoriales (Bombilla)

## Objetivo
Implementar un sistema de ayuda contextual en cada página del sistema avícola que permita a los usuarios entender el funcionamiento de cada sección mediante una bombilla interactiva.

## Arquitectura
1.  **Componente UI**: Un botón flotante o integrado en el header con el icono de bombilla (`lightbulb`).
2.  **Estado Global**: Uso de Pinia (`tutorialStore`) para almacenar el contenido de ayuda por ruta.
3.  **Contenido**: Mapeo de rutas a objetos de ayuda (Título, Descripción, Pasos, Tips).
4.  **Visualización**: Uso de un `q-dialog` (Quasar) para mostrar la información.

## Pasos para el Mantenimiento
- Para añadir un tutorial a una página nueva:
    1.  Identificar la ruta de la página.
    2.  Añadir un objeto de contenido en `src/stores/tutorial.ts` bajo la llave de la ruta.
    3.  Verificar que la bombilla cargue el contenido correcto al navegar.

## Casos Borde y Restricciones
- **Rutas no definidas**: Si la ruta no tiene tutorial definido, el botón debe mostrar un mensaje genérico de "Ayuda no disponible para esta sección" o estar deshabilitado/oculto (preferiblemente oculto si no hay info).
- **Responsive**: El diálogo debe ser legible en dispositivos móviles (usar `maximized` en pantallas pequeñas).
- **Persistencia**: No es estrictamente necesaria, pero se puede guardar si el usuario ya vio el tutorial inicial para no molestarlo (opcional según feedback).

## Trampas Conocidas
- No hardcodear textos largos en los componentes. Usar el store.
- Asegurarse de que el diálogo no bloquee acciones críticas si se deja abierto (aunque los diálogos modales de Quasar por defecto bloquean el fondo).
