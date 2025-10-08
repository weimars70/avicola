import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import { useNotifications } from './useNotifications';

// Helper para manejar errores de API
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

interface CategoriaGasto {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rendimiento {
  id: string;
  fecha: string;
  totalIngresos: number;
  totalGastos: number;
  utilidadNeta: number;
  margenUtilidad: number;
  roi: number;
  periodo: string;
  observaciones?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Salida {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  observaciones?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GastoPorCategoria {
  categoria: string;
  total: number;
  porcentaje: number;
  color?: string;
}

interface MesComparativo {
  mes: number;
  nombreMes: string;
  ingresos: number;
  gastosTotal: number;
  gastosOperativos: number;
  utilidadOperativa: number;
  utilidadNeta: number;
  margenUtilidad: number;
}

export interface ComparativoMensual {
  año: number;
  totalInversionInicial: number;
  meses: MesComparativo[];
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  observaciones?: string;
  numeroFactura?: string;
  proveedor?: string;
  activo: boolean;
  categoria: CategoriaGasto;
  categoriaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ingreso {
  id: string;
  monto: number;
  fecha: string;
  descripcion: string;
  observaciones?: string;
  tipo: string;
  activo: boolean;
  salida?: Salida;
  salidaId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResumenFinanciero {
  totalIngresos: number;
  totalGastos: number;
  utilidadNeta: number;
  margenUtilidad: number;
  gastosPorCategoria: GastoPorCategoria[];
  periodo?: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export function useFinanzas() {
  const { showSuccess, showError } = useNotifications();
  
  // Estados reactivos para manejar datos financieros
  const categorias = ref<CategoriaGasto[]>([]);
  const gastos = ref<Gasto[]>([]);
  const ingresos = ref<Ingreso[]>([]);
  const rendimientos = ref<Rendimiento[]>([]);
  const resumenFinanciero = ref<ResumenFinanciero | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computadas
  const categoriasActivas = computed(() => 
    categorias.value.filter(c => c.activo)
  );

  const gastosActivos = computed(() => 
    gastos.value.filter(g => g.activo)
  );

  const ingresosActivos = computed(() => 
    ingresos.value.filter(i => i.activo)
  );

  const totalGastos = computed(() => {
    return gastos.value.reduce((total, gasto) => total + Number(gasto.monto), 0);
  });

  const totalIngresos = computed(() => {
    return ingresos.value.reduce((total, ingreso) => total + Number(ingreso.monto), 0);
  });

  const utilidadNeta = computed(() => {
    return totalIngresos.value - totalGastos.value;
  });

  const margenUtilidad = computed(() => {
    return totalIngresos.value > 0 ? (utilidadNeta.value / totalIngresos.value) * 100 : 0;
  });

  const ingresosPorTipo = computed(() => {
    const grupos: { [key: string]: number } = {};
    ingresos.value.forEach(ingreso => {
      const tipo = ingreso.tipo;
      grupos[tipo] = (grupos[tipo] || 0) + Number(ingreso.monto);
    });
    return Object.entries(grupos).map(([nombre, total]) => ({ nombre, total }));
  });

  // Funciones para categorías
  const fetchCategorias = async () => {
    try {
      loading.value = true;
      const response = await api.get('/categorias-gastos');
      categorias.value = response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar categorías');
      showError('Error al cargar categorías');
    } finally {
      loading.value = false;
    }
  }

  const createCategoria = async (categoriaData: Partial<CategoriaGasto>) => {
    try {
      loading.value = true;
      const response = await api.post('/categorias-gastos', categoriaData);
      categorias.value.push(response.data);
      showSuccess('Categoría creada exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al crear categoría');
      showError('Error al crear categoría');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategoria = async (id: number, categoriaData: Partial<CategoriaGasto>) => {
    try {
      loading.value = true;
      const response = await api.patch(`/categorias-gastos/${id}`, categoriaData);
      const index = categorias.value.findIndex(c => c.id === Number(id));
      if (index !== -1) {
        categorias.value[index] = response.data;
      }
      showSuccess('Categoría actualizada exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al actualizar categoría');
      showError('Error al actualizar categoría');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      loading.value = true;
      await api.delete(`/categorias-gastos/${id}`);
      categorias.value = categorias.value.filter(c => c.id !== Number(id));
      showSuccess('Categoría eliminada exitosamente');
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al eliminar categoría');
      showError('Error al eliminar categoría');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const seedCategorias = async () => {
    try {
      loading.value = true;
      const response = await api.post('/categorias-gastos/seed');
      await fetchCategorias(); // Recargar categorías después del seed
      showSuccess(response.data.message || 'Categorías iniciales creadas exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al crear categorías iniciales');
      showError('Error al crear categorías iniciales');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Funciones para gastos
  const fetchGastos = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      loading.value = true;
      let url = '/gastos';
      if (fechaInicio && fechaFin) {
        url += `/by-date-range?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      const response = await api.get(url);
      gastos.value = response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar gastos');
      showError('Error al cargar gastos');
    } finally {
      loading.value = false;
    }
  };

  const createGasto = async (gastoData: Partial<Gasto>) => {
    try {
      loading.value = true;
      
      // Obtener id_empresa y id_usuario_inserta del localStorage
      const id_empresa = localStorage.getItem('id_empresa');
      const id_usuario_inserta = localStorage.getItem('id_usuario');
      
      if (!id_empresa) {
        throw new Error('No se encontró id_empresa en localStorage');
      }
      
      if (!id_usuario_inserta) {
        throw new Error('No se encontró id_usuario en localStorage');
      }
      
      // Enviar los datos del gasto en el body y los parámetros id_empresa e id_usuario_inserta como query params
      const url = `/gastos?id_empresa=${id_empresa}&id_usuario_inserta=${id_usuario_inserta}`;
      const response = await api.post(url, gastoData);
      gastos.value.unshift(response.data);
      showSuccess('Gasto registrado exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al registrar gasto');
      showError('Error al registrar gasto');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateGasto = async (id: string, gastoData: Partial<Gasto>) => {
    try {
      loading.value = true;
      const response = await api.patch(`/gastos/${id}`, gastoData);
      const index = gastos.value.findIndex(g => g.id === id);
      if (index !== -1) {
        gastos.value[index] = response.data;
      }
      showSuccess('Gasto actualizado exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al actualizar gasto');
      showError('Error al actualizar gasto');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGasto = async (id: string) => {
    try {
      loading.value = true;
      await api.delete(`/gastos/${id}`);
      gastos.value = gastos.value.filter(g => g.id !== id);
      showSuccess('Gasto eliminado exitosamente');
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al eliminar gasto');
      showError('Error al eliminar gasto');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createConsumoPropio = async (consumoPropioData: {
    fecha: string;
    descripcion: string;
    huevosConsumidos: Array<{
      tipoHuevoId: string;
      unidades: number;
    }>;
    observaciones?: string;
  }) => {
    try {
      loading.value = true;
      
      // Obtener id_empresa y id_usuario_inserta del localStorage
      const id_empresa = localStorage.getItem('id_empresa');
      const id_usuario_inserta = localStorage.getItem('id_usuario');
      
      if (!id_empresa) {
        throw new Error('No se encontró id_empresa en localStorage');
      }
      
      if (!id_usuario_inserta) {
        throw new Error('No se encontró id_usuario en localStorage');
      }
      
      // Enviar los datos que espera el backend según el DTO, sin incluir id_usuario_inserta en el body
      const dataToSend = {
        descripcion: consumoPropioData.descripcion,
        fecha: consumoPropioData.fecha,
        observaciones: consumoPropioData.observaciones || '',
        huevosConsumidos: consumoPropioData.huevosConsumidos,
        id_empresa: parseInt(id_empresa, 10)
      };
      
      console.log('Enviando datos de consumo propio:', dataToSend);
      
      // Usar Axios con configuración correcta - enviando id_usuario_inserta e id_empresa como query params
      const url = `/gastos/consumo-propio?id_empresa=${id_empresa}&id_usuario_inserta=${id_usuario_inserta}`;
      await api.post(url, dataToSend);
      await fetchGastos();
      showSuccess('Consumo propio registrado correctamente');
    } catch (error) {
      console.error('Error guardando gasto:', error);
      showError(`Error guardando gasto: ${getErrorMessage(error, 'Error desconocido')}`);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Funciones para ingresos
  const fetchIngresos = async () => {
    try {
      loading.value = true;
      const response = await api.get('/ingresos');
      ingresos.value = response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar ingresos');
      showError('Error al cargar ingresos');
    } finally {
      loading.value = false;
    }
  };

  const createIngreso = async (ingresoData: Partial<Ingreso>) => {
    try {
      loading.value = true;
      const response = await api.post('/ingresos', ingresoData);
      ingresos.value.unshift(response.data);
      showSuccess('Ingreso registrado exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al crear ingreso');
      showError('Error al crear ingreso');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateIngreso = async (id: string, ingresoData: Partial<Ingreso>) => {
    try {
      loading.value = true;
      const response = await api.patch(`/ingresos/${id}`, ingresoData);
      const index = ingresos.value.findIndex(i => i.id === id);
      if (index !== -1) {
        ingresos.value[index] = response.data;
      }
      showSuccess('Ingreso actualizado exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al actualizar ingreso');
      showError('Error al actualizar ingreso');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteIngreso = async (id: string) => {
    try {
      loading.value = true;
      await api.delete(`/ingresos/${id}`);
      ingresos.value = ingresos.value.filter(i => i.id !== id);
      showSuccess('Ingreso eliminado exitosamente');
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al eliminar ingreso');
      showError('Error al eliminar ingreso');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const syncIngresosFromSalidas = async () => {
    try {
      loading.value = true;
      const response = await api.post('/ingresos/sync-from-salidas');
      await fetchIngresos();
      showSuccess('Ingresos sincronizados exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al sincronizar ingresos');
      showError('Error al sincronizar ingresos');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Funciones para rendimiento
  const fetchRendimientos = async () => {
    try {
      loading.value = true;
      const response = await api.get('/rendimiento');
      rendimientos.value = response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar rendimientos');
      showError('Error al cargar rendimientos');
    } finally {
      loading.value = false;
    }
  };

  const getMetricasRendimiento = async () => {
    try {
      loading.value = true;
      const response = await api.get('/rendimiento/metricas');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar métricas');
      showError('Error al cargar métricas');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const calcularRendimientoMensual = async (año: number, mes: number) => {
    try {
      loading.value = true;
      const response = await api.post('/rendimiento/calcular-mensual', { año, mes });
      await fetchRendimientos();
      showSuccess('Rendimiento calculado exitosamente');
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al calcular rendimiento');
      showError('Error al calcular rendimiento');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Funciones para resúmenes
  const fetchResumenFinanciero = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      loading.value = true;
      let url = '/finanzas/resumen';
      if (fechaInicio && fechaFin) {
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      const response = await api.get(url);
      resumenFinanciero.value = response.data;
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar resumen financiero');
      showError('Error al cargar resumen financiero');
    } finally {
      loading.value = false;
    }
  };

  const fetchKPIsFinancieros = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      loading.value = true;
      // Usar el endpoint de resumen que sí existe
      let url = '/finanzas/resumen';
      if (fechaInicio && fechaFin) {
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar KPIs financieros');
      showError('Error al cargar KPIs financieros');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchComparativoMensual = async (año?: string) => {
    try {
      loading.value = true;
      let url = '/finanzas/comparativo-mensual';
      if (año) {
        url += `?año=${año}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Error al cargar comparativo mensual');
      showError('Error al cargar comparativo mensual');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Utilidades
  const formatCurrency = (value: number | undefined | null) => {
    // Manejar valores undefined, null o NaN
    if (value === undefined || value === null || isNaN(value)) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
    }
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string): string => {
    if (!date) return '';
    
    // Validar que la fecha tenga el formato correcto
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Evitar problemas de timezone parseando la fecha manualmente
    const parts = date.split('-');
    if (parts.length !== 3) return date;
    
    const year = parseInt(parts[0]!, 10);
    const month = parseInt(parts[1]!, 10);
    const day = parseInt(parts[2]!, 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return date;
    
    const localDate = new Date(year, month - 1, day);
    
    return localDate.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Función para asegurar que las fechas se envíen correctamente al backend
  const ensureDateFormat = (date: string): string => {
    if (!date) return '';
    
    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Si es una fecha en otro formato, intentar convertirla
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date; // Si no es una fecha válida, devolver tal como está
    }
    
    // Convertir a formato YYYY-MM-DD en timezone local
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Retorno del composable
  return {
    // Estados
    categorias,
    gastos,
    ingresos,
    rendimientos,
    resumenFinanciero,
    loading,
    error,
    
    // Computadas
    categoriasActivas,
    gastosActivos,
    ingresosActivos,
    totalGastos,
    totalIngresos,
    utilidadNeta,
    margenUtilidad,
    ingresosPorTipo,
    
    // Funciones de categorías
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    seedCategorias,
    
    // Funciones de gastos
    fetchGastos,
    createGasto,
    updateGasto,
    deleteGasto,
    createConsumoPropio,
    
    // Funciones de ingresos
    fetchIngresos,
    createIngreso,
    updateIngreso,
    deleteIngreso,
    syncIngresosFromSalidas,
    
    // Funciones de rendimiento
    fetchRendimientos,
    getMetricasRendimiento,
    calcularRendimientoMensual,
    
    // Funciones de resúmenes
    fetchResumenFinanciero,
    fetchKPIsFinancieros,
    fetchComparativoMensual,
    
    // Utilidades
    formatCurrency,
    formatDate,
    ensureDateFormat,
  };
}