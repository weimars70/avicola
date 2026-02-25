<template>
  <q-page class="q-pa-sm q-pa-md-lg modern-page">
    <!-- Header con gradiente -->
    <div class="page-header q-mb-lg q-mb-md-xl">
      <div class="row items-center justify-between q-gutter-y-md">
        <div class="col-12 col-md-auto">
          <div class="header-content">
            <div class="header-icon">
              <q-icon name="egg" size="2.5rem" />
            </div>
            <div>
              <h1 class="page-title text-h4 text-md-h3">Tipos de Huevo</h1>
              <p class="page-subtitle text-body2 text-md-body1">Administra los tipos de huevo del sistema</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="row q-gutter-sm q-gutter-md-md items-center justify-center justify-md-end">
            <ViewModeToggle 
              :view-mode="viewMode" 
              @update:view-mode="setViewMode" 
            />
            <q-btn
              class="action-btn"
              icon="add"
              :label="$q.screen.xs ? 'Nuevo' : 'Nuevo Tipo'"
              @click="openDialog()"
              :size="$q.screen.xs ? 'md' : 'lg'"
              unelevated
            />
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs Section -->
    <div class="row q-col-gutter-md q-mb-lg q-mb-md-xl">
      <div class="col-6 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-total full-height">
          <q-card-section class="text-center q-pa-sm q-pa-md-md">
            <div class="kpi-icon">
              <q-icon name="egg" :size="$q.screen.xs ? '1.5rem' : '2rem'" />
            </div>
            <div class="kpi-value text-h5 text-md-h4">{{ tiposHuevoStore.tiposHuevo.length }}</div>
            <div class="kpi-label text-caption text-md-body2">Total Tipos</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-active full-height">
          <q-card-section class="text-center q-pa-sm q-pa-md-md">
            <div class="kpi-icon">
              <q-icon name="check_circle" :size="$q.screen.xs ? '1.5rem' : '2rem'" />
            </div>
            <div class="kpi-value text-h5 text-md-h4">{{ tiposHuevoStore.tiposHuevo.filter((t: TipoHuevo) => t.activo).length }}</div>
            <div class="kpi-label text-caption text-md-body2">Activos</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-inactive full-height">
          <q-card-section class="text-center q-pa-sm q-pa-md-md">
            <div class="kpi-icon">
              <q-icon name="cancel" :size="$q.screen.xs ? '1.5rem' : '2rem'" />
            </div>
            <div class="kpi-value text-h5 text-md-h4">{{ tiposHuevoStore.tiposHuevo.filter((t: TipoHuevo) => !t.activo).length }}</div>
            <div class="kpi-label text-caption text-md-body2">Inactivos</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-price full-height">
          <q-card-section class="text-center q-pa-sm q-pa-md-md">
            <div class="kpi-icon">
              <q-icon name="attach_money" :size="$q.screen.xs ? '1.5rem' : '2rem'" />
            </div>
            <div class="kpi-value text-h5 text-md-h4">{{ averagePrice }}</div>
            <div class="kpi-label text-caption text-md-body2">Precio Promedio</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <q-card class="filter-card q-mb-lg">
      <q-card-section class="q-pa-sm q-pa-md-md">
        <div class="row q-gutter-sm q-gutter-md-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filter.search"
              placeholder="Buscar tipos de huevo..."
              outlined
              dense
              clearable
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filter.activo"
              :options="estadoOptions"
              label="Estado"
              outlined
              dense
              clearable
              emit-value
              map-options
              class="modern-select"
            />
          </div>
          <div class="col-12 col-md-auto">
            <q-btn
              class="filter-btn full-width"
              icon="search"
              :label="$q.screen.xs ? 'Buscar' : 'Buscar'"
              @click="fetchTiposHuevo"
              unelevated
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Vista de Tarjetas -->
    <div v-if="isCardsView" class="row q-col-gutter-md">
      <div v-for="tipo in filteredTiposHuevo" :key="tipo.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="tipo-card full-height" :class="{ 'tipo-inactive': !tipo.activo }">
          <q-card-section class="card-header">
            <div class="row items-center justify-between">
              <div class="col">
                <div class="card-title">{{ tipo.nombre }}</div>
                <div class="card-subtitle">{{ tipo.descripcion || 'Sin descripción' }}</div>
              </div>
              <div class="col-auto">
                <q-badge 
                  :color="tipo.activo ? 'positive' : 'negative'" 
                  :label="tipo.activo ? 'Activo' : 'Inactivo'"
                  class="status-badge"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section class="card-content">
            <div class="price-section">
              <div class="price-label">Valor por Unidad</div>
              <div class="price-value">{{ formatCurrency(tipo.valorUnidad) }}</div>
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <q-icon name="calendar_today" class="detail-icon" />
                <div class="detail-content">
                  <div class="detail-label">Creado</div>
                  <div class="detail-value">{{ formatDate(tipo.createdAt) }}</div>
                </div>
              </div>
              <div class="detail-item" v-if="tipo.updatedAt">
                <q-icon name="update" class="detail-icon" />
                <div class="detail-content">
                  <div class="detail-label">Actualizado</div>
                  <div class="detail-value">{{ formatDate(tipo.updatedAt) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="card-actions">
            <q-btn
              flat
              icon="edit"
              label="Editar"
              class="action-btn-secondary"
              @click="openDialog(tipo)"
            />
            <q-btn
              flat
              icon="delete"
              label="Eliminar"
              class="action-btn-danger"
              @click="confirmDelete(tipo)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
    <!-- Vista de Tabla -->
    <q-card v-else-if="isTableView" class="q-mt-md table-container">
      <div class="table-wrapper">
        <q-table
          :rows="filteredTiposHuevo"
          :columns="tableColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: $q.screen.xs ? 5 : 10 }"
          :dense="$q.screen.xs"
          :grid="$q.screen.xs"
          :hide-header="$q.screen.xs"
          class="tipos-huevo-table"
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
        
        <template v-slot:body-cell-valorUnidad="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.valorUnidad) }}
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
              @click="openDialog(props.row)"
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
          </q-td>
        </template>
        
        <!-- Template para vista grid en móviles -->
        <template v-slot:item="props" v-if="$q.screen.xs">
          <div class="q-pa-xs col-xs-12">
            <q-card class="mobile-card">
              <q-card-section class="q-pa-md">
                <div class="row items-center q-mb-sm">
                  <div class="col">
                    <div class="text-h6 text-primary">{{ props.row.nombre }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.descripcion || 'Sin descripción' }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip
                      :color="props.row.activo ? 'positive' : 'negative'"
                      text-color="white"
                      :label="props.row.activo ? 'Activo' : 'Inactivo'"
                      size="sm"
                    />
                  </div>
                </div>
                
                <div class="row q-gutter-sm q-mb-md">
                  <div class="col-6">
                    <div class="text-caption text-grey-6">Valor por Unidad</div>
                    <div class="text-h6 text-positive">{{ formatCurrency(props.row.valorUnidad) }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-caption text-grey-6">Creado</div>
                    <div class="text-body2">{{ formatDate(props.row.createdAt) }}</div>
                  </div>
                </div>
                
                <div class="row q-gutter-xs">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="edit"
                    label="Editar"
                    class="col"
                    @click="openDialog(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="delete"
                    label="Eliminar"
                    class="col"
                    @click="confirmDelete(props.row)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
      </div>
    </q-card>

    <!-- Empty State -->
    <div v-if="filteredTiposHuevo.length === 0 && !loading" class="empty-state">
      <q-card class="empty-card">
        <q-card-section class="text-center q-pa-xl">
          <q-icon name="egg" size="4rem" class="empty-icon" />
          <div class="empty-title">No hay tipos de huevo</div>
          <div class="empty-subtitle">Comienza creando tu primer tipo de huevo</div>
          <q-btn
            class="action-btn q-mt-lg"
            icon="add"
            label="Crear Tipo de Huevo"
            @click="openDialog()"
            size="lg"
            unelevated
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog-responsive">
        <q-card-section>
          <div class="text-h6">
            {{ editingTipoHuevo ? 'Editar Tipo de Huevo' : 'Nuevo Tipo de Huevo' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTipoHuevo" class="q-gutter-md">
            <q-input
              v-model="form.nombre"
              label="Nombre *"
              outlined
              :rules="[(val: string) => !!val || 'El nombre es requerido']"
            />

            <q-input
              v-model="form.descripcion"
              label="Descripción"
              outlined
              type="textarea"
              rows="3"
            />

            <q-input
              v-model.number="form.valorUnidad"
              label="Valor por Unidad *"
              outlined
              type="number"
              min="0"
              step="0.01"
              prefix="$"
              :rules="[(val: number) => val > 0 || 'El valor por unidad debe ser mayor a 0']"
            />



            <q-toggle
              v-model="form.activo"
              label="Activo"
              color="positive"
            />

            <div class="row q-gutter-sm justify-end">
              <q-btn
                label="Cancelar"
                color="grey"
                flat
                @click="closeDialog"
              />
              <q-btn
                label="Guardar"
                color="primary"
                type="submit"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useInventarioStore } from 'src/stores/inventario';
import { useQuasar } from 'quasar';
import { useViewMode } from 'src/composables/useViewMode';
import ViewModeToggle from 'src/components/ViewModeToggle.vue';

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

const $q = useQuasar();
const tiposHuevoStore = useTiposHuevoStore();
const inventarioStore = useInventarioStore();
const { viewMode, isCardsView, isTableView, setViewMode } = useViewMode();

const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editingTipoHuevo = ref<TipoHuevo | null>(null);

const filter = ref({
  search: '',
  activo: null
});

const form = ref({
  nombre: '',
  descripcion: '',
  valorUnidad: 0,
  activo: true
});



const estadoOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
];

const tableColumns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left' as const,
    field: 'nombre',
    sortable: true
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    align: 'left' as const,
    field: 'descripcion',
    sortable: true
  },
  {
    name: 'valorUnidad',
    label: 'Valor por Unidad',
    align: 'right' as const,
    field: 'valorUnidad',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center' as const,
    field: 'activo',
    sortable: true
  },
  {
    name: 'createdAt',
    label: 'Fecha de Creación',
    align: 'center' as const,
    field: 'createdAt',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center' as const,
    field: 'acciones',
    sortable: false
  }
];



const filteredTiposHuevo = computed(() => {
  let result = tiposHuevoStore.tiposHuevo;

  if (filter.value.search) {
    const search = filter.value.search.toLowerCase();
    result = result.filter(tipo => 
      tipo.nombre.toLowerCase().includes(search) ||
      tipo.descripcion?.toLowerCase().includes(search)
    );
  }

  if (filter.value.activo !== null) {
    result = result.filter(tipo => tipo.activo === filter.value.activo);
  }

  return result;
});

const formatCurrency = (value: number) => {
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

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  // Ajustar por zona horaria para evitar problemas de conversión
  const adjustedDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
  return adjustedDate.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const averagePrice = computed(() => {
  if (tiposHuevoStore.tiposHuevo.length === 0) return '0.00';
  
  // Obtener datos del inventario para calcular promedio ponderado
  const inventarioData = inventarioStore.resumenInventario;
  
  if (inventarioData.length === 0) {
    // Si no hay inventario, usar promedio simple de tipos activos
    const tiposConValor = tiposHuevoStore.tiposHuevo.filter(tipo => 
      tipo.activo &&
      tipo.valorUnidad !== null && 
      tipo.valorUnidad !== undefined && 
      !isNaN(tipo.valorUnidad) && 
      tipo.valorUnidad > 0
    );
    
    if (tiposConValor.length === 0) return '0.00';
    
    const total = tiposConValor.reduce((sum: number, tipo: TipoHuevo) => sum + tipo.valorUnidad, 0);
    const avg = total / tiposConValor.length;
    return formatCurrency(avg);
  }
  
  // Calcular promedio ponderado basado en stock actual
  let valorTotalPonderado = 0;
  let stockTotal = 0;
  
  inventarioData.forEach(item => {
    if (item.stockActual > 0 && item.tipoHuevo.valorUnidad > 0) {
      valorTotalPonderado += item.tipoHuevo.valorUnidad * item.stockActual;
      stockTotal += item.stockActual;
    }
  });
  
  if (stockTotal === 0) return '0.00';
  
  const promedioReal = valorTotalPonderado / stockTotal;
  return formatCurrency(promedioReal);
});

const fetchTiposHuevo = async () => {
  loading.value = true;
  try {
    await tiposHuevoStore.fetchTiposHuevo();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los tipos de huevo'
    });
  } finally {
    loading.value = false;
  }
};

