<template>
  <q-page class="modern-page">
    <div class="page-container">
      <!-- Header -->
      <div class="modern-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <q-icon name="inventory_2" class="title-icon" />
              Inventario General
            </h1>
            <p class="page-subtitle">
              Vista general del inventario con valores calculados
            </p>
          </div>
          <q-btn
            class="action-btn"
            color="primary"
            icon="refresh"
            label="Actualizar"
            @click="loadInventario"
            :loading="loading"
            unelevated
            rounded
          />
        </div>
      </div>

      <!-- KPIs Section -->
      <div class="kpi-section">
        <div class="kpi-grid">
          <q-card class="kpi-card kpi-primary">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="inventory_2" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalItems }}</div>
                <div class="kpi-label">Tipos de Huevo</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-success">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="egg" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalUnidades }}</div>
                <div class="kpi-label">Total Unidades</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-warning">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="attach_money" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">${{ formatCurrency(totalValue) }}</div>
                <div class="kpi-label">Valor Total</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-info">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="analytics" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">${{ formatCurrency(promedioValor) }}</div>
                <div class="kpi-label">Valor Promedio</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Filters -->
      <q-card class="filter-card">
        <q-card-section class="filter-section">
          <div class="filter-content">
            <q-input
              v-model="filter"
              placeholder="Buscar en inventario..."
              class="search-input"
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
            <div class="filter-actions">
              <q-btn
                color="secondary"
                icon="tune"
                label="Ajuste de Inventario"
                @click="showAjusteModal = true"
                unelevated
                class="ajuste-btn"
              />
              <q-btn
                color="primary"
                icon="refresh"
                label="Actualizar"
                @click="loadInventario"
                :loading="loading"
                unelevated
                class="refresh-btn"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Inventario Grid -->
      <div class="inventario-grid" v-if="filteredInventario.length > 0">
        <q-card 
          v-for="item in filteredInventario" 
          :key="item.id" 
          class="inventario-card"
        >
          <q-card-section class="inventario-header">
            <div class="inventario-info">
              <div class="inventario-title">
                <q-icon name="egg" class="inventario-icon" />
                {{ item.tipoHuevo.nombre }}
              </div>
              <div class="inventario-description">
                {{ item.tipoHuevo.descripcion || 'Sin descripción' }}
              </div>
            </div>
            <q-badge 
              :color="getStockColor(item.unidades)" 
              :label="getStockLabel(item.unidades)"
              class="status-badge"
            />
          </q-card-section>

          <q-card-section class="inventario-content">
            <div class="inventario-details">
              <div class="detail-item">
                <q-icon name="attach_money" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Valor Unitario</div>
                  <div class="detail-value price-value">${{ formatCurrency(item.tipoHuevo.valorUnidad) }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <q-icon name="inventory_2" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Unidades en Stock</div>
                  <div class="detail-value units-value">{{ item.unidades }}</div>
                </div>
              </div>

              <div class="detail-item">
                <q-icon name="calculate" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Valor Total</div>
                  <div class="detail-value total-value">${{ formatCurrency(item.valorTotal) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="inventario-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">% del Total</div>
                <div class="stat-value">{{ getPercentage(item.valorTotal) }}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Estado</div>
                <div class="stat-value">{{ getStockStatus(item.unidades) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <q-icon name="inventory_2" size="4rem" color="grey-4" />
        <h3 class="empty-title">No hay items en inventario</h3>
        <p class="empty-subtitle">El inventario está vacío o no coincide con los filtros</p>
        <q-btn
          color="primary"
          icon="refresh"
          label="Actualizar Inventario"
          @click="loadInventario"
          unelevated
          rounded
          class="empty-action"
        />
      </div>

      <!-- Summary Card -->
      <q-card class="summary-card">
        <q-card-section class="summary-content">
          <div class="summary-header">
            <q-icon name="summarize" class="summary-icon" />
            <h3 class="summary-title">Resumen del Inventario</h3>
          </div>
          <div class="summary-stats">
            <div class="summary-stat">
              <div class="summary-stat-label">Total de Registros</div>
              <div class="summary-stat-value">{{ inventario.length }}</div>
            </div>
            <div class="summary-stat">
              <div class="summary-stat-label">Valor Total del Inventario</div>
              <div class="summary-stat-value total-highlight">${{ formatCurrency(totalValue) }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Historial de Ajustes -->
      <q-card class="historial-card">
        <q-card-section class="historial-header responsive-header">
          <div class="historial-title-section">
            <q-icon name="history" class="historial-icon" />
            <h3 class="historial-title">Historial de Ajustes</h3>
          </div>
          <q-btn
            color="primary"
            icon="refresh"
            label="Actualizar"
            @click="loadHistorialAjustes"
            :loading="loadingHistorial"
            unelevated
            size="sm"
            class="refresh-historial-btn"
          />
        </q-card-section>

        <q-card-section class="historial-content">
          <div v-if="loadingHistorial" class="historial-loading">
            <q-spinner-dots size="2rem" color="primary" />
            <p>Cargando historial...</p>
          </div>

          <div v-else-if="ajustesStore.error" class="historial-error">
            <q-icon name="error_outline" size="3rem" color="negative" />
            <p class="error-message">{{ ajustesStore.error }}</p>
            <q-btn 
              color="primary" 
              label="Reintentar" 
              @click="loadHistorialAjustes" 
              unelevated 
              size="sm"
            />
          </div>

          <div v-else-if="historialAjustes.length === 0" class="historial-empty">
            <q-icon name="history_toggle_off" size="3rem" color="grey-4" />
            <p class="empty-message">No hay ajustes registrados</p>
          </div>

          <div v-else class="historial-list">
            <q-expansion-item
              v-for="lote in historialAjustes"
              :key="lote.id"
              class="historial-item"
              :label="lote.descripcionGeneral"
              :caption="formatFecha(lote.createdAt)"
              icon="tune"
              header-class="historial-item-header"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon name="tune" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="historial-descripcion">
                    <div class="descripcion-texto">{{ lote.descripcionGeneral }}</div>
                  </q-item-label>
                  <q-item-label caption class="historial-fecha">
                    <q-icon name="schedule" size="xs" />
                    {{ formatFecha(lote.createdAt) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="historial-actions-section">
                  <div class="historial-actions">
                    <q-badge 
                      :label="`${lote.ajustes.length} ajuste${lote.ajustes.length !== 1 ? 's' : ''}`"
                      color="secondary"
                      outline
                      class="q-mr-sm ajustes-badge"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      color="primary"
                      size="sm"
                      @click.stop="editarLote(lote)"
                      class="edit-btn q-mr-xs"
                    >
                      <q-tooltip>Editar ajuste</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click.stop="confirmarEliminarLote(lote.id)"
                      class="delete-btn"
                    >
                      <q-tooltip>Eliminar ajuste</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </template>

              <div class="ajustes-detalle">
                <q-table
                  :rows="lote.ajustes"
                  :columns="[
                    { name: 'A', label: 'A', field: row => row.tipoHuevo.nombre, align: 'left', style: 'white-space: normal !important; min-width: 150px;', headerStyle: 'white-space: normal !important; min-width: 150px;' },
                    { name: 'S', label: 'S', field: 'tipoAjuste', align: 'center', style: 'white-space: normal !important; min-width: 120px;', headerStyle: 'white-space: normal !important; min-width: 120px;' },
                    { name: 'I', label: 'I', field: 'cantidadAjuste', align: 'right', style: 'white-space: normal !important; min-width: 120px;', headerStyle: 'white-space: normal !important; min-width: 120px;' }
                  ]"
                  row-key="id"
                  dense
                  flat
                  hide-pagination
                  class="ajustes-table history-table gt-xs"
                  :class="{'responsive-table': $q.screen.lt.md}"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props" class="ajuste-row">
                      <q-td key="A" :props="props" class="ajuste-cell">
                        <div class="ajuste-tipo">
                          <q-icon name="egg" size="sm" class="ajuste-icon" />
                          <span class="tipo-nombre">{{ props.row.tipoHuevo.nombre }}</span>
                        </div>
                      </q-td>
                      <q-td key="S" :props="props" class="ajuste-cell">
                        <div class="ajuste-operacion" :class="props.row.tipoAjuste">
                          <q-icon 
                            :name="props.row.tipoAjuste === 'suma' ? 'add' : 'remove'" 
                            size="xs" 
                            class="operacion-icon"
                          />
                          <span class="operacion-texto">{{ props.row.tipoAjuste === 'suma' ? 'Entrada' : 'Salida' }}</span>
                        </div>
                      </q-td>
                      <q-td key="I" :props="props" class="ajuste-cell">
                        <span class="cantidad">{{ props.row.cantidadAjuste }}</span>
                        <span class="unidades">unidades</span>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                
                <!-- Vista móvil alternativa para pantallas pequeñas -->
                <div v-if="$q.screen.lt.sm" class="ajustes-mobile-list">
                  <div v-for="(ajuste, index) in lote.ajustes" :key="index" class="ajuste-mobile-item">
                    <div class="ajuste-mobile-header">
                      <div class="ajuste-tipo-mobile">
                        <q-icon name="egg" size="sm" class="ajuste-icon" />
                        <span class="tipo-nombre">{{ ajuste.tipoHuevo.nombre }}</span>
                      </div>
                    </div>
                    <div class="ajuste-mobile-content">
                      <div class="ajuste-mobile-row">
                        <div class="ajuste-mobile-label">Operación:</div>
                        <div class="ajuste-operacion-mobile" :class="ajuste.tipoAjuste">
                          <q-icon 
                            :name="ajuste.tipoAjuste === 'suma' ? 'add' : 'remove'" 
                            size="xs" 
                          />
                          <span>{{ ajuste.tipoAjuste === 'suma' ? 'Entrada' : 'Salida' }}</span>
                        </div>
                      </div>
                      <div class="ajuste-mobile-row">
                        <div class="ajuste-mobile-label">Cantidad:</div>
                        <div class="ajuste-cantidad-mobile">
                          <span class="cantidad">{{ ajuste.cantidadAjuste }}</span>
                          <span class="unidades">unidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Modal de Ajuste de Inventario -->
    <AjusteInventarioModal
      v-model="showAjusteModal"
      :inventario="inventario"
      :edit-mode="modalEditMode"
      :lote-data="loteParaEditar"
      @ajuste-realizado="onAjusteRealizado"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useAjustesInventarioStore } from 'src/stores/ajustesInventario';
import AjusteInventarioModal from 'src/components/AjusteInventarioModal.vue';

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

interface AjusteLote {
  id: string;
  descripcionGeneral: string;
  usuarioId: string;
  createdAt: string;
  usuario: Usuario;
  ajustes: {
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
  }[];
}

interface InventarioItem {
  id: number;
  tipoHuevo: TipoHuevo;
  unidades: number;
  valorTotal: number;
}

interface AjusteHistorial {
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

interface LoteHistorial {
  id: string;
  descripcionGeneral: string;
  usuarioId: string;
  createdAt: string;
  usuario: Usuario;
  ajustes: AjusteHistorial[];
}

const $q = useQuasar();
const ajustesStore = useAjustesInventarioStore();
const loading = ref(false);
const loadingHistorial = ref(false);
const inventario = ref<InventarioItem[]>([]);
const historialAjustes = ref<LoteHistorial[]>([]);
const filter = ref('');
const showAjusteModal = ref(false);
const modalEditMode = ref(false);
const loteParaEditar = ref<AjusteLote | null>(null);





// Computed properties para KPIs
const totalValue = computed(() => {
  return inventario.value.reduce((sum, item) => sum + item.valorTotal, 0);
});

const totalItems = computed(() => {
  return inventario.value.length;
});

const totalUnidades = computed(() => {
  return inventario.value.reduce((sum, item) => sum + item.unidades, 0);
});

const promedioValor = computed(() => {
  if (inventario.value.length === 0) return 0;
  return totalValue.value / inventario.value.length;
});

const filteredInventario = computed(() => {
  if (!filter.value) return inventario.value;
  
  const searchTerm = filter.value.toLowerCase();
  return inventario.value.filter(item => 
    item.tipoHuevo.nombre.toLowerCase().includes(searchTerm) ||
    (item.tipoHuevo.descripcion && item.tipoHuevo.descripcion.toLowerCase().includes(searchTerm))
  );
});

// Funciones auxiliares
const formatCurrency = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getStockColor = (unidades: number): string => {
  if (unidades === 0) return 'red';
  if (unidades < 50) return 'orange';
  if (unidades < 100) return 'yellow';
  return 'green';
};

const getStockLabel = (unidades: number): string => {
  if (unidades === 0) return 'Sin Stock';
  if (unidades < 50) return 'Stock Bajo';
  if (unidades < 100) return 'Stock Medio';
  return 'Stock Alto';
};

const getStockStatus = (unidades: number): string => {
  if (unidades === 0) return 'Agotado';
  if (unidades < 50) return 'Crítico';
  if (unidades < 100) return 'Normal';
  return 'Óptimo';
};

const getPercentage = (valor: number): string => {
  if (totalValue.value === 0) return '0';
  const percentage = (valor / totalValue.value) * 100;
  return typeof percentage === 'number' && !isNaN(percentage) ? percentage.toFixed(1) : '0.0';
};

const loadInventario = async () => {
  loading.value = true;
  try {
    const response = await api.get('/inventario-stock/vista/inventario');
    inventario.value = response.data;
    
    $q.notify({
      type: 'positive',
      message: 'Inventario cargado correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error al cargar inventario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el inventario',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const loadHistorialAjustes = async () => {
  loadingHistorial.value = true;
  try {
    await ajustesStore.fetchLotes();
    historialAjustes.value = ajustesStore.lotes;
  } catch (error) {
    console.error('Error al cargar historial:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el historial de ajustes',
      position: 'top'
    });
  } finally {
    loadingHistorial.value = false;
  }
};

const formatFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const onAjusteRealizado = async () => {
  // Recargar el inventario después de realizar un ajuste
  await loadInventario();
  await loadHistorialAjustes();
};

const confirmarEliminarLote = (loteId: string) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar este lote de ajustes? Esta acción revertirá todos los cambios de inventario asociados y no se puede deshacer.',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    void eliminarLote(loteId);
  });
};

const eliminarLote = async (loteId: string) => {
  try {
    await ajustesStore.deleteLote(loteId);
    $q.notify({
      type: 'positive',
      message: 'Lote de ajustes eliminado correctamente',
      position: 'top'
    });
    // Recargar datos
    await loadInventario();
    await loadHistorialAjustes();
  } catch (error) {
    console.error('Error al eliminar lote:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el lote de ajustes',
      position: 'top'
    });
  }
};

const editarLote = (lote: LoteHistorial) => {
  // Abrir el modal en modo edición
  modalEditMode.value = true;
  loteParaEditar.value = lote as AjusteLote;
  showAjusteModal.value = true;
};

onMounted(() => {
  void loadInventario();
  void loadHistorialAjustes();
});
</script>

<style scoped>
/* Modern Page Layout */
.modern-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header Styles */
.modern-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  color: #3498db;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0.5rem 0 0 0;
}

.action-btn {
  padding: 0.75rem 2rem;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* KPI Section */
.kpi-section {
  margin-bottom: 1rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--kpi-color-start), var(--kpi-color-end));
}

.kpi-primary {
  --kpi-color-start: #3498db;
  --kpi-color-end: #2980b9;
}

.kpi-success {
  --kpi-color-start: #2ecc71;
  --kpi-color-end: #27ae60;
}

.kpi-warning {
  --kpi-color-start: #f39c12;
  --kpi-color-end: #e67e22;
}

.kpi-info {
  --kpi-color-start: #9b59b6;
  --kpi-color-end: #8e44ad;
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--kpi-color-start), var(--kpi-color-end));
  color: white;
  flex-shrink: 0;
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Section */
.filter-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-section {
  padding: 1.5rem;
}

.filter-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.ajuste-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.refresh-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: none;
}

/* Inventario Grid */
.inventario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.inventario-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
}

.inventario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.inventario-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.inventario-info {
  flex: 1;
}

.inventario-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.inventario-icon {
  color: #3498db;
}

.inventario-description {
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
}

.status-badge {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.inventario-content {
  padding: 1.5rem;
}

.inventario-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #3498db;
}

.detail-icon {
  color: #3498db;
  font-size: 1.5rem;
}

.detail-info {
  flex: 1;
}

.detail-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.price-value {
  color: #27ae60;
}

.units-value {
  color: #3498db;
}

.total-value {
  color: #e74c3c;
}

.inventario-stats {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Summary Card */
.summary-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-content {
  padding: 2rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-icon {
  font-size: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.summary-stat {
  text-align: center;
}

.summary-stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.summary-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.total-highlight {
  font-size: 2rem !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
}

.empty-subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.empty-action {
  padding: 0.75rem 2rem;
  font-weight: 600;
  text-transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
    gap: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .inventario-grid {
    grid-template-columns: 1fr;
  }

  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .summary-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
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

.inventario-card {
  animation: fadeInUp 0.6s ease-out;
}

.kpi-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Historial Error State */
.historial-error {
  text-align: center;
  padding: 2rem;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px solid #fed7d7;
}

.historial-error .error-message {
  color: #e53e3e;
  font-size: 1rem;
  margin: 1rem 0;
  font-weight: 500;
}

.historial-loading,
.historial-empty {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.historial-loading p,
.historial-empty .empty-message {
  margin-top: 1rem;
  font-size: 1rem;
}

/* Historial Actions */
.historial-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Estilos responsivos para el historial */
.responsive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.ajustes-table {
  width: 100%;
  overflow-x: auto;
}

.ajuste-tipo, .ajuste-operacion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.suma {
  color: #21ba45;
}

.resta {
  color: #c10015;
}

@media (max-width: 768px) {
  .historial-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .historial-actions-section {
    width: 100%;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }
  
  .ajustes-badge {
    font-size: 0.8rem;
  }
  
  .historial-item-header {
    padding: 0.5rem;
  }
  
  .historial-descripcion {
    font-size: 0.9rem;
  }
}

/* Scoped: tabla de historial, forzar texto horizontal y diseño minimalista */
.history-table :deep(th),
.history-table :deep(td) {
  white-space: normal !important;
  word-wrap: break-word !important;
  word-break: break-word !important;
  writing-mode: horizontal-tb !important;
  text-orientation: mixed !important;
  text-align: left;
}

.history-table :deep(td) {
  padding: 6px 8px; /* compacto, sin excesos */
  line-height: 1.2; /* renglones legibles y juntos */
}

.history-table :deep(th) {
  padding: 6px 8px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .history-table :deep(th),
  .history-table :deep(td) {
    padding: 6px 6px;
    font-size: 0.9rem;
    min-width: 100px; /* evitar vertical en columnas estrechas */
  }
}

@media (max-width: 480px) {
  .history-table :deep(th),
  .history-table :deep(td) {
    padding: 5px 6px;
    font-size: 0.85rem;
    min-width: 90px;
  }
}
</style>