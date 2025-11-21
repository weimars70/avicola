<template>
  <q-page class="modern-page">
    <div class="page-container">
      <!-- Header -->
      <div class="modern-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <q-icon name="output" class="title-icon" />
              Salidas
            </h1>
            <p class="page-subtitle">
              Registra y gestiona las salidas de huevos
            </p>
          </div>
          <div class="row q-gutter-md items-center">
            <ViewModeToggle
              :view-mode="viewMode"
              @update:view-mode="setViewMode"
            />
            <q-btn
              class="action-btn"
              color="primary"
              icon="add"
              label="Nueva Salida"
              @click="openDialog()"
              unelevated
              rounded
            />
          </div>
        </div>
      </div>

      <!-- KPIs Section -->
      <div class="kpi-section">
        <div class="kpi-grid">
          <q-card class="kpi-card kpi-primary">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="output" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalSalidas }}</div>
                <div class="kpi-label">Total Salidas</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-success">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="trending_down" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalUnidades }}</div>
                <div class="kpi-label">Unidades Vendidas</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-warning">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="today" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ salidasHoy }}</div>
                <div class="kpi-label">Salidas Hoy</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-info">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="analytics" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ promedioUnidades }}</div>
                <div class="kpi-label">Promedio/Salida</div>
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
              v-model="filter.search"
              placeholder="Buscar salidas..."
              class="search-input"
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              icon="refresh"
              label="Actualizar"
              @click="fetchSalidas"
              unelevated
              class="refresh-btn"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Vista de Tarjetas -->
      <div v-if="isCardsView && filteredSalidas.length > 0" class="salidas-grid">
        <q-card 
          v-for="salida in filteredSalidas" 
          :key="salida.id" 
          class="salida-card"
        >
          <q-card-section class="salida-header">
            <div class="salida-info">
              <div class="salida-title">
                <q-icon name="output" class="salida-icon" />
                Salida #{{ salida.id.slice(-6) }}
              </div>
              <div class="salida-date">
                {{ formatDate(salida.createdAt) }}
              </div>
            </div>
            <q-badge 
              :color="getStatusColor(salida.createdAt)" 
              :label="getStatusLabel(salida.createdAt)"
              class="status-badge"
            />
          </q-card-section>

          <q-card-section class="salida-content">
            <div class="salida-details">
              <div class="detail-item">
                <q-icon name="category" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Tipo de Huevo</div>
                  <div class="detail-value">{{ salida.tipoHuevo?.nombre || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <q-icon name="shopping_basket" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Tipo de Canasta</div>
                  <div class="detail-value">{{ salida.canasta?.nombre || 'N/A' }}</div>
                </div>
              </div>

              <div class="detail-item">
                <q-icon name="inventory_2" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Unidades</div>
                  <div class="detail-value units-value">{{ salida.unidades }}</div>
                </div>
              </div>

              <div class="detail-item">
                <q-icon name="person" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Comprador</div>
                  <div class="detail-value">{{ salida.nombreComprador || 'Sin especificar' }}</div>
                </div>
              </div>

              <div v-if="salida.valor && salida.valor > 0" class="detail-item">
                <q-icon name="attach_money" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Valor</div>
                  <div class="detail-value">${{ typeof salida.valor === 'number' ? salida.valor.toFixed(2) : parseFloat(salida.valor || '0').toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="salida-actions">
            <q-btn
              flat
              color="primary"
              icon="edit"
              label="Editar"
              @click="openDialog(salida)"
              class="action-btn-small"
            />
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Eliminar"
              @click="confirmDelete(salida)"
              class="action-btn-small"
            />
          </q-card-actions>
        </q-card>
      </div>
      
      <!-- Vista de Tabla -->
      <q-card v-else-if="isTableView && filteredSalidas.length > 0" class="q-mt-md">
        <q-table
          :rows="filteredSalidas"
          :columns="tableColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              #{{ props.row.id.slice(-6) }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-tipoHuevo="props">
            <q-td :props="props">
              {{ props.row.tipoHuevo?.nombre || 'N/A' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-canasta="props">
            <q-td :props="props">
              {{ props.row.canasta?.nombre || 'N/A' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-nombreComprador="props">
            <q-td :props="props">
              {{ props.row.nombreComprador || 'Sin especificar' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.createdAt)"
                text-color="white"
                :label="getStatusLabel(props.row.createdAt)"
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
        <q-icon name="output" size="4rem" color="grey-4" />
        <h3 class="empty-title">No hay salidas registradas</h3>
        <p class="empty-subtitle">Comienza registrando tu primera salida de huevos</p>
        <q-btn
          color="primary"
          icon="add"
          label="Nueva Salida"
          @click="openDialog()"
          unelevated
          rounded
          class="empty-action"
        />
      </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingSalida ? 'Editar Salida' : 'Nueva Salida' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveSalida" class="q-gutter-md">
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

            <q-select
              v-model="form.canastaId"
              :options="canastasOptions"
              option-value="value"
              option-label="label"
              label="Tipo de canasta *"
              outlined
              dense
              emit-value
              map-options
              :rules="[
                (val: string) => !!val || 'El tipo de canasta es requerido'
              ]"
            />

            <q-input
              v-model.number="form.unidades"
              label="Unidades *"
              outlined
              type="number"
              min="1"
              suffix="unidades"
              :rules="[(val: number) => val > 0 || 'Las unidades deben ser mayor a 0']"
            />

            <q-input
              v-model.number="form.valor"
              label="Valor (opcional)"
              outlined
              type="number"
              min="0"
              step="0.01"
              prefix="$"
              placeholder="0.00"
            />
            <div v-if="form.valor && form.unidades" class="text-caption text-right q-mb-sm">
              Valor total: ${{ (form.valor * form.unidades).toFixed(2) }}
            </div>

            <q-input
              v-model="form.fecha"
              label="Fecha *"
              outlined
              type="date"
              :rules="[
                (val: string) => !!val || 'La fecha es requerida'
              ]"
            />

            <q-input
              v-model="form.nombreComprador"
              label="Nombre del comprador (opcional)"
              outlined
              dense
              clearable
              placeholder="Ingrese el nombre del comprador"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useSalidasStore } from 'src/stores/salidas';
import type { CreateSalidaDto, UpdateSalidaDto } from 'src/stores/salidas';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useCanastasStore } from 'src/stores/canastas';
import { useQuasar } from 'quasar';
import { useViewMode } from 'src/composables/useViewMode';
import ViewModeToggle from 'src/components/ViewModeToggle.vue';

interface TipoHuevo {
  id: string;
  nombre: string;
}

interface Canasta {
  id: string;
  nombre: string;
}

interface Salida {
  id: string;
  tipoHuevoId: string;
  canastaId?: string | null | undefined; // Actualizar para permitir null y undefined
  unidades: number;
  valor?: number;
  fecha?: string;
  createdAt: string;
  updatedAt: string;
  tipoHuevo?: TipoHuevo;
  canasta?: Canasta;
  nombreComprador?: string;
}

const $q = useQuasar();
const salidasStore = useSalidasStore();
const tiposHuevoStore = useTiposHuevoStore();
const canastasStore = useCanastasStore();
const { viewMode, setViewMode, isCardsView, isTableView } = useViewMode();

const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editingSalida = ref<Salida | null>(null);

const filter = ref({
  search: ''
});

interface FormularioSalida {
  tipoHuevoId: string;
  canastaId: string | null; // Permitir null
  unidades: number;
  valor?: number;
  fecha: string;
  nombreComprador?: string;
}

const form = ref<FormularioSalida>({
  tipoHuevoId: '',
  canastaId: null, // Cambiar a null por defecto
  unidades: 0,
  valor: 0,
  fecha: new Date().toISOString().split('T')[0] || '', // Fecha actual por defecto
  nombreComprador: ''
});

const tableColumns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left' as const,
    field: 'id',
    sortable: true
  },
  {
    name: 'fecha',
    required: true,
    label: 'Fecha',
    align: 'left' as const,
    field: 'createdAt',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'tipoHuevo',
    required: true,
    label: 'Tipo de Huevo',
    align: 'left' as const,
    field: 'tipoHuevo',
    sortable: true
  },
  {
    name: 'canasta',
    required: true,
    label: 'Canasta',
    align: 'left' as const,
    field: 'canasta',
    sortable: true
  },
  {
    name: 'unidades',
    required: true,
    label: 'Unidades',
    align: 'center' as const,
    field: 'unidades',
    sortable: true
  },
  {
    name: 'nombreComprador',
    required: false,
    label: 'Comprador',
    align: 'left' as const,
    field: 'nombreComprador',
    sortable: true
  },
  {
    name: 'valor',
    required: false,
    label: 'Valor ($)',
    align: 'right' as const,
    field: 'valor',
    sortable: true
  },
  {
    name: 'estado',
    required: true,
    label: 'Estado',
    align: 'center' as const,
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'acciones',
    required: true,
    label: 'Acciones',
    align: 'center' as const,
    field: 'acciones',
    sortable: false
  }
];

const tipoHuevoOptions = computed(() => {
  return tiposHuevoStore.tiposHuevo
    .filter(t => t.activo)
    .map(tipo => ({
      label: tipo.nombre,
      value: tipo.id
    }));
});

const canastasOptions = computed(() => {
  console.log('Canastas disponibles:', canastasStore.canastas);
  let canastas = canastasStore.canastas.filter(canasta => canasta.activo);
  
  // Filtrar canastas por tipo de huevo seleccionado
  if (form.value.tipoHuevoId) {
    canastas = canastas.filter(canasta => canasta.tipoHuevoId === form.value.tipoHuevoId);
  }
  
  const options = canastas.map(canasta => ({
    label: `${canasta.nombre} (${canasta.unidadesPorCanasta} unidades)`,
    value: canasta.id
  }));
  console.log('Opciones de canastas generadas:', options);
  return options;
});



const filteredSalidas = computed(() => {
  let result = salidasStore.salidas;

  if (filter.value.search) {
    const search = filter.value.search.toLowerCase();
    result = result.filter(salida => 
      salida.tipoHuevo?.nombre.toLowerCase().includes(search) ||
      salida.canasta?.nombre.toLowerCase().includes(search)
    );
  }

  return result;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Ajustar por zona horaria para evitar problemas de conversión
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjustedDate.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Computed properties para KPIs
const totalSalidas = computed(() => {
  return salidasStore.salidas.length;
});

const totalUnidades = computed(() => {
  return salidasStore.salidas.reduce((total, salida) => total + salida.unidades, 0);
});

const salidasHoy = computed(() => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  return salidasStore.salidas.filter(salida => {
    const salidaDate = new Date(salida.createdAt);
    const salidaStr = salidaDate.toISOString().split('T')[0]; // YYYY-MM-DD
    return salidaStr === todayStr;
  }).length;
});

const promedioUnidades = computed(() => {
  if (salidasStore.salidas.length === 0) return 0;
  return Math.round(totalUnidades.value / salidasStore.salidas.length);
});

// Funciones auxiliares de estado
const getStatusColor = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();
  
  // Comparar solo las fechas (sin hora) para evitar problemas de zona horaria
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  
  if (!dateStr || !todayStr) return 'grey';
  
  // Crear fechas después de validar que no son undefined
  const validDateStr = dateStr;
  const validTodayStr = todayStr;
  const dateObj = new Date(validDateStr);
  const todayObj = new Date(validTodayStr);
  const diffTime = todayObj.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'positive';
  if (diffDays <= 7) return 'warning';
  return 'grey';
};

const getStatusLabel = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();
  
  // Comparar solo las fechas (sin hora) para evitar problemas de zona horaria
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  
  if (!dateStr || !todayStr) return 'Fecha inválida';
  
  // Crear fechas después de validar que no son undefined
  const validDateStr = dateStr;
  const validTodayStr = todayStr;
  const dateObj = new Date(validDateStr);
  const todayObj = new Date(validTodayStr);
  const diffTime = todayObj.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays <= 7) return `${diffDays} días`;
  return 'Antigua';
};

const fetchSalidas = async () => {
  loading.value = true;
  try {
    await salidasStore.fetchSalidas();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las salidas'
    });
  } finally {
    loading.value = false;
  }
};

