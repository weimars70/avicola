<template>
  <q-page class="form-page q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-mb-lg">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title text-h3 q-mb-sm">
            <q-icon name="person" class="q-mr-sm" />
            {{ isEditing ? 'Editar Tercero' : 'Nuevo Tercero' }}
          </h1>
          <p class="page-subtitle text-body1 text-grey-7">
            {{ isEditing ? 'Actualiza la información del tercero' : 'Registra un nuevo tercero en el sistema' }}
          </p>
        </div>
        <div class="header-actions">
          <q-btn
            outline
            color="grey"
            icon="arrow_back"
            label="Volver"
            class="action-btn"
            @click="goBack"
          />
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <q-card class="form-card q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Información del Tercero</div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- SECCIÓN INFORMACIÓN GENERAL -->
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm text-weight-medium">Información General</div>
              <q-separator class="q-mb-md" />
            </div>
            
            <!-- Tipo de Identificación -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.tipoIdent"
                :options="tiposIdent"
                option-value="codigo"
                option-label="nombre"
                emit-value
                map-options
                label="Tipo Identificación *"
                outlined
                dense
                :loading="loadingMaestros"
                :disable="loadingMaestros"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay datos disponibles
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Número de Identificación -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.identificacion"
                label="Número de Identificación *"
                outlined
                :rules="[
                  val => !!val || 'La identificación es obligatoria',
                  val => val.length >= 5 || 'Mínimo 5 caracteres'
                ]"
              />
            </div>

            <!-- Nombre -->
            <div class="col-12">
              <q-input
                v-model="form.nombre"
                label="Nombre Completo / Razón Social *"
                outlined
                :rules="[
                  val => !!val || 'El nombre es obligatorio',
                  val => val.length >= 3 || 'Mínimo 3 caracteres'
                ]"
              />
            </div>

            <!-- Tipo de Tercero -->
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">Tipo de Tercero *</div>
              <div class="row q-gutter-sm">
                <q-checkbox v-model="form.cliente" label="Cliente" />
                <q-checkbox v-model="form.proveedor" label="Proveedor" />
              </div>
              <div v-if="!form.cliente && !form.proveedor" class="text-negative text-caption q-mt-xs">
                Debe seleccionar al menos un tipo de tercero
              </div>
            </div>

            <!-- Estado -->
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">Estado</div>
              <q-toggle
                v-model="form.activo"
                color="positive"
                :label="form.activo ? 'Activo' : 'Inactivo'"
              />
            </div>
            
            <!-- SECCIÓN INFORMACIÓN DE CONTACTO -->
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm text-weight-medium q-mt-md">Información de Contacto</div>
              <q-separator class="q-mb-md" />
            </div>
            
            <!-- Teléfono -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.telefono"
                label="Teléfono"
                outlined
                mask="(###) ###-####"
                hint="Formato: (123) 456-7890"
              />
            </div>

            <!-- Email -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                label="Correo Electrónico"
                outlined
                type="email"
                :rules="[
                  val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo electrónico inválido'
                ]"
              />
            </div>

            <!-- Ciudad -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.ciudadCodigo"
                :options="ciudades"
                option-value="codigo"
                option-label="nombre"
                emit-value
                map-options
                use-input
                input-debounce="300"
                @filter="filterCiudades"
                label="Ciudad *"
                outlined
                dense
                :loading="loadingMaestros"
                :disable="loadingMaestros"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Dirección -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.direccion"
                label="Dirección"
                outlined
              />
            </div>

            <!-- Contacto Principal -->
            <div class="col-12">
              <q-input
                v-model="form.contacto"
                label="Nombre de Contacto Principal"
                outlined
              />
            </div>
            
            <!-- SECCIÓN INFORMACIÓN FISCAL -->
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm text-weight-medium q-mt-md">Información Fiscal</div>
              <q-separator class="q-mb-md" />
            </div>
            
            <!-- Régimen -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.regimen"
                :options="regimenes"
                option-value="codigo"
                option-label="nombre"
                emit-value
                map-options
                clearable
                label="Régimen"
                outlined
                dense
                :loading="loadingMaestros"
                :disable="loadingMaestros"
              />
            </div>

            <!-- Estrato -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.estratoCodigo"
                :options="estratos"
                option-value="codigo"
                option-label="nombre"
                emit-value
                map-options
                label="Estrato *"
                outlined
                dense
                :loading="loadingMaestros"
                :disable="loadingMaestros"
              />
            </div>

            <!-- Tipo de Impuesto -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.tipoImpuesto"
                :options="tiposImpuesto"
                option-value="codigo"
                option-label="nombre"
                emit-value
                map-options
                clearable
                label="Tipo Impuesto"
                outlined
                dense
                :loading="loadingMaestros"
                :disable="loadingMaestros"
              />
            </div>
            
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.tipoImpuesto"
                label="Tipo de Impuesto"
                outlined
                emit-value
                map-options
                :loading="loadingMaestros"
              />
            </div>

            <!-- Observaciones -->
            <div class="col-12">
              <q-input
                v-model="form.observaciones"
                label="Observaciones"
                outlined
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="row justify-end q-mt-lg">
            <q-btn
              outline
              color="grey"
              label="Cancelar"
              class="q-mr-sm"
              @click="goBack"
            />
            <q-btn
              unelevated
              color="primary"
              :label="isEditing ? 'Actualizar' : 'Guardar'"
              type="submit"
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useTercerosStore } from '../stores/terceros';
import type { Ciudad, Estrato, TipoRegimen, TipoIdent, TipoImpuesto, Tercero } from '../types/terceros';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const tercerosStore = useTercerosStore();

