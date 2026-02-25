<template>
  <q-page class="modern-page">
    <div class="page-container">
      <!-- Header -->
      <div class="modern-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <q-icon name="input" class="title-icon" />
              Entradas de Producción
            </h1>
            <p class="page-subtitle">
              Registra y gestiona las entradas de producción de huevos
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
              label="Nueva Entrada"
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
                <q-icon name="egg" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalEntradas }}</div>
                <div class="kpi-label">Total Entradas</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-success">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="trending_up" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ totalUnidades }}</div>
                <div class="kpi-label">Unidades Totales</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-warning">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="today" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ entradasHoy }}</div>
                <div class="kpi-label">Entradas Hoy</div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="kpi-card kpi-analytics">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon name="analytics" size="2rem" />
              </div>
              <div class="kpi-info">
                <div class="kpi-value">{{ promedioUnidades }}</div>
                <div class="kpi-label">Promedio/Entrada</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Calendario de Producción -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="calendar_month" class="q-mr-sm" />
            Calendario de Producción
          </div>
          <div class="text-caption text-grey-6 q-mb-md">
            Visualiza la producción diaria de huevos
          </div>
          <CalendarioFinanciero
            :datos="datosCalendarioFormateados"
            :mostrar-ingresos="false"
            :mostrar-gastos="false"
            :mostrar-produccion="true"
            @cambio-mes="onCambioMes"
          />
        </q-card-section>
      </q-card>

      <!-- Filters -->
      <q-card class="filter-card">
        <q-card-section class="filter-section">
          <div class="filter-content">
            <q-input
              v-model="filter.search"
              placeholder="Buscar entradas..."
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
              @click="fetchEntradas"
              unelevated
              class="refresh-btn"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Vista de Tarjetas -->
      <div v-if="isCardsView && filteredEntradas.length > 0" class="entradas-grid">
        <q-card 
          v-for="entrada in filteredEntradas" 
          :key="entrada.id" 
          class="entrada-card"
        >
          <q-card-section class="entrada-header">
            <div class="entrada-info">
              <div class="entrada-title">
                <q-icon name="input" class="entrada-icon" />
                {{ entrada.galpon?.nombre || 'Todos los galpones' }}
              </div>
              <div class="entrada-date">
                {{ formatDate(entrada.fecha) }}
              </div>
            </div>
            <q-badge 
              :color="getStatusColor(entrada.fecha)" 
              :label="getStatusLabel(entrada.fecha)"
              class="status-badge"
            />
          </q-card-section>

          <q-card-section class="entrada-content">
            <div class="entrada-details">
              <div class="detail-item">
                <q-icon name="category" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Tipo de Huevo</div>
                  <div class="detail-value">{{ entrada.tipoHuevo?.nombre || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <q-icon name="inventory" class="detail-icon" />
                <div class="detail-info">
                  <div class="detail-label">Unidades</div>
                  <div class="detail-value units-value">{{ entrada.unidades }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="entrada-actions">
            <q-btn
              flat
              color="primary"
              icon="edit"
              label="Editar"
              @click="openDialog(entrada)"
              class="action-btn-small"
            />
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Eliminar"
              @click="confirmDelete(entrada)"
              class="action-btn-small"
            />
          </q-card-actions>
        </q-card>
      </div>
      
      <!-- Vista de Tabla -->
      <q-card v-else-if="isTableView && filteredEntradas.length > 0" class="q-mt-md">
        <q-table
          :rows="filteredEntradas"
          :columns="tableColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-galpon="props">
            <q-td :props="props">
              {{ props.row.galpon?.nombre || 'Todos los galpones' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-tipoHuevo="props">
            <q-td :props="props">
              {{ props.row.tipoHuevo?.nombre || 'N/A' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.fecha)"
                text-color="white"
                :label="getStatusLabel(props.row.fecha)"
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
        <q-icon name="input" size="4rem" color="grey-4" />
        <h3 class="empty-title">No hay entradas registradas</h3>
        <p class="empty-subtitle">Comienza registrando tu primera entrada de producción</p>
        <q-btn
          color="primary"
          icon="add"
          label="Nueva Entrada"
          @click="openDialog()"
          unelevated
          rounded
          class="empty-action"
        />
      </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog-responsive">
        <q-card-section>
          <div class="text-h6">
            {{ editingEntrada ? 'Editar Entrada' : 'Nueva Entrada' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveEntrada" class="q-gutter-md">
            <q-select
              v-model="form.galponId"
              :options="galponOptions"
              option-value="value"
              option-label="label"
              label="Galpón"
              outlined
              dense
              emit-value
              map-options
              hint="Opcional: Seleccione para filtrar por galpón específico"
            />

            <q-input
              v-model="form.fecha"
              label="Fecha *"
              outlined
              type="date"
              :rules="[(val: string) => !!val || 'La fecha es requerida']"
            />

            <div class="text-subtitle2 q-mt-md q-mb-sm">Unidades por tipo de huevo:</div>
            <div class="q-gutter-md">
              <div 
                v-for="(entrada, index) in form.entradas" 
                :key="entrada.tipoHuevoId"
                class="row items-end q-gutter-md"
              >
                <div class="col">
                  <q-input
                    :model-value="getTipoHuevoNombre(entrada.tipoHuevoId)"
                    label="Tipo de huevo"
                    outlined
                    dense
                    readonly
                  />
                </div>
                <div class="col">
                   <q-input
                     v-model.number="form.entradas[index]!.unidades"
                     label="Unidades"
                     outlined
                     dense
                     type="number"
                     min="0"
                   />
                 </div>
              </div>
            </div>

            <!-- Total de huevos -->
            <div class="q-mt-md q-pa-md bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-primary">
                <q-icon name="egg" class="q-mr-sm" />
                Total de huevos: {{ totalHuevos }}
              </div>
            </div>

            <div class="row q-gutter-sm justify-end q-mt-md">
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
import { useEntradasProduccionStore } from 'src/stores/entradas-produccion';
import { useGalponesStore } from 'src/stores/galpones';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useQuasar } from 'quasar';
import { useViewMode } from 'src/composables/useViewMode';
import ViewModeToggle from 'src/components/ViewModeToggle.vue';
import CalendarioFinanciero from 'src/components/CalendarioFinanciero.vue';
import { api } from 'src/boot/axios';

interface Galpon {
  id: string;
  nombre: string;
}

interface TipoHuevo {
  id: string;
  nombre: string;
}

interface EntradaProduccion {
  id: string;
  galponId: string;
  fecha: string;
  tipoHuevoId: string;
  unidades: number;
  createdAt: string;
  updatedAt: string;
  galpon?: Galpon;
  tipoHuevo?: TipoHuevo;
}

const $q = useQuasar();
const entradasStore = useEntradasProduccionStore();
const galponesStore = useGalponesStore();
const tiposHuevoStore = useTiposHuevoStore();
const { viewMode, setViewMode, isCardsView, isTableView } = useViewMode();

const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editingEntrada = ref<EntradaProduccion | null>(null);

const filter = ref({
  search: ''
});

// Variables para el calendario
const datosCalendarioFormateados = ref<Record<string, { produccion: number }>>({});

const form = ref({
  galponId: '',
  fecha: new Date().toISOString().split('T')[0],
  entradas: [] as { tipoHuevoId: string; unidades: number }[]
});

const initializeEntradas = () => {
  form.value.entradas = tiposHuevoStore.tiposHuevo
    .filter(t => t.activo)
    .map(tipo => ({
      tipoHuevoId: tipo.id,
      unidades: 0
    }));
};

const tableColumns = [
  {
    name: 'fecha',
    required: true,
    label: 'Fecha',
    align: 'left' as const,
    field: 'fecha',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'galpon',
    required: true,
    label: 'Galpón',
    align: 'left' as const,
    field: 'galpon',
    sortable: true
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
    name: 'unidades',
    required: true,
    label: 'Unidades',
    align: 'center' as const,
    field: 'unidades',
    sortable: true
  },
  {
    name: 'estado',
    required: true,
    label: 'Estado',
    align: 'center' as const,
    field: 'fecha',
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

const galponOptions = computed(() => {
  const options = galponesStore.galpones
    .filter(g => g.activo)
    .map(galpon => ({
      label: galpon.nombre,
      value: galpon.id
    }));
    
  return [
    { label: 'Todos los galpones (Producción Global)', value: '' },
    ...options
  ];
});

// Removed tipoHuevoOptions as it's no longer used in the new form structure



const filteredEntradas = computed(() => {
  let result = entradasStore.entradasProduccion;

  if (filter.value.search) {
    const search = filter.value.search.toLowerCase();
    result = result.filter(entrada => 
      entrada.galpon?.nombre.toLowerCase().includes(search) ||
      entrada.tipoHuevo?.nombre.toLowerCase().includes(search)
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

// KPI Computed Properties
const totalEntradas = computed(() => {
  return entradasStore.entradasProduccion.length;
});

const totalUnidades = computed(() => {
  return entradasStore.entradasProduccion.reduce((sum, entrada) => sum + entrada.unidades, 0);
});

const entradasHoy = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return entradasStore.entradasProduccion.filter(entrada => 
    entrada.fecha.split('T')[0] === today
  ).length;
});

const promedioUnidades = computed(() => {
  const total = totalEntradas.value;
  if (total === 0) return 0;
  return Math.round(totalUnidades.value / total);
});

// Total de huevos en el formulario actual
const totalHuevos = computed(() => {
  return form.value.entradas.reduce((sum, entrada) => sum + (entrada.unidades || 0), 0);
});

// Status functions
const getStatusColor = (fecha: string) => {
  const entryDate = new Date(fecha);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'positive';
  if (diffDays <= 7) return 'warning';
  return 'grey';
};

const getStatusLabel = (fecha: string) => {
  const entryDate = new Date(fecha);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays <= 7) return `${diffDays} días`;
  return 'Antigua';
};

const getTipoHuevoNombre = (tipoHuevoId: string) => {
  const tipo = tiposHuevoStore.tiposHuevo.find(t => t.id === tipoHuevoId);
  return tipo?.nombre || 'N/A';
};

const fetchEntradas = async () => {
  loading.value = true;
  try {
    await entradasStore.fetchEntradasProduccion();
    // Regenerar datos del calendario después de cargar entradas
    const ahora = new Date();
    void cargarDatosCalendario(ahora.getMonth(), ahora.getFullYear());
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las entradas de producción'
    });
  } finally {
    loading.value = false;
  }
};

const openDialog = (entrada: EntradaProduccion | null = null) => {
  editingEntrada.value = entrada;
  initializeEntradas();
  
  if (entrada) {
    form.value.galponId = entrada.galponId;
    form.value.fecha = entrada.fecha.split('T')[0];
    // Para edición individual, solo establecer las unidades del tipo específico
     const entradaIndex = form.value.entradas.findIndex(e => e.tipoHuevoId === entrada.tipoHuevoId);
     if (entradaIndex !== -1) {
       form.value.entradas[entradaIndex]!.unidades = entrada.unidades;
     }
  } else {
    form.value.galponId = '';
    form.value.fecha = new Date().toISOString().split('T')[0];
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingEntrada.value = null;
  form.value = {
    galponId: '',
    fecha: new Date().toISOString().split('T')[0],
    entradas: []
  };
};

const saveEntrada = async () => {
  saving.value = true;
  try {
    const fecha = form.value.fecha || new Date().toISOString().split('T')[0];
    
    if (editingEntrada.value) {
      // Para edición, usar el método individual existente
      const entradaConUnidades = form.value.entradas.find(e => e.unidades > 0);
      if (!entradaConUnidades) {
        $q.notify({
          type: 'warning',
          message: 'Debe especificar al menos una cantidad mayor a 0'
        });
        return;
      }
      
      const formData = {
        galponId: form.value.galponId,
        fecha: fecha as string,
        tipoHuevoId: entradaConUnidades.tipoHuevoId,
        unidades: entradaConUnidades.unidades
      };
      
      await entradasStore.updateEntradaProduccion(editingEntrada.value.id, formData);
      $q.notify({
        type: 'positive',
        message: 'Entrada actualizada correctamente'
      });
    } else {
      // Para creación, usar el método masivo
      const entradasValidas = form.value.entradas.filter(e => e.unidades > 0);
      
      if (entradasValidas.length === 0) {
        $q.notify({
          type: 'warning',
          message: 'Debe especificar al menos una cantidad mayor a 0'
        });
        return;
      }
      
      const formData = {
        galponId: form.value.galponId,
        fecha: fecha as string,
        entradas: entradasValidas
      };
      
      await entradasStore.createEntradasMasivas(formData);
      $q.notify({
        type: 'positive',
        message: `${entradasValidas.length} entrada(s) creada(s) correctamente`
      });
    }
    closeDialog();
    await fetchEntradas();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la entrada'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (entrada: EntradaProduccion) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar esta entrada de producción?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await entradasStore.deleteEntradaProduccion(entrada.id);
        $q.notify({
          type: 'positive',
          message: 'Entrada eliminada correctamente'
        });
        await fetchEntradas();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al eliminar la entrada'
        });
      }
    })();
  });
};

// Funciones del calendario
const cargarDatosCalendario = async (mes?: number, año?: number) => {
  const fechaActual = new Date();
  const mesCalendario = mes ?? fechaActual.getMonth();
  const añoCalendario = año ?? fechaActual.getFullYear();
  
  try {
    // Usar el mes directamente como viene del calendario (0-11)
    const fechaInicio = new Date(añoCalendario, mesCalendario, 1);
    const fechaFin = new Date(añoCalendario, mesCalendario + 1, 0);
    
    const response = await api.get('/finanzas/datos-diarios', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0]
      }
    });
    
    // Asegurar que los datos se actualicen correctamente
    datosCalendarioFormateados.value = { ...response.data };
  } catch (error) {
    console.error('Error cargando datos del calendario:', error);
    
    // Mostrar mensaje informativo al usuario
    if ((error as Error & { code?: string })?.code === 'ECONNABORTED') {
      console.warn('Timeout al cargar datos del servidor, usando datos locales');
    } else {
      console.warn('Error de conexión, usando datos locales disponibles');
    }
    
    // Fallback a datos locales en caso de error
    generarDatosCalendarioLocal(mesCalendario, añoCalendario);
  }
};