const openDialog = (salida: Salida | null = null) => {
  editingSalida.value = salida;
  if (salida) {
    // Al editar, usar la fecha original de la salida
    const fechaOriginal = salida.fecha || salida.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    form.value = {
      tipoHuevoId: salida.tipoHuevoId,
      canastaId: salida.canastaId || null, // Usar null en lugar de string vacío para consistencia
      unidades: salida.unidades,
      valor: salida.valor || 0,
      fecha: fechaOriginal || '',
      nombreComprador: salida.nombreComprador || ''
    };
  } else {
    // Al crear nueva salida, usar fecha actual
    const today = new Date().toISOString().split('T')[0];
    form.value = {
      tipoHuevoId: '',
      canastaId: null, // Usar null en lugar de string vacío para consistencia
      unidades: 0,
      valor: 0,
      fecha: today || '',
      nombreComprador: ''
    };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingSalida.value = null;
  const today = new Date().toISOString().split('T')[0];
  form.value = {
    tipoHuevoId: '',
    canastaId: '',
    unidades: 0,
    valor: 0,
    fecha: today || '',
    nombreComprador: ''
  };
};

const saveSalida = async () => {
  // Validar campos requeridos
  if (!form.value.tipoHuevoId) {
    $q.notify({
      type: 'negative',
      message: 'Debe seleccionar un tipo de huevo'
    });
    return;
  }
  
  if (!form.value.fecha) {
    $q.notify({
      type: 'negative',
      message: 'Debe seleccionar una fecha'
    });
    return;
  }
  
  if (form.value.unidades <= 0) {
    $q.notify({
      type: 'negative',
      message: 'Las unidades deben ser mayor a 0'
    });
    return;
  }

  saving.value = true;
  try {
    if (editingSalida.value) {
      // Para actualización, usar UpdateSalidaDto
      const updateData: UpdateSalidaDto = {
        tipoHuevoId: form.value.tipoHuevoId,
        canastaId: form.value.canastaId || null,
        unidades: parseInt(String(form.value.unidades), 10),
        fecha: form.value.fecha,
      };

      // Solo incluir campos opcionales si tienen valores válidos
      // Enviar el valor total (precio por canasta * unidades) para mantener consistencia con el backend
      const unidadesNum = parseInt(String(form.value.unidades), 10);
      if (form.value.valor && unidadesNum > 0) {
        updateData.valor = parseFloat(String(form.value.valor)) * unidadesNum;
      }
      
      if (form.value.nombreComprador && form.value.nombreComprador.trim()) {
        updateData.nombreComprador = form.value.nombreComprador.trim();
      }

      await salidasStore.updateSalida(editingSalida.value.id, updateData);
      $q.notify({
        type: 'positive',
        message: 'Salida actualizada correctamente'
      });
    } else {
      // Para creación, usar CreateSalidaDto
      const createData: CreateSalidaDto = {
        tipoHuevoId: form.value.tipoHuevoId,
        unidades: parseInt(String(form.value.unidades), 10),
        fecha: form.value.fecha,
      };

      // Solo incluir campos opcionales si tienen valores válidos
      if (form.value.canastaId) {
        createData.canastaId = form.value.canastaId;
      }
      
      if (form.value.valor && form.value.valor > 0 && form.value.unidades > 0) {
        // Guardar el total (precio por canasta * unidades)
        createData.valor = parseFloat(String(form.value.valor)) * parseInt(String(form.value.unidades), 10);
      }
      
      if (form.value.nombreComprador && form.value.nombreComprador.trim()) {
        createData.nombreComprador = form.value.nombreComprador.trim();
      }
      
      console.log('Datos a enviar:', createData);

      await salidasStore.createSalida(createData);
      $q.notify({
        type: 'positive',
        message: 'Salida creada correctamente'
      });
    }
    closeDialog();
    await fetchSalidas();
  } catch (error: unknown) {
    console.error('Error al guardar salida:', error);
    
    let errorMessage = 'Error al guardar la salida';
    
    // Type guard para verificar si es un error de Axios
    const isAxiosError = (err: unknown): err is { response?: { status?: number; data?: { message?: string | string[] } }; code?: string } => {
      return typeof err === 'object' && err !== null;
    };
    
    if (isAxiosError(error)) {
      // Manejo específico de errores 400 (Bad Request)
      if (error.response?.status === 400) {
        const validationErrors = error.response.data?.message;
        if (Array.isArray(validationErrors)) {
          errorMessage = `Error de validación: ${validationErrors.join(', ')}`;
        } else if (typeof validationErrors === 'string') {
          errorMessage = `Error de validación: ${validationErrors}`;
        } else {
          errorMessage = 'Error de validación en los datos enviados';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tiempo de espera agotado. Intente nuevamente';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'No se pudo conectar con el servidor';
      }
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (salida: Salida) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar esta salida?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await salidasStore.deleteSalida(salida.id);
        $q.notify({
          type: 'positive',
          message: 'Salida eliminada correctamente'
        });
        await fetchSalidas();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al eliminar la salida'
        });
      }
    })();
  });
};

