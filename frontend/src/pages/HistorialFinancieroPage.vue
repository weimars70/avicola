<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="col-12 col-md-8">
        <div class="text-h4 q-mb-sm">
          <q-icon name="history" class="q-mr-sm text-primary" />
          Historial Financiero
        </div>
        <div class="text-subtitle1 text-grey-7">
          Registro completo de todas las transacciones financieras
        </div>
      </div>
      <div class="col-12 col-md-4 q-mt-md q-mt-md-none">
        <div class="row q-gutter-sm justify-end">
          <q-btn
            color="secondary"
            icon="sync"
            :label="$q.screen.gt.xs ? 'Sincronizar Ingresos' : ''"
            @click="syncIngresos"
            :loading="finanzasLoading"
            :size="$q.screen.gt.xs ? 'md' : 'sm'"
            :round="$q.screen.lt.sm"
          >
            <q-tooltip v-if="$q.screen.lt.sm">Sincronizar Ingresos</q-tooltip>
          </q-btn>
          <q-btn
            color="primary"
            icon="add"
            :label="$q.screen.gt.xs ? 'Nueva Transacción' : ''"
            @click="openTransactionDialog()"
            :size="$q.screen.gt.xs ? 'md' : 'sm'"
            :round="$q.screen.lt.sm"
          >
            <q-tooltip v-if="$q.screen.lt.sm">Nueva Transacción</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-end">
          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-select
              v-model="filtros.tipo"
              :options="tipoOptions"
              label="Tipo de Transacción"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.fechaInicio"
              label="Desde fecha"
              type="date"
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.fechaFin"
              label="Hasta fecha"
              type="date"
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.busqueda"
              label="Buscar..."
              outlined
              dense
              clearable
              debounce="300"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="filter_list"
              label="Filtrar"
              @click="aplicarFiltros"
            />
            <q-btn
              flat
              color="grey"
              icon="clear"
              label="Limpiar"
              @click="limpiarFiltros"
              class="q-ml-sm"
            />
          </div>
        </div>
        
        <!-- Filtros rápidos de fecha -->
        <div class="row q-gutter-sm q-mt-sm">
          <q-btn
            size="sm"
            color="grey-6"
            outline
            @click="filtrarHoy"
            label="Hoy"
          />
          <q-btn
            size="sm"
            color="grey-6"
            outline
            @click="filtrarUltimaSemana"
            label="Última semana"
          />
          <q-btn
            size="sm"
            color="grey-6"
            outline
            @click="filtrarUltimoMes"
            label="Último mes"
          />
          <q-btn
            size="sm"
            color="grey-6"
            outline
            @click="filtrarUltimosTresMeses"
            label="Últimos 3 meses"
          />
          <q-btn
            size="sm"
            color="grey-6"
            outline
            @click="filtrarEsteAno"
            label="Este año"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Resumen -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="summary-card summary-card--ingresos">
          <q-card-section class="summary-card__content">
            <div class="summary-card__icon">
              <q-icon name="trending_up" :size="$q.screen.gt.xs ? '2.5rem' : '2rem'" />
            </div>
            <div class="summary-card__info">
              <div class="summary-card__value" :class="{ 'text-small': resumen.totalIngresos > 999999 }">
                ${{ formatCurrency(resumen.totalIngresos) }}
              </div>
              <div class="summary-card__label">Total Ingresos</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="summary-card summary-card--gastos">
          <q-card-section class="summary-card__content">
            <div class="summary-card__icon">
              <q-icon name="trending_down" :size="$q.screen.gt.xs ? '2.5rem' : '2rem'" />
            </div>
            <div class="summary-card__info">
              <div class="summary-card__value" :class="{ 'text-small': resumen.totalGastos > 999999 }">
                ${{ formatCurrency(resumen.totalGastos) }}
              </div>
              <div class="summary-card__label">Total Gastos</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="summary-card" :class="resumen.balance >= 0 ? 'summary-card--balance-positive' : 'summary-card--balance-negative'">
          <q-card-section class="summary-card__content">
            <div class="summary-card__icon">
              <q-icon name="account_balance" :size="$q.screen.gt.xs ? '2.5rem' : '2rem'" />
            </div>
            <div class="summary-card__info">
              <div class="summary-card__value" :class="{ 'text-small': Math.abs(resumen.balance) > 999999 }">
                ${{ formatCurrency(resumen.balance) }}
              </div>
              <div class="summary-card__label">Balance</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="summary-card summary-card--transacciones">
          <q-card-section class="summary-card__content">
            <div class="summary-card__icon">
              <q-icon name="receipt" size="2.5rem" />
            </div>
            <div class="summary-card__info">
              <div class="summary-card__value">{{ resumen.cantidad }}</div>
              <div class="summary-card__label">Transacciones</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tarjeta de Inversión Inicial -->
    <div class="row q-mb-lg" v-if="inversionStore.inversionInicial.montoTotal > 0">
      <div class="col-12">
        <q-card class="bg-orange-1">
          <q-card-section>
            <div class="row items-center q-gutter-md">
              <div class="col-12 col-md-3">
                <div class="text-subtitle2 text-orange-8">Inversión Inicial</div>
                <div class="text-h5 text-orange-9">${{ inversionStore.inversionInicial.montoTotal.toLocaleString() }}</div>
              </div>
              
              <div class="col-12 col-md-3">
                <div class="text-subtitle2 text-green-8">Recuperado</div>
                <div class="text-h6 text-green-9">${{ inversionStore.inversionInicial.montoRecuperado.toLocaleString() }}</div>
                <div class="text-caption text-green-7">{{ typeof inversionStore.inversionInicial.porcentajeRecuperado === 'number' ? inversionStore.inversionInicial.porcentajeRecuperado.toFixed(1) : '0.0' }}%</div>
              </div>
              
              <div class="col-12 col-md-3">
                <div class="text-subtitle2 text-red-8">Restante</div>
                <div class="text-h6 text-red-9">${{ inversionStore.inversionInicial.montoRestante.toLocaleString() }}</div>
              </div>
              
              <div class="col-12 col-md-3">
                <div class="text-subtitle2 text-blue-8">Tiempo Estimado</div>
                <div class="text-h6 text-blue-9">
                  {{ inversionStore.tiempoEstimadoRecuperacion ? `${inversionStore.tiempoEstimadoRecuperacion} meses` : 'N/A' }}
                </div>
              </div>
            </div>
            
            <div class="q-mt-md">
              <q-linear-progress 
                :value="inversionStore.inversionInicial.porcentajeRecuperado / 100" 
                color="green" 
                track-color="grey-3" 
                size="12px" 
                rounded
              />
              <div class="text-center text-caption q-mt-xs">
                Progreso de Recuperación: {{ typeof inversionStore.inversionInicial.porcentajeRecuperado === 'number' ? inversionStore.inversionInicial.porcentajeRecuperado.toFixed(1) : '0.0' }}%
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Calendario Financiero -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="calendar_month" class="q-mr-sm" />
          Calendario de Salidas Financieras
        </div>
        <CalendarioFinanciero
           :datos="datosCalendario"
           :mostrar-ingresos="true"
           :mostrar-gastos="true"
           :mostrar-canastas="true"
           @cambio-mes="onCambioMes"
         />
      </q-card-section>
    </q-card>

    <!-- Tabla de Historial -->
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Historial de Transacciones</div>
        <q-table
          :rows="transaccionesFiltradas"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-xs">
                <q-badge
                  :color="getTipoColor(props.value)"
                  :label="getTipoLabel(props.value)"
                />
                <q-icon
                  v-if="props.row.salidaId"
                  name="inventory_2"
                  color="orange"
                  size="sm"
                >
                  <q-tooltip>Registro de salida - Editable</q-tooltip>
                </q-icon>
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-monto="props">
            <q-td :props="props">
              <span :class="props.row.tipo === 'ingreso' ? 'text-green text-weight-bold' : 'text-red text-weight-bold'">
                {{ props.row.tipo === 'ingreso' ? '+' : '-' }}${{ props.value.toLocaleString() }}
              </span>
            </q-td>
          </template>
          
          <template v-slot:body-cell-nombreComprador="props">
            <q-td :props="props">
              <span v-if="props.row.nombreComprador" class="text-primary">
                {{ props.row.nombreComprador }}
              </span>
              <span v-else class="text-grey-5">-</span>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="editTransaction(props.row)"
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
      </q-card-section>
    </q-card>

    <!-- Dialog para Nueva/Editar Transacción -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ editingTransaction ? 'Editar Transacción' : 'Nueva Transacción' }}
          </div>
        </q-card-section>

        <!-- Alerta para registros de salida -->
        <q-card-section v-if="editingTransaction?.salidaId" class="q-pt-none">
          <q-banner class="bg-orange-1 text-orange-9" rounded>
            <template v-slot:avatar>
              <q-icon name="inventory_2" color="orange" />
            </template>
            <div class="text-body2">
              <strong>Registro de Salida:</strong> Este ingreso fue generado automáticamente desde una salida.
              Al editarlo, se actualizará la cantidad de unidades en la salida correspondiente.
            </div>
          </q-banner>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTransaction" class="q-gutter-md">
            <q-select
              v-model="form.tipo"
              :options="tipoOptions"
              label="Tipo de Transacción *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'El tipo es requerido']"
            />
            
            <q-input
              v-model="form.descripcion"
              label="Descripción *"
              outlined
              :rules="[val => !!val || 'La descripción es requerida']"
            />
            
            <q-input
              v-model.number="form.monto"
              label="Monto *"
              type="number"
              step="0.01"
              outlined
              prefix="$"
              :rules="[val => !!val && val > 0 || 'El monto debe ser mayor a 0']"
            />
            
            <q-input
              v-model="form.fecha"
              label="Fecha *"
              type="date"
              outlined
              :rules="[val => !!val || 'La fecha es requerida']"
            />
            
            <q-input
              v-model="form.categoria"
              label="Categoría"
              outlined
            />
            
            <q-input
              v-model="form.referencia"
              label="Referencia/Factura"
              outlined
            />
            
            <q-input
              v-model="form.observaciones"
              label="Observaciones"
              type="textarea"
              outlined
              rows="3"
            />
            
            <!-- Campo para nombre del comprador (solo para transacciones con salidaId) -->
            <q-input
              v-if="editingTransaction?.salidaId"
              v-model="form.nombreComprador"
              label="Nombre del Comprador"
              outlined
              hint="Nombre de la persona que realizó la compra"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="closeDialog" />
          <q-btn color="primary" label="Guardar" @click="saveTransaction" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Confirmación de Eliminación -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Eliminación</div>
        </q-card-section>
        <q-card-section>
          ¿Estás seguro de que deseas eliminar esta transacción?
          <br><strong>{{ transactionToDelete?.descripcion }}</strong>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="deleteDialog = false" />
          <q-btn color="negative" label="Eliminar" @click="deleteTransaction" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useHistorialFinancieroStore, type TransaccionFinanciera, type FiltrosHistorial } from 'src/stores/historialFinanciero';