const generarDatosCalendarioLocal = (mes: number, año: number) => {
  const entradasDelMes = entradasStore.entradasProduccion.filter(entrada => {
    const fechaEntrada = new Date(entrada.fecha);
    return fechaEntrada.getMonth() === mes && fechaEntrada.getFullYear() === año;
  });

  const datosAgrupados = entradasDelMes.reduce((acc, entrada) => {
    if (!entrada.fecha) return acc;
    const fecha = entrada.fecha.split('T')[0];
    if (!fecha) return acc;
    if (!acc[fecha]) {
      acc[fecha] = {
        produccion: 0
      };
    }
    acc[fecha].produccion += entrada.unidades || 0;
    return acc;
  }, {} as Record<string, { produccion: number }>);

  // Forzar reactividad usando spread operator
  datosCalendarioFormateados.value = { ...datosAgrupados };
};

const onCambioMes = (mes: number, año: number) => {
  void cargarDatosCalendario(mes, año);
};

onMounted(async () => {
  await fetchEntradas();
  await galponesStore.fetchGalpones();
  await tiposHuevoStore.fetchTiposHuevo();
  initializeEntradas();
  
  // Cargar datos iniciales del calendario para el mes actual
  await cargarDatosCalendario();
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  font-size: 3rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

.action-btn {
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

/* KPI Section */
.kpi-section {
  margin: 1rem 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.kpi-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kpi-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.kpi-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.kpi-analytics {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.kpi-content {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-icon {
  opacity: 0.9;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Filter Card */
.filter-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-section {
  padding: 1.5rem;
}

.filter-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
}

.refresh-btn {
  padding: 8px 20px;
  font-weight: 600;
}

/* Entradas Grid */
.entradas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.entrada-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
}

.entrada-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.entrada-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e9ecef;
}

.entrada-info {
  flex: 1;
}

.entrada-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.entrada-icon {
  color: #667eea;
}

.entrada-date {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.status-badge {
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
}

.entrada-content {
  padding: 1.5rem;
}

.entrada-details {
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
  border-left: 4px solid #667eea;
}

.detail-icon {
  color: #667eea;
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

.units-value {
  color: #28a745;
  font-size: 1.3rem;
}

.entrada-actions {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn-small {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn-small:hover {
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #6c757d;
  margin: 1rem 0 0.5rem 0;
}

.empty-subtitle {
  color: #adb5bd;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.empty-action {
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .entradas-grid {
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
  
  .modern-header {
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
    padding: 0;
  }
  
  .kpi-content {
    padding: 0.75rem;
  }
  
  .kpi-value {
    font-size: 1.5rem;
  }
  
  .kpi-label {
    font-size: 0.8rem;
  }
  
  .entradas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0.5rem;
  }
  
  .entrada-card {
    margin-bottom: 0;
  }
  
  .entrada-header {
    padding: 1rem;
  }
  
  .entrada-content {
    padding: 1rem;
  }
  
  .entrada-actions {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .action-btn-small {
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
  
  .entrada-header {
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
  
  .units-value {
    font-size: 1.1rem;
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

.entrada-card {
  animation: fadeInUp 0.5s ease-out;
}

.kpi-card {
  animation: fadeInUp 0.5s ease-out;
}
</style>

<style scoped>
.q-table {
  border-radius: 8px;
}
</style>