// Limpiar canasta cuando cambie el tipo de huevo
watch(
  () => form.value.tipoHuevoId,
  (newTipoHuevoId, oldTipoHuevoId) => {
    if (newTipoHuevoId !== oldTipoHuevoId && form.value.canastaId) {
      // Verificar si la canasta actual es compatible con el nuevo tipo de huevo
      const canastaActual = canastasStore.canastas.find(c => c.id === form.value.canastaId);
      if (canastaActual && canastaActual.tipoHuevoId !== newTipoHuevoId) {
        form.value.canastaId = '';
        form.value.valor = 0;
      }
    }
  }
);

// Autocompletado del valor basado en la canasta seleccionada
watch(
  [() => form.value.tipoHuevoId, () => form.value.canastaId],
  ([tipoHuevoId, canastaId]) => {
    if (tipoHuevoId && canastaId) {
      // Buscar la canasta seleccionada
      const canasta = canastasStore.canastas.find(c => c.id === canastaId);
      
      if (canasta) {
        // Usar el valor real de la canasta guardado en la base de datos
        form.value.valor = canasta.valorCanasta;
      }
    }
  },
  { immediate: false }
);

// Asegurar que la fecha tenga un valor por defecto
watch(
  () => dialog.value,
  (newValue) => {
    if (newValue && !form.value.fecha) {
      const today = new Date().toISOString().split('T')[0];
      form.value.fecha = today || '';
    }
  }
);

onMounted(() => {
  void fetchSalidas();
  void tiposHuevoStore.fetchTiposHuevo();
  void canastasStore.fetchCanastas();
});
</script>

<style scoped>
/* Modern Page Styles */
.modern-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
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
  color: #1976d2;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.action-btn {
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
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

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--kpi-color), var(--kpi-color-light));
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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

.kpi-content {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
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
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Card */
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

.refresh-btn {
  padding: 8px 20px;
  font-weight: 600;
}

/* Salidas Grid */
.salidas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.salida-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
}

.salida-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.salida-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
}

.salida-info {
  flex: 1;
}

.salida-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.salida-icon {
  color: #1976d2;
  font-size: 1.2rem;
}

.salida-date {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.status-badge {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.salida-content {
  padding: 1rem 1.5rem;
}

.salida-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  flex-shrink: 0;
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
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.units-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1976d2;
}

.salida-actions {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn-small {
  padding: 6px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
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
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
}

.empty-action {
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
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
  
  .salidas-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
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

.salida-card {
  animation: fadeInUp 0.3s ease-out;
}

.kpi-card {
  animation: fadeInUp 0.3s ease-out;
}
</style>

<style scoped>
.q-table {
  border-radius: 8px;
}
</style>