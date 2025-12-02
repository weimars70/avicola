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
  nombreComprador?: string;
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
  salida?: {
    nombreComprador?: string;
  };
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
        salidaId: ingreso.salidaId,
        nombreComprador: ingreso.salida?.nombreComprador || undefined
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
        
        // Actualizar la transacción en la lista local para reflejar cambios inmediatamente
        const index = transacciones.value.findIndex(t => t.id === id);
        if (index !== -1 && transacciones.value[index]) {
          const currentItem = transacciones.value[index];
          // Asegurarse de que los valores opcionales no sean undefined
          const transaccionActualizada = {
            id: currentItem.id,
            tipo: currentItem.tipo,
            descripcion: data.descripcion !== undefined ? data.descripcion : currentItem.descripcion,
            monto: data.monto !== undefined ? data.monto : currentItem.monto,
            fecha: data.fecha !== undefined ? data.fecha : currentItem.fecha,
            categoria: data.categoria || currentItem.categoria || '',
            referencia: data.referencia || currentItem.referencia,
            observaciones: data.observaciones || currentItem.observaciones,
            usuario: currentItem.usuario,
            detalles: currentItem.detalles,
            createdAt: currentItem.createdAt,
            updatedAt: currentItem.updatedAt,
            esInversionInicial: currentItem.esInversionInicial,
            salidaId: currentItem.salidaId,
            nombreComprador: currentItem.nombreComprador
          };
          transacciones.value[index] = transaccionActualizada as TransaccionFinanciera;
        }
        
        // Si el ingreso proviene de una salida, actualizar también la salida
        if (transaccionActual?.salidaId && (data.monto !== undefined || data.nombreComprador !== undefined)) {
          try {
            const updateData: { valor?: number; nombreComprador?: string } = {};
            if (typeof data.monto === 'number') updateData.valor = data.monto;
            if (typeof data.nombreComprador === 'string') updateData.nombreComprador = data.nombreComprador;
            await api.patch(`/salidas/${transaccionActual.salidaId}`, updateData);
          } catch (salidaError) {
            console.warn('Error al actualizar salida relacionada:', salidaError);
            // No fallar la actualización del ingreso si falla la salida
          }
        }
      } else if (id.startsWith('sal-')) {
        // Actualizar salida
        const realSalidaId = id.replace('sal-', '');

        // Usar una interfaz extendida para acceder a campos de salida
        interface SalidaData extends Partial<TransaccionFinanciera> {
          unidades?: number;
          tipoHuevoId?: string;
          canastaId?: string | null;
          fechaSalida?: string;
        }

        const salidaData = data as SalidaData;

        // Preparar datos para actualizar
        const salidaPayload: {
          valor?: number;
          nombreComprador?: string;
          unidades?: number;
          tipoHuevoId?: string;
          canastaId?: string | null;
          fecha?: string;
        } = {};

        // Si se proporciona monto (precio unitario) y unidades, calcular el total
        if (typeof data.monto === 'number' && typeof salidaData.unidades === 'number') {
          salidaPayload.valor = data.monto * salidaData.unidades; // Total = precio unitario * unidades
        } else if (typeof data.monto === 'number') {
          salidaPayload.valor = data.monto;
        }

        if (typeof salidaData.unidades === 'number') {
          salidaPayload.unidades = salidaData.unidades;
        }

        if (typeof salidaData.tipoHuevoId === 'string') {
          salidaPayload.tipoHuevoId = salidaData.tipoHuevoId;
        }

        if (salidaData.canastaId !== undefined) {
          salidaPayload.canastaId = salidaData.canastaId;
        }

        if (typeof salidaData.fechaSalida === 'string') {
          salidaPayload.fecha = salidaData.fechaSalida;
        }

        if (typeof data.nombreComprador === 'string') {
          salidaPayload.nombreComprador = data.nombreComprador;
        }

        // Asegurarse de que no se envíen campos vacíos o undefined (excepto canastaId que puede ser null)
        Object.keys(salidaPayload).forEach(key => {
          const k = key as keyof typeof salidaPayload;
          if (salidaPayload[k] === undefined || salidaPayload[k] === '') {
            delete salidaPayload[k];
          }
        });

        console.log('Enviando datos de salida:', salidaPayload);
        console.log('URL:', `/salidas/${realSalidaId}`);

        await api.patch(`/salidas/${realSalidaId}`, salidaPayload);
        
        // Actualizar también el store de salidas para mantener sincronización
        try {
          const { useSalidasStore } = await import('./salidas');
          const salidasStore = useSalidasStore();
          await salidasStore.fetchSalidas();
        } catch (salidasError) {
          console.warn('Error al actualizar store de salidas:', salidasError);
        }
        // Actualizar la transacción en la lista local para reflejar cambios inmediatamente
        const index = transacciones.value.findIndex(t => t.id === id);
        if (index !== -1 && transacciones.value[index]) {
          const currentItem = transacciones.value[index];
          const transaccionActualizada = {
            id: currentItem.id,
            tipo: currentItem.tipo,
            descripcion: data.descripcion || currentItem.descripcion,
            monto: typeof data.monto === 'number' ? data.monto : currentItem.monto,
            fecha: data.fecha || currentItem.fecha,
            categoria: data.categoria || currentItem.categoria || '',
            referencia: data.referencia || currentItem.referencia,
            observaciones: data.observaciones || currentItem.observaciones,
            usuario: currentItem.usuario,
            detalles: currentItem.detalles,
            createdAt: currentItem.createdAt,
            updatedAt: currentItem.updatedAt,
            esInversionInicial: currentItem.esInversionInicial,
            salidaId: currentItem.salidaId,
            nombreComprador: typeof data.nombreComprador === 'string' ? data.nombreComprador : currentItem.nombreComprador
          };
          transacciones.value[index] = transaccionActualizada as TransaccionFinanciera;
        }
        
        // Recargar datos para asegurar sincronización
        await loadHistorial(filtros.value);
      } else {
        // Actualizar gasto - necesitamos obtener el categoriaId de la transacción actual
        const transaccionActual = transacciones.value.find(t => t.id === id);
        const categoriaId = transaccionActual?.detalles?.categoriaId;
        
        // Si no tenemos categoriaId, buscar por nombre de categoría
        let finalCategoriaId = categoriaId;
        if (!finalCategoriaId && data.categoria) {
          try {
            const categoriasResponse = await api.get('/categorias-gastos');
            const categoria = categoriasResponse.data.find((cat: { id: number; nombre: string }) => cat.nombre === data.categoria);
            finalCategoriaId = categoria?.id;
          } catch (error) {
            console.warn('Error al obtener categorías:', error);
          }
        }
        
        const gastoPayload = {
          descripcion: data.descripcion,
          monto: data.monto,
          fecha: data.fecha,
          observaciones: data.observaciones,
          categoriaId: finalCategoriaId || 1 // Default a 1 si no se encuentra
        };
        
        console.log('Enviando datos de gasto:', gastoPayload);
        console.log('URL:', `/gastos/${realId}`);
        
        await api.patch(`/gastos/${realId}`, gastoPayload);
        
        // Actualizar la transacción en la lista local para reflejar cambios inmediatamente
        const index = transacciones.value.findIndex(t => t.id === id);
        if (index !== -1 && transacciones.value[index]) {
          const currentItem = transacciones.value[index];
          const transaccionActualizada = {
            id: currentItem.id,
            tipo: currentItem.tipo,
            descripcion: data.descripcion !== undefined ? data.descripcion : currentItem.descripcion,
            monto: data.monto !== undefined ? data.monto : currentItem.monto,
            fecha: data.fecha !== undefined ? data.fecha : currentItem.fecha,
            categoria: data.categoria !== undefined ? data.categoria : currentItem.categoria,
            referencia: data.referencia !== undefined ? data.referencia : currentItem.referencia,
            observaciones: data.observaciones !== undefined ? data.observaciones : currentItem.observaciones,
            usuario: currentItem.usuario,
            detalles: currentItem.detalles,
            createdAt: currentItem.createdAt,
            updatedAt: currentItem.updatedAt,
            esInversionInicial: currentItem.esInversionInicial,
            salidaId: currentItem.salidaId,
            nombreComprador: currentItem.nombreComprador
          };
          transacciones.value[index] = transaccionActualizada as TransaccionFinanciera;
        }
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