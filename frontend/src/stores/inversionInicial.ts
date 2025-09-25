import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';

export interface InversionInicial {
  montoTotal: number;
  montoRecuperado: number;
  porcentajeRecuperado: number;
  montoRestante: number;
  fechaInicio: string;
  metaRecuperacion?: number; // en meses
  promedioMensualRecuperacion: number;
}

export interface RegistroRecuperacion {
  fecha: string;
  monto: number;
  descripcion: string;
  tipo: 'ingreso' | 'venta';
}

interface Gasto {
  fecha: string;
  monto: number;
  descripcion: string;
  categoria?: {
    nombre: string;
  };
}

export const useInversionInicialStore = defineStore('inversionInicial', () => {
  // Estado
  const inversionInicial = ref<InversionInicial>({
    montoTotal: 0,
    montoRecuperado: 0,
    porcentajeRecuperado: 0,
    montoRestante: 0,
    fechaInicio: '',
    promedioMensualRecuperacion: 0
  } as InversionInicial);
  
  const registrosRecuperacion = ref<RegistroRecuperacion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computadas
  const tiempoEstimadoRecuperacion = computed(() => {
    const montoRestante = inversionInicial.value?.montoRestante || 0;
    const promedioMensual = inversionInicial.value?.promedioMensualRecuperacion || 0;
    
    // Validar que los valores sean números válidos
    if (isNaN(montoRestante) || isNaN(promedioMensual) || promedioMensual <= 0 || montoRestante <= 0) {
      return 0;
    }
    
    const resultado = Math.ceil(montoRestante / promedioMensual);
    return isNaN(resultado) || !isFinite(resultado) ? 0 : resultado;
  });

  const progresoDiario = computed(() => {
    const fechaInicio = inversionInicial.value?.fechaInicio;
    const montoRecuperado = inversionInicial.value?.montoRecuperado || 0;
    
    if (!fechaInicio || isNaN(montoRecuperado)) return 0;
    
    const fechaInicioDate = new Date(fechaInicio);
    const fechaActual = new Date();
    const diasTranscurridos = Math.floor((fechaActual.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasTranscurridos <= 0) return 0;
    
    const resultado = Math.round((montoRecuperado / diasTranscurridos) * 100) / 100;
    return isNaN(resultado) || !isFinite(resultado) ? 0 : resultado;
  });

  // Acciones
  const loadInversionInicial = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Obtener el total de inversión inicial desde el backend
      const resumenResponse = await api.get('/finanzas/resumen');
      const resumen = resumenResponse.data;
      
      console.log('Resumen desde backend:', resumen);
      
      const montoTotal = Number(resumen.totalInversionInicial) || 0;
      let fechaInicioStr = '2024-01-01'; // Valor por defecto
      
      // Intentar obtener la fecha de inicio real desde los gastos de inversión inicial
      try {
        const gastosResponse = await api.get('/gastos');
        const gastos = gastosResponse.data;
        const inversionInicialGasto = gastos.find((gasto: Gasto) => 
          gasto.categoria?.nombre === 'Inversión Inicial'
        );
        if (inversionInicialGasto && inversionInicialGasto.fecha) {
          fechaInicioStr = inversionInicialGasto.fecha.split('T')[0];
        }
      } catch (gastosError) {
        console.warn('No se pudo obtener la fecha de inversión inicial:', gastosError);
      }
      
      // Obtener todos los ingresos para calcular la recuperación
      const ingresosResponse = await api.get('/ingresos');
      const ingresos = ingresosResponse.data;
      
      console.log('Ingresos desde backend:', ingresos);
      
      // Calcular monto recuperado (solo ingresos y ventas)
      const montoRecuperado = ingresos.reduce((total: number, ingreso: { monto: number }) => {
        const monto = Number(ingreso.monto) || 0;
        return total + monto;
      }, 0);
      
      console.log('Valores calculados:', { montoTotal, montoRecuperado });
      
      const montoRestante = Math.max(0, montoTotal - montoRecuperado);
      const porcentajeRecuperado = montoTotal > 0 ? (montoRecuperado / montoTotal) * 100 : 0;
      
      // Calcular promedio mensual de recuperación
      const fechaInicio = new Date(fechaInicioStr);
      const fechaActual = new Date();
      const mesesTranscurridos = Math.max(1, 
        (fechaActual.getFullYear() - fechaInicio.getFullYear()) * 12 + 
        (fechaActual.getMonth() - fechaInicio.getMonth())
      );
      
      const promedioMensualRecuperacion = mesesTranscurridos > 0 ? montoRecuperado / mesesTranscurridos : 0;
      
      // Validar y sanitizar todos los valores numéricos
      const sanitizeNumber = (value: unknown): number => {
        const num = Number(value);
        return isNaN(num) || !isFinite(num) ? 0 : num;
      };
      
      const inversionData = {
        montoTotal: sanitizeNumber(montoTotal),
        montoRecuperado: sanitizeNumber(montoRecuperado),
        porcentajeRecuperado: sanitizeNumber(typeof porcentajeRecuperado === 'number' && !isNaN(porcentajeRecuperado) ? porcentajeRecuperado.toFixed(2) : '0'),
        montoRestante: sanitizeNumber(montoRestante),
        fechaInicio: fechaInicioStr,
        promedioMensualRecuperacion: sanitizeNumber(typeof promedioMensualRecuperacion === 'number' && !isNaN(promedioMensualRecuperacion) ? promedioMensualRecuperacion.toFixed(0) : '0')
      };
      
      console.log('Datos finales de inversión:', inversionData);
      
      inversionInicial.value = inversionData;
      
      // Crear registros de recuperación basados en ingresos
      registrosRecuperacion.value = ingresos.map((ingreso: { fecha: string; monto: number; descripcion: string; tipo: string }) => ({
        fecha: ingreso.fecha.split('T')[0],
        monto: ingreso.monto,
        descripcion: ingreso.descripcion,
        tipo: ingreso.tipo === 'venta' ? 'venta' : 'ingreso'
      })).sort((a: RegistroRecuperacion, b: RegistroRecuperacion) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      
    } catch (err: unknown) {
      error.value = 'Error al cargar información de inversión inicial';
      console.error('Error loading inversion inicial:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarMetaRecuperacion = (meses: number) => {
    try {
      inversionInicial.value.metaRecuperacion = meses;
      // Aquí podrías guardar la meta en el backend si es necesario
    } catch (err: unknown) {
      error.value = 'Error al actualizar meta de recuperación';
      console.error('Error updating meta:', err);
    }
  };
  
  const getRecuperacionPorPeriodo = (fechaInicio: string, fechaFin: string) => {
    return registrosRecuperacion.value
      .filter(registro => registro.fecha >= fechaInicio && registro.fecha <= fechaFin)
      .reduce((total, registro) => total + registro.monto, 0);
  };
  
  const getProyeccionRecuperacion = (meses: number) => {
    const montoMensualPromedio = inversionInicial.value.promedioMensualRecuperacion;
    const proyeccion = montoMensualPromedio * meses;
    const fechaEstimada = new Date();
    fechaEstimada.setMonth(fechaEstimada.getMonth() + meses);
    
    return {
      montoProyectado: Math.round(proyeccion),
      fechaEstimada: fechaEstimada.toISOString().split('T')[0],
      porcentajeProyectado: inversionInicial.value.montoTotal > 0 
        ? Math.min(100, ((inversionInicial.value.montoRecuperado + proyeccion) / inversionInicial.value.montoTotal) * 100)
        : 0
    };
  };
  
  const setInversionInicial = async (datos: { montoTotal: number; fechaInicio: string; metaRecuperacion?: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Llamada a la API para guardar los datos
      await api.post('/finanzas/inversion-inicial', datos);
      
      // Calcular valores derivados
      const montoRecuperado = inversionInicial.value.montoRecuperado || 0;
      const porcentajeRecuperado = datos.montoTotal > 0 
        ? (montoRecuperado / datos.montoTotal) * 100 
        : 0;
      const montoRestante = datos.montoTotal - montoRecuperado;
      const promedioMensualRecuperacion = inversionInicial.value.promedioMensualRecuperacion 
        ? inversionInicial.value.promedioMensualRecuperacion 
        : 0;
      
      const nuevaInversion: InversionInicial = {
        montoTotal: datos.montoTotal,
        montoRecuperado,
        porcentajeRecuperado,
        montoRestante,
        fechaInicio: datos.fechaInicio,
        promedioMensualRecuperacion
      };
      
      if (datos.metaRecuperacion !== undefined) {
        nuevaInversion.metaRecuperacion = datos.metaRecuperacion;
      }
      
      inversionInicial.value = nuevaInversion;
      
    } catch (err) {
      error.value = 'Error al actualizar la inversión inicial';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estado
    inversionInicial,
    registrosRecuperacion,
    loading,
    error,
    
    // Computadas
    tiempoEstimadoRecuperacion,
    progresoDiario,
    
    // Acciones
    loadInversionInicial,
    setInversionInicial,
    actualizarMetaRecuperacion,
    getRecuperacionPorPeriodo,
    getProyeccionRecuperacion
  };
});