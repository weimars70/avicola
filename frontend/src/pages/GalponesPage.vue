<template>
  <q-page class="q-pa-sm q-pa-md-lg fade-in">
    <div class="row q-gutter-sm q-gutter-md-lg">
      <!-- Header -->
      <div class="col-12">
        <div class="row items-start items-md-center justify-between q-gutter-sm">
          <div class="col-12 col-md">
            <div class="text-h5 text-md-h4 q-mb-sm">
              <q-icon name="home" class="q-mr-sm" style="color: #667eea;" />
              Gestión de Galpones
            </div>
            <div class="text-subtitle2 text-md-subtitle1 text-grey-7">
              Administra los galpones del sistema
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <div class="row q-gutter-sm q-gutter-md-md items-center justify-start justify-md-end">
              <ViewModeToggle 
                :view-mode="viewMode" 
                @update:view-mode="setViewMode" 
              />
              <q-btn
                color="primary"
                icon="add"
                :label="$q.screen.xs ? '' : 'Nuevo Galpón'"
                @click="openDialog()"
                :size="$q.screen.xs ? 'sm' : 'md'"
              >
                <q-tooltip v-if="$q.screen.xs">Nuevo Galpón</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="col-12">
        <q-card>
          <q-card-section class="q-pa-sm q-pa-md-md">
            <div class="row q-gutter-sm q-gutter-md-md items-end">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="filter.search"
                  placeholder="Buscar galpones..."
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  v-model="filter.activo"
                  :options="estadoOptions"
                  label="Estado"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-sm-12 col-md-auto">
                <q-btn
                  color="primary"
                  icon="search"
                  :label="$q.screen.xs ? '' : 'Buscar'"
                  @click="fetchGalpones"
                  :size="$q.screen.xs ? 'sm' : 'md'"
                  class="full-width full-width-sm"
                >
                  <q-tooltip v-if="$q.screen.xs">Buscar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Content Area -->
      <div class="col-12">
        <div v-if="loading" class="row justify-center q-pa-lg">
          <q-spinner-dots size="50px" color="primary" />
        </div>
        <div v-else-if="filteredGalpones.length === 0" class="row justify-center q-pa-lg">
          <div class="text-center text-grey-6">
            <q-icon name="search_off" size="4rem" class="q-mb-md" />
            <div class="text-h6">No se encontraron galpones</div>
            <div class="text-subtitle2">Intenta ajustar los filtros de búsqueda</div>
          </div>
        </div>
        
        <!-- Vista de Tarjetas -->
        <div v-else-if="isCardsView" class="row q-gutter-sm q-gutter-md-md fade-in">
          <div 
            v-for="galpon in filteredGalpones" 
            :key="galpon.id" 
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <q-card 
              :class="['galpon-card cursor-pointer fade-in', { 'galpon-card-selected': selectedGalpon?.id === galpon.id, 'galpon-inactive': !galpon.activo }]" 
              @click="selectGalpon(galpon)"
            >

              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-h6 text-primary">
                    <q-icon name="home" class="q-mr-sm" />
                    {{ galpon.nombre }}
                  </div>
                  <q-chip
                    :color="galpon.activo ? 'positive' : 'negative'"
                    text-color="white"
                    :label="galpon.activo ? 'Activo' : 'Inactivo'"
                    size="sm"
                  />
                </div>
                
                <div v-if="galpon.descripcion" class="text-body2 text-grey-7 q-mb-sm">
                  {{ galpon.descripcion }}
                </div>
                
                <!-- Métricas principales -->
                <div class="row q-gutter-sm q-mb-md">
                  <div class="col">
                    <div class="row items-center">
                      <q-icon name="groups" class="q-mr-xs text-blue-6" size="sm" />
                      <span class="text-body2 text-weight-medium">{{ galpon.capacidad || 0 }}</span>
                    </div>
                    <div class="text-caption text-grey-6">Capacidad</div>
                  </div>
                  <div class="col">
                    <div class="row items-center">
                      <q-icon name="pets" class="q-mr-xs text-orange-6" size="sm" />
                      <span class="text-body2 text-weight-medium">{{ galpon.gallinasActuales || 0 }}</span>
                    </div>
                    <div class="text-caption text-grey-6">Gallinas</div>
                  </div>
                </div>

                <!-- Barra de ocupación -->
                <div class="q-mb-md">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-caption text-grey-7">Ocupación</span>
                    <span class="text-caption text-weight-medium">{{ Math.round(((galpon.gallinasActuales || 0) / (galpon.capacidad || 1)) * 100) }}%</span>
                  </div>
                  <q-linear-progress
                    :value="(galpon.gallinasActuales || 0) / (galpon.capacidad || 1)"
                    :color="getOccupancyColor((galpon.gallinasActuales || 0) / (galpon.capacidad || 1))"
                    size="8px"
                    rounded
                    class="q-mb-sm"
                  />
                </div>

                <!-- Indicadores de estado -->
                <div class="row items-center justify-between">
                  <div class="row items-center">
                    <q-icon 
                      :name="galpon.activo ? 'check_circle' : 'cancel'" 
                      :color="galpon.activo ? 'positive' : 'negative'" 
                      size="sm" 
                      class="q-mr-xs"
                    />
                    <span class="text-caption">{{ galpon.activo ? 'Operativo' : 'Inactivo' }}</span>
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ formatDate(galpon.createdAt) }}
                  </div>
                </div>
              </q-card-section>
              
              <q-card-actions align="right">
                <q-btn
                  flat
                  round
                  color="blue"
                  icon="analytics"
                  size="sm"
                  @click.stop="selectGalpon(galpon)"
                >
                  <q-tooltip>Ver Detalles/Actividades</q-tooltip>
                </q-btn>



                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click.stop="openDialog(galpon)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="galpon.activo"
                  flat
                  round
                  color="orange"
                  icon="visibility_off"
                  size="sm"
                  @click.stop="confirmInactivate(galpon)"
                >
                  <q-tooltip>Inactivar</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  flat
                  round
                  color="positive"
                  icon="visibility"
                  size="sm"
                  @click.stop="confirmReactivate(galpon)"
                >
                  <q-tooltip>Reactivar</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        
        <!-- Vista de Tabla -->
        <q-card v-else class="q-mt-sm q-mt-md-md">
          <div class="table-container">
            <q-table
              :rows="filteredGalpones"
              :columns="tableColumns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: $q.screen.xs ? 5 : 10 }"
              :dense="$q.screen.xs"
              :grid="$q.screen.xs"
              :hide-header="$q.screen.xs"
            >
            <template v-slot:body-cell-gallinas="props">
              <q-td :props="props">
                <div class="row items-center justify-center">
                  <q-icon name="pets" class="q-mr-xs text-orange-6" size="sm" />
                  <span class="text-weight-medium">{{ props.row.gallinasActuales || 0 }}</span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-ocupacion="props">
              <q-td :props="props">
                <div class="column items-center" style="min-width: 80px;">
                  <div class="text-caption text-weight-medium q-mb-xs">
                    {{ Math.round(((props.row.gallinasActuales || 0) / (props.row.capacidad || 1)) * 100) }}%
                  </div>
                  <q-linear-progress
                    :value="(props.row.gallinasActuales || 0) / (props.row.capacidad || 1)"
                    :color="getOccupancyColor((props.row.gallinasActuales || 0) / (props.row.capacidad || 1))"
                    size="6px"
                    rounded
                    style="width: 60px;"
                  />
                </div>
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
                  color="blue"
                  icon="analytics"
                  size="sm"
                  @click="selectGalpon(props.row)"
                >
                  <q-tooltip>Ver Detalles</q-tooltip>
                </q-btn>



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
                  v-if="props.row.activo"
                  flat
                  round
                  color="orange"
                  icon="visibility_off"
                  size="sm"
                  @click="confirmInactivate(props.row)"
                >
                  <q-tooltip>Inactivar</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  flat
                  round
                  color="positive"
                  icon="visibility"
                  size="sm"
                  @click="confirmReactivate(props.row)"
                >
                  <q-tooltip>Reactivar</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            
            <!-- Template para vista grid en móviles -->
            <template v-slot:item="props" v-if="$q.screen.xs">
              <div class="q-pa-xs col-xs-12">
                <q-card class="galpon-mobile-card">
                  <q-card-section class="q-pa-sm">
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-subtitle2 text-weight-medium text-primary">
                        <q-icon name="home" class="q-mr-xs" size="sm" />
                        {{ props.row.nombre }}
                      </div>
                      <q-chip
                        :color="props.row.activo ? 'positive' : 'negative'"
                        text-color="white"
                        :label="props.row.activo ? 'Activo' : 'Inactivo'"
                        size="xs"
                      />
                    </div>
                    
                    <div v-if="props.row.descripcion" class="text-caption text-grey-7 q-mb-xs">
                      {{ props.row.descripcion }}
                    </div>
                    
                    <div class="row q-gutter-xs q-mb-xs">
                      <div class="col">
                        <div class="text-caption text-grey-6">Capacidad</div>
                        <div class="text-body2 text-weight-medium">{{ props.row.capacidad || 0 }}</div>
                      </div>
                      <div class="col">
                        <div class="text-caption text-grey-6">Gallinas</div>
                        <div class="text-body2 text-weight-medium">
                          <q-icon name="pets" class="q-mr-xs text-orange-6" size="xs" />
                          {{ props.row.gallinasActuales || 0 }}
                        </div>
                      </div>
                      <div class="col">
                        <div class="text-caption text-grey-6">Ocupación</div>
                        <div class="text-body2 text-weight-medium">
                          {{ Math.round(((props.row.gallinasActuales || 0) / (props.row.capacidad || 1)) * 100) }}%
                        </div>
                      </div>
                    </div>
                    
                    <q-linear-progress
                      :value="(props.row.gallinasActuales || 0) / (props.row.capacidad || 1)"
                      :color="getOccupancyColor((props.row.gallinasActuales || 0) / (props.row.capacidad || 1))"
                      size="4px"
                      rounded
                      class="q-mb-sm"
                    />
                    
                    <div class="row justify-end q-gutter-xs">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="edit"
                        size="xs"
                        @click="openDialog(props.row)"
                      >
                        <q-tooltip>Editar</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="props.row.activo"
                        flat
                        round
                        color="orange"
                        icon="visibility_off"
                        size="xs"
                        @click="confirmInactivate(props.row)"
                      >
                        <q-tooltip>Inactivar</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-else
                        flat
                        round
                        color="positive"
                        icon="visibility"
                        size="xs"
                        @click="confirmReactivate(props.row)"
                      >
                        <q-tooltip>Reactivar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
          </div>
        </q-card>
      </div>

      <!-- Sección de Novedades -->
      <div class="col-12" v-if="selectedGalpon">
        <NovedadesGalponSection 
          :galpon-id="selectedGalpon.id" 
          :galpon-nombre="selectedGalpon.nombre"
        />
      </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingGalpon ? 'Editar Galpón' : 'Nuevo Galpón' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveGalpon" class="q-gutter-md">
            <q-input
              v-model="form.nombre"
              label="Nombre *"
              outlined
              :rules="[val => !!val || 'El nombre es requerido']"
            />

            <q-input
              v-model="form.descripcion"
              label="Descripción"
              outlined
              type="textarea"
              rows="3"
            />

            <q-input
              v-model.number="form.capacidad"
              label="Capacidad *"
              outlined
              type="number"
              min="1"
              :rules="[val => val >= 1 || 'La capacidad debe ser mayor a 0']"
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
import { useGalponesStore } from 'src/stores/galpones';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar, date } from 'quasar';
import { useViewMode } from 'src/composables/useViewMode';
import ViewModeToggle from 'src/components/ViewModeToggle.vue';
import NovedadesGalponSection from 'src/components/galpones/NovedadesGalponSection.vue';