import { useInversionInicialStore } from 'src/stores/inversionInicial';
import { useFinanzas } from 'src/composables/useFinanzas';
import CalendarioFinanciero from 'src/components/CalendarioFinanciero.vue';
import { api } from 'src/boot/axios';
import { useAuthStore } from "src/stores/auth";

interface TransactionForm {
  tipo: 'ingreso' | 'gasto' | 'venta' | 'compra' | '';
  descripcion: string;
  monto: number | null;
  fecha: string;
  categoria: string;
  referencia: string;
  observaciones: string;
  nombreComprador: string;
}

const $q = useQuasar();
const historialStore = useHistorialFinancieroStore();
const inversionStore = useInversionInicialStore();
const userStore = useAuthStore();
const { syncIngresosFromSalidas, loading: finanzasLoading, ensureDateFormat } = useFinanzas();

// Estado local
const dialog = ref(false);
const deleteDialog = ref(false);
const editingTransaction = ref<TransaccionFinanciera | null>(null);
const transactionToDelete = ref<TransaccionFinanciera | null>(null);
const datosCalendario = ref<Record<string, { ingresos: number; produccion: number; gastos: number }>>({});

// Filtros
const filtros = ref<FiltrosHistorial>({
  fechaInicio: '',
  fechaFin: '',
  tipo: '',
  categoria: '',
  montoMin: undefined,
  montoMax: undefined,
  busqueda: ''
});

