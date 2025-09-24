# 📱 Compilación para Móvil - Galpones App

## 🔧 Configuración del Backend

La aplicación está configurada para conectarse automáticamente al servidor correcto según el entorno:

### URLs Configuradas:
- **Desarrollo**: `http://localhost:3012`
- **Producción/Móvil**: `http://2.58.80.90:3012`

## 🚀 Pasos para Compilar para Android

### 1. Preparar el Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Sincronizar con Capacitor
```bash
npx cap sync android
```

### 3. Abrir en Android Studio
```bash
npx cap open android
```

### 4. Compilar APK
En Android Studio:
1. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. El APK se generará en `android/app/build/outputs/apk/debug/`

## 🔧 Configuración Avanzada

### Variables de Entorno
Puedes modificar las configuraciones en `frontend/.env`:

```env
# Puerto del servidor de desarrollo del frontend
VITE_DEV_PORT=3011

# URL del backend para desarrollo local
VITE_API_URL_DEV=http://localhost:3012

# URL del backend para producción/móvil
VITE_API_URL_PROD=http://2.58.80.90:3012

# Timeout para las peticiones API
VITE_API_TIMEOUT=15000

# Información de la aplicación
VITE_APP_NAME=Galpones
VITE_APP_VERSION=1.0.0
```

### Detección Automática de Entorno
La aplicación detecta automáticamente el entorno:
- **Móvil (Capacitor)**: Usa `VITE_API_URL_PROD`
- **Desarrollo**: Usa `VITE_API_URL_DEV`
- **Producción Web**: Usa `VITE_API_URL_PROD`

## 📋 Requisitos Previos

### Android
- Android Studio instalado
- Android SDK configurado
- Java JDK 11 o superior

### Backend
- Servidor backend ejecutándose en `2.58.80.90:3012`
- Puerto 3012 abierto en el firewall
- CORS configurado para permitir conexiones desde la app móvil

## 🐛 Debugging

### Ver Logs de Conexión
La aplicación muestra en la consola qué servidor está usando:
- 🚀 Modo móvil detectado
- 🛠️ Modo desarrollo
- 🌐 Modo producción

### Verificar Conectividad
```bash
# Desde el dispositivo/emulador, verificar que puede alcanzar el servidor
curl http://2.58.80.90:3012/health
```

## 📱 Configuración de Red

### Para Desarrollo Local con Dispositivo Físico
Si quieres probar con tu dispositivo físico conectado a la misma red:

1. Obtén tu IP local:
```bash
ipconfig
```

2. Actualiza la variable de entorno:
```env
VITE_API_URL_DEV=http://TU_IP_LOCAL:3012
```

3. Asegúrate de que el backend esté escuchando en todas las interfaces:
```env
# En backend/.env
HOST=0.0.0.0
PORT=3012
```

## 🔒 Consideraciones de Seguridad

- En producción, considera usar HTTPS
- Configura CORS apropiadamente en el backend
- Valida certificados SSL si usas HTTPS

## 📦 Distribución

### APK de Debug
Para pruebas internas, usa el APK de debug generado.

### APK de Release
Para distribución:
1. Configura signing en Android Studio
2. Genera APK de release
3. Considera usar Google Play Store para distribución