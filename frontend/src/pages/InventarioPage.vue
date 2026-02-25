<template>
  <q-page class="modern-page">
    <div class="page-container">
      
      <!-- Cabecera y Tabs -->
      <div class="modern-header q-mb-md">
        <div class="header-content column flex-center">
            <h1 class="page-title text-center">
              <q-icon name="inventory_2" class="title-icon q-mr-sm" />
              Gestión de Inventario
            </h1>
           
            <q-tabs
                v-model="tab"
                class="text-grey-7 bg-grey-2 rounded-borders q-mt-md tabs-style"
                active-class="bg-white text-primary shadow-2"
                indicator-color="transparent"
                align="center"
            >
                <q-tab name="propio" label="Inventario Propio" icon="egg" />
                <q-tab name="terceros" label="Inventario Terceros" icon="shopping_basket" />
            </q-tabs>
        </div>
      </div>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        
        <!-- PANEL INVENTARIO PROPIO -->
        <q-tab-panel name="propio" class="q-pa-none">
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
                  <div class="kpi-info-content">
                    <div class="kpi-value">{{ formatCurrency(totalValue) }}</div>
                    <div class="kpi-label">Valor Total</div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card class="kpi-card kpi-info">
                <q-card-section class="kpi-content">
                  <div class="kpi-icon">
                    <q-icon name="analytics" size="2rem" />
                  </div>
                  <div class="kpi-info-content">
                    <div class="kpi-value">{{ formatCurrency(promedioValor) }}</div>
                    <div class="kpi-label">Valor Promedio</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Filters -->
          <q-card class="filter-card q-mb-md">
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
                      <div class="detail-value price-value">{{ formatCurrency(item.tipoHuevo.valorUnidad) }}</div>
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
                      <div class="detail-value total-value">{{ formatCurrency(item.valorTotal) }}</div>
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
          </div>

          <!-- Historial de Ajustes -->
          <div class="q-mt-xl">
             <div class="row items-center justify-between q-mb-md">
                <h3 class="text-h6 text-grey-8 q-my-none">Historial de Ajustes</h3>
                 <q-btn icon="refresh" flat color="primary" @click="loadHistorialAjustes" :loading="loadingHistorial" />
             </div>
             
             <!-- Historial List (Simplified from original) -->
              <div v-if="historialAjustes.length > 0">
                 <q-expansion-item
                  v-for="lote in historialAjustes"
                  :key="lote.id"
                  class="bg-white q-mb-sm rounded-borders shadow-1"
                  :label="lote.descripcionGeneral"
                  :caption="formatFecha(lote.createdAt)"
                  icon="tune"
                >
                  <q-card>
                    <q-card-section>
                       <q-table
                          :rows="lote.ajustes"
                          :columns="[
                            { name: 'tipo', label: 'Tipo Huevo', field: row => row.tipoHuevo.nombre, align: 'left'},
                            { name: 'operacion', label: 'Operación', field: 'tipoAjuste', align: 'center'},
                            { name: 'cantidad', label: 'Cantidad', field: 'cantidadAjuste', align: 'right'}
                          ]"
                          dense flat hide-bottom
                       />
                    </q-card-section>
                     <q-card-actions align="right">
                        <q-btn flat color="primary" label="Editar" size="sm" @click="editarLote(lote)" />
                        <q-btn flat color="negative" label="Eliminar" size="sm" @click="confirmarEliminarLote(lote.id)" />
                     </q-card-actions>
                  </q-card>
                </q-expansion-item>
              </div>
          </div>
        </q-tab-panel>

        <!-- PANEL INVENTARIO TERCEROS -->
        <q-tab-panel name="terceros" class="q-pa-none">
           <div class="kpi-section">
              <div class="kpi-grid">
                 <q-card class="kpi-card kpi-primary">
                  <q-card-section class="kpi-content">
                    <div class="kpi-icon">
                      <q-icon name="shopping_basket" size="2rem" />
                    </div>
                    <div class="kpi-info">
                      <div class="kpi-value">{{ backendTercerosData.resumen?.canastasDisponibles || 0 }}</div>
                      <div class="kpi-label">Canastas Disponibles</div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card class="kpi-card kpi-success">
                  <q-card-section class="kpi-content">
                    <div class="kpi-icon">
                      <q-icon name="monetization_on" size="2rem" />
                    </div>
                    <div class="kpi-info-content">
                      <div class="kpi-value">{{ formatCurrency(backendTercerosData.resumen?.valorTotal || 0) }}</div>
                      <div class="kpi-label">Inversión Total</div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card class="kpi-card kpi-info">
                  <q-card-section class="kpi-content">
                    <div class="kpi-icon">
                      <q-icon name="functions" size="2rem" />
                    </div>
                    <div class="kpi-info-content">
                      <div class="kpi-value">{{ formatCurrency(backendTercerosData.resumen?.valorPromedio || 0) }}</div>
                      <div class="kpi-label">Costo Promedio</div>
                    </div>
                  </q-card-section>
                </q-card>
                 
                  <q-card class="kpi-card kpi-warning">
                  <q-card-section class="kpi-content">
                    <div class="kpi-icon">
                      <q-icon name="history" size="2rem" />
                    </div>
                    <div class="kpi-info">
                      <div class="kpi-value">{{ backendTercerosData.resumen?.totalCanastas || 0 }}</div>
                      <div class="kpi-label">Total Adquiridas</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
           </div>

           <!-- Lista de Canastas -->
           <div class="filter-actions flex justify-end q-mb-md">
              <q-btn icon="refresh" label="Actualizar" color="primary" @click="loadBackendTerceros" :loading="loadingTerceros" unelevated class="refresh-btn" />
           </div>

           <div class="inventario-grid" v-if="backendTercerosData.porCanasta && backendTercerosData.porCanasta.length > 0">
               <q-card v-for="c in backendTercerosData.porCanasta" :key="c.canastaId" class="inventario-card">
                  <q-card-section class="inventario-header">
                    <div class="inventario-info">
                      <div class="inventario-title">
                        <q-icon name="shopping_basket" class="inventario-icon" />
                        {{ c.nombreCanasta }}
                      </div>
                      <div class="inventario-description">Última compra: {{ formatDateShort(c.ultimaCompra) }}</div>
                    </div>
                     <q-badge :color="c.canastasDisponibles > 0 ? 'green' : 'red'" :label="c.canastasDisponibles + ' UND'" class="status-badge" />
                  </q-card-section>
                  <q-card-section class="inventario-content">
                      <div class="inventario-details">
                         <div class="detail-item">
                            <q-icon name="attach_money" class="detail-icon" />
                            <div class="detail-info">
                              <div class="detail-label">Total Invertido</div>
                              <div class="detail-value total-value">${{ formatCurrency(c.valorTotal) }}</div>
                            </div>
                         </div>
                         <div class="detail-item">
                            <q-icon name="analytics" class="detail-icon" />
                            <div class="detail-info">
                              <div class="detail-label">Costo Promedio</div>
                              <div class="detail-value text-primary">${{ formatCurrency(c.precioPromedio) }}</div>
                            </div>
                         </div>
                         <div class="detail-item">
                            <q-icon name="layers" class="detail-icon" />
                            <div class="detail-info">
                              <div class="detail-label">Total Comprado</div>
                              <div class="detail-value text-grey-8">{{ c.totalUnidades }} und</div>
                            </div>
                         </div>
                      </div>
                  </q-card-section>
               </q-card>
           </div>
           
           <div v-else class="empty-state">
              <q-icon name="remove_shopping_cart" size="4rem" color="grey-4" />
              <h3 class="empty-title">Sin datos de terceros</h3>
              <p class="empty-subtitle">No se encontraron movimientos de canastas de terceros.</p>
           </div>

        </q-tab-panel>

      </q-tab-panels>

      <!-- Modal de Ajuste de Inventario -->
      <AjusteInventarioModal
        v-model="showAjusteModal"
        :inventario="inventario"
        :edit-mode="modalEditMode"
        :lote-data="loteParaEditar"
        @ajuste-realizado="onAjusteRealizado"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar, date } from 'quasar';