// Formulario
const form = ref<TransactionForm>({
  tipo: '',
  descripcion: '',
  monto: null,
  fecha: date.formatDate(new Date(), 'YYYY-MM-DD'),
  categoria: '',
  referencia: '',
  observaciones: '',
  nombreComprador: ''
});

// Opciones
const tipoOptions = [
  { label: 'Ingreso', value: 'ingreso' },
  { label: 'Gasto', value: 'gasto' },
  { label: 'Venta', value: 'venta' },
  { label: 'Compra', value: 'compra' }
];

// Paginación
const pagination = ref({
  sortBy: 'fecha',
  descending: true,
  page: 1,
  rowsPerPage: 15
});

// Función para formatear fechas correctamente para Colombia
const formatDateColombia = (dateString: string) => {
  if (!dateString) return '';
  
  // Evitar problemas de timezone parseando la fecha manualmente
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10);
  const day = parseInt(parts[2]!, 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString;
  
  const localDate = new Date(year, month - 1, day);
  
  return localDate.toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Columnas de la tabla
const columns = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left' as const,
    field: 'fecha',
    sortable: true,
    format: (val: string) => formatDateColombia(val)
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center' as const,
    field: 'tipo',
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
    name: 'categoria',
    label: 'Categoría',
    align: 'left' as const,
    field: 'categoria',
    sortable: true
  },
  {
    name: 'monto',
    label: 'Monto',
    align: 'right' as const,
    field: 'monto',
    sortable: true
  },
  {
    name: 'referencia',
    label: 'Referencia',
    align: 'left' as const,
    field: 'referencia',
    sortable: true
  },
  {
    name: 'nombreComprador',
    label: 'Comprador',
    align: 'left' as const,
    field: 'nombreComprador',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'center' as const,
    field: 'actions'
  }
];

