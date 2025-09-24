import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';
import { useInversionInicialStore } from './inversionInicial';

export interface TransaccionFinanciera {
  id: string;
  tipo: 'gasto' | 'ingreso' | 'venta' | 'compra';
  descripcion: string;
  monto: number;
  fecha: string;
  categoria?: string;
  referencia?: string;
  usuario?: string;
  detalles?: Record<string, unknown>;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
  esInversionInicial?: boolean;
  salidaId?: string;
}

export interface FiltrosHistorial {
  fechaInicio: string;
  fechaFin: string;
  tipo: string;
  categoria: string;
  montoMin?: number | undefined;
  montoMax?: number | undefined;
  busqueda: string;
}

interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria?: { nombre: string };
  categoriaId?: number;
  referencia?: string;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Ingreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  tipo?: string;
  referencia?: string;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
  salidaId?: string;
}

export const useHistorialFinancieroStore = defineStore('historialFinanciero', () => {
  // Estado
  const transacciones = ref<TransaccionFinanciera[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filtros = ref<FiltrosHistorial>({
    fechaInicio: '',
    fechaFin: '',
    tipo: '',
    categoria: '',
    montoMin: undefined,
    montoMax: undefined,
    busqueda: ''
  });

  // Getters computados
  const transaccionesFiltradas = computed(() => {
    let resultado = [...transacciones.value];

    if (filtros.value.fechaInicio) {
      resultado = resultado.filter(t => t.fecha >= filtros.value.fechaInicio);
    }

    if (filtros.value.fechaFin) {
      resultado = resultado.filter(t => t.fecha <= filtros.value.fechaFin);
    }

    if (filtros.value.tipo) {
      resultado = resultado.filter(t => t.tipo === filtros.value.tipo);
    }

    if (filtros.value.categoria) {
      resultado = resultado.filter(t => t.categoria === filtros.value.categoria);
    }

    if (filtros.value.montoMin !== undefined) {
      resultado = resultado.filter(t => t.monto >= filtros.value.montoMin!);
    }

    if (filtros.value.montoMax !== undefined) {
      resultado = resultado.filter(t => t.monto <= filtros.value.montoMax!);
    }

    return resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  const totalIngresos = computed(() => {
    return transaccionesFiltradas.value
      .filter(t => t.tipo === 'ingreso' || t.tipo === 'venta')
      .reduce((sum, t) => sum + t.monto, 0);
  });

  const totalGastos = computed(() => {
    return transaccionesFiltradas.value
      .filter(t => t.tipo === 'gasto' || t.tipo === 'compra')
      .reduce((sum, t) => sum + t.monto, 0);
  });

  const balanceNeto = computed(() => {
    return totalIngresos.value - totalGastos.value;
  });

  const categorias = computed(() => {
    const cats = new Set(transacciones.value.map(t => t.categoria).filter(Boolean));
    return Array.from(cats);
  });

  // Acciones
  const loadHistorial = async (filtrosParam?: FiltrosHistorial) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Cargar información de inversión inicial
      const inversionStore = useInversionInicialStore();
      await inversionStore.loadInversionInicial();
      
      // Cargar gastos e ingresos reales del backend
      const [gastosResponse, ingresosResponse] = await Promise.all([
        filtrosParam?.fechaInicio && filtrosParam?.fechaFin 
          ? api.get(`/gastos/by-date-range?fechaInicio=${filtrosParam.fechaInicio}&fechaFin=${filtrosParam.fechaFin}`)
          : api.get('/gastos'),
        filtrosParam?.fechaInicio && filtrosParam?.fechaFin
          ? api.get(`/ingresos/by-date-range?fechaInicio=${filtrosParam.fechaInicio}&fechaFin=${filtrosParam.fechaFin}`)
          : api.get('/ingresos')
      ]);

      const gastos = gastosResponse.data;
      const ingresos = ingresosResponse.data;

      // Convertir gastos a formato de transacciones
      const transaccionesGastos: TransaccionFinanciera[] = gastos.map((gasto: Gasto) => ({
        id: gasto.id.toString(),
        tipo: 'gasto' as const,
        descripcion: gasto.descripcion,
        monto: Number(gasto.monto) || 0, // Asegurar que sea número
        fecha: gasto.fecha.split('T')[0], // Convertir a formato YYYY-MM-DD
        categoria: gasto.categoria?.nombre || 'Sin categoría',
        referencia: gasto.referencia,
        usuario: 'Sistema',
        detalles: {
          categoriaId: gasto.categoriaId,
          observaciones: gasto.observaciones
        },
        createdAt: gasto.createdAt,
        updatedAt: gasto.updatedAt
      }));

      // Convertir ingresos a formato de transacciones
      const transaccionesIngresos: TransaccionFinanciera[] = ingresos.map((ingreso: Ingreso) => ({
        id: `ing-${ingreso.id}`,
        tipo: 'ingreso' as const,
        descripcion: ingreso.descripcion,
        monto: Number(ingreso.monto) || 0, // Asegurar que sea número
        fecha: ingreso.fecha.split('T')[0],
        categoria: ingreso.tipo || 'Ingreso',
        referencia: ingreso.referencia,
        usuario: 'Sistema',
        detalles: {
          tipo: ingreso.tipo,
          observaciones: ingreso.observaciones
        },
        createdAt: ingreso.createdAt,
        updatedAt: ingreso.updatedAt,
        salidaId: ingreso.salidaId
      }));

      // No agregar transacción de inversión inicial por separado ya que viene incluida en los gastos del backend
      // La inversión inicial se crea como un gasto regular con categoría 'Inversión Inicial'
      
      // Combinar y ordenar por fecha (más recientes primero)
      transacciones.value = [...transaccionesGastos, ...transaccionesIngresos]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
      if (filtrosParam) {
        filtros.value = { ...filtrosParam };
      }
    } catch (err: unknown) {
      error.value = 'Error al cargar el historial financiero';
      console.error('Error fetching historial financiero:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateTransaccion = async (id: string, data: Partial<TransaccionFinanciera>) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Determinar si es gasto o ingreso por el ID
      const isIngreso = id.startsWith('ing-');
      const realId = isIngreso ? id.replace('ing-', '') : id;
      
      if (isIngreso) {
        // Encontrar la transacción actual para obtener salidaId
        const transaccionActual = transacciones.value.find(t => t.id === id);
        
        // Actualizar ingreso
        await api.patch(`/ingresos/${realId}`, {
          descripcion: data.descripcion,
          monto: data.monto,
          fecha: data.fecha,
          tipo: data.categoria,
          referencia: data.referencia,
          observaciones: data.observaciones
        });
        
        // Si el ingreso proviene de una salida, actualizar también la salida
        if (transaccionActual?.salidaId && data.monto !== undefined) {
          try {
            // Obtener la salida actual para calcular las nuevas unidades
            const salidaResponse = await api.get(`/salidas/${transaccionActual.salidaId}`);
            const salida = salidaResponse.data;
            
            // Calcular las nuevas unidades basadas en el nuevo monto
            const valorCanasta = salida.canasta?.valorCanasta || 1;
            const nuevasUnidades = Math.round(data.monto / valorCanasta);
            
            // Actualizar la salida con las nuevas unidades
            await api.patch(`/salidas/${transaccionActual.salidaId}`, {
              unidades: nuevasUnidades
            });
          } catch (salidaError) {
            console.warn('Error al actualizar salida relacionada:', salidaError);
            // No fallar la actualización del ingreso si falla la salida
          }
        }
      } else {
        // Actualizar gasto
        await api.patch(`/gastos/${realId}`, {
          descripcion: data.descripcion,
          monto: data.monto,
          fecha: data.fecha,
          referencia: data.referencia,
          observaciones: data.observaciones
        });
      }
      
      // Recargar datos
      await loadHistorial(filtros.value);
      return { success: true };
    } catch (err: unknown) {
      error.value = 'Error al actualizar la transacción';
      console.error('Error updating transaccion:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteTransaccion = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Determinar si es gasto o ingreso por el ID
      const isIngreso = id.startsWith('ing-');
      const realId = isIngreso ? id.replace('ing-', '') : id;
      
      if (isIngreso) {
        // Encontrar la transacción actual para obtener salidaId
        const transaccionActual = transacciones.value.find(t => t.id === id);
        
        // Eliminar ingreso
        await api.delete(`/ingresos/${realId}`);
        
        // Si el ingreso proviene de una salida, eliminar también la salida
        if (transaccionActual?.salidaId) {
          try {
            await api.delete(`/salidas/${transaccionActual.salidaId}`);
          } catch (salidaError) {
            console.warn('Error al eliminar salida relacionada:', salidaError);
            // No fallar la eliminación del ingreso si falla la salida
          }
        }
      } else {
        // Eliminar gasto
        await api.delete(`/gastos/${realId}`);
      }
      
      // Recargar datos
      await loadHistorial(filtros.value);
      return { success: true };
    } catch (err: unknown) {
      error.value = 'Error al eliminar la transacción';
      console.error('Error deleting transaccion:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const createTransaccion = async (data: Omit<TransaccionFinanciera, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (data.tipo === 'ingreso') {
        // Crear ingreso
        await api.post('/ingresos', {
          descripcion: data.descripcion,
          monto: data.monto,
          fecha: data.fecha,
          tipo: data.categoria,
          referencia: data.referencia,
          observaciones: data.observaciones
        });
      } else {
        // Crear gasto - necesitamos obtener el categoriaId
        const categoriasResponse = await api.get('/categorias-gastos');
        const categoria = categoriasResponse.data.find((cat: { id: number; nombre: string }) => cat.nombre === data.categoria);
        
        await api.post('/gastos', {
          descripcion: data.descripcion,
          monto: data.monto,
          fecha: data.fecha,
          categoriaId: categoria?.id || 1, // Default a la primera categoría si no se encuentra
          referencia: data.referencia,
          observaciones: data.observaciones
        });
      }
      
      // Recargar datos
      await loadHistorial(filtros.value);
      return { success: true };
    } catch (err: unknown) {
      error.value = 'Error al crear la transacción';
      console.error('Error creating transaccion:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const aplicarFiltros = (nuevosFiltros: FiltrosHistorial) => {
    filtros.value = { ...nuevosFiltros };
  };

  const limpiarFiltros = () => {
    filtros.value = {
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      categoria: '',
      montoMin: undefined,
      montoMax: undefined,
      busqueda: ''
    };
  };

  return {
    // Estado
    transacciones,
    loading,
    error,
    filtros,
    
    // Getters
    transaccionesFiltradas,
    totalIngresos,
    totalGastos,
    balanceNeto,
    categorias,
    
    // Acciones
    loadHistorial,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    aplicarFiltros,
    limpiarFiltros
  };
});