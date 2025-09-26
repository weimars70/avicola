<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="dashboard-title">
              <q-icon name="dashboard" class="title-icon" />
              Dashboard de Inventario
            </h1>
            <p class="dashboard-subtitle">
              Vista completa del estado del inventario y métricas clave
            </p>
          </div>
          <div class="header-actions">
            <q-btn
              class="action-btn"
              color="primary"
              icon="refresh"
              label="Actualizar"
              @click="loadResumen"
              :loading="loading"
              unelevated
              rounded
            />
            <q-btn
              class="action-btn"
              color="secondary"
              icon="file_download"
              label="Exportar"
              unelevated
              rounded
            />
          </div>
        </div>
      </div>

      <!-- KPIs Principales -->
      <div class="kpi-section">
        <div class="kpi-grid">
          <q-card class="kpi-card kpi-primary">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="inventory_2" size="2.5rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalTiposHuevo }}</div>
                <div class="kpi-label">Tipos de Huevo</div>
                <div class="kpi-trend positive">+2 este mes</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-success">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="egg" size="2.5rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalStock }}</div>
                <div class="kpi-label">Stock Total</div>
                <div class="kpi-trend" :class="stockTrend.class">{{ stockTrend.text }}</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-warning">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="attach_money" size="2.5rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">${{ formatCurrency(valorTotalGeneral) }}</div>
                <div class="kpi-label">Valor Total</div>
                <div class="kpi-trend positive">+15% vs mes anterior</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-info">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="trending_up" size="2.5rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ rotacionPromedio }}%</div>
                <div class="kpi-label">Rotación Promedio</div>
                <div class="kpi-trend positive">Óptimo</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Filtros Avanzados -->
      <q-card class="filter-card">
        <q-card-section class="filter-section">
          <div class="filter-header">
            <q-icon name="filter_list" class="filter-icon" />
            <h3 class="filter-title">Filtros y Configuración</h3>
          </div>
          <div class="filter-content">
            <q-select
              v-model="filtroTipoHuevo"
              :options="tiposHuevoOptions"
              label="Filtrar por Tipo de Huevo"
              class="filter-select"
              outlined
              clearable
              emit-value
              map-options
              @update:model-value="loadResumen"
            >
              <template v-slot:prepend>
                <q-icon name="category" color="primary" />
              </template>
            </q-select>
            <q-select
              v-model="periodoAnalisis"
              :options="periodosOptions"
              label="Período de Análisis"
              class="filter-select"
              outlined
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="date_range" color="primary" />
              </template>
            </q-select>
            <q-btn
              color="primary"
              icon="analytics"
              label="Generar Reporte"
              unelevated
              class="filter-btn"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Grid de Resumen por Tipo de Huevo -->
      <div class="resumen-section">
        <div class="section-header">
          <h2 class="section-title">
            <q-icon name="category" class="section-icon" />
            Resumen por Tipo de Huevo
          </h2>
          <q-btn
            color="primary"
            icon="view_module"
            :label="viewMode === 'grid' ? 'Vista Lista' : 'Vista Grid'"
            @click="toggleViewMode"
            flat
            rounded
          />
        </div>

        <!-- Vista Grid -->
        <div v-if="viewMode === 'grid'" class="resumen-grid">
          <q-card
            v-for="item in filteredResumen"
            :key="item.tipoHuevo.id"
            class="resumen-card"
          >
            <q-card-section class="card-header">
              <div class="card-title-section">
                <q-chip
                  color="primary"
                  text-color="white"
                  :label="item.tipoHuevo.nombre"
                  class="tipo-chip"
                />
                <q-btn
                  icon="more_vert"
                  flat
                  round
                  size="sm"
                  class="card-menu"
                >
                  <q-menu>
                    <q-list>
                      <q-item clickable>
                        <q-item-section avatar>
                          <q-icon name="visibility" />
                        </q-item-section>
                        <q-item-section>Ver Detalles</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section avatar>
                          <q-icon name="analytics" />
                        </q-item-section>
                        <q-item-section>Análisis</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>

            <q-card-section class="card-content">
              <!-- Stock Actual -->
              <div class="metric-row">
                <div class="metric-icon">
                  <q-icon name="inventory" color="primary" size="1.5rem" />
                </div>
                <div class="metric-info">
                  <div class="metric-label">Stock Actual</div>
                  <div class="metric-value primary">{{ item.stockActual.toLocaleString() }}</div>
                </div>
                <div class="metric-progress">
                  <q-circular-progress
                    :value="getStockPercentage(item)"
                    size="40px"
                    :thickness="0.15"
                    color="primary"
                    track-color="grey-3"
                    class="q-ma-md"
                  >
                    <div class="text-caption">{{ Math.round(getStockPercentage(item)) }}%</div>
                  </q-circular-progress>
                </div>
              </div>

              <!-- Valor Total -->
              <div class="metric-row">
                <div class="metric-icon">
                  <q-icon name="attach_money" color="positive" size="1.5rem" />
                </div>
                <div class="metric-info">
                  <div class="metric-label">Valor Total</div>
                  <div class="metric-value positive">${{ formatCurrency(item.valorTotal) }}</div>
                </div>
                <div class="metric-badge">
                  <q-badge
                    :color="getValueTrendColor(item)"
                    :label="getValueTrendLabel(item)"
                  />
                </div>
              </div>

              <!-- Movimientos -->
              <div class="movements-section">
                <div class="movement-item entrada">
                  <q-icon name="trending_up" class="movement-icon" />
                  <div class="movement-info">
                    <div class="movement-label">Entradas</div>
                    <div class="movement-value">+{{ item.totalEntradas.toLocaleString() }}</div>
                  </div>
                </div>
                <div class="movement-item salida">
                  <q-icon name="trending_down" class="movement-icon" />
                  <div class="movement-info">
                    <div class="movement-label">Salidas</div>
                    <div class="movement-value">-{{ item.totalSalidas.toLocaleString() }}</div>
                  </div>
                </div>
              </div>

              <!-- Indicadores de Rendimiento -->
              <div class="performance-indicators">
                <div class="indicator">
                  <div class="indicator-label">Rotación</div>
                  <div class="indicator-value">{{ getRotacion(item) }}%</div>
                </div>
                <div class="indicator">
                  <div class="indicator-label">Eficiencia</div>
                  <div class="indicator-value">{{ getEficiencia(item) }}%</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Vista Lista (Tabla Compacta) -->
        <q-table
          v-else
          :rows="filteredResumen"
          :columns="columns"
          row-key="tipoHuevo.id"
          :loading="loading"
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          class="resumen-table-compact"
        >
          <template v-slot:body-cell-tipoHuevo="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.tipoHuevo.color || 'primary'"
                text-color="white"
                :label="props.row.tipoHuevo.nombre"
                size="sm"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-stockActual="props">
            <q-td :props="props">
              <div class="text-weight-medium">
                {{ props.row.stockActual.toLocaleString() }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-valorTotal="props">
            <q-td :props="props">
              <div class="text-weight-bold text-positive">
                ${{ formatCurrency(props.row.valorTotal) }}
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Estado Vacío -->
      <div v-if="!loading && resumen.length === 0" class="empty-state">
        <div class="empty-content">
          <q-icon name="inventory_2" size="4rem" color="grey-4" />
          <h3 class="empty-title">No hay datos de inventario</h3>
          <p class="empty-message">
            No se encontraron registros de inventario para mostrar.
            Verifica que existan tipos de huevo configurados.
          </p>
          <q-btn
            color="primary"
            icon="add"
            label="Configurar Tipos de Huevo"
            unelevated
            rounded
            to="/tipos-huevo"
          />
        </div>
      </div>

      <!-- Tarjeta de Resumen Total -->
      <q-card class="summary-card" v-if="resumen.length > 0">
        <q-card-section class="summary-content">
          <div class="summary-header">
            <h3 class="summary-title">
              <q-icon name="summarize" class="summary-icon" />
              Resumen General
            </h3>
          </div>
          <div class="summary-metrics">
            <div class="summary-metric">
              <div class="summary-metric-value">{{ resumen.length }}</div>
              <div class="summary-metric-label">Tipos de Huevo</div>
            </div>
            <div class="summary-metric">
              <div class="summary-metric-value">${{ formatCurrency(valorTotalGeneral) }}</div>
              <div class="summary-metric-label">Valor Total del Inventario</div>
            </div>
            <div class="summary-metric">
              <div class="summary-metric-value">{{ totalStockGeneral.toLocaleString() }}</div>
              <div class="summary-metric-label">Stock Total</div>
            </div>
            <div class="summary-metric">
              <div class="summary-metric-value">{{ promedioRotacion }}%</div>
              <div class="summary-metric-label">Rotación Promedio</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInventarioStore } from 'src/stores/inventario';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useQuasar } from 'quasar';

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface ResumenItem {
  tipoHuevo: TipoHuevo;
  stockActual: number;
  valorTotal: number;
  totalEntradas: number;
  totalSalidas: number;
  galponId?: string;
  galpon?: {
    id: string;
    nombre: string;
    descripcion?: string;
    capacidadMaxima: number;
    activo: boolean;
  };
}

