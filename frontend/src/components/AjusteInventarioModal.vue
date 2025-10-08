<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="ajuste-modal">
      <q-card-section class="modal-header">
        <div class="header-content">
          <q-icon name="tune" class="header-icon" />
          <div class="header-text">
            <h3 class="modal-title">{{ props.editMode ? 'Editar Ajuste de Inventario' : 'Ajuste de Inventario' }}</h3>
            <p class="modal-subtitle">{{ props.editMode ? 'Modificar descripción del ajuste' : 'Realizar múltiples ajustes de stock' }}</p>
          </div>
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeModal"
          class="close-btn"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="modal-content">
        <q-form @submit="onSubmit" class="ajuste-form">
          <!-- Descripción General -->
          <div class="form-group">
            <label class="form-label">Descripción General del Ajuste *</label>
            <q-input
              v-model="form.descripcionGeneral"
              outlined
              dense
              :rules="[val => !!val || 'Ingrese una descripción general']"
              placeholder="Ej: Ajuste por inventario físico, rotura de huevos, etc."
              class="form-input"
            />
          </div>

          <q-separator class="q-my-md" />

          <!-- Ajustes Individuales - Solo en modo creación -->
          <div v-if="!props.editMode" class="ajustes-section">
            <div class="section-header">
              <h4 class="section-title">Ajustes Individuales</h4>
              <q-btn
                label="Agregar Ajuste"
                color="secondary"
                outline
                size="sm"
                icon="add"
                @click="addAjuste"
                class="add-btn"
              />
            </div>

            <div v-for="(ajuste, index) in form.ajustes" :key="index" class="ajuste-item">
              <div class="ajuste-header">
                <span class="ajuste-number">Ajuste {{ index + 1 }}</span>
                <q-btn
                  v-if="form.ajustes.length > 1"
                  icon="delete"
                  color="negative"
                  flat
                  dense
                  size="sm"
                  @click="removeAjuste(index)"
                  class="delete-btn"
                />
              </div>

              <div class="ajuste-content">
                <div class="row q-gutter-md">
                  <!-- Tipo de Huevo -->
                  <div class="col-12 col-md-4">
                    <label class="form-label">Tipo de Huevo *</label>
                    <q-select
                      v-model="ajuste.tipoHuevoId"
                      :options="tiposHuevoOptions"
                      option-value="id"
                      option-label="nombre"
                      emit-value
                      map-options
                      outlined
                      dense
                      :rules="[val => !!val || 'Seleccione un tipo']"
                      class="form-input"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                            <q-item-label caption>Stock: {{ getStockActual(scope.opt.id) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Tipo de Ajuste -->
                  <div class="col-12 col-md-3">
                    <label class="form-label">Tipo *</label>
                    <q-select
                      v-model="ajuste.tipoAjuste"
                      :options="tipoAjusteOptions"
                      option-value="value"
                      option-label="label"
                      emit-value
                      map-options
                      outlined
                      dense
                      :rules="[val => !!val || 'Seleccione tipo']"
                      class="form-input"
                    />
                  </div>

                  <!-- Cantidad -->
                  <div class="col-12 col-md-3">
                    <label class="form-label">Cantidad *</label>
                    <q-input
                      v-model.number="ajuste.cantidadAjuste"
                      type="number"
                      outlined
                      dense
                      min="1"
                      :rules="[
                        val => !!val || 'Ingrese cantidad',
                        val => val > 0 || 'Mayor a 0',
                        val => ajuste.tipoAjuste === 'suma' || val <= getStockActual(ajuste.tipoHuevoId) || 'Excede stock'
                      ]"
                      class="form-input"
                    >
                      <template v-slot:prepend>
                        <q-icon :name="ajuste.tipoAjuste === 'suma' ? 'add' : 'remove'" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Descripción individual removida - se usa la descripción general -->

                  <!-- Resumen -->
                  <div class="col-12 col-md-2">
                    <div v-if="ajuste.tipoHuevoId && ajuste.cantidadAjuste" class="stock-summary">
                      <div class="stock-current">{{ getStockActual(ajuste.tipoHuevoId) }}</div>
                      <q-icon :name="ajuste.tipoAjuste === 'suma' ? 'arrow_forward' : 'arrow_forward'" size="xs" />
                      <div class="stock-final" :class="ajuste.tipoAjuste === 'suma' ? 'positive' : 'negative'">
                        {{ calcularStockFinalAjuste(ajuste) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions class="modal-actions">
        <q-btn
          label="Cancelar"
          color="grey"
          flat
          @click="closeModal"
          class="action-btn"
        />
        <q-btn
          v-if="props.editMode"
          label="Ajuste Inverso"
          color="orange"
          unelevated
          @click="realizarAjusteInverso"
          :loading="loading"
          class="action-btn inverse-btn"
          icon="undo"
        />
        <q-btn
          :label="props.editMode ? 'Actualizar' : 'Realizar Ajustes'"
          color="primary"
          unelevated
          @click="onSubmit"
          :loading="loading"
          :disable="!isFormValid"
          class="action-btn primary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAjustesInventarioStore } from 'src/stores/ajustesInventario';
import { useTiposHuevoStore } from 'src/stores/tipos-huevo';
import { useAuthStore } from 'src/stores/auth';

interface TipoHuevo {
  id: string;
  nombre: string;
  descripcion?: string;
  valorUnidad: number;
  activo: boolean;
}

interface AjusteItem {
  tipoHuevoId: string;
  cantidadAjuste: number;
  tipoAjuste: 'suma' | 'resta';
  descripcion?: string;
}

interface Props {
  modelValue: boolean;
  inventario: Array<{
    id: number;
    tipoHuevo: {
      id: string;
      nombre: string;
    };
    unidades: number;
  }>;
  editMode?: boolean;
  loteData?: {
    id: string;
    descripcionGeneral: string;
    ajustes: Array<{
      id: string;
      tipoHuevoId: string;
      cantidadAjuste: number;
      tipoAjuste: 'suma' | 'resta';
      descripcion: string;
    }>;
  } | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'ajuste-realizado'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const $q = useQuasar();
const ajustesStore = useAjustesInventarioStore();
const tiposHuevoStore = useTiposHuevoStore();
const authStore = useAuthStore();

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const loading = ref(false);

const form = ref({
  descripcionGeneral: '',
  ajustes: [{
    tipoHuevoId: '',
    cantidadAjuste: 0,
    tipoAjuste: 'suma' as 'suma' | 'resta',
    descripcion: ''
  }] as AjusteItem[]
});

const tipoAjusteOptions = [
  { label: 'Sumar', value: 'suma' },
  { label: 'Restar', value: 'resta' }
];

const tiposHuevoOptions = computed(() => {
  return tiposHuevoStore.tiposHuevo.filter((tipo: TipoHuevo) => tipo.activo);
});

const isFormValid = computed(() => {
  return authStore.isAuthenticated &&
    authStore.user?.id &&
    form.value.descripcionGeneral.trim() !== '' &&
    form.value.ajustes.every(ajuste => {
      if (!ajuste.tipoHuevoId || !ajuste.cantidadAjuste || ajuste.cantidadAjuste <= 0) {
        return false;
      }
      
      // Para ajustes de resta, verificar que no exceda el stock disponible
      if (ajuste.tipoAjuste === 'resta') {
        const stockActual = getStockActual(ajuste.tipoHuevoId);
        return ajuste.cantidadAjuste <= stockActual;
      }
      
      return true;
    });
});

const getStockActual = (tipoHuevoId: string): number => {
  const item = props.inventario.find(inv => inv.tipoHuevo.id === tipoHuevoId);
  return item ? item.unidades : 0;
};

const calcularStockFinalAjuste = (ajuste: AjusteItem): number => {
  if (!ajuste.tipoHuevoId || !ajuste.cantidadAjuste) return 0;
  
  const stockActual = getStockActual(ajuste.tipoHuevoId);
  if (ajuste.tipoAjuste === 'suma') {
    return stockActual + ajuste.cantidadAjuste;
  } else {
    return stockActual - ajuste.cantidadAjuste;
  }
};

const addAjuste = () => {
  form.value.ajustes.push({
    tipoHuevoId: '',
    cantidadAjuste: 0,
    tipoAjuste: 'suma'
  });
};

const removeAjuste = (index: number) => {
  if (form.value.ajustes.length > 1) {
    form.value.ajustes.splice(index, 1);
  }
};

const resetForm = () => {
  form.value = {
    descripcionGeneral: '',
    ajustes: [{
      tipoHuevoId: '',
      cantidadAjuste: 0,
      tipoAjuste: 'suma'
    }]
  };
};

const closeModal = () => {
  resetForm();
  showModal.value = false;
};

const onSubmit = async () => {
  if (!authStore.isAuthenticated || !authStore.user?.id) {
    $q.notify({
      type: 'negative',
      message: 'Debe iniciar sesión para realizar ajustes',
      position: 'top'
    });
    return;
  }
  
  if (!isFormValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor complete todos los campos requeridos',
      position: 'top'
    });
    return;
  }
  
  // Verificar que el usuario esté autenticado
  if (!authStore.user?.id) {
    $q.notify({
      type: 'negative',
      message: 'Usuario no autenticado. Por favor, inicie sesión nuevamente.',
      position: 'top'
    });
    return;
  }

  loading.value = true;
  try {
    const ajustesData = form.value.ajustes.map((ajuste, index) => {
      console.log(`Ajuste ${index}:`, {
        tipoHuevoId: ajuste.tipoHuevoId,
        cantidadAjuste: ajuste.cantidadAjuste,
        tipoAjuste: ajuste.tipoAjuste,
        tipoAjusteType: typeof ajuste.tipoAjuste
      });
      return {
        tipoHuevoId: ajuste.tipoHuevoId,
        cantidadAjuste: ajuste.cantidadAjuste,
        tipoAjuste: ajuste.tipoAjuste,
        descripcion: ajuste.descripcion || ''
      };
    });

    if (props.editMode && props.loteData) {
      // Modo edición - actualizar descripción y ajustes
      await ajustesStore.updateLote(props.loteData.id, {
        descripcionGeneral: form.value.descripcionGeneral,
        ajustes: ajustesData
      });

      $q.notify({
        type: 'positive',
        message: 'Ajuste actualizado correctamente',
        position: 'top'
      });
    } else {
      // Modo creación
      console.log("Datos enviados:", JSON.stringify({
  descripcionGeneral: form.value.descripcionGeneral,
  usuarioId: authStore.user.id,
  ajustes: ajustesData,
  id_usuario_inserta: authStore.user.id,
  id_empresa: Number(localStorage.getItem('id_empresa'))
}, null, 2));
      await ajustesStore.createLote({
        descripcionGeneral: form.value.descripcionGeneral,
        usuarioId: authStore.user.id,
        ajustes: ajustesData,
        id_usuario_inserta: authStore.user.id,
        id_empresa: Number(localStorage.getItem('id_empresa'))
      });

      $q.notify({
        type: 'positive',
        message: 'Ajustes de inventario realizados correctamente',
        position: 'top'
      });
    }

    emit('ajuste-realizado');
    closeModal();
  } catch (error) {
   
    console.error('Error al realizar ajustes:', error);
    $q.notify({
      type: 'negative',
      message: ajustesStore.error || 'Error al realizar los ajustes',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const realizarAjusteInverso = () => {
  if (!authStore.isAuthenticated || !authStore.user?.id || !props.loteData) {
    return;
  }

  // Confirmar la acción
  $q.dialog({
    title: 'Confirmar Ajuste Inverso',
    message: '¿Está seguro de que desea realizar el ajuste inverso? Esto restaurará el inventario al estado anterior a este ajuste.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      loading.value = true;
      
      try {
        // Crear ajustes inversos
        const ajustesInversos = props.loteData!.ajustes.map(ajuste => ({
          tipoHuevoId: ajuste.tipoHuevoId,
          cantidadAjuste: ajuste.cantidadAjuste,
          tipoAjuste: ajuste.tipoAjuste === 'suma' ? 'resta' : 'suma' as 'suma' | 'resta',
          descripcion: `Ajuste inverso de: ${ajuste.descripcion || 'Sin descripción'}`
        }));

        await ajustesStore.createLote({
          descripcionGeneral: `Ajuste inverso de: ${props.loteData!.descripcionGeneral}`,
          usuarioId: authStore.user!.id,
          ajustes: ajustesInversos,
          id_usuario_inserta: authStore.user!.id,
          id_empresa: Number(localStorage.getItem('id_empresa'))
        });

        $q.notify({
          type: 'positive',
          message: 'Ajuste inverso realizado correctamente. El inventario ha sido restaurado.',
          position: 'top'
        });

        emit('ajuste-realizado');
        closeModal();
      } catch (error) {
        console.error('Error al realizar ajuste inverso:', error);
        $q.notify({
          type: 'negative',
          message: 'Error al realizar el ajuste inverso',
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    })();
  });
};

// Cargar tipos de huevo al abrir el modal
watch(showModal, async (newValue) => {
  if (newValue) {
    await tiposHuevoStore.fetchTiposHuevo();
    
    // Si está en modo edición, cargar los datos del lote
    if (props.editMode && props.loteData) {
      form.value.descripcionGeneral = props.loteData.descripcionGeneral;
      // Cargar los ajustes existentes para mostrar y permitir edición
      if (props.loteData.ajustes && props.loteData.ajustes.length > 0) {
        form.value.ajustes = props.loteData.ajustes.map(ajuste => ({
          tipoHuevoId: ajuste.tipoHuevoId,
          cantidadAjuste: ajuste.cantidadAjuste,
          tipoAjuste: ajuste.tipoAjuste,
          descripcion: ajuste.descripcion || ''
        }));
      }
    }
  }
});
</script>

<style scoped>
.ajuste-modal {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 32px;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.close-btn {
  color: white;
}

.modal-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
}

.ajustes-section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.add-btn {
  border-radius: 8px;
}

.ajuste-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.ajuste-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.ajuste-number {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.delete-btn {
  color: #ef4444;
}

.ajuste-content {
  padding: 16px;
}

.stock-summary {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.stock-current {
  color: #6b7280;
}

.stock-final.positive {
  color: #10b981;
}

.stock-final.negative {
  color: #ef4444;
}

.modal-actions {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f9fafb;
}

.action-btn {
  min-width: 120px;
  border-radius: 8px;
  font-weight: 500;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 768px) {
  .ajuste-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-content {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .add-btn {
    align-self: center;
  }
}

.inverse-btn {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.inverse-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
</style>