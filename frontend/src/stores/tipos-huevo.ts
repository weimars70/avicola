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

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTipoHuevoDto {
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo?: boolean;
}

interface UpdateTipoHuevoDto {
  nombre?: string;
  descripcion?: string;
  valorUnidad?: number;
  activo?: boolean;
}

export const useTiposHuevoStore = defineStore('tiposHuevo', () => {
  const tiposHuevo = ref<TipoHuevo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number>(0);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutos
  const pagination = ref({ page: 1, limit: 20, total: 0 });

  const fetchTiposHuevo = async (includeInactive = false, forceRefresh = false, page = 1, limit = 20) => {
    const now = Date.now();
    
    // Verificar caché si no es refresh forzado
    if (!forceRefresh && tiposHuevo.value.length > 0 && (now - lastFetch.value) < cacheTimeout) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (includeInactive) {
        params.append('includeInactive', 'true');
      }
      
      const response = await api.get(`/tipos-huevo?${params.toString()}`);
      
      if (page === 1) {
        tiposHuevo.value = response.data.items || response.data;
      } else {
        tiposHuevo.value.push(...(response.data.items || response.data));
      }
      
      pagination.value = {
        page,
        limit,
        total: response.data.total || tiposHuevo.value.length
      };
      
      lastFetch.value = now;
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al cargar tipos de huevo';
    } finally {
      loading.value = false;
    }
  };

  const createTipoHuevo = async (tipoHuevoData: CreateTipoHuevoDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/tipos-huevo', tipoHuevoData);
      tiposHuevo.value.push(response.data);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al crear tipo de huevo';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateTipoHuevo = async (id: string, tipoHuevoData: UpdateTipoHuevoDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/tipos-huevo/${id}`, tipoHuevoData);
      const index = tiposHuevo.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tiposHuevo.value[index] = response.data;
      }
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al actualizar tipo de huevo';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteTipoHuevo = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/tipos-huevo/${id}`);
      tiposHuevo.value = tiposHuevo.value.filter(t => t.id !== id);
      return { success: true };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al eliminar tipo de huevo';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const getTipoHuevoById = (id: string) => {
    return tiposHuevo.value.find(t => t.id === id);
  };

  const invalidateCache = () => {
    lastFetch.value = 0;
  };

  const loadMore = async (includeInactive = false) => {
    if (pagination.value.page * pagination.value.limit < pagination.value.total) {
      await fetchTiposHuevo(includeInactive, false, pagination.value.page + 1, pagination.value.limit);
    }
  };

  return {
    tiposHuevo,
    loading,
    error,
    pagination,
    fetchTiposHuevo,
    createTipoHuevo,
    updateTipoHuevo,
    deleteTipoHuevo,
    getTipoHuevoById,
    invalidateCache,
    loadMore,
  };
});