// Estado
// Ya no necesitamos activeTab porque el formulario está en una sola vista
const saving = ref(false);
const loadingMaestros = ref(false);
const loadingTercero = ref(false);

// Datos maestros
const ciudades = ref<Ciudad[]>([]);
const estratos = ref<Estrato[]>([]);
const regimenes = ref<TipoRegimen[]>([]);
const tiposIdent = ref<TipoIdent[]>([]);
const tiposImpuesto = ref<TipoImpuesto[]>([]);

// Filtrado de ciudades
const ciudadesFiltradas = ref<Ciudad[]>([]);

// Formulario
const form = ref<Tercero>({
  codigo: null as unknown as number,
  id: null as unknown as number,
  tipoIdent: null,
  tipo_ident: null as unknown as number,
  identificacion: '',
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudadCodigo: '',
  contacto: '',
  regimen: null,
  estratoCodigo: null,
  tipoImpuesto: null,
  observaciones: '',
  cliente: true,
  proveedor: false,
  activo: true,
  idEmpresa: 1
});

// Computed
const isEditing = computed(() => !!route.params.id);

// Estas variables computed no se utilizan porque los componentes q-select
// usan directamente los arrays de datos con option-value y option-label

// Métodos
const loadMaestros = async () => {
  try {
    loadingMaestros.value = true;
    await tercerosStore.loadMaestros();
    
    // Actualizar refs
    ciudades.value = tercerosStore.ciudades;
    estratos.value = tercerosStore.estratos;
    regimenes.value = tercerosStore.regimenes;
    tiposIdent.value = tercerosStore.tiposIdentificacion;
    tiposImpuesto.value = tercerosStore.tiposImpuesto;
    
    console.log('Datos cargados en componente:', { 
      ciudades: ciudades.value.length, 
      estratos: estratos.value.length, 
      regimenes: regimenes.value.length, 
      tiposIdent: tiposIdent.value.length, 
      tiposImpuesto: tiposImpuesto.value.length 
    });
  } catch (error: unknown) {
    const err = error as Error;
    $q.notify({
      color: 'negative',
      message: 'Error al cargar datos: ' + (err.message || 'Error desconocido'),
      icon: 'error'
    });
  } finally {
    loadingMaestros.value = false;
  }
};