const openDialog = (tipoHuevo: TipoHuevo | null = null) => {
  editingTipoHuevo.value = tipoHuevo;
  if (tipoHuevo) {
    form.value = {
      nombre: tipoHuevo.nombre,
      descripcion: tipoHuevo.descripcion || '',
      valorUnidad: tipoHuevo.valorUnidad,
      activo: tipoHuevo.activo
    };
  } else {
    form.value = {
      nombre: '',
      descripcion: '',
      valorUnidad: 0,
      activo: true
    };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingTipoHuevo.value = null;
  form.value = {
    nombre: '',
    descripcion: '',
    valorUnidad: 0,
    activo: true
  };
};

const saveTipoHuevo = async () => {
  saving.value = true;
  try {
    if (editingTipoHuevo.value) {
      await tiposHuevoStore.updateTipoHuevo(editingTipoHuevo.value.id, form.value);
      $q.notify({
        type: 'positive',
        message: 'Tipo de huevo actualizado correctamente'
      });
    } else {
      // Añadir id_empresa al crear un nuevo tipo de huevo
      const tipoHuevoData = {
        ...form.value,
        id_empresa: 2 // Usando el id_empresa que aparece en la URL del error
      };
      await tiposHuevoStore.createTipoHuevo(tipoHuevoData);
      $q.notify({
        type: 'positive',
        message: 'Tipo de huevo creado correctamente'
      });
    }
    closeDialog();
  } catch (error) {
    console.error('Error al guardar tipo de huevo:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el tipo de huevo'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (tipoHuevo: TipoHuevo) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar el tipo de huevo "${tipoHuevo.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await tiposHuevoStore.deleteTipoHuevo(tipoHuevo.id);
        $q.notify({
          type: 'positive',
          message: 'Tipo de huevo eliminado correctamente'
        });
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al eliminar el tipo de huevo'
        });
      }
    })();
  });
};



