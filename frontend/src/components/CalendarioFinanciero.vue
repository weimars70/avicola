<template>
  <div class="calendario-financiero">
    <!-- Header del calendario -->
    <div class="calendario-header">
      <q-btn
        flat
        round
        icon="chevron_left"
        @click="mesAnterior"
        class="nav-btn"
      />
      <div class="mes-año">
        <h6 class="text-h6 q-ma-none">{{ nombreMes }} {{ año }}</h6>
      </div>
      <q-btn
        flat
        round
        icon="chevron_right"
        @click="mesSiguiente"
        class="nav-btn"
      />
    </div>

    <!-- Días de la semana -->
    <div class="dias-semana">
      <div
        v-for="dia in diasSemana"
        :key="dia"
        class="dia-semana-header"
      >
        {{ dia }}
      </div>
    </div>

    <!-- Grid del calendario -->
    <div class="calendario-grid">
      <div
        v-for="dia in diasDelMes"
        :key="dia.fecha"
        class="dia-celda"
        :class="{
          'dia-otro-mes': !dia.esDelMesActual,
          'dia-hoy': dia.esHoy,
          'dia-con-datos': dia.datos && ((dia.datos.ingresos || 0) > 0 || (dia.datos.gastos || 0) > 0 || (dia.datos.canastas || 0) > 0)
        }"
      >
        <!-- Contenido del día -->
        <div v-if="dia.esDelMesActual" class="dia-contenido">
          <!-- Número del día -->
          <div class="dia-numero">{{ dia.numero }}</div>
          
          <!-- Datos del día - SIEMPRE mostrar iconos -->
          <div class="datos-container">
            <!-- Solo Gastos (para página de finanzas) -->
            <div v-if="mostrarGastos && !mostrarIngresos" class="dato-item gastos-solo">
              <span class="icono">💰</span>
              <span class="valor">${{ (dia.datos && dia.datos.gastos) || 0 }}</span>
            </div>
            
            <!-- Calendario completo (historial financiero) -->
             <template v-if="mostrarIngresos || mostrarCanastas || mostrarGastos || mostrarProduccion">
               <!-- Producción de huevos -->
               <div v-if="mostrarProduccion" class="dato-item produccion">
                 <span class="icono">🥚</span>
                 <span class="valor">{{ (dia.datos && dia.datos.produccion) || 0 }}</span>
               </div>
               
               <!-- Ingresos (salidas monetarias) -->
               <div v-if="mostrarIngresos" class="dato-item ingresos">
                 <span class="icono">$</span>
                 <span class="valor">{{ (dia.datos && dia.datos.ingresos) || 0 }}</span>
               </div>
               
               <!-- Canastas -->
               <div v-if="mostrarCanastas" class="dato-item canastas">
                 <span class="icono">🧺</span>
                 <span class="valor">{{ (dia.datos && dia.datos.canastas) || 0 }}</span>
               </div>
               
               <!-- Gastos -->
               <div v-if="mostrarGastos" class="dato-item gastos">
                 <span class="icono">💸</span>
                 <span class="valor">${{ (dia.datos && dia.datos.gastos) || 0 }}</span>
               </div>
             </template>
          </div>
        </div>
        
        <!-- Para días de otros meses, solo mostrar el número -->
        <div v-else class="dia-numero otro-mes">{{ dia.numero }}</div>
      </div>
    </div>

    <!-- Leyenda -->
    <div class="leyenda">
      <div v-if="mostrarProduccion" class="leyenda-item">
        <span class="leyenda-icono">🥚</span>
        <span>Producción de Huevos</span>
      </div>
      <div v-if="mostrarIngresos" class="leyenda-item">
        <span class="leyenda-icono">$</span>
        <span>Salidas (Ingresos)</span>
      </div>
      <div v-if="mostrarCanastas" class="leyenda-item">
        <span class="leyenda-icono">🧺</span>
        <span>Canastas</span>
      </div>
      <div v-if="mostrarGastos" class="leyenda-item">
        <span class="leyenda-icono">💸</span>
        <span>Gastos</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'

interface DatosDia {
  ingresos?: number
  produccion?: number
  gastos?: number
  salidas?: number
  canastas?: number
}

interface DiaCalendario {
  fecha: string
  numero: number
  esDelMesActual: boolean
  esHoy: boolean
  datos: DatosDia | undefined
}

interface Props {
  datos?: Record<string, DatosDia>
  mostrarIngresos?: boolean
  mostrarGastos?: boolean
  mostrarCanastas?: boolean
  mostrarProduccion?: boolean
  mesInicial?: number
  añoInicial?: number
}