import { useAjustesInventarioStore } from 'src/stores/ajustesInventario';
import AjusteInventarioModal from 'src/components/AjusteInventarioModal.vue';

import type { AjusteLote } from 'src/stores/ajustesInventario';

// --- Interfaces ---
interface TipoHuevo { id: string; nombre: string; descripcion?: string; valorUnidad: number; }
interface InventarioItem { id: number; tipoHuevo: TipoHuevo; unidades: number; valorTotal: number; }
interface EvolucionMensualItem { mes: string; compras: number; valor: number; }
interface TerceroData {
    resumen: { totalCanastas: number, valorTotal: number, canastasDisponibles: number, valorPromedio: number };
    porCanasta: { canastaId: string, nombreCanasta: string, totalUnidades: number, valorTotal: number, precioPromedio: number, ultimaCompra: string, canastasDisponibles: number }[];
    evolucionMensual: EvolucionMensualItem[];
}

const $q = useQuasar();
const ajustesStore = useAjustesInventarioStore();

// --- State ---
const tab = ref('propio');
const loading = ref(false);
const loadingHistorial = ref(false);
const loadingTerceros = ref(false);

const inventario = ref<InventarioItem[]>([]);
const historialAjustes = ref<AjusteLote[]>([]);
const backendTercerosData = ref<TerceroData>({ resumen: {totalCanastas:0, valorTotal:0, canastasDisponibles:0, valorPromedio:0}, porCanasta: [], evolucionMensual: [] });

