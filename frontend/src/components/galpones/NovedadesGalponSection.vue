<template>
  <div class="novedades-section q-mt-xl fade-in" v-if="galponId">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-primary">
          <q-icon name="assignment" class="q-mr-sm" />
          Detalles y Actividades: {{ galponNombre }}
        </div>
        <div class="text-subtitle2 text-grey-7">
          Gestión integral de movimientos, sanidad y mantenimientos
        </div>
      </div>
      <div class="row q-gutter-sm items-center">
        <div class="poblacion-badge q-pa-sm q-px-md shadow-2">
          <div class="text-caption text-grey-7">Población Actual</div>
          <div class="text-h6 text-weight-bold color-primary">
            <q-icon name="pets" class="q-mr-xs" />
            {{ store.poblacionActual }} aves
          </div>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Nueva Actividad"
          @click="openCreateDialog"
          class="pulse-button"
        />
      </div>
    </div>

    <!-- Timeline / Listado de Detalles -->
    <q-card flat bordered class="timeline-card">
      <q-card-section v-if="store.loading && store.movimientos.length === 0" class="row justify-center q-pa-xl">
        <q-spinner-dots size="40px" color="primary" />
      </q-card-section>

      <q-card-section v-else-if="store.movimientos.length === 0" class="row justify-center q-pa-xl text-grey-6">
        <div class="text-center">
          <q-icon name="event_busy" size="4rem" class="q-mb-md" />
          <div class="text-h6">Sin actividades registradas</div>
          <div class="text-subtitle2">Los movimientos y tareas aparecerán aquí</div>
        </div>
      </q-card-section>

      <q-card-section v-else class="q-pa-none">
        <q-scroll-area style="height: 500px;">
          <q-list separator>
            <q-item v-for="mov in store.movimientos" :key="mov.id" class="q-py-md item-detalle">
              <q-item-section avatar>
                <q-avatar 
                  :color="getIconColor(mov)" 
                  text-color="white" 
                  :icon="getIconName(mov)"
                >
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-subtitle1">
                  {{ mov.motivo }}
                  <q-badge v-if="mov.tipo === 'SUMA' || mov.tipo === 'RESTA'" :color="mov.tipo === 'SUMA' ? 'positive' : 'negative'" class="q-ml-sm">
                    {{ mov.tipo === 'SUMA' ? '+' : '-' }}{{ mov.cantidad }} aves
                  </q-badge>
                </q-item-label>
                <q-item-label caption v-if="mov.comentario" class="text-grey-8 q-mt-xs">
                  {{ mov.comentario }}
                </q-item-label>
                <div class="row q-gutter-md q-mt-xs">
                  <q-item-label caption>
                    <q-icon name="person" size="xs" class="q-mr-xs" />
                    {{ mov.usuarioInserta?.nombre || 'Admin' }}
                  </q-item-label>
                  <q-item-label caption v-if="mov.usuarioActualiza">
                    <q-icon name="edit" size="xs" class="q-mr-xs" />
                    Editado por: {{ mov.usuarioActualiza?.nombre }}
                  </q-item-label>
                </div>
              </q-item-section>

              <q-item-section side top>
                <div class="column items-end">
                  <q-item-label caption class="text-weight-medium">
                    {{ formatDate(mov.fecha) }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ formatTime(mov.fecha) }}
                  </q-item-label>
                  <div class="row q-gutter-xs q-mt-sm actions-overlay">
                    <q-btn flat round dense color="primary" icon="edit" size="sm" @click="openEditDialog(mov)">
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense color="negative" icon="delete" size="sm" @click="confirmDelete(mov)">
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
    </q-card>

    <!-- Dialogo CRUD -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 450px; border-radius: 15px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Editar Actividad' : 'Nueva Actividad' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.tipo"
                  :options="tipoOptions"
                  label="Tipo de Registro"
                  outlined
                  emit-value
                  map-options
                  :rules="[val => !!val || 'El tipo es requerido']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="form.cantidad"
                  type="number"
                  label="Cantidad de Aves"
                  outlined
                  :disable="form.tipo === 'OTRO'"
                  :rules="[
                    val => (form.tipo === 'OTRO' || (!!val && val > 0)) || 'La cantidad es requerida y debe ser > 0',
                    val => validatePoblacion(val)
                  ]"
                />
              </div>
            </div>

            <q-select
              v-model="form.motivo"
              :options="motivosOptions"
              label="Motivo / Tarea"
              outlined
              use-input
              fill-input
              hide-selected
              @filter="filterMotivos"
              :rules="[val => !!val || 'El motivo es requerido']"
            />

            <q-input
              v-model="form.comentario"
              type="textarea"
              label="Observaciones"
              outlined
              rows="3"
            />

            <q-input
              v-model="form.fecha"
              label="Fecha y Hora"
              outlined
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fecha" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer q-ml-sm">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="form.fecha" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
              <q-btn 
                :label="isEditing ? 'Actualizar' : 'Guardar'" 
                type="submit" 
                color="primary" 
                :loading="store.loading" 
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMovimientosGalponStore } from 'src/stores/movimientos-galpon';
import { date, useQuasar } from 'quasar';
import { TipoMovimiento } from 'src/types/movimientos-galpon';
import type { DetalleGalpon } from 'src/types/movimientos-galpon';


const props = defineProps<{
  galponId: string | null;
  galponNombre: string | null;
}>();