onMounted(async () => {
  await fetchTiposHuevo();
  await inventarioStore.fetchResumenInventario();
});
</script>

<style scoped>
/* Modern Page Styles */
.modern-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-weight: 400;
}

.action-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 12px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

/* KPI Cards */
.kpi-card {
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.kpi-total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.kpi-active {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.kpi-inactive {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.kpi-price {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.kpi-icon {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kpi-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Card */
.filter-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.modern-input, .modern-select {
  border-radius: 12px;
}

.filter-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 12px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
}

/* Tipo Cards */
.tipo-card {
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.tipo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.tipo-inactive {
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.8);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin: -1px -1px 0 -1px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.card-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 400;
}

.status-badge {
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 1.5rem;
}

.price-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  color: white;
}

.price-label {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.detail-icon {
  color: #667eea;
  font-size: 1.2rem;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.2rem;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.card-actions {
  padding: 1rem 1.5rem;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 0 0 20px 20px;
  display: flex;
  justify-content: space-between;
}

.action-btn-secondary {
  color: #667eea;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn-secondary:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.action-btn-danger {
  color: #ff6b6b;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn-danger:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-card {
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.empty-icon {
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Table Container */
.table-container {
  border-radius: 12px;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

/* Mobile Cards */
.mobile-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.mobile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 1024px) {
  .page-header {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .modern-page {
    padding: 0.5rem !important;
  }
  
  .page-header {
    padding: 1rem;
    margin-bottom: 1rem !important;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .page-title {
    font-size: 1.75rem !important;
    margin-bottom: 0.25rem;
  }
  
  .page-subtitle {
    font-size: 0.875rem !important;
  }
  
  .kpi-card {
    margin-bottom: 0.5rem;
  }
  
  .kpi-value {
    font-size: 1.5rem !important;
  }
  
  .kpi-label {
    font-size: 0.75rem !important;
  }
  
  .filter-card {
    margin-bottom: 1rem;
  }
  
  .filter-btn {
    margin-top: 0.5rem;
  }
  
  .tipo-card {
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .price-value {
    font-size: 1.25rem;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn-secondary,
  .action-btn-danger {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modern-page {
    padding: 0.25rem !important;
  }
  
  .page-header {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem !important;
  }
  
  .kpi-value {
    font-size: 1.25rem !important;
  }
  
  .header-icon q-icon {
    font-size: 2rem !important;
  }
  
  .action-btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

/* Animation */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style scoped>
.q-table {
  border-radius: 8px;
}
</style>