// Computadas del store
const transaccionesFiltradas = computed(() => historialStore.transaccionesFiltradas);
const loading = computed(() => historialStore.loading);
// const categorias = computed(() => historialStore.categorias);

const resumen = computed(() => {
  const transaccionesFiltradas = historialStore.transacciones.filter((t: TransaccionFinanciera) => {
    let cumpleFiltros = true;
    
    if (filtros.value.fechaInicio && filtros.value.fechaInicio !== '') {
      cumpleFiltros = cumpleFiltros && t.fecha >= filtros.value.fechaInicio;
    }
    
    if (filtros.value.fechaFin && filtros.value.fechaFin !== '') {
      cumpleFiltros = cumpleFiltros && t.fecha <= filtros.value.fechaFin;
    }
    
    if (filtros.value.tipo && filtros.value.tipo !== '') {
      cumpleFiltros = cumpleFiltros && t.tipo === filtros.value.tipo;
    }
    
    return cumpleFiltros;
  });
  
  return transaccionesFiltradas.reduce((acc: { totalIngresos: number; totalGastos: number; balance: number; cantidad: number }, t: TransaccionFinanciera) => {
    if (t.tipo === 'ingreso' || t.tipo === 'venta') {
      acc.totalIngresos += t.monto;
    } else if (t.tipo === 'gasto' || t.tipo === 'compra') {
      acc.totalGastos += t.monto;
    }
    acc.balance = acc.totalIngresos - acc.totalGastos;
    acc.cantidad++;
    return acc;
  }, { totalIngresos: 0, totalGastos: 0, balance: 0, cantidad: 0 });
});