interface Galpon {
  id: string;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  gallinasActuales?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GalponForm {
  nombre: string;
  descripcion: string;
  capacidad: number;
  activo: boolean;
  id_empresa?: number;
}

const $q = useQuasar();
const galponesStore = useGalponesStore();
const authStore = useAuthStore();
const { viewMode, isCardsView, setViewMode } = useViewMode();

const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editingGalpon = ref<Galpon | null>(null);
const selectedGalpon = ref<Galpon | null>(null);


const filter = ref({
  search: '',
  activo: null
});

// Columnas para la vista de tabla
const tableColumns = [
  {
    name: 'nombre',
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
    name: 'capacidad',
    label: 'Capacidad',
    align: 'center' as const,
    field: 'capacidad',
    sortable: true
  },
  {
    name: 'gallinas',
    label: 'Gallinas Actuales',
    align: 'center' as const,
    field: 'gallinasActuales',
    sortable: true,
    format: (val: number) => val || 0
  },
  {
    name: 'ocupacion',
    label: 'Ocupación',
    align: 'center' as const,
    field: (row: Galpon) => Math.round(((row.gallinasActuales || 0) / (row.capacidad || 1)) * 100),
    sortable: true,
    format: (val: number) => `${val}%`
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
    label: 'Fecha Creación',
    align: 'center' as const,
    field: 'createdAt',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center' as const,
    field: 'id'
  }
];

const form = ref<GalponForm>({
  nombre: '',
  descripcion: '',
  capacidad: 1,
  activo: true
});



const estadoOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
];

