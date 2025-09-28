import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'src/boot/axios';

interface TipoHuevo {
  id: string;
  nombre: string;
}

interface Canasta {
  id: string;
  nombre: string;
}

export interface Salida {
  id: string;
  tipoHuevoId: string;
  canastaId?: string | null | undefined; // Agregar undefined para compatibilidad con exactOptionalPropertyTypes
  unidades: number;
  valor?: number;
  fecha?: string;
  createdAt: string;
  updatedAt: string;
  tipoHuevo?: TipoHuevo;
  canasta?: Canasta;
  nombreComprador?: string;
}

export interface CreateSalidaDto {
  tipoHuevoId: string;
  canastaId?: string | null; // Permitir null y undefined
  unidades: number;
  valor?: number;
  fecha?: string;
  nombreComprador?: string;
}

export interface UpdateSalidaDto {
  tipoHuevoId?: string;
  canastaId?: string | null; // Permitir null y undefined
  unidades?: number;
  valor?: number;
  fecha?: string;
  nombreComprador?: string;
}

export const useSalidasStore = defineStore('salidas', () => {
  const salidas = ref<Salida[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number>(0);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutos
  const pagination = ref({ page: 1, limit: 20, total: 0 });

  const fetchSalidas = async (forceRefresh = false, page = 1, limit = 20, filters?: { tipoHuevoId?: string; canastaId?: string; fechaInicio?: string; fechaFin?: string }) => {
    const now = Date.now();
    
    // Verificar caché si no es refresh forzado y no hay filtros
    if (!forceRefresh && !filters && salidas.value.length > 0 && (now - lastFetch.value) < cacheTimeout) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters) {
        if (filters.tipoHuevoId) params.append('tipoHuevoId', filters.tipoHuevoId);
        if (filters.canastaId) params.append('canastaId', filters.canastaId);
        if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
        if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
      }
      
      const response = await api.get(`/salidas?${params.toString()}`);
      
      if (page === 1) {
        salidas.value = response.data.items || response.data;
      } else {
        salidas.value.push(...(response.data.items || response.data));
      }
      
      pagination.value = {
        page,
        limit,
        total: response.data.total || salidas.value.length
      };
      
      lastFetch.value = now;
    } catch (err) {
      error.value = 'Error al cargar las salidas';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createSalida = async (salidaData: CreateSalidaDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/salidas', salidaData);
      salidas.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Error al crear la salida';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSalida = async (id: string, salidaData: UpdateSalidaDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/salidas/${id}`, salidaData);
      const index = salidas.value.findIndex(s => s.id === id);
      if (index !== -1) {
        salidas.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = 'Error al actualizar la salida';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSalida = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/salidas/${id}`);
      salidas.value = salidas.value.filter(s => s.id !== id);
    } catch (err) {
      error.value = 'Error al eliminar la salida';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const invalidateCache = () => {
    lastFetch.value = 0;
  };

  const loadMore = async (filters?: { tipoHuevoId?: string; canastaId?: string; fechaInicio?: string; fechaFin?: string }) => {
    if (pagination.value.page * pagination.value.limit < pagination.value.total) {
      await fetchSalidas(false, pagination.value.page + 1, pagination.value.limit, filters);
    }
  };

  return {
    salidas,
    loading,
    error,
    pagination,
    fetchSalidas,
    createSalida,
    updateSalida,
    deleteSalida,
    invalidateCache,
    loadMore,
  };
});