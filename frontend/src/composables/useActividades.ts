import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

export interface ActividadReciente {
  id: string;
  descripcion: string;
  fecha: Date;
  tipo: 'entrada' | 'salida' | 'gasto';
  icon: string;
  color: 'positive' | 'negative' | 'warning';
  monto?: number;
}

export function useActividades() {
  const $q = useQuasar();
  const actividades = ref<ActividadReciente[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchActividadesRecientes = async (limit: number = 10) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await api.get(`/actividades/recientes?limit=${limit}`);
      
      // Convertir las fechas de string a Date
      actividades.value = response.data.map((actividad: { fecha: string; [key: string]: unknown }) => ({
        ...actividad,
        fecha: new Date(actividad.fecha)
      }));
      
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cargar actividades recientes';
      error.value = errorMessage;
      console.error('Error fetching actividades recientes:', err);
      
      $q.notify({
        type: 'negative',
        message: 'Error al cargar actividades recientes',
        position: 'top-right'
      });
    } finally {
      loading.value = false;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Hace un momento';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) { // 24 horas
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      if (days < 7) {
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return {
    actividades,
    loading,
    error,
    fetchActividadesRecientes,
    formatDate,
    formatCurrency
  };
}