const formatDate = (dateString: string) => {
  return date.formatDate(dateString, 'DD/MM/YYYY');
};

const filteredGalpones = computed(() => {
  let result = galponesStore.galpones;

  if (filter.value.search) {
    const search = filter.value.search.toLowerCase();
    result = result.filter(galpon => 
      galpon.nombre.toLowerCase().includes(search) ||
      galpon.descripcion?.toLowerCase().includes(search)
    );
  }

  if (filter.value.activo !== null) {
    result = result.filter(galpon => galpon.activo === filter.value.activo);
  }

  // Ordenar: activos primero, inactivos al final
  return result.sort((a, b) => {
    if (a.activo && !b.activo) return -1;
    if (!a.activo && b.activo) return 1;
    return a.nombre.localeCompare(b.nombre);
  });
});

// Función para obtener el color de la barra de ocupación
const getOccupancyColor = (percentage: number) => {
  if (percentage >= 0.9) return 'red-6';
  if (percentage >= 0.7) return 'orange-6';
  if (percentage >= 0.5) return 'yellow-6';
  return 'green-6';
};

const fetchGalpones = async () => {
  loading.value = true;
  try {
    await galponesStore.fetchGalpones(true); // Incluir galpones inactivos
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los galpones'
    });
  } finally {
    loading.value = false;
  }
};

