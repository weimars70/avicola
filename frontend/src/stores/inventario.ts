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
  capacidadMaxima: number;
  activo: boolean;
}

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo: boolean;
}

// Interfaces Canasta y Usuario eliminadas - ya no se utilizan

// Interfaces removidas - ya no se usan movimientos

interface ResumenInventario {
  galpon?: Galpon;
  tipoHuevo: TipoHuevo;
  stockActual: number;
  valorTotal: number;
  totalEntradas: number;
  totalSalidas: number;
  galponId?: string;
}

export const useInventarioStore = defineStore('inventario', () => {
  const resumenInventario = ref<ResumenInventario[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Funciones de movimientos removidas - ya no se usan

  const fetchResumenInventario = async (galponId?: string, tipoHuevoId?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (galponId) params.append('galponId', galponId);
      if (tipoHuevoId) params.append('tipoHuevoId', tipoHuevoId);
      
      const response = await api.get(`/inventario/resumen?${params.toString()}`);
      resumenInventario.value = response.data;
    } catch (err: unknown) {
      error.value = (err as AxiosError).response?.data?.message || 'Error al cargar resumen de inventario';
    } finally {
      loading.value = false;
    }
  };

  // Función getMovimientoById removida - ya no se usa

  return {
    resumenInventario,
    loading,
    error,
    fetchResumenInventario,
  };
});