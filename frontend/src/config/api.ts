// Configuración de API para diferentes entornos

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// Interfaz para el objeto window con Capacitor
interface WindowWithCapacitor extends Window {
  Capacitor?: {
    isNativePlatform: () => boolean;
    getPlatform: () => string;
  };
}

// Detectar si estamos en un entorno móvil (Capacitor)
const isCapacitor = (): boolean => {
  const windowWithCapacitor = window as WindowWithCapacitor;
  return !!(windowWithCapacitor.Capacitor);
};

// Obtener variables de entorno con valores por defecto
const getEnvVar = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue;
};

// Configuraciones por entorno usando variables de entorno
const configs = {
  development: {
    baseURL: getEnvVar('VITE_API_URL_DEV', 'http://localhost:3012'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000'), 10),
  },
  production: {
    baseURL: getEnvVar('VITE_API_URL_PROD', 'http://2.58.80.90:3012'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '15000'), 10),
  },
  mobile: {
    baseURL: getEnvVar('VITE_API_URL_PROD', 'http://2.58.80.90:3012'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '15000'), 10),
  }
} as const;

// Función para obtener la configuración actual
export const getApiConfig = (): ApiConfig => {
  // Si estamos en Capacitor (móvil), usar configuración móvil
  if (isCapacitor()) {
    console.log('🚀 Modo móvil detectado - usando servidor:', configs.mobile.baseURL);
    return configs.mobile;
  }

  // Si estamos en localhost, usar configuración de desarrollo
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocalhost) {
    console.log('🛠️ Modo desarrollo (localhost) - usando servidor:', configs.development.baseURL);
    return configs.development;
  }

  // Por defecto, usar configuración de producción
  console.log('🌐 Modo producción - usando servidor:', configs.production.baseURL);
  return configs.production;
};

// Exportar la configuración actual
export const apiConfig = getApiConfig();