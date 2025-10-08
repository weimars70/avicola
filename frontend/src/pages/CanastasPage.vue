<template>
  <q-page class="modern-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <q-icon name="shopping_basket" class="header-icon" />
          <div>
            <h1 class="page-title">Gestión de Canastas</h1>
            <p class="page-subtitle">Administra las canastas del sistema avícola</p>
          </div>
        </div>
        <div class="row q-gutter-md items-center">
          <ViewModeToggle
            :view-mode="viewMode"
            @update:view-mode="setViewMode"
          />
          <q-btn
            class="add-btn"
            color="primary"
            icon="add"
            label="Nueva Canasta"
            size="lg"
            @click="openDialog()"
          />
        </div>
      </div>
    </div>

    <!-- KPIs Section -->
    <div class="kpi-section">
      <div class="kpi-grid">
        <q-card class="kpi-card kpi-total">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="shopping_basket" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ canastas.length }}</div>
              <div class="kpi-label">Total Canastas</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-active">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="check_circle" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ activeCanastas }}</div>
              <div class="kpi-label">Canastas Activas</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-average">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="attach_money" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${{ formatCurrency(averageValue) }}</div>
              <div class="kpi-label">Valor Promedio</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-units">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="inventory" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalUnits }}</div>
              <div class="kpi-label">Total Unidades</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <q-card class="filter-card">
      <q-card-section>
        <div class="filter-content">
          <q-input
            v-model="filter.search"
            placeholder="Buscar canastas por nombre..."
            outlined
            dense
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
          
          <q-select
            v-model="filter.activo"
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
            icon="refresh"
            label="Actualizar"
            @click="fetchCanastas"
            class="refresh-btn"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Vista de Tarjetas -->
    <div v-if="isCardsView && filteredCanastas.length > 0" class="canastas-grid">
      <q-card 
        v-for="canasta in filteredCanastas" 
        :key="canasta.id" 
        class="canasta-card"
        @click="openDialog(canasta)"
      >
        <q-card-section class="canasta-header">
          <div class="canasta-title">
            <q-icon name="shopping_basket" class="canasta-icon" />
            <span class="canasta-name">{{ canasta.nombre }}</span>
          </div>
          <q-badge 
            :color="canasta.activo ? 'positive' : 'negative'"
            :label="canasta.activo ? 'Activo' : 'Inactivo'"
            class="status-badge"
          />
        </q-card-section>

        <q-card-section class="canasta-content">
          <div class="canasta-description" v-if="canasta.descripcion">
            {{ canasta.descripcion }}
          </div>
          
          <div class="canasta-details">
            <div class="detail-item">
              <q-icon name="egg" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">Tipo de Huevo</div>
                <div class="detail-value">{{ canasta.tipoHuevo?.nombre || 'N/A' }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <q-icon name="inventory_2" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">Unidades</div>
                <div class="detail-value">{{ canasta.unidadesPorCanasta }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <q-icon name="attach_money" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">Valor</div>
                <div class="detail-value price">${{ formatCurrency(canasta.valorCanasta) }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <q-icon name="schedule" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">Actualizado</div>
                <div class="detail-value">{{ formatDate(canasta.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="canasta-actions">
          <q-btn
            flat
            color="primary"
            icon="edit"
            label="Editar"
            @click.stop="openDialog(canasta)"
            class="action-btn"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            label="Eliminar"
            @click.stop="confirmDelete(canasta)"
            class="action-btn"
          />
        </q-card-actions>
      </q-card>
    </div>
    
    <!-- Vista de Tabla -->
    <q-card v-else-if="isTableView && filteredCanastas.length > 0" class="q-mt-md">
      <q-table
        :rows="filteredCanastas"
        :columns="tableColumns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-tipoHuevo="props">
          <q-td :props="props">
            {{ props.row.tipoHuevo?.nombre || 'N/A' }}
          </q-td>
        </template>
        
        <template v-slot:body-cell-valorCanasta="props">
          <q-td :props="props">
            ${{ formatCurrency(props.row.valorCanasta) }}
          </q-td>
        </template>
        
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
      </q-table>
    </q-card>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <q-icon name="shopping_basket" class="empty-icon" />
      <h3 class="empty-title">No hay canastas registradas</h3>
      <p class="empty-subtitle">Comienza creando tu primera canasta</p>
      <q-btn
        color="primary"
        icon="add"
        label="Crear Primera Canasta"
        size="lg"
        @click="openDialog()"
        class="empty-btn"
      />
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingCanasta ? 'Editar Canasta' : 'Nueva Canasta' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveCanasta" class="q-gutter-md">
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

            <q-select
              v-model="form.tipoHuevoId"
              :options="tipoHuevoOptions"
              option-value="value"
              option-label="label"
              label="Tipo de huevo *"
              outlined
              dense
              emit-value
              map-options
              :rules="[
                (val: string) => !!val || 'El tipo de huevo es requerido'
              ]"
            />

            <q-input
              v-model.number="form.unidadesPorCanasta"
              label="Unidades por Canasta *"
              outlined
              type="number"
              min="1"
              suffix="unidades"
              :rules="[(val: number) => val > 0 || 'Las unidades por canasta deben ser mayor a 0']"
            />

            <q-input
              v-model.number="form.valorCanasta"
              label="Valor Canasta *"
              outlined
              type="number"
              min="0"
              step="0.01"
              prefix="$"
              :rules="[(val: number) => val > 0 || 'El valor de la canasta debe ser mayor a 0']"
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
import { useCanastasStore } from 'src/stores/canastas';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useQuasar } from 'quasar';
import { useViewMode } from 'src/composables/useViewMode';
import ViewModeToggle from 'src/components/ViewModeToggle.vue';

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo: boolean;
}

interface Canasta {
  id: string;
  nombre: string;
  descripcion?: string;
  valorCanasta: number;
  unidadesPorCanasta: number;
  tipoHuevoId: string;
  tipoHuevo?: TipoHuevo;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

const $q = useQuasar();
const canastasStore = useCanastasStore();
const tiposHuevoStore = useTiposHuevoStore();
const { viewMode, isCardsView, isTableView, setViewMode } = useViewMode();

const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editingCanasta = ref<Canasta | null>(null);

const filter = ref({
  search: '',
  activo: null
});

const form = ref({
  nombre: '',
  descripcion: '',
  valorCanasta: 0,
  unidadesPorCanasta: 0,
  tipoHuevoId: '',
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
    name: 'tipoHuevo',
    label: 'Tipo de Huevo',
    align: 'left' as const,
    field: 'tipoHuevo',
    sortable: true
  },
  {
    name: 'unidadesPorCanasta',
    label: 'Unidades',
    align: 'center' as const,
    field: 'unidadesPorCanasta',
    sortable: true
  },
  {
    name: 'valorCanasta',
    label: 'Valor',
    align: 'right' as const,
    field: 'valorCanasta',
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
    name: 'updatedAt',
    label: 'Última Actualización',
    align: 'center' as const,
    field: 'updatedAt',
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

const tipoHuevoOptions = computed(() => {
  return tiposHuevoStore.tiposHuevo.map(tipo => ({
    label: tipo.nombre,
    value: tipo.id
  }));
});



const filteredCanastas = computed(() => {
  let result = canastasStore.canastas;

  if (filter.value.search) {
    const search = filter.value.search.toLowerCase();
    result = result.filter(canasta => 
      canasta.nombre.toLowerCase().includes(search) ||
      canasta.descripcion?.toLowerCase().includes(search)
    );
  }

  if (filter.value.activo !== null) {
    result = result.filter(canasta => canasta.activo === filter.value.activo);
  }

  return result;
});

const formatCurrency = (value: number) => {
  if (isNaN(value) || value === null || value === undefined || value === 0) {
    return '0';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Ajustar por zona horaria para evitar problemas de conversión
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjustedDate.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Computed properties for KPIs
const activeCanastas = computed(() => {
  return canastasStore.canastas.filter(canasta => canasta.activo).length;
});

const averageValue = computed(() => {
  const canastas = canastasStore.canastas;
  if (canastas.length === 0) return 0;
  const total = canastas.reduce((sum, canasta) => sum + canasta.valorCanasta, 0);
  return total / canastas.length;
});

const totalUnits = computed(() => {
  return canastasStore.canastas.reduce((sum, canasta) => sum + canasta.unidadesPorCanasta, 0);
});

const canastas = computed(() => canastasStore.canastas);

const fetchCanastas = async () => {
  loading.value = true;
  try {
    await canastasStore.fetchCanastas();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las canastas'
    });
  } finally {
    loading.value = false;
  }
};

const openDialog = (canasta: Canasta | null = null) => {
  editingCanasta.value = canasta;
  if (canasta) {
    form.value = {
      nombre: canasta.nombre,
      descripcion: canasta.descripcion || '',
      valorCanasta: canasta.valorCanasta,
      unidadesPorCanasta: canasta.unidadesPorCanasta,
      tipoHuevoId: canasta.tipoHuevoId,
      activo: canasta.activo
    };
  } else {
    form.value = {
      nombre: '',
      descripcion: '',
      valorCanasta: 0,
      unidadesPorCanasta: 0,
      tipoHuevoId: '',
      activo: true
    };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingCanasta.value = null;
  form.value = {
    nombre: '',
    descripcion: '',
    valorCanasta: 0,
    unidadesPorCanasta: 0,
    tipoHuevoId: '',
    activo: true
  };
};

const saveCanasta = async () => {
  saving.value = true;
  try {
    if (editingCanasta.value) {
      await canastasStore.updateCanasta(editingCanasta.value.id, form.value);
      $q.notify({
        type: 'positive',
        message: 'Canasta actualizada correctamente'
      });
    } else {
      // Añadir id_empresa al crear una nueva canasta
      const canastaData = {
        ...form.value,
        id_empresa: 2 // Usando el id_empresa que aparece en la URL del error
      };
      await canastasStore.createCanasta(canastaData);
      $q.notify({
        type: 'positive',
        message: 'Canasta creada correctamente'
      });
    }
    closeDialog();
    await fetchCanastas(); // Refrescar la tabla después de guardar
  } catch (error) {
    console.error('Error al guardar canasta:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la canasta'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (canasta: Canasta) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar la canasta "${canasta.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await canastasStore.deleteCanasta(canasta.id);
        $q.notify({
          type: 'positive',
          message: 'Canasta eliminada correctamente'
        });
        await fetchCanastas(); // Refrescar la tabla después de eliminar
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al eliminar la canasta'
        });
      }
    })();
  });
};



onMounted(() => {
  void fetchCanastas();
  void tiposHuevoStore.fetchTiposHuevo();
});
</script>

<style scoped>
.modern-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.header-icon {
  font-size: 3rem;
  opacity: 0.9;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

.add-btn {
  border-radius: 12px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,255,255,0.3);
}

/* KPI Section */
.kpi-section {
  margin-bottom: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  border-radius: 16px;
  border: none;
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
  background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.kpi-total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kpi-active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.kpi-average {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.kpi-units {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.kpi-content {
  padding: 1.5rem;
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Filter Card */
.filter-card {
  border-radius: 16px;
  margin-bottom: 2rem;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.filter-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 150px;
}

.refresh-btn {
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
}

/* Canastas Grid */
.canastas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.canasta-card {
  border-radius: 16px;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.canasta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.canasta-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.canasta-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.canasta-icon {
  font-size: 1.5rem;
}

.canasta-name {
  font-size: 1.25rem;
  font-weight: 600;
}

.status-badge {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.canasta-content {
  padding: 1.5rem;
}

.canasta-description {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-left: 3px solid #667eea;
  padding-left: 0.75rem;
  font-size: 0.95rem;
}

.canasta-details {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

.detail-icon {
  color: #667eea;
  font-size: 1.25rem;
}

.detail-info {
  flex: 1;
}

.detail-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-top: 0.25rem;
}

.detail-value.price {
  color: #28a745;
  font-size: 1.1rem;
}

.canasta-actions {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  padding: 0.5rem 1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.empty-btn {
  border-radius: 12px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  text-transform: none;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .canastas-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .modern-page {
    padding: 0.5rem;
  }
  
  .page-container {
    padding: 0;
  }
  
  .page-header {
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 12px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .kpi-section {
    margin: 0.5rem;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .kpi-card {
    padding: 0.75rem;
  }
  
  .kpi-value {
    font-size: 1.5rem;
  }
  
  .kpi-label {
    font-size: 0.8rem;
  }
  
  .canastas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0.5rem;
  }
  
  .canasta-card {
    margin-bottom: 0;
  }
  
  .canasta-header {
    padding: 1rem;
  }
  
  .canasta-name {
    font-size: 1.1rem;
  }
  
  .canasta-content {
    padding: 1rem;
  }
  
  .canasta-actions {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .action-btn {
    flex: 1;
    min-width: 80px;
  }
  
  .filter-card {
    margin: 0.5rem;
    border-radius: 12px;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .search-input,
  .filter-select {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .canasta-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-value {
    font-size: 0.9rem;
  }
  
  .detail-label {
    font-size: 0.75rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.canasta-card {
  animation: fadeInUp 0.6s ease forwards;
}

.canasta-card:nth-child(even) {
  animation-delay: 0.1s;
}

.canasta-card:nth-child(odd) {
  animation-delay: 0.2s;
}
</style>

<style scoped>
.q-table {
  border-radius: 8px;
}
</style>