// Métodos
const loadTransactions = async () => {
  await historialStore.loadHistorial(filtros.value);
};

const cargarDatosCalendario = async (mes?: number, año?: number) => {
  try {
    const fechaActual = new Date();
    const mesConsulta = mes !== undefined ? mes : fechaActual.getMonth();
    const añoConsulta = año !== undefined ? año : fechaActual.getFullYear();
    
    // Usar el mismo formato que otras páginas para consistencia
    const fechaInicio = new Date(añoConsulta, mesConsulta, 1);
    const fechaFin = new Date(añoConsulta, mesConsulta + 1, 0);
    
    const response = await api.get('/finanzas/datos-diarios', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        id_empresa: userStore.user?.id_empresa
      }
    });
    
    // Forzar reactividad
    datosCalendario.value = { ...response.data };
  } catch (error) {
    console.error('Error al cargar datos del calendario:', error);
  }
};

const onCambioMes = (mes: number, año: number) => {
  void cargarDatosCalendario(mes, año);
};

const syncIngresos = async () => {
  try {
    await syncIngresosFromSalidas();
    await cargarDatosCalendario();
    await loadTransactions();
    $q.notify({
      type: 'positive',
      message: 'Ingresos sincronizados correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error sincronizando ingresos:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al sincronizar ingresos',
      position: 'top'
    });
  }
};

const openTransactionDialog = (transaction?: TransaccionFinanciera) => {
  if (transaction) {
    editingTransaction.value = transaction;
    form.value = {
      tipo: transaction.tipo,
      descripcion: transaction.descripcion,
      monto: transaction.monto,
      fecha: ensureDateFormat(transaction.fecha),
      categoria: transaction.categoria || '',
      referencia: transaction.referencia || '',
      observaciones: transaction.observaciones || '',
      nombreComprador: transaction.nombreComprador || ''
    };
  } else {
    editingTransaction.value = null;
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editingTransaction.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = {
    tipo: '',
    descripcion: '',
    monto: null,
    fecha: date.formatDate(new Date(), 'YYYY-MM-DD'),
    categoria: '',
    referencia: '',
    observaciones: '',
    nombreComprador: ''
  };
};

const saveTransaction = async () => {
  if (!form.value.tipo || !form.value.descripcion || !form.value.monto || !form.value.fecha) {
    $q.notify({
      type: 'negative',
      message: 'Por favor complete todos los campos requeridos'
    });
    return;
  }

  try {
    if (editingTransaction.value) {
      // Editar transacción existente
      const result = await historialStore.updateTransaccion(editingTransaction.value.id, {
        tipo: form.value.tipo,
        descripcion: form.value.descripcion,
        monto: form.value.monto || 0,
        fecha: ensureDateFormat(form.value.fecha),
        categoria: form.value.categoria,
        referencia: form.value.referencia,
        observaciones: form.value.observaciones,
        nombreComprador: form.value.nombreComprador
      });

      if (result.success) {
        $q.notify({
          type: 'positive',
          message: 'Transacción actualizada exitosamente'
        });
        closeDialog();
      } else {
        $q.notify({
          type: 'negative',
          message: result.error || 'Error al actualizar la transacción'
        });
      }
    } else {
      // Crear nueva transacción - por ahora no disponible
      $q.notify({
        type: 'negative',
        message: 'La creación de nuevas transacciones no está disponible desde esta página'
      });
    }
  } catch (error) {
    console.error('Error saving transaction:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la transacción'
    });
  }
};

