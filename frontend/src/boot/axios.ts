import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { apiConfig } from '../config/api';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ 
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout
});

// Configurar token automáticamente si existe en localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para añadir id_empresa a todas las peticiones y manejar id_usuario_inserta/id_usuario_actualiza
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANTE: Obtener id_empresa directamente del localStorage, no del objeto user
    const idEmpresa = localStorage.getItem('id_empresa') || '2';
    
    config.headers['x-empresa-id'] = idEmpresa;
    
    console.log('Request con empresa:', idEmpresa, config.url);
    
    const id_usuario = localStorage.getItem('id_usuario');
    
    // No añadir id_empresa como query parameter para endpoints específicos
    // que ya lo incluyen en el cuerpo de la solicitud
    // Añadir id_usuario_inserta o id_usuario_actualiza según el método
    // Excluir rutas de autenticación para no añadir campos adicionales
    const isAuthRoute = config.url?.includes('/auth/');
    
    // Verificar si la URL ya contiene id_usuario_inserta como parámetro
    const urlHasIdUsuarioInserta = config.url?.includes('id_usuario_inserta=');
    const paramsHasIdUsuarioInserta = config.params && 'id_usuario_inserta' in config.params;
    
    // Excluir rutas específicas que ya manejan id_usuario_inserta
    const skipIdUsuarioInsertaRoutes = [
      '/gastos',
      '/gastos/consumo-propio'
    ];
    
    const shouldSkipIdUsuarioInserta = skipIdUsuarioInsertaRoutes.some(endpoint => 
      config.url && config.url.includes(endpoint)
    );
    
    if (config.method?.toLowerCase() === 'post' && id_usuario && !isAuthRoute && !urlHasIdUsuarioInserta && !paramsHasIdUsuarioInserta && !shouldSkipIdUsuarioInserta) {
      // Añadir id_usuario_inserta como parámetro de consulta solo si no existe ya y no es una ruta excluida
      config.params = { ...config.params, id_usuario_inserta: id_usuario };
      
      // Para la ruta específica de terceros, asegurarse de que id_usuario_inserta esté presente
      if (config.url && config.url.includes('/terceros')) {
        console.log('Añadiendo id_usuario_inserta a la solicitud de terceros:', id_usuario);
        config.params = { ...config.params, id_usuario_inserta: id_usuario };
      }
    }
    
    if ((config.method?.toLowerCase() === 'put' || config.method?.toLowerCase() === 'patch') && id_usuario && !isAuthRoute) {
      // Añadir id_usuario_actualiza como parámetro de consulta
      config.params = { ...config.params, id_usuario_actualiza: id_usuario };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error?.message || 'Error en la solicitud'));
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si el token es inválido
      localStorage.removeItem('token');
      localStorage.removeItem('id_usuario');
      localStorage.removeItem('id_empresa');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    // Mantener el error original para preservar status y data
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