const filter = ref('');
const showAjusteModal = ref(false);
const modalEditMode = ref(false);
const loteParaEditar = ref<AjusteLote | null>(null);

// --- Computed ---
const totalValue = computed(() => inventario.value.reduce((sum, item) => sum + item.valorTotal, 0));
const totalItems = computed(() => inventario.value.length);
const totalUnidades = computed(() => inventario.value.reduce((sum, item) => sum + item.unidades, 0));
const promedioValor = computed(() => inventario.value.length === 0 ? 0 : totalValue.value / inventario.value.length);

const filteredInventario = computed(() => {
  if (!filter.value) return inventario.value;
  const s = filter.value.toLowerCase();
  return inventario.value.filter(item => 
    item.tipoHuevo.nombre.toLowerCase().includes(s) ||
    (item.tipoHuevo.descripcion && item.tipoHuevo.descripcion.toLowerCase().includes(s))
  );
});

// --- Methods ---
const formatCurrency = (value: number) => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const formatDateShort = (val: string) => {
  if(!val) return '-';
  return date.formatDate(val, 'DD/MM/YYYY');
}
const formatFecha = (val: string) => date.formatDate(val, 'DD/MM/YYYY HH:mm');

const getStockColor = (u: number) => u === 0 ? 'red' : u < 50 ? 'orange' : u < 100 ? 'yellow' : 'green';
const getStockLabel = (u: number) => u === 0 ? 'Sin Stock' : u < 50 ? 'Bajo' : u < 100 ? 'Medio' : 'Alto';
const getStockStatus = (u: number) => u === 0 ? 'Agotado' : u < 50 ? 'Crítico' : u < 100 ? 'Normal' : 'Óptimo';
const getPercentage = (v: number) => totalValue.value === 0 ? '0' : ((v / totalValue.value) * 100).toFixed(1);

const loadInventario = async () => {
  loading.value = true;
  try {
    const response = await api.get('/inventario-stock/vista/inventario');
    inventario.value = response.data;
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Error al cargar inventario' });
  } finally {
    loading.value = false;
  }
};

