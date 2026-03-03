# Directiva: Resolución de Error Java 21 en Capacitor Android

## Objetivo
Identificar por qué el build de Capacitor Android solicita Java 21 y forzar el uso de Java 17 o actualizar el entorno según sea necesario.

## Entradas
- Proyecto Quasar + Capacitor.
- Carpeta `src-capacitor/android`.
- Error: `invalid source release: 21`.

## Pasos Lógicos

1. **Búsqueda de Configuración:**
   - Buscar la cadena `21` o `JavaVersion.VERSION_21` en todos los archivos `.gradle` de la carpeta `android`.
   - Revisar `build.gradle` (raíz), `app/build.gradle` y `variables.gradle`.

2. **Análisis de Dependencias:**
   - Verificar la versión de Android Gradle Plugin (AGP) en `build.gradle` (classpath `com.android.tools.build:gradle`).
   - AGP 8.x+ a menudo requiere Java 17+, pero algunas configuraciones específicas de plantillas nuevas pueden estar apuntando a 21.

3. **Verificación de Capacitor:**
   - Revisar `capacitor.config.json` o `ts` para ver si hay configuraciones de compilación.

4. **Identificación del Módulo Conflictivo:**
   - El error `:capacitor-android:compileReleaseJavaWithJavac` sugiere que el módulo core de Capacitor para Android está siendo compilado con release 21.

5. **Resolución sugerida:**
   - Si se desea mantener Java 17: Cambiar `sourceCompatibility` y `targetCompatibility` a `JavaVersion.VERSION_17` en los archivos identificados.
   - Si se requiere Java 21: Actualizar `org.gradle.java.home` en `gradle.properties` o instalar el JDK 21.

## Restricciones / Casos Borde
- Quasar CLI puede sobreescribir configuraciones si se ejecuta `quasar mode add capacitor` de nuevo, pero los cambios manuales en `src-capacitor/android` suelen persistir.
- Android Studio Chipmunk/Dolphin/Electric Eel/Flamingo/Giraffe/Hedgehog/Iguana tienen diferentes versiones de JDK embebidas.

## Trampas Conocidas
- **AGP 8.3+:** Empieza a sugerir o requerir versiones más altas de Java según el `targetSdk`.
- **gradle.properties:** A veces la propiedad `org.gradle.java.home` está hardcoded apuntando a un JDK antiguo.
- **Flag --release:** Forzar `options.release = 17` en Gradle causa errores en AGP 8.x porque interfiere con la configuración del bootclasspath de Android. Se debe usar `sourceCompatibility` y `targetCompatibility` sin el flag release.
- **Capacitor 7 CLI:** Sobreescribe `app/capacitor.build.gradle` con Java 21 en cada ejecución de `cap update`. El script de parcheo debe ejecutarse después de cada update o ser parte del build.
- **Core Library persistencia:** Modificar `node_modules` es necesario si el módulo core de Capacitor ignora los overrides de root.
