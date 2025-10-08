import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'src/boot/axios';

interface Galpon {
  id: string;
  nombre: string;
}

interface TipoHuevo {
  id: string;
  nombre: string;
}

interface EntradaProduccion {
  id: string;
  galponId: string;
  fecha: string;
  tipoHuevoId: string;
  unidades: number;
  createdAt: string;
  updatedAt: string;
  galpon?: Galpon;
  tipoHuevo?: TipoHuevo;
}

interface CreateEntradaProduccionDto {
  galponId: string;
  fecha: string;
  tipoHuevoId: string;
  unidades: number;
}

interface UpdateEntradaProduccionDto {
  galponId?: string;
  fecha?: string;
  tipoHuevoId?: string;
  unidades?: number;
}

interface CreateEntradasMasivasDto {
  galponId: string;
  fecha: string;
  entradas: { tipoHuevoId: string; unidades: number }[];
}

export const useEntradasProduccionStore = defineStore('entradas-produccion', () => {
  const entradasProduccion = ref<EntradaProduccion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number>(0);
  const pagination = ref({ page: 1, limit: 20, total: 0 });

  const fetchEntradasProduccion = async (page = 1, limit = 20, filters?: { galponId?: string; tipoHuevoId?: string; fechaInicio?: string; fechaFin?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Obtener id_empresa del localStorage y añadirlo a los parámetros
      const id_empresa = localStorage.getItem('id_empresa');
      if (id_empresa) {
        params.append('id_empresa', id_empresa);
      }
      
      if (filters) {
        if (filters.galponId) params.append('galponId', filters.galponId);
        if (filters.tipoHuevoId) params.append('tipoHuevoId', filters.tipoHuevoId);
        if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
        if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
      }
      
      const response = await api.get(`/entradas-produccion?${params.toString()}`);
      
      if (page === 1) {
        entradasProduccion.value = response.data.items || response.data;
      } else {
        entradasProduccion.value.push(...(response.data.items || response.data));
      }
      
      pagination.value = {
        page,
        limit,
        total: response.data.total || entradasProduccion.value.length
      };
      
      lastFetch.value = Date.now();
    } catch (err) {
      error.value = 'Error al cargar las entradas de producción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createEntradaProduccion = async (entradaData: CreateEntradaProduccionDto) => {
    loading.value = true;
    error.value = null;
    try {
      // Obtener id_empresa y id_usuario_inserta del localStorage
      const id_empresa = localStorage.getItem('id_empresa');
      const id_usuario_inserta = localStorage.getItem('id_usuario');
      
      // Crear objeto con todos los datos necesarios
      const dataToSend = {
        ...entradaData,
        id_empresa: parseInt(id_empresa || '1', 10),
        id_usuario_inserta: id_usuario_inserta || ''
      };
      
      // Enviar datos en el cuerpo y evitar que se añadan como query params
      const response = await api.post('/entradas-produccion', dataToSend, {
        params: {} // Parámetros vacíos para evitar que el interceptor añada id_empresa como query param
      });
      entradasProduccion.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Error al crear la entrada de producción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEntradaProduccion = async (id: string, entradaData: UpdateEntradaProduccionDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/entradas-produccion/${id}`, entradaData);
      const index = entradasProduccion.value.findIndex(e => e.id === id);
      if (index !== -1) {
        entradasProduccion.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = 'Error al actualizar la entrada de producción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEntradaProduccion = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/entradas-produccion/${id}`);
      entradasProduccion.value = entradasProduccion.value.filter(e => e.id !== id);
    } catch (err) {
      error.value = 'Error al eliminar la entrada de producción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createEntradasMasivas = async (entradaData: CreateEntradasMasivasDto) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/entradas-produccion/masivas', entradaData);
      // Agregar las nuevas entradas al inicio del array
      entradasProduccion.value.unshift(...response.data);
      return response.data;
    } catch (err) {
      error.value = 'Error al crear las entradas de producción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const invalidateCache = () => {
    lastFetch.value = 0;
  };

  const loadMore = async (filters?: { galponId?: string; tipoHuevoId?: string; fechaInicio?: string; fechaFin?: string }) => {
    if (pagination.value.page * pagination.value.limit < pagination.value.total) {
      await fetchEntradasProduccion(pagination.value.page + 1, pagination.value.limit, filters);
    }
  };

  return {
    entradasProduccion,
    loading,
    error,
    pagination,
    fetchEntradasProduccion,
    createEntradaProduccion,
    updateEntradaProduccion,
    deleteEntradaProduccion,
    createEntradasMasivas,
    invalidateCache,
    loadMore,
  };
});