const loadHistorialAjustes = async () => {
  loadingHistorial.value = true;
  try {
    await ajustesStore.fetchLotes();
    historialAjustes.value = ajustesStore.lotes;
  } catch {
    $q.notify({ type: 'negative', message: 'Error cargar historial' });
  } finally {
     loadingHistorial.value = false;
  }
};

const loadBackendTerceros = async () => {
    loadingTerceros.value = true;
    try {
        const res = await api.get('/compras-terceros/inventario-canastas');
        backendTercerosData.value = res.data;
    } catch (e) {
        console.error(e);
        $q.notify({type: 'negative', message: 'Error al cargar inventario terceros'});
    } finally {
        loadingTerceros.value = false;
    }
}

const onAjusteRealizado = async () => {
  await loadInventario();
  await loadHistorialAjustes();
};

const confirmarEliminarLote = (loteId: string) => {
  $q.dialog({ title: 'Confirmar', message: '¿Eliminar ajuste?', cancel: true, persistent: true }).onOk(() => {
     void (async () => {
        try {
            await ajustesStore.deleteLote(loteId);
            $q.notify({ type: 'positive', message: 'Eliminado' });
            await loadInventario();
            await loadHistorialAjustes();
        } catch {
            $q.notify({ type: 'negative', message: 'Error al eliminar' });
        }
     })();
  });
};

const editarLote = (lote: AjusteLote) => {
  modalEditMode.value = true;
  loteParaEditar.value = lote;
  showAjusteModal.value = true;
};

// --- Lifecycle ---
watch(tab, (val) => {
    if(val === 'terceros') {
        void loadBackendTerceros();
    }
});

onMounted(() => {
  void loadInventario();
  void loadHistorialAjustes();
  // Pre-load terceros info if preferred, or wait for tab switch
  void loadBackendTerceros(); 
});
</script>

<style scoped>
.modern-page { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; }
.page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
.modern-header { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.page-title { font-size: 2rem; font-weight: 700; color: #2c3e50; margin: 0; }
.title-icon { color: #3498db; }
.tabs-style { border-radius: 12px; }

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.kpi-card { border-radius: 16px; padding: 1.5rem; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.05); background: white; transition: transform 0.3s; }
.kpi-card:hover { transform: translateY(-4px); }
.kpi-primary { border-left: 4px solid #3498db; }
.kpi-success { border-left: 4px solid #2ecc71; }
.kpi-warning { border-left: 4px solid #f39c12; }
.kpi-info { border-left: 4px solid #9b59b6; }
.kpi-content { display: flex; align-items: center; gap: 1rem; }
.kpi-icon { width: 50px; height: 50px; border-radius: 12px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; }
.kpi-info-content { display: flex; flex-direction: column; }
.kpi-value { font-size: 1.8rem; font-weight: 700; color: #2c3e50; line-height: 1.2; }
.kpi-label { font-size: 0.9rem; color: #7f8c8d; }

/* Cards Grid */
.inventario-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.inventario-card { border-radius: 16px; background: white; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.3s; }
.inventario-card:hover { transform: translateY(-3px); }
.inventario-header { padding: 1.2rem; background: #f8f9fa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: start; }
.inventario-title { font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; }
.inventario-description { font-size: 0.8rem; color: #8898aa; margin-top: 0.2rem; }
.inventario-content { padding: 1.2rem; }
.inventario-details { display: flex; flex-direction: column; gap: 0.8rem; }
.detail-item { display: flex; align-items: center; gap: 1rem; padding: 0.8rem; bg: #fff; border: 1px solid #f0f0f0; border-radius: 10px; }
.detail-icon { color: #3498db; font-size: 1.4rem; }
.detail-value { font-weight: 600; font-size: 1rem; color: #2c3e50; }
.total-value { color: #e74c3c; }

/* Filter */
.filter-card { border-radius: 16px; border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.filter-section { padding: 1.2rem; }
.filter-content { display: flex; gap: 1rem; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; }

@media (max-width: 768px) {
  .page-container { padding: 1rem; }
  .filter-content { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr; }
}
</style>