const $q = useQuasar();
const inventarioStore = useInventarioStore();
const tiposHuevoStore = useTiposHuevoStore();

const loading = ref(false);
const filtroTipoHuevo = ref<string | null>(null);
const periodoAnalisis = ref('mes_actual');
const viewMode = ref<'grid' | 'table'>('grid');
const resumen = ref<ResumenItem[]>([]);

// Opciones para filtros
const periodosOptions = [
  { label: 'Mes Actual', value: 'mes_actual' },
  { label: 'Último Trimestre', value: 'trimestre' },
  { label: 'Último Semestre', value: 'semestre' },
  { label: 'Último Año', value: 'año' }
];

// Computed properties para KPIs
const totalTiposHuevo = computed(() => resumen.value.length);

const totalStock = computed(() => {
  return resumen.value.reduce((sum, item) => sum + item.stockActual, 0);
});

const totalStockGeneral = computed(() => totalStock.value);

const stockTrend = computed(() => {
  // Simulación de tendencia - en producción vendría del backend
  const trend = Math.random() > 0.5 ? 'positive' : 'negative';
  const percentage = Math.floor(Math.random() * 20) + 1;
  return {
    class: trend,
    text: trend === 'positive' ? `+${percentage}% vs mes anterior` : `-${percentage}% vs mes anterior`
  };
});

