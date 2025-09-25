import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface AjusteInventario {
  id: string;
  tipoHuevoId: string;
  cantidadAnterior: number;
  cantidadAjuste: number;
  cantidadNueva: number;
  tipoAjuste: 'suma' | 'resta';
  descripcion: string;
  usuarioId: string;
  createdAt: string;
  tipoHuevo: TipoHuevo;
  usuario: Usuario;
}

interface CreateAjusteInventarioDto {
  tipoHuevoId: string;
  cantidadAjuste: number;
  tipoAjuste: 'suma' | 'resta';
  descripcion: string;
  usuarioId: string;
}

interface AjusteItem {
  tipoHuevoId: string;
  cantidadAjuste: number;
  tipoAjuste: 'suma' | 'resta';
  descripcion?: string;
}

interface CreateAjusteLoteDto {
  descripcionGeneral: string;
  usuarioId: string;
  ajustes: AjusteItem[];
}

export interface AjusteLote {
  id: string;
  descripcionGeneral: string;
  usuarioId: string;
  createdAt: string;
  usuario: Usuario;
  ajustes: AjusteInventario[];
}

interface UpdateAjusteLoteDto {
  descripcionGeneral?: string;
  ajustes?: AjusteItem[];
}

export const useAjustesInventarioStore = defineStore('ajustesInventario', () => {
  const ajustes = ref<AjusteInventario[]>([]);
  const lotes = ref<AjusteLote[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createAjuste = async (ajusteData: CreateAjusteInventarioDto): Promise<AjusteInventario> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/ajustes-inventario', ajusteData);
      const nuevoAjuste = response.data;
      ajustes.value.unshift(nuevoAjuste);
      return nuevoAjuste;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al crear ajuste de inventario';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAjustes = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/ajustes-inventario');
      ajustes.value = response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al cargar ajustes de inventario';
    } finally {
      loading.value = false;
    }
  };

  const fetchAjustesByTipoHuevo = async (tipoHuevoId: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/ajustes-inventario/tipo-huevo/${tipoHuevoId}`);
      ajustes.value = response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al cargar ajustes de inventario';
    } finally {
      loading.value = false;
    }
  };

  const fetchAjuste = async (id: string): Promise<AjusteInventario | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/ajustes-inventario/${id}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al cargar ajuste de inventario';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createLote = async (loteData: CreateAjusteLoteDto): Promise<AjusteLote> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/ajustes-inventario/lotes', loteData);
      const nuevoLote = response.data;
      lotes.value.unshift(nuevoLote);
      return nuevoLote;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data as ErrorResponse;
      
      if (status === 401) {
        error.value = 'No estás autenticado. Por favor, inicia sesión nuevamente.';
      } else if (status === 400) {
        error.value = errorData?.message || 'Datos de ajuste inválidos. Verifica la información ingresada.';
      } else if (status === 404) {
        error.value = 'El endpoint de creación de lotes no está disponible en el servidor.';
      } else {
        error.value = errorData?.message || 'Error al crear lote de ajustes';
      }
      
      console.error('Error en createLote:', {
        status,
        message: errorData?.message,
        url: '/ajustes-inventario/lotes',
        data: loteData
      });
      
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchLotes = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/ajustes-inventario/lotes/all');
      lotes.value = response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data as ErrorResponse;
      
      if (status === 401) {
        error.value = 'No estás autenticado. Por favor, inicia sesión nuevamente.';
      } else if (status === 404) {
        error.value = 'El endpoint de lotes no está disponible en el servidor. Verifica la configuración del backend.';
      } else {
        error.value = errorData?.message || 'Error al cargar lotes de ajustes';
      }
      
      console.error('Error en fetchLotes:', {
        status,
        message: errorData?.message,
        url: '/ajustes-inventario/lotes/all'
      });
    } finally {
      loading.value = false;
    }
  };

  const fetchLote = async (id: string): Promise<AjusteLote | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/ajustes-inventario/lotes/${id}`);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al cargar lote de ajustes';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteLote = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/ajustes-inventario/lotes/${id}`);
      // Actualizar la lista local removiendo el lote eliminado
      lotes.value = lotes.value.filter(lote => lote.id !== id);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al eliminar lote de ajustes';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateLote = async (id: string, updateData: UpdateAjusteLoteDto): Promise<AjusteLote | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put(`/ajustes-inventario/lotes/${id}`, updateData);
      const updatedLote = response.data;
      
      // Actualizar la lista local
      const index = lotes.value.findIndex(lote => lote.id === id);
      if (index !== -1) {
        lotes.value[index] = updatedLote;
      }
      
      return updatedLote;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      error.value = errorData?.message || 'Error al actualizar lote de ajustes';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    ajustes,
    lotes,
    loading,
    error,
    createAjuste,
    fetchAjustes,
    fetchAjustesByTipoHuevo,
    fetchAjuste,
    createLote,
    fetchLotes,
    fetchLote,
    deleteLote,
    updateLote,
  };
});