import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  id_empresa: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const id_usuario = ref<string | null>(localStorage.getItem('id_usuario'));
  const id_empresa = ref<number | null>(localStorage.getItem('id_empresa') ? parseInt(localStorage.getItem('id_empresa')!) : null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.rol === 'admin');

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', credentials);

      const { access_token, user: userData } = response.data;
      
      // Verificar que los datos necesarios estén presentes
      if (!userData || !userData.id || userData.id_empresa === undefined) {
        throw new Error('Datos de usuario incompletos en la respuesta del servidor');
      }
      
      token.value = access_token;
      user.value = userData;
      id_usuario.value = userData.id;
      id_empresa.value = userData.id_empresa;

      console.log('token.value:', token.value);
    
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('id_usuario', userData.id);
      localStorage.setItem('id_empresa', userData.id_empresa);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Siempre forzar una recarga completa de la página al iniciar sesión
      // Esto garantiza que se limpie cualquier estado o caché anterior
      console.log('Iniciando sesión con empresa:', userData.id_empresa);
      
      // Establecer un flag para indicar que es un nuevo inicio de sesión
      localStorage.setItem('fresh_login', 'true');
      
      // Forzar recarga completa de la página para limpiar todo el estado
      window.location.href = '/';
      return { success: true, message: 'Inicio de sesión exitoso' };
      
    } catch (error: unknown) {
      console.error('Error durante el login:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError.response?.data?.message || 'Error al iniciar sesión. Datos de usuario incompletos.' 
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    id_usuario.value = null;
    id_empresa.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('id_empresa');
    delete api.defaults.headers.common['Authorization'];
  };

  const initializeAuth = async () => {
    //console.log('token.value initialize:::', token.value);
    if (token.value) {
      // Decodificar el token para verificar su estructura
      try {
        const tokenParts = token.value.split('.');
        if (tokenParts.length === 3 && tokenParts[1]) {
          const payload = JSON.parse(atob(tokenParts[1]));
          //console.log('Token payload:', payload);
          //console.log('Extrayendo id_empresa del token:', payload.id_empresa);
          
          if (payload.id_empresa) {
            localStorage.setItem('id_empresa', payload.id_empresa.toString());
            //console.log('✅ id_empresa guardado en localStorage:', payload.id_empresa);
          } else {
            console.error('⚠️ Token no contiene id_empresa');
          }
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
      
      // Asegurar que el token se configura correctamente en los headers
      const tokenStr = `Bearer ${token.value}`;
      api.defaults.headers.common['Authorization'] = tokenStr;
      
      // Verificar que el header se ha configurado correctamente
      //console.log('Header de autorización configurado:', api.defaults.headers.common['Authorization']);
      
      try {
        // Guardar los datos originales del localStorage antes de la petición
        const storedIdUsuario = localStorage.getItem('id_usuario');
        const storedIdEmpresa = localStorage.getItem('id_empresa') ? parseInt(localStorage.getItem('id_empresa')!) : null;
        
        // Realizar la petición al backend con el header explícito para esta llamada
        // Obtener el id_usuario del localStorage para enviarlo como parámetro
     
        
        const response = await api.get(`/auth/profile?userId=${storedIdUsuario}`, {
          headers: {
            'Authorization': tokenStr
          }
        });
        
        // Verificar si los datos recibidos son consistentes con los almacenados
        if (response.data.id_empresa !== undefined && storedIdEmpresa !== null) {
          if (response.data.id_empresa !== storedIdEmpresa) {
            console.warn('El id_empresa recibido del servidor no coincide con el almacenado localmente', {
              recibido: response.data.id_empresa,
              almacenado: storedIdEmpresa
            });
            
            // SOLUCIÓN: Mantener el id_empresa almacenado localmente en lugar de usar el del servidor
            response.data.id_empresa = storedIdEmpresa;
            //console.log('Se mantuvo el id_empresa original:', storedIdEmpresa);
          }
        } else if (response.data.id_empresa === undefined && storedIdEmpresa !== null) {
          console.warn('id_empresa no está presente en la respuesta del perfil, usando el valor almacenado');
          response.data.id_empresa = storedIdEmpresa;
        }
        
        // Verificar también el id_usuario para mayor seguridad
        if (storedIdUsuario && response.data.id !== storedIdUsuario) {
          console.warn('El id_usuario recibido del servidor no coincide con el almacenado localmente', {
            recibido: response.data.id,
            almacenado: storedIdUsuario
          });
          
          // Mantener el id_usuario original
          response.data.id = storedIdUsuario;
        }
        
        // Actualizar el estado con los datos (posiblemente corregidos)
        user.value = response.data;
        id_usuario.value = response.data.id;
        id_empresa.value = response.data.id_empresa;
        
        // Asegurar que localStorage tenga los valores correctos
       // localStorage.setItem('id_usuario', response.data.id);
        if (response.data.id_empresa !== undefined) {
         // localStorage.setItem('id_empresa', response.data.id_empresa.toString());
        }
        
        //console.log('Datos de usuario actualizados (con correcciones si fueron necesarias):', response.data);
      } catch (error: unknown) {
        console.error('Error al inicializar autenticación:', error);
        // Solo limpiar el token si hay un error 401 (no autorizado)
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 401) {
          logout();
        }
      }
    }
  };

  return {
    user,
    token,
    loading,
    id_usuario,
    id_empresa,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initializeAuth,
  };
});