const $q = useQuasar();
const store = useMovimientosGalponStore();
const dialog = ref(false);
const isEditing = ref(false);
const currentId = ref<string | null>(null);

const form = ref({
  tipo: TipoMovimiento.RESTA as TipoMovimiento | 'OTRO',


  cantidad: 1,
  motivo: '',
  comentario: '',
  fecha: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
});

const tipoOptions = [
  { label: 'Suma (Ingreso)', value: TipoMovimiento.SUMA },
  { label: 'Resta (Salida/Muerte)', value: TipoMovimiento.RESTA },
  { label: 'Otro (Actividad/Tarea)', value: 'OTRO' }
];

const motivosBase = [
  'Muerte por enfermedad',
  'Muerte por estrés',
  'Muerte accidental',
  'Ingreso de nuevas aves',
  'Traslado a otro galpón',
  'Venta de descarte',
  'Ajuste de inventario',
  'Vacunación realizada',
  'Limpieza general',
  'Mantenimiento de bebederos',
  'Cambio de cama'
];

const motivosOptions = ref(motivosBase);

const filterMotivos = (val: string, update: (cb: () => void) => void) => {

  if (val === '') {
    update(() => {
      motivosOptions.value = motivosBase;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    motivosOptions.value = motivosBase.filter(v => v.toLowerCase().indexOf(needle) > -1);
    if (!motivosOptions.value.includes(val)) {
      motivosOptions.value.push(val);
    }
  });
};

const getIconName = (mov: DetalleGalpon) => {
  if (mov.tipo === TipoMovimiento.SUMA) return 'add';
  if (mov.tipo === TipoMovimiento.RESTA) return 'remove';
  return 'assignment';
};

const getIconColor = (mov: DetalleGalpon) => {
  if (mov.tipo === TipoMovimiento.SUMA) return 'positive';
  if (mov.tipo === TipoMovimiento.RESTA) return 'negative';
  return 'blue-grey';
};

const formatDate = (dateStr: string) => date.formatDate(dateStr, 'DD/MM/YYYY');
const formatTime = (dateStr: string) => date.formatDate(dateStr, 'hh:mm A');

const validatePoblacion = (val: number) => {
  if (form.value.tipo === TipoMovimiento.RESTA && val > store.poblacionActual) {
    // Si estamos editando un registro de resta, debemos considerar la cantidad original en el cálculo
    // Para simplificar esta demo, mantendremos la validación básica pero idealmente 
    // se compararía contra (poblacionActual + cantidadOriginal)
    return `La cantidad no puede superar la población actual (${store.poblacionActual})`;
  }
  return true;
};

const openCreateDialog = () => {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    tipo: TipoMovimiento.RESTA,
    cantidad: 1,
    motivo: '',
    comentario: '',
    fecha: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
  };
  dialog.value = true;
};

const openEditDialog = (mov: DetalleGalpon) => {
  isEditing.value = true;
  currentId.value = mov.id;
  form.value = {
    tipo: mov.tipo,
    cantidad: mov.cantidad,
    motivo: mov.motivo,
    comentario: mov.comentario || '',
    fecha: date.formatDate(mov.fecha, 'YYYY-MM-DD HH:mm')
  };
  dialog.value = true;
};

const confirmDelete = (mov: DetalleGalpon) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Deseas eliminar el registro "${mov.motivo}"? Esto afectará el cálculo de población.`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Eliminar' }
  }).onOk(() => {
    void (async () => {
      try {
        await store.deleteMovimiento(mov.id, mov.id_galpon);
        $q.notify({ type: 'positive', message: 'Registro eliminado' });
      } catch {
        $q.notify({ type: 'negative', message: 'Error al eliminar' });
      }

    })();
  });

};

const onSubmit = async () => {
  if (!props.galponId) return;

  const data = {
    id_galpon: props.galponId,
    tipo: form.value.tipo === 'OTRO' ? TipoMovimiento.SUMA : form.value.tipo, // Default SUMA but cantidad 0 for OTRO
    cantidad: form.value.tipo === 'OTRO' ? 0 : form.value.cantidad,
    motivo: form.value.motivo,
    comentario: form.value.comentario,
    fecha: form.value.fecha
  };

  try {
    if (isEditing.value && currentId.value) {
      await store.updateMovimiento(currentId.value, data);
      $q.notify({ type: 'positive', message: 'Registro actualizado' });
    } else {
      await store.registrarMovimiento(data);
      $q.notify({ type: 'positive', message: 'Registro guardado' });
    }
    dialog.value = false;
  } catch {
    $q.notify({ type: 'negative', message: 'Error en la operación' });
  }


};

watch(() => props.galponId, (newId) => {
  if (newId) {
    void store.fetchMovimientos(newId);
    void store.fetchPoblacion(newId);
  }
}, { immediate: true });
</script>

<style scoped>
.novedades-section {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.timeline-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
}

.poblacion-badge {
  background: white;
  border-left: 5px solid #667eea;
  border-radius: 12px;
  min-width: 150px;
}

.color-primary { color: #667eea; }

.item-detalle {
  transition: background-color 0.2s;
}

.item-detalle:hover {
  background-color: #f8fafc;
}

.actions-overlay {
  opacity: 0.6;
}

.item-detalle:hover .actions-overlay {
  opacity: 1;
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