const editTransaction = (transaction: TransaccionFinanciera) => {
  openTransactionDialog(transaction);
};

const confirmDelete = (transaction: TransaccionFinanciera) => {
  transactionToDelete.value = transaction;
  deleteDialog.value = true;
};

const deleteTransaction = async () => {
  if (!transactionToDelete.value) return;
  
  try {
    const result = await historialStore.deleteTransaccion(transactionToDelete.value.id);
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Transacción eliminada'
      });
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Error al eliminar la transacción'
      });
    }
    
    deleteDialog.value = false;
    transactionToDelete.value = null;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar la transacción'
    });
  }
};

const aplicarFiltros = async () => {
  historialStore.aplicarFiltros(filtros.value);
  await historialStore.loadHistorial(filtros.value);
  $q.notify({
    type: 'info',
    message: 'Filtros aplicados'
  });
};

const limpiarFiltros = async () => {
  filtros.value = {
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    busqueda: '',
    categoria: '',
    montoMin: undefined,
    montoMax: undefined
  };
  historialStore.limpiarFiltros();
  await historialStore.loadHistorial();
};

// Filtros rápidos de fecha
const filtrarHoy = async () => {
  const hoy = new Date().toISOString().split('T')[0] as string;
  filtros.value.fechaInicio = hoy;
  filtros.value.fechaFin = hoy;
  await aplicarFiltros();
};

const filtrarUltimaSemana = async () => {
  const hoy = new Date();
  const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  filtros.value.fechaInicio = semanaAtras.toISOString().split('T')[0] as string;
  filtros.value.fechaFin = hoy.toISOString().split('T')[0] as string;
  await aplicarFiltros();
};

const filtrarUltimoMes = async () => {
  const hoy = new Date();
  const mesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
  filtros.value.fechaInicio = mesAtras.toISOString().split('T')[0] as string;
  filtros.value.fechaFin = hoy.toISOString().split('T')[0] as string;
  await aplicarFiltros();
};

const filtrarUltimosTresMeses = async () => {
  const hoy = new Date();
  const tresMesesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 3, hoy.getDate());
  filtros.value.fechaInicio = tresMesesAtras.toISOString().split('T')[0] as string;
  filtros.value.fechaFin = hoy.toISOString().split('T')[0] as string;
  await aplicarFiltros();
};

const filtrarEsteAno = async () => {
  const hoy = new Date();
  const inicioAno = new Date(hoy.getFullYear(), 0, 1);
  filtros.value.fechaInicio = inicioAno.toISOString().split('T')[0] as string;
  filtros.value.fechaFin = hoy.toISOString().split('T')[0] as string;
  await aplicarFiltros();
};

const onRequest = (props: { pagination: typeof pagination.value }) => {
  pagination.value = props.pagination;
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'ingreso':
    case 'venta':
      return 'green';
    case 'gasto':
    case 'compra':
      return 'red';
    default: return 'grey';
  }
};

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'ingreso': return 'Ingreso';
    case 'gasto': return 'Gasto';
    case 'venta': return 'Venta';
    case 'compra': return 'Compra';
    default: return tipo;
  }
};

// Función para formatear moneda sin abreviaciones
const formatCurrency = (amount: number) => {
  return amount.toLocaleString();
};

// Lifecycle
onMounted(() => {
  void loadTransactions();
  void cargarDatosCalendario();
});
</script>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.q-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-h4 {
  font-weight: 600;
}

.text-subtitle1 {
  opacity: 0.8;
}

/* Estilos para las tarjetas de resumen */
.summary-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.summary-card__content {
  display: flex;
  align-items: center;
  padding: 24px;
  position: relative;
  z-index: 2;
}

.summary-card__icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.summary-card__info {
  flex: 1;
}