const rotacionPromedio = computed(() => {
  if (resumen.value.length === 0) return 0;
  const totalRotacion = resumen.value.reduce((sum, item) => sum + getRotacion(item), 0);
  return Math.round(totalRotacion / resumen.value.length);
});

const promedioRotacion = computed(() => rotacionPromedio.value);

const filteredResumen = computed(() => {
  if (!filtroTipoHuevo.value) return resumen.value;
  return resumen.value.filter(item => item.tipoHuevo.id === filtroTipoHuevo.value);
});

// Funciones auxiliares
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid';
};

const getStockPercentage = (item: ResumenItem) => {
  // Simulación de porcentaje basado en capacidad máxima
  const maxCapacity = item.galpon?.capacidadMaxima || 10000;
  return Math.min((item.stockActual / maxCapacity) * 100, 100);
};



const getRotacion = (item: ResumenItem) => {
  // Cálculo de rotación basado en entradas y salidas
  if (item.stockActual === 0) return 0;
  const movimientos = item.totalEntradas + item.totalSalidas;
  return Math.round((movimientos / (item.stockActual + movimientos)) * 100);
};

const getEficiencia = (item: ResumenItem) => {
  // Cálculo de eficiencia basado en la relación entradas/salidas
  if (item.totalEntradas === 0) return 0;
  return Math.round((item.totalSalidas / item.totalEntradas) * 100);
};

const getValueTrendColor = (item: ResumenItem) => {
  // Determina el color basado en la tendencia del valor
  const valorTotal = item.valorTotal || 0;
  if (valorTotal > 50000) return 'positive';
  if (valorTotal > 20000) return 'warning';
  return 'negative';
};

const getValueTrendLabel = (item: ResumenItem) => {
  // Determina la etiqueta basada en la tendencia del valor
  const valorTotal = item.valorTotal || 0;
  if (valorTotal > 50000) return 'Alto';
  if (valorTotal > 20000) return 'Medio';
  return 'Bajo';
};

const columns = [
  {
    name: 'tipoHuevo',
    required: true,
    label: 'Tipo de Huevo',
    align: 'left' as const,
    field: (row: ResumenItem) => row.tipoHuevo.nombre,
    sortable: true
  },
  {
    name: 'stockActual',
    align: 'center' as const,
    label: 'Stock Actual',
    field: 'stockActual',
    sortable: true
  },
  {
    name: 'totalEntradas',
    align: 'center' as const,
    label: 'Total Entradas',
    field: 'totalEntradas',
    sortable: true
  },
  {
    name: 'totalSalidas',
    align: 'center' as const,
    label: 'Total Salidas',
    field: 'totalSalidas',
    sortable: true
  },
  {
    name: 'valorTotal',
    align: 'right' as const,
    label: 'Valor Total',
    field: 'valorTotal',
    sortable: true
  }
];

const tiposHuevoOptions = computed(() => {
  return tiposHuevoStore.tiposHuevo
    .filter(tipo => tipo.activo)
    .map(tipo => ({
      label: tipo.nombre,
      value: tipo.id
    }));
});