const selectGalpon = (galpon: Galpon) => {
  selectedGalpon.value = galpon;
  // Desplazar suavemente a la sección de novedades
  setTimeout(() => {
    const el = document.querySelector('.novedades-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

const openDialog = (galpon: Galpon | null = null) => {
  editingGalpon.value = galpon;
  if (galpon) {
    selectedGalpon.value = galpon;
    form.value = {
      nombre: galpon.nombre,
      descripcion: galpon.descripcion || '',
      capacidad: galpon.capacidad || 1,
      activo: galpon.activo
    };
  } else {

    form.value = {
      nombre: '',
      descripcion: '',
      capacidad: 1,
      activo: true
    };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingGalpon.value = null;
  form.value = {
    nombre: '',
    descripcion: '',
    capacidad: 1,
    activo: true,
    id_empresa: Number(localStorage.getItem('id_empresa') )
  };
};

const saveGalpon = async () => {
  saving.value = true;
  try {
    if (editingGalpon.value) {
      // Para edición, incluir id_usuario_actualiza
      await galponesStore.updateGalpon(
        editingGalpon.value.id, 
        { 
          ...form.value,
          id_usuario_actualiza: authStore.id_usuario as string
        }
      );
      $q.notify({
        type: 'positive',
        message: 'Galpón actualizado correctamente'
      });
    } else {
      // Para creación, obtener id_empresa del localStorage para asegurar consistencia
      const id_empresa = Number(localStorage.getItem('id_empresa'));

      console.log('id_empresa:', id_empresa);
      
      // Verificar que id_usuario exista en localStorage
      const id_usuario = authStore.id_usuario as string;
      console.log('id_usuario:', id_usuario);
      
      if (!id_usuario) {
        throw new Error('No se encontró el ID de usuario en la sesión');
      }
      
      const galponData = {
        ...form.value,
        id_empresa: id_empresa,
        id_usuario_inserta: id_usuario
      };
      
      console.log('Datos enviados al crear galpón:', galponData);
      console.log('id_empresa usado:', id_empresa);
      console.log('authStore.id_usuario:', id_usuario);
      
      await galponesStore.createGalpon(galponData);
      $q.notify({
        type: 'positive',
        message: 'Galpón creado correctamente'
      });
    }
    closeDialog();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el galpón'
    });
  } finally {
    saving.value = false;
  }
};





const confirmInactivate = (galpon: Galpon) => {
  $q.dialog({
    title: 'Confirmar inactivación',
    message: `¿Está seguro de inactivar el galpón "${galpon.nombre}"? Podrá reactivarlo posteriormente.`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await galponesStore.inactivateGalpon(galpon.id);
        $q.notify({
          type: 'positive',
          message: 'Galpón inactivado correctamente'
        });
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al inactivar el galpón'
        });
      }
    })();
  });
};

