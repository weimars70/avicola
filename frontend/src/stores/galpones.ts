import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Galpon {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  capacidad: number;
  gallinasActuales?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateGalponDto {
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  capacidad: number;
  activo?: boolean;
  id_empresa: number;
  id_usuario_inserta?: string;
}

interface UpdateGalponDto {
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
  capacidad?: number;
  activo?: boolean;
  id_usuario_actualiza?: string;
}

export const useGalponesStore = defineStore('galpones', () => {
  const galpones = ref<Galpon[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number>(0);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutos
  const pagination = ref({ page: 1, limit: 20, total: 0 });

  const fetchGalpones = async (includeInactive = false, forceRefresh = false, page = 1, limit = 20) => {
    const now = Date.now();
    
    // Verificar caché si no es refresh forzado
    if (!forceRefresh && galpones.value.length > 0 && (now - lastFetch.value) < cacheTimeout) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Obtener id_empresa del localStorage o del store de autenticación
      const id_empresa = localStorage.getItem('id_empresa');
      if (id_empresa) {
        params.append('id_empresa', id_empresa);
        console.log('Enviando id_empresa:', id_empresa);
      } else {
        console.error('No se encontró id_empresa en localStorage');
      }
      
      if (includeInactive) {
        params.append('includeInactive', 'true');
      }
      
      const url = `/galpones?${params.toString()}`;
      console.log('URL de petición:', url);
      const response = await api.get(url);
      
      if (page === 1) {
        galpones.value = response.data.items || response.data;
      } else {
        galpones.value.push(...(response.data.items || response.data));
      }
      
      pagination.value = {
        page,
        limit,
        total: response.data.total || galpones.value.length
      };
      
      lastFetch.value = now;
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al cargar galpones';
    } finally {
      loading.value = false;
    }
  };

  const createGalpon = async (galponData: CreateGalponDto) => {
    console.log('Datos a enviar al crear galpón:', galponData);
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/galpones', galponData);
      console.log('Respuesta del servidor al crear galpón:', response.data);
      galpones.value.push(response.data);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al crear galpón';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateGalpon = async (id: string, galponData: UpdateGalponDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/galpones/${id}`, galponData);
      const index = galpones.value.findIndex(g => g.id === id);
      if (index !== -1) {
        galpones.value[index] = response.data;
      }
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al actualizar galpón';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const inactivateGalpon = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.patch(`/galpones/${id}/inactivar`);
      // Actualizar el galpón en la lista local
      const index = galpones.value.findIndex(g => g.id === id);
      if (index !== -1 && galpones.value[index]) {
        galpones.value[index].activo = false;
      }
      return { success: true };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al inactivar galpón';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const reactivateGalpon = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.patch(`/galpones/${id}/reactivar`);
      // Actualizar el galpón en la lista local
      const index = galpones.value.findIndex(g => g.id === id);
      if (index !== -1 && galpones.value[index]) {
        galpones.value[index].activo = true;
      }
      return { success: true };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al reactivar galpón';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const getGalponById = (id: string) => {
    return galpones.value.find(g => g.id === id);
  };

  const invalidateCache = () => {
    lastFetch.value = 0;
  };

  const loadMore = async (includeInactive = false) => {
    if (pagination.value.page * pagination.value.limit < pagination.value.total) {
      await fetchGalpones(includeInactive, false, pagination.value.page + 1, pagination.value.limit);
    }
  };

  return {
    galpones,
    loading,
    error,
    pagination,
    fetchGalpones,
    createGalpon,
    updateGalpon,
    inactivateGalpon,
    reactivateGalpon,
    getGalponById,
    invalidateCache,
    loadMore,
  };
});