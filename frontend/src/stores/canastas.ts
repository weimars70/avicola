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
}

interface Canasta {
  id: string;
  nombre: string;
  descripcion?: string;
  valorCanasta: number;
  unidadesPorCanasta: number;
  tipoHuevoId: string;
  tipoHuevo?: TipoHuevo;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateCanastaDto {
  nombre: string;
  descripcion?: string;
  valorCanasta: number;
  unidadesPorCanasta: number;
  tipoHuevoId: string;
  activo?: boolean;
}

interface UpdateCanastaDto {
  nombre?: string;
  descripcion?: string;
  valorCanasta?: number;
  unidadesPorCanasta?: number;
  tipoHuevoId?: string;
  activo?: boolean;
}

export const useCanastasStore = defineStore('canastas', () => {
  const canastas = ref<Canasta[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number>(0);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutos
  const pagination = ref({ page: 1, limit: 20, total: 0 });

  const fetchCanastas = async (forceRefresh = false, page = 1, limit = 20) => {
    const now = Date.now();
    
    // Verificar caché si no es refresh forzado
    if (!forceRefresh && canastas.value.length > 0 && (now - lastFetch.value) < cacheTimeout) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get(`/canastas?${params.toString()}`);
      
      if (page === 1) {
        canastas.value = response.data.items || response.data;
      } else {
        canastas.value.push(...(response.data.items || response.data));
      }
      
      pagination.value = {
        page,
        limit,
        total: response.data.total || canastas.value.length
      };
      
      lastFetch.value = now;
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al cargar canastas';
    } finally {
      loading.value = false;
    }
  };

  const createCanasta = async (canastaData: CreateCanastaDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/canastas', canastaData);
      canastas.value.push(response.data);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al crear canasta';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateCanasta = async (id: string, canastaData: UpdateCanastaDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/canastas/${id}`, canastaData);
      const index = canastas.value.findIndex(c => c.id === id);
      if (index !== -1) {
        canastas.value[index] = response.data;
      }
      return { success: true, data: response.data };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al actualizar canasta';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteCanasta = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/canastas/${id}`);
      canastas.value = canastas.value.filter(c => c.id !== id);
      return { success: true };
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al eliminar canasta';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const getCanastaById = (id: string) => {
    return canastas.value.find(c => c.id === id);
  };

  const invalidateCache = () => {
    lastFetch.value = 0;
  };

  const loadMore = async () => {
    if (pagination.value.page * pagination.value.limit < pagination.value.total) {
      await fetchCanastas(false, pagination.value.page + 1, pagination.value.limit);
    }
  };

  return {
    canastas,
    loading,
    error,
    pagination,
    fetchCanastas,
    createCanasta,
    updateCanasta,
    deleteCanasta,
    getCanastaById,
    invalidateCache,
    loadMore,
  };
});