const valorTotalGeneral = computed(() => {
  return resumen.value.reduce((sum, item) => sum + item.valorTotal, 0);
});

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const loadResumen = async () => {
  loading.value = true;
  try {
    await inventarioStore.fetchResumenInventario(undefined, filtroTipoHuevo.value || undefined);
    // Forzar reactividad con spread operator
    resumen.value = [...inventarioStore.resumenInventario];
    
    $q.notify({
      type: 'positive',
      message: 'Resumen cargado correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error al cargar resumen:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el resumen',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await tiposHuevoStore.fetchTiposHuevo();
  await loadResumen();
});
</script>

<style scoped>
/* Layout Principal */
.dashboard-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-text {
  flex: 1;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 2.5rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* KPIs */
.kpi-section {
  margin-bottom: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--kpi-color), var(--kpi-color-light));
}

.kpi-primary {
  --kpi-color: #1976d2;
  --kpi-color-light: #42a5f5;
}

.kpi-success {
  --kpi-color: #388e3c;
  --kpi-color-light: #66bb6a;
}

.kpi-warning {
  --kpi-color: #f57c00;
  --kpi-color-light: #ffb74d;
}

.kpi-info {
  --kpi-color: #7b1fa2;
  --kpi-color-light: #ba68c8;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--kpi-color), var(--kpi-color-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.kpi-label {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
  font-weight: 500;
}

.kpi-trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.kpi-trend.positive {
  background: #e8f5e8;
  color: #2e7d32;
}

.kpi-trend.negative {
  background: #ffebee;
  color: #c62828;
}

/* Filtros */
.filter-card {
  margin-bottom: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-section {
  padding: 1.5rem;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filter-icon {
  color: #1976d2;
  font-size: 1.5rem;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.filter-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-select {
  min-width: 200px;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: none;
}

/* Sección de Resumen */
.resumen-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  color: #1976d2;
}

/* Grid de Resumen */
.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.resumen-card {
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.resumen-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
}

.card-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tipo-chip {
  font-weight: 600;
  font-size: 0.9rem;
}

.card-menu {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.card-menu:hover {
  opacity: 1;
}

.card-content {
  padding: 1.5rem;
}

/* Métricas */
.metric-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-row:last-child {
  border-bottom: none;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.metric-value.primary {
  color: #1976d2;
}

.metric-value.positive {
  color: #388e3c;
}

.metric-progress {
  display: flex;
  align-items: center;
}

.metric-badge {
  display: flex;
  align-items: center;
}

/* Movimientos */
.movements-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.movement-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.movement-item.entrada .movement-icon {
  color: #388e3c;
}

.movement-item.salida .movement-icon {
  color: #d32f2f;
}

.movement-info {
  flex: 1;
}

.movement-label {
  font-size: 0.8rem;
  color: #666;
}

.movement-value {
  font-size: 1rem;
  font-weight: 600;
}

.movement-item.entrada .movement-value {
  color: #388e3c;
}

.movement-item.salida .movement-value {
  color: #d32f2f;
}

/* Indicadores de Rendimiento */
.performance-indicators {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.indicator {
  text-align: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 12px;
}

.indicator-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.indicator-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1976d2;
}

/* Tabla Compacta */
.resumen-table-compact {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Estado Vacío */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin: 2rem 0;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #666;
  margin: 1rem 0 0.5rem 0;
}

.empty-message {
  color: #888;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Tarjeta de Resumen Total */
.summary-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-top: 2rem;
}

.summary-content {
  padding: 2rem;
}

.summary-header {
  margin-bottom: 1.5rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-icon {
  font-size: 1.5rem;
}

.summary-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-metric {
  text-align: center;
}

.summary-metric-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.summary-metric-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-container {
    padding: 1.5rem;
  }
  
  .resumen-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    margin-bottom: 1.5rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .title-icon {
    font-size: 2rem;
  }
  
  .dashboard-subtitle {
    font-size: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    min-width: 120px;
  }
  
  .kpi-section {
    margin-bottom: 1.5rem;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .kpi-card {
    border-radius: 12px;
  }
  
  .kpi-content {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .kpi-icon {
    width: 50px;
    height: 50px;
  }
  
  .kpi-value {
    font-size: 1.5rem;
  }
  
  .kpi-label {
    font-size: 0.8rem;
  }
  
  .kpi-trend {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
  
  .resumen-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-content {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .filter-select {
    min-width: unset;
  }
  
  .filter-btn {
    padding: 0.6rem 1.2rem;
    width: 100%;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .summary-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .summary-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 0.75rem;
  }
  
  .dashboard-title {
    font-size: 1.75rem;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .kpi-icon {
    align-self: center;
  }
  
  .kpi-value {
    font-size: 1.75rem;
  }
  
  .summary-metrics {
    grid-template-columns: 1fr;
  }
  
  .summary-metric-value {
    font-size: 1.5rem;
  }
  
  .movements-section {
    grid-template-columns: 1fr;
  }
  
  .performance-indicators {
    grid-template-columns: 1fr;
  }
  
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card,
.resumen-card,
.filter-card,
.summary-card {
  animation: fadeInUp 0.6s ease-out;
}

.kpi-card:nth-child(2) { animation-delay: 0.1s; }
.kpi-card:nth-child(3) { animation-delay: 0.2s; }
.kpi-card:nth-child(4) { animation-delay: 0.3s; }

.q-table th {
  font-weight: bold;
}

.q-table .q-chip {
  font-weight: 500;
}
</style>