.summary-card__value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.summary-card__value.text-small {
  font-size: 1.4rem;
}

.summary-card__label {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tarjeta de Ingresos */
.summary-card--ingresos {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%);
  color: white;
}

.summary-card--ingresos::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

/* Tarjeta de Gastos */
.summary-card--gastos {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
  color: white;
}

.summary-card--gastos::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

/* Tarjeta de Balance Positivo */
.summary-card--balance-positive {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%);
  color: white;
}

.summary-card--balance-positive::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

/* Tarjeta de Balance Negativo */
.summary-card--balance-negative {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  color: white;
}

.summary-card--balance-negative::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

/* Tarjeta de Transacciones */
.summary-card--transacciones {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  color: white;
}

.summary-card--transacciones::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .q-page {
    padding: 1.5rem;
  }
  
  .summary-card__content {
    padding: 20px;
  }
  
  .summary-card__value {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .q-page {
    padding: 1rem;
  }
  
  /* Header responsivo */
  .row.items-center.justify-between {
    flex-direction: column;
    align-items: stretch !important;
    gap: 1rem;
  }
  
  .col-auto {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .col-auto .q-btn {
    width: 100%;
    margin: 0 !important;
  }
  
  .text-h4 {
    font-size: 1.75rem;
  }
  
  .text-subtitle1 {
    font-size: 0.9rem;
  }
  
  /* Filtros responsivos */
  .row.q-gutter-md {
    margin: 0 !important;
  }
  
  .row.q-gutter-md > div {
    margin: 0 0 1rem 0 !important;
    width: 100% !important;
    max-width: none !important;
  }
  
  /* Tarjetas de resumen */
  .summary-card {
    margin-bottom: 1rem;
  }
  
  .summary-card__content {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .summary-card__icon {
    margin-right: 0;
    width: 50px;
    height: 50px;
  }
  
  .summary-card__value {
    font-size: 1.4rem;
  }
  
  .summary-card__label {
    font-size: 0.8rem;
  }
  
  /* Inversión inicial responsiva */
  .bg-orange-1 .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .bg-orange-1 .col-12.col-md-3 {
    text-align: center;
  }
  
  .bg-orange-1 .text-h5,
  .bg-orange-1 .text-h6 {
    font-size: 1.2rem;
  }
  
  /* Tabla responsiva */
  .q-table {
    font-size: 0.8rem;
  }
  
  .q-table th,
  .q-table td {
    padding: 8px 4px;
  }
  
  /* Ocultar columnas menos importantes en móvil */
  .q-table th:nth-child(4),
  .q-table td:nth-child(4),
  .q-table th:nth-child(6),
  .q-table td:nth-child(6) {
    display: none;
  }
}

@media (max-width: 480px) {
  .q-page {
    padding: 0.75rem;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
  
  .q-mb-lg {
    margin-bottom: 1rem !important;
  }
  
  /* Tarjetas de resumen más compactas */
  .summary-card__content {
    padding: 12px;
  }
  
  .summary-card__icon {
    width: 40px;
    height: 40px;
  }
  
  .summary-card__value {
    font-size: 1.2rem;
  }
  
  .summary-card__label {
    font-size: 0.75rem;
  }
  
  /* Inversión inicial más compacta */
  .bg-orange-1 .text-h5,
  .bg-orange-1 .text-h6 {
    font-size: 1rem;
  }
  
  .bg-orange-1 .text-subtitle2 {
    font-size: 0.8rem;
  }
  
  /* Tabla más compacta */
  .q-table {
    font-size: 0.7rem;
  }
  
  .q-table th,
  .q-table td {
    padding: 6px 2px;
  }
  
  /* Mostrar solo columnas esenciales */
  .q-table th:nth-child(3),
  .q-table td:nth-child(3) {
    display: none;
  }
  
  /* Botones de acción más pequeños */
  .q-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  /* Diálogos responsivos */
  .q-dialog .q-card {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
}
</style>