const props = withDefaults(defineProps<Props>(), {
  datos: () => ({}),
  mostrarIngresos: true,
  mostrarGastos: false,
  mostrarCanastas: false,
  mostrarProduccion: false,
  mesInicial: () => new Date().getMonth(),
  añoInicial: () => new Date().getFullYear()
})

const emit = defineEmits<{
  cambioMes: [mes: number, año: number]
}>()

const mesActual = ref(props.mesInicial)
const añoActual = ref(props.añoInicial)

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const nombresMeses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const nombreMes = computed(() => nombresMeses[mesActual.value])
const año = computed(() => añoActual.value)

const diasDelMes = computed(() => {
  const primerDia = new Date(añoActual.value, mesActual.value, 1)
  const ultimoDia = new Date(añoActual.value, mesActual.value + 1, 0)
  const diasEnMes = ultimoDia.getDate()
  const primerDiaSemana = primerDia.getDay()
  
  const dias: DiaCalendario[] = []
  const hoy = new Date()
  const hoyStr = date.formatDate(hoy, 'YYYY-MM-DD')
  
  // Días del mes anterior
  const mesAnterior = new Date(añoActual.value, mesActual.value, 0)
  for (let i = primerDiaSemana - 1; i >= 0; i--) {
    const dia = mesAnterior.getDate() - i
    const fecha = new Date(añoActual.value, mesActual.value - 1, dia)
    const fechaStr = date.formatDate(fecha, 'YYYY-MM-DD')
    
    dias.push({
      fecha: fechaStr,
      numero: dia,
      esDelMesActual: false,
      esHoy: fechaStr === hoyStr,
      datos: props.datos[fechaStr] || undefined
    })
  }
  
  // Días del mes actual
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(añoActual.value, mesActual.value, dia)
    const fechaStr = date.formatDate(fecha, 'YYYY-MM-DD')
    
    dias.push({
      fecha: fechaStr,
      numero: dia,
      esDelMesActual: true,
      esHoy: fechaStr === hoyStr,
      datos: props.datos[fechaStr] || undefined
    })
  }
  
  // Días del mes siguiente para completar la grilla
  const diasRestantes = 42 - dias.length // 6 semanas * 7 días
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const fecha = new Date(añoActual.value, mesActual.value + 1, dia)
    const fechaStr = date.formatDate(fecha, 'YYYY-MM-DD')
    
    dias.push({
      fecha: fechaStr,
      numero: dia,
      esDelMesActual: false,
      esHoy: fechaStr === hoyStr,
      datos: props.datos[fechaStr] || undefined
    })
  }
  
  return dias
})

const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11
    añoActual.value--
  } else {
    mesActual.value--
  }
  emit('cambioMes', mesActual.value, añoActual.value)
}

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0
    añoActual.value++
  } else {
    mesActual.value++
  }
  emit('cambioMes', mesActual.value, añoActual.value)
}



// Emitir cambio inicial
onMounted(() => {
  emit('cambioMes', mesActual.value, añoActual.value)
})
</script>

<style scoped>
.calendario-financiero {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.calendario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.mes-año {
  flex: 1;
  text-align: center;
}

.mes-año h6 {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  color: white;
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 10px;
}

.dia-semana-header {
  text-align: center;
  font-weight: 600;
  padding: 14px 5px;
  color: white;
  font-size: 12px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.dia-celda {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  min-height: 85px;
  padding: 10px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.dia-celda:hover {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
  border-color: #1976d2;
}

.dia-otro-mes {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%) !important;
  color: #bbb;
  opacity: 0.6;
}

.dia-hoy {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%) !important;
  border: 3px solid #ff9800;
  box-shadow: 0 0 15px rgba(255, 152, 0, 0.4);
  transform: scale(1.02);
}

.dia-con-datos {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-color: #4caf50;
}

.dia-numero {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #1976d2;
  text-align: center;
}

.dia-numero.otro-mes {
  color: #bbb;
  text-align: center;
  padding: 10px;
}

.dia-contenido {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
}

.datos-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.dato-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  margin: 1px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.dato-item.ingresos {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.dato-item.gastos {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.dato-item.canastas {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
  color: white;
}

.dato-item.gastos-solo {
  color: #1b5e20;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  border-left: 3px solid #4caf50;
  font-weight: 600;
  justify-content: center;
}

.icono {
  font-size: 14px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.valor {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendario-leyenda {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 12px;
  border: 1px solid rgba(156, 39, 176, 0.2);
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a148c;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.leyenda-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.9);
}

.leyenda-icono {
  font-size: 16px;
  margin-right: 8px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .calendario-financiero {
    padding: 15px;
  }
  
  .dia-celda {
    min-height: 60px;
    padding: 4px;
  }
  
  .dato-item {
    font-size: 9px;
  }
  
  .leyenda {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>