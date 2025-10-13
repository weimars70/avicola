<template>
  <q-page class="modern-page q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-mb-lg">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title text-h3 q-mb-sm">
            <q-icon name="people" class="q-mr-sm" />
            Listado de Terceros
          </h1>
          <p class="page-subtitle text-body1 text-grey-7">
            Gestiona tus clientes, proveedores y otros terceros
          </p>
        </div>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Nuevo Tercero"
            class="action-btn"
            unelevated
            @click="goToFormulario()"
          />
          <q-btn
            outline
            color="secondary"
            icon="refresh"
            class="action-btn"
            @click="refreshData"
            :loading="loading"
          />
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section q-mb-lg">
      <div class="kpi-grid">
        <q-card class="kpi-card kpi-primary">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="people" size="2rem" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalTerceros }}</div>
              <div class="kpi-label">Total Terceros</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-success">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="shopping_cart" size="2rem" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalClientes }}</div>
              <div class="kpi-label">Clientes</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-warning">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="inventory_2" size="2rem" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalProveedores }}</div>
              <div class="kpi-label">Proveedores</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-info">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="check_circle" size="2rem" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalActivos }}</div>
              <div class="kpi-label">Terceros Activos</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <q-card class="filter-card q-mb-lg">
      <q-card-section class="filter-section">
        <div class="text-h6 q-mb-md">Filtros</div>
        <div class="filter-content">
          <q-input
            v-model="filters.search"
            label="Buscar"
            outlined
            dense
            clearable
            class="search-input"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filters.tipo"
            :options="tipoOptions"
            label="Tipo"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="filter-select"
          />

          <q-select
            v-model="filters.estado"
            :options="estadoOptions"
            label="Estado"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="filter-select"
          />

          <q-btn
            color="primary"
            label="Filtrar"
            unelevated
            class="filter-btn"
            @click="applyFilters"
          />

          <q-btn
            outline
            color="grey"
            label="Limpiar"
            class="filter-btn"
            @click="clearFilters"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Toggle View -->
    <div class="view-toggle q-mb-md">
      <q-btn-toggle
        v-model="viewMode"
        toggle-color="primary"
        :options="[
          { label: 'Tarjetas', value: 'cards', icon: 'grid_view' },
          { label: 'Tabla', value: 'table', icon: 'table_rows' }
        ]"
        unelevated
        rounded
        class="q-px-md"
      />
    </div>

    <!-- Cards View -->
    <div v-if="viewMode === 'cards'" class="terceros-grid">
      <q-card
        v-for="tercero in filteredTerceros"
        :key="tercero.id || 'temp-' + Math.random()"
        class="tercero-card"
        :class="{ 'inactive-card': !tercero.activo }"
      >
        <q-card-section class="tercero-header">
          <div class="tercero-name">{{ tercero.nombre }}</div>
          <q-chip
            :color="tercero.activo ? 'positive' : 'negative'"
            text-color="white"
            :label="tercero.activo ? 'Activo' : 'Inactivo'"
            size="sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="tercero-content">
          <div class="tercero-details">
            <div class="detail-item">
              <div class="detail-label">Identificación:</div>
              <div class="detail-value">{{ tercero.tipoIdentObj?.abreviado || tercero.tipo_ident || '' }} {{ tercero.identificacion }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Teléfono:</div>
              <div class="detail-value">{{ tercero.telefono || 'No registrado' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Email:</div>
              <div class="detail-value">{{ tercero.email || 'No registrado' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Ciudad:</div>
              <div class="detail-value">{{ tercero.ciudad?.nombre || 'No registrada' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Dirección:</div>
              <div class="detail-value">{{ tercero.direccion || 'No registrada' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Tipo:</div>
              <div class="detail-value">
                <q-chip v-if="tercero.cliente" color="teal-6" text-color="white" label="Cliente" size="sm" dense />
                <q-chip v-if="tercero.proveedor" color="indigo-6" text-color="white" label="Proveedor" size="sm" dense />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="tercero-actions">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click="goToFormulario(tercero.id)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="confirmDelete(tercero)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="visibility"
            @click="viewDetails(tercero)"
          >
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>

      <!-- Empty State -->
      <div v-if="filteredTerceros.length === 0 && !loading" class="empty-state">
        <q-icon name="search_off" size="4rem" color="grey-5" />
        <div class="text-h6 q-mt-md">No se encontraron terceros</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Intenta con otros filtros o crea un nuevo tercero
        </div>
      </div>
    </div>

    <!-- Table View -->
    <q-card v-else-if="viewMode === 'table'" class="q-mt-md table-container">
      <div class="table-wrapper">
        <q-table
          :rows="filteredTerceros"
          :columns="tableColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: $q.screen.xs ? 5 : 10 }"
          :dense="$q.screen.xs"
          :grid="$q.screen.xs"
          :hide-header="$q.screen.xs"
          class="terceros-table"
          :class="{'responsive-table': $q.screen.lt.md}"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.activo ? 'positive' : 'negative'"
                text-color="white"
                :label="props.row.activo ? 'Activo' : 'Inactivo'"
                size="sm"
              />
            </q-td>
          </template>
          
          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-chip v-if="props.row.cliente" color="teal-6" text-color="white" label="Cliente" size="sm" dense />
                <q-chip v-if="props.row.proveedor" color="indigo-6" text-color="white" label="Proveedor" size="sm" dense />
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="goToFormulario(props.row.id)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="secondary"
                icon="visibility"
                size="sm"
                @click="viewDetails(props.row)"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Cargando terceros...</div>
    </div>

    <!-- Infinite Scroll eliminado -->

    <!-- Details Dialog -->
    <q-dialog v-model="detailsDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="text-h6">Detalles del Tercero</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedTercero" class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Información General</div>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Nombre</q-item-label>
                    <q-item-label>{{ selectedTercero.nombre }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Identificación</q-item-label>
                    <q-item-label>{{ selectedTercero.tipoIdentObj?.abreviado || selectedTercero.tipo_ident || '' }} {{ selectedTercero.identificacion }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Teléfono</q-item-label>
                    <q-item-label>{{ selectedTercero.telefono || 'No registrado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Email</q-item-label>
                    <q-item-label>{{ selectedTercero.email || 'No registrado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Estado</q-item-label>
                    <q-item-label>
                      <q-chip
                        :color="selectedTercero.activo ? 'positive' : 'negative'"
                        text-color="white"
                        :label="selectedTercero.activo ? 'Activo' : 'Inactivo'"
                        size="sm"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Información Adicional</div>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Dirección</q-item-label>
                    <q-item-label>{{ selectedTercero.direccion || 'No registrada' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Ciudad</q-item-label>
                    <q-item-label>{{ selectedTercero.ciudad?.nombre || 'No registrada' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Régimen</q-item-label>
                    <q-item-label>{{ selectedTercero.tipoRegimen?.nombre || 'No registrado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Estrato</q-item-label>
                    <q-item-label>{{ selectedTercero.estrato?.nombre || 'No registrado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Tipo</q-item-label>
                    <q-item-label>
                      <div class="row q-gutter-xs">
                        <q-chip v-if="selectedTercero.cliente" color="teal-6" text-color="white" label="Cliente" size="sm" dense />
            <q-chip v-if="selectedTercero.proveedor" color="indigo-6" text-color="white" label="Proveedor" size="sm" dense />
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn unelevated label="Editar" color="primary" @click="editFromDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="text-h6">Confirmar Eliminación</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <p>¿Estás seguro de que deseas eliminar el tercero <strong>{{ selectedTercero?.nombre }}</strong>?</p>
          <p class="text-negative">Esta acción no se puede deshacer.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn unelevated label="Eliminar" color="negative" @click="deleteTercero" :loading="deleteLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useTercerosStore } from '../stores/terceros';
import type { Tercero } from '../types/terceros';

const router = useRouter();
const $q = useQuasar();
const tercerosStore = useTercerosStore();

// Estado
const loading = ref(false);
const deleteLoading = ref(false);
const viewMode = ref('cards');
const detailsDialog = ref(false);
const deleteDialog = ref(false);
const selectedTercero = ref<Tercero | null>(null);

// Filtros
const filters = ref({
  search: '',
  tipo: null,
  estado: null
});

const tipoOptions = [
  { label: 'Todos', value: null },
  { label: 'Clientes', value: 'cliente' },
  { label: 'Proveedores', value: 'proveedor' }
];

const estadoOptions = [
  { label: 'Todos', value: null },
  { label: 'Activos', value: 'activo' },
  { label: 'Inactivos', value: 'inactivo' }
];

// Columnas para la tabla
const tableColumns = [
  { name: 'nombre', align: 'left' as const, label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'identificacion', align: 'left' as const, label: 'Identificación', field: (row: Tercero) => `${row.tipoIdentObj?.abreviado || row.tipo_ident || ''} ${row.identificacion}`, sortable: true },
  { name: 'telefono', align: 'left' as const, label: 'Teléfono', field: 'telefono' },
  { name: 'email', align: 'left' as const, label: 'Email', field: 'email' },
  { name: 'ciudad', align: 'left' as const, label: 'Ciudad', field: (row: Tercero) => row.ciudad?.nombre || '', sortable: true },
  { name: 'tipo', align: 'center' as const, label: 'Tipo', field: (row: Tercero) => getTipoLabel(row) },
  { name: 'estado', align: 'center' as const, label: 'Estado', field: (row: Tercero) => row.activo ? 'Activo' : 'Inactivo' },
  { name: 'acciones', align: 'center' as const, label: 'Acciones', field: 'id' }
];

// Getters computados
const filteredTerceros = computed(() => {
  let result = [...tercerosStore.terceros];
  
  // Filtrar por búsqueda
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(t => 
      t.nombre.toLowerCase().includes(searchLower) || 
      t.identificacion.toLowerCase().includes(searchLower) ||
      (t.email && t.email.toLowerCase().includes(searchLower))
    );
  }
  
  // Filtrar por tipo
  if (filters.value.tipo === 'cliente') {
    result = result.filter(t => t.cliente);
  } else if (filters.value.tipo === 'proveedor') {
    result = result.filter(t => t.proveedor);
  }
  
  // Filtrar por estado
  if (filters.value.estado === 'activo') {
    result = result.filter(t => t.activo);
  } else if (filters.value.estado === 'inactivo') {
    result = result.filter(t => !t.activo);
  }
  
  return result;
});

const totalTerceros = computed(() => tercerosStore.terceros.length);
const totalClientes = computed(() => tercerosStore.terceros.filter((t: Tercero) => t.cliente).length);
const totalProveedores = computed(() => tercerosStore.terceros.filter((t: Tercero) => t.proveedor).length);
const totalActivos = computed(() => tercerosStore.terceros.filter((t: Tercero) => t.activo).length);

// Métodos
const fetchData = async () => {
  loading.value = true;
  try {
    await tercerosStore.fetchTerceros();
  } catch (error) {
    const err = error as Error;
    $q.notify({
      color: 'negative',
      message: 'Error al cargar terceros: ' + (err.message || 'Error desconocido'),
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  void fetchData();
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente a través del computed filteredTerceros
};

const clearFilters = () => {
  filters.value = {
    search: '',
    tipo: null,
    estado: null
  };
};

const goToFormulario = (id: number | null | undefined = null) => {
  if (id) {
    void router.push(`/terceros/formulario/${id}`);
  } else {
    void router.push('/terceros/formulario');
  }
};

const viewDetails = (tercero: Tercero) => {
  selectedTercero.value = tercero;
  detailsDialog.value = true;
};

const editFromDialog = () => {
  detailsDialog.value = false;
  if (selectedTercero.value) {
    goToFormulario(selectedTercero.value.id);
  }
};

const confirmDelete = (tercero: Tercero) => {
  selectedTercero.value = tercero;
  deleteDialog.value = true;
};

const deleteTercero = async () => {
  if (!selectedTercero.value) return;
  
  deleteLoading.value = true;
  try {
    await tercerosStore.deleteTercero(selectedTercero.value?.id as number);
    deleteDialog.value = false;
    
    $q.notify({
      color: 'positive',
      message: `Tercero "${selectedTercero.value.nombre}" eliminado correctamente`,
      icon: 'check_circle'
    });
  } catch (error) {
    const err = error as Error;
    $q.notify({
      color: 'negative',
      message: 'Error al eliminar tercero: ' + (err.message || 'Error desconocido'),
      icon: 'error'
    });
  } finally {
    deleteLoading.value = false;
  }
};



const getTipoLabel = (tercero: Tercero): string => {
  const tipos: string[] = [];
  if (tercero.cliente) tipos.push('Cliente');
  if (tercero.proveedor) tipos.push('Proveedor');
  return tipos.join(', ') || 'Otro';
};

// Ciclo de vida
onMounted(() => {
  void fetchData();
});
</script>

<style lang="scss">
/* Layout Principal */
.modern-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  opacity: 0.8;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
}

/* KPI Cards */
.kpi-section {
  margin-bottom: 1.5rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.kpi-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-icon {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.kpi-icon .q-icon {
  color: white !important;
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: white;
}

.kpi-label {
  font-size: 0.875rem;
  opacity: 0.9;
  color: white;
}

.kpi-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kpi-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.kpi-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.kpi-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

/* Filter Card */
.filter-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.filter-section {
  padding: 1.5rem;
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.search-input,
.filter-select {
  min-width: 200px;
}

.filter-btn {
  height: 40px;
  min-width: 100px;
}

/* View Toggle */
.view-toggle {
  display: flex;
  justify-content: flex-end;
}

/* Terceros Grid */
.terceros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tercero-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.tercero-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.inactive-card {
  opacity: 0.7;
}

.tercero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
}

.tercero-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: white;
}

.tercero-content {
  padding: 1rem;
  background-color: white;
}

.tercero-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.tercero-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #fafbfc;
  border-top: 1px solid #e1e5e9;
}

/* Table Container */
.table-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  overflow-x: auto;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

/* Dialog */
.dialog-card {
  border-radius: 12px;
  min-width: 400px;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .terceros-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .filter-select {
    min-width: 100%;
  }
  
  .dialog-card {
    min-width: 300px;
    width: 90%;
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

.tercero-card {
  animation: fadeInUp 0.3s ease-out;
}

.kpi-card {
  animation: fadeInUp 0.3s ease-out;
}
</style>