const loadTercero = async (id: number) => {
  loadingTercero.value = true;
  try {
    const tercero = await tercerosStore.getTerceroById(id);
    if (tercero) {
      form.value = {
        id: tercero.id,
        codigo: tercero.codigo,
        tipoIdent: tercero.tipoIdent || tercero.tipo_ident,
        tipo_ident: tercero.tipo_ident || tercero.tipoIdent,
        identificacion: tercero.identificacion,
        nombre: tercero.nombre,
        telefono: tercero.telefono || '',
        email: tercero.email || '',
        direccion: tercero.direccion || '',
        ciudadCodigo: tercero.ciudadCodigo || tercero.ciudad_codigo,
        contacto: tercero.contacto || '',
        regimen: tercero.regimen,
        estratoCodigo: tercero.estratoCodigo || tercero.estrato_codigo,
        tipoImpuesto: tercero.tipoImpuesto || tercero.tipo_impuesto,
        observaciones: tercero.observaciones || '',
        cliente: tercero.cliente,
        proveedor: tercero.proveedor,
        activo: tercero.activo,
        idEmpresa: tercero.idEmpresa || 1
      };
    } else {
      $q.notify({
        color: 'negative',
        message: 'No se encontró el tercero solicitado',
        icon: 'error'
      });
      goBack();
    }
  } catch (error: unknown) {
      const err = error as Error;
      $q.notify({
        color: 'negative',
        message: 'Error al cargar el tercero: ' + (err.message || 'Error desconocido'),
        icon: 'error'
      });
      goBack();
  } finally {
    loadingTercero.value = false;
  }
};

const filterCiudades = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      ciudadesFiltradas.value = ciudades.value;
    } else {
      const needle = val.toLowerCase();
      ciudadesFiltradas.value = ciudades.value.filter(
        (c: Ciudad) => c.nombre.toLowerCase().includes(needle)
      );
    }
  });
};

const validateForm = () => {
  // Validaciones básicas
  if (!form.value.tipoIdent && !form.value.tipo_ident) {
    $q.notify({
      color: 'negative',
      message: 'Debe seleccionar un tipo de identificación',
      icon: 'error'
    });
    return false;
  }

  if (!form.value.identificacion || form.value.identificacion.length < 5) {
    $q.notify({
      color: 'negative',
      message: 'La identificación es obligatoria y debe tener al menos 5 caracteres',
      icon: 'error'
    });
    return false;
  }

  if (!form.value.nombre || form.value.nombre.length < 3) {
    $q.notify({
      color: 'negative',
      message: 'El nombre es obligatorio y debe tener al menos 3 caracteres',
      icon: 'error'
    });
    return false;
  }

  if (!form.value.cliente && !form.value.proveedor) {
    $q.notify({
      color: 'negative',
      message: 'Debe seleccionar al menos un tipo de tercero (Cliente o Proveedor)',
      icon: 'error'
    });
    return false;
  }

  // Validar email si está presente
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    $q.notify({
      color: 'negative',
      message: 'El formato del correo electrónico es inválido',
      icon: 'error'
    });
    return false;
  }

  return true;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  saving.value = true;
  try {
    if (isEditing.value) {
      await tercerosStore.updateTercero(form.value);
      $q.notify({
        color: 'positive',
        message: `Tercero "${form.value.nombre}" actualizado correctamente`,
        icon: 'check_circle'
      });
    } else {
      await tercerosStore.createTercero(form.value);
      $q.notify({
        color: 'positive',
        message: `Tercero "${form.value.nombre}" creado correctamente`,
        icon: 'check_circle'
      });
    }

    // Redirigir al listado después de guardar
    goBack();
  } catch (error: unknown) {
    const err = error as Error;
    $q.notify({
      color: 'negative',
      message: `Error al ${isEditing.value ? 'actualizar' : 'crear'} tercero: ${err.message || 'Error desconocido'}`,
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  void router.push('/terceros');
};

// Ciclo de vida
onMounted(async () => {
  await loadMaestros();
  
  if (isEditing.value && route.params.id) {
    await loadTercero(Number(route.params.id));
  }
});
</script>

<style lang="scss">
/* Layout Principal */
.form-page {
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

/* Form Card */
.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-page {
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
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.q-tab-panel {
  animation: fadeIn 0.3s ease-out;
}
</style>