const confirmReactivate = (galpon: Galpon) => {
  $q.dialog({
    title: 'Confirmar reactivación',
    message: `¿Está seguro de reactivar el galpón "${galpon.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await galponesStore.reactivateGalpon(galpon.id);
        $q.notify({
          type: 'positive',
          message: 'Galpón reactivado correctamente'
        });
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Error al reactivar el galpón'
        });
      }
    })();
  });
};

onMounted(() => {
  void fetchGalpones();
});
</script>

<style scoped>
/* Importar fuentes modernas */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

/* Estilos para las tarjetas de galpones */
.galpon-card {
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.galpon-card-selected {
  border: 2px solid #667eea !important;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2) !important;
  transform: translateY(-5px);
}

.galpon-inactive {

  opacity: 0.6;
  filter: grayscale(0.3);
  border: 2px dashed #ccc !important;
}

.galpon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  z-index: 1;
}

.galpon-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%);
}

.galpon-card .q-card__section {
  padding: 24px;
  position: relative;
  z-index: 2;
}

.galpon-card .q-card__actions {
  padding: 16px 24px 24px 24px;
  position: relative;
  z-index: 2;
}

/* Estilos para el header de la página */
.text-h4 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-subtitle1 {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

/* Estilos para los chips de estado */
.q-chip {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Estilos para botones modernos */
.q-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 12px;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.q-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Estilos para inputs modernos */
.q-input, .q-select {
  font-family: 'Inter', sans-serif;
}

.q-input .q-field__control, .q-select .q-field__control {
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Animaciones suaves */
.fade-in {
  animation: fadeInUp 0.6s ease-out;
}

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

/* Estilos para la tabla moderna */
.q-table {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.q-table thead tr:first-child th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.q-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

/* Efectos de hover para iconos */
.q-icon {
  transition: all 0.3s ease;
}

.q-btn:hover .q-icon {
  transform: scale(1.1);
}

/* Estilos para cards de filtros */
.q-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Gradientes para diferentes estados */
.status-active {
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
}

.status-inactive {
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
}

/* Estilos para galpones inactivos */
.galpon-inactive {
  opacity: 0.6;
  filter: grayscale(0.3);
  order: 999; /* Mover al final */
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.galpon-inactive .q-card {
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%) !important;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.galpon-inactive:hover {
  opacity: 0.8;
  transform: scale(0.98);
}

/* Efectos de partículas decorativas */
.galpon-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.galpon-card:hover::after {
  opacity: 1;
}

.galpon-inactive::after {
  background: radial-gradient(circle, rgba(158, 158, 158, 0.05) 0%, transparent 70%) !important;
}

/* Estilos responsivos adicionales */
@media (max-width: 599px) {
  .q-page {
    padding: 8px !important;
  }
  
  .text-h5 {
    font-size: 1.25rem !important;
    line-height: 1.4 !important;
  }
  
  .galpon-card {
    margin-bottom: 8px;
  }
  
  .q-card-section {
    padding: 12px !important;
  }
  
  .q-gutter-sm > * {
    margin-left: 4px !important;
    margin-top: 4px !important;
  }
  
  .full-width-sm {
    width: 100% !important;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .q-page {
    padding: 16px !important;
  }
}

@media (min-width: 1024px) {
  .q-page {
    padding: 24px !important;
  }
}

/* Mejoras para la tabla en móviles */
@media (max-width: 768px) {
  .q-table {
    font-size: 0.875rem;
  }
  
  .q-table th,
  .q-table td {
    padding: 8px 4px !important;
  }
  
  .q-table .q-btn {
    min-width: 32px;
    padding: 4px;
  }
}

/* Estilos para botones responsivos */
.q-btn.full-width {
  width: 100%;
}

@media (max-width: 599px) {
  .q-btn.full-width-sm {
    width: 100% !important;
    justify-content: center;
  }
}

/* Mejoras para cards en diferentes tamaños */
@media (min-width: 1440px) {
  .col-xl-2 {
    width: 16.6667% !important;
    flex: 0 0 16.6667% !important;
  }
}

/* Contenedor de tabla responsivo */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .table-container {
    margin: -16px;
    padding: 16px;
  }
}

/* Estilos para cards móviles */
.galpon-mobile-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.galpon-mobile-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Espaciado responsivo para gutter */
@media (max-width: 599px) {
  .q-gutter-sm > * + * {
    margin-left: 4px !important;
  }
  
  .q-gutter-sm {
    margin-left: -4px !important;
    margin-top: -4px !important;
  }
}

@media (min-width: 600px) {
  .q-gutter-md-md > * + * {
    margin-left: 16px !important;
  }
  
  .q-gutter-md-md {
    margin-left: -16px !important;
    margin-top: -16px !important;
  }
}

@media (min-width: 1024px) {
  .q-gutter-md-lg > * + * {
    margin-left: 24px !important;
  }
  
  .q-gutter-md-lg {
    margin-left: -24px !important;
    margin-top: -24px !important;
  }
}
</style>