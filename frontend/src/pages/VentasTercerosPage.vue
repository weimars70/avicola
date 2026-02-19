<template>
  <q-page class="modern-page">
    <div class="page-container">
      <!-- Header Moderno (Gradiente Verde) -->
      <div class="modern-header animate-fade-in-down">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="icon-wrapper">
              <q-icon name="sell" class="header-icon" />
            </div>
            <div>
              <h1 class="page-title">Ventas a Terceros</h1>
              <p class="page-subtitle">Gestión de ventas externas y clientes</p>
            </div>
          </div>
          <div class="header-actions">
            <!-- View Mode Toggle -->
            <div class="view-toggle-container">
              <q-btn-group unelevated class="view-toggle">
                <q-btn
                  :class="{'active-view': viewMode === 'cards'}"
                  icon="grid_view"
                  @click="viewMode = 'cards'"
                  flat
                  dense
                  padding="sm"
                >
                  <q-tooltip>Vista Tarjetas</q-tooltip>
                </q-btn>
                <div class="divider"></div>
                <q-btn
                  :class="{'active-view': viewMode === 'table'}"
                  icon="table_chart"
                  @click="viewMode = 'table'"
                  flat
                  dense
                  padding="sm"
                >
                  <q-tooltip>Vista Tabla</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>

            <q-btn
              label="Nueva Venta"
              icon="add"
              class="btn-glass"
              @click="openDialog()"
            />
            <q-btn
              icon="refresh"
              flat
              round
              color="white"
              class="refresh-btn"
              @click="fetchData()"
            >
              <q-tooltip>Actualizar datos</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- KPIs Section -->
      <div class="kpi-section animate-fade-in-up">
        <div class="kpi-grid">
          <q-card class="kpi-card glass-effect kpi-primary">
            <div class="kpi-content">
              <div class="kpi-icon-circle">
                <q-icon name="point_of_sale" />
              </div>
              <div class="kpi-data">
                <div class="kpi-value">{{ totalVentas }}</div>
                <div class="kpi-label">Total Ventas</div>
              </div>
            </div>
             <div class="kpi-trend">
              <q-icon name="trending_up" />
              <span>Transacciones</span>
            </div>
          </q-card>

          <q-card class="kpi-card glass-effect kpi-success">
            <div class="kpi-content">
              <div class="kpi-icon-circle">
                <q-icon name="attach_money" />
              </div>
              <div class="kpi-data">
                <div class="kpi-value">${{ formatNumber(totalIngresado) }}</div>
                <div class="kpi-label">Total Ingresado</div>
              </div>
            </div>
            <div class="kpi-trend">
              <q-icon name="savings" />
              <span>Ingresos reales</span>
            </div>
          </q-card>

          <q-card class="kpi-card glass-effect kpi-warning">
            <div class="kpi-content">
              <div class="kpi-icon-circle">
                <q-icon name="pending_actions" />
              </div>
              <div class="kpi-data">
                <div class="kpi-value">{{ ventasPendientes }}</div>
                <div class="kpi-label">Pendientes</div>
              </div>
            </div>
            <div class="kpi-trend text-warning">
              <q-icon name="warning" />
              <span>Por cobrar</span>
            </div>
          </q-card>

          <q-card class="kpi-card glass-effect kpi-info">
            <div class="kpi-content">
              <div class="kpi-icon-circle">
                 <q-icon name="show_chart" />
              </div>
              <div class="kpi-data">
                <div class="kpi-value">${{ formatNumber(promedioVenta) }}</div>
                <div class="kpi-label">Ticket Promedio</div>
              </div>
            </div>
             <div class="kpi-trend">
              <span>Valor medio</span>
            </div>
          </q-card>
        </div>
      </div>

       <!-- Filtros y Búsqueda -->
      <div class="filters-section animate-fade-in-up delay-100">
        <q-card class="filter-card">
          <q-card-section class="q-pa-sm">
            <div class="filter-row">
              <q-input
                v-model="filter.search"
                placeholder="Buscar por cliente, factura..."
                dense
                outlined
                class="search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-select
                v-model="filter.estado"
                :options="estadoOptions"
                label="Filtrar por Estado"
                dense
                outlined
                emit-value
                map-options
                clearable
                class="filter-select"
              >
                <template v-slot:prepend>
                  <q-icon name="filter_list" />
                </template>
              </q-select>
              <q-space class="gt-xs" />
               <div class="text-caption text-grey-7 self-center gt-sm">
                Mostrando {{ filteredVentas.length }} registros
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Content Area -->
      <div class="content-area animate-fade-in-up delay-200">
        
        <!-- CARD VIEW -->
        <div v-if="viewMode === 'cards'" class="cards-grid">
          <q-card
            v-for="venta in filteredVentas"
            :key="venta.id"
            class="venta-card-view"
          >
            <!-- Badge de Estado -->
             <div class="card-status-strip" :class="getEstadoColor(venta.estado || 'PENDIENTE')"></div>
            
            <q-card-section class="q-pb-none">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-bold text-primary">{{ venta.tercero?.nombre || 'Cliente Desconocido' }}</div>
                <q-chip
                  :color="getEstadoColor(venta.estado || 'PENDIENTE')"
                  text-color="white"
                  size="sm"
                  class="status-chip"
                >
                  {{ venta.estado || 'PENDIENTE' }}
                </q-chip>
              </div>
              <div class="text-caption text-grey-6 flex items-center gap-1">
                <q-icon name="tag" size="xs"/> 
                Factura: {{ venta.numeroFactura || 'S/N' }}
              </div>
            </q-card-section>
            
            <q-card-section class="q-py-sm">
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-caption text-grey">Fecha</div>
                <div class="text-body2 font-medium">{{ formatDate(venta.fecha) }}</div>
              </div>
              <div class="row items-center justify-between">
                <div class="text-caption text-grey">Total</div>
                <div class="text-h6 text-green-7 force-dark-text">${{ formatNumber(Number(venta.total)) }}</div>
              </div>
              <div class="canastas-preview q-mt-sm">
                <div class="text-xs text-grey-7 text-italic ellipsis-2-lines">
                   <q-icon name="shopping_basket" size="xs" class="q-mr-xs"/>
                   {{ canastaResumenVenta(venta) || 'Sin detalles' }}
                </div>
              </div>
            </q-card-section>
            
            <q-separator />

            <q-card-actions align="right" class="card-actions bg-grey-1">
              <q-btn flat round color="grey-7" icon="edit" size="sm" @click="openDialog(venta)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                v-if="venta.estado !== 'PAGADO'"
                flat round color="positive" icon="done_all" size="sm"
                @click="markVentaPagada(venta.id)"
              >
                <q-tooltip>Marcar como Pagada</q-tooltip>
              </q-btn>
              <q-btn flat round color="negative" icon="delete_outline" size="sm" @click="deleteVenta(venta.id)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>

        <!-- TABLE VIEW -->
        <q-card v-else class="modern-table-card">
          <q-table
            :rows="filteredVentas"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
           <template v-slot:body-cell-fecha="props">
              <q-td :props="props">
                <div class="flex items-center gap-2">
                   <q-icon name="event" class="text-grey-6" />
                   {{ formatDate(props.row.fecha) }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-tercero="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.tercero?.nombre || 'N/A' }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-detalles="props">
              <q-td :props="props">
                 <div class="text-caption text-grey-8" style="white-space: normal; min-width: 200px;">
                  {{ canastaResumenVenta(props.row) || '—' }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-total="props">
              <q-td :props="props">
                <div class="text-weight-bold text-green-7">${{ formatNumber(Number(props.row.total)) }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip
                  :color="getEstadoColor(props.row.estado)"
                  text-color="white"
                  :label="props.row.estado"
                  size="sm"
                  class="cursor-pointer shadow-1"
                >
                   <q-popup-edit v-model="props.row.estado" title="Cambiar estado" buttons v-slot="scope" @save="val => updateEstadoVenta(props.row.id, val as string)">
                    <q-select v-model="scope.value" :options="['PENDIENTE','PAGADO','PARCIAL']" dense outlined />
                  </q-popup-edit>
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <div class="row justify-center q-gutter-xs">
                  <q-btn flat round color="primary" icon="edit" size="sm" @click="openDialog(props.row)">
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.estado !== 'PAGADO'" flat round color="positive" icon="done_all" size="sm" @click="markVentaPagada(props.row.id)">
                    <q-tooltip>Marcar como Pagada</q-tooltip>
                  </q-btn>
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteVenta(props.row.id)">
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

       <!-- Empty State -->
      <div v-if="filteredVentas.length === 0" class="empty-state animate-fade-in-up">
        <q-icon name="remove_shopping_cart" size="5rem" class="text-grey-4" />
        <h3 class="text-h6 text-grey-6 q-mt-md">No se encontraron ventas</h3>
        <p class="text-grey-5">Intenta ajustar los filtros o crea una nueva venta.</p>
        <q-btn label="Nueva Venta" icon="add" color="green-6" flat @click="openDialog()" />
      </div>

    </div>

    <!-- DIALOG CON DISEÑO MEJORADO -->
    <q-dialog v-model="dialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="modern-dialog" :style="'width: 900px; max-width: 95vw; height: 90vh; display: flex; flex-direction: column;'">
        <div class="dialog-header-bg">
          <div class="dialog-header-content">
             <div class="row items-center">
                <div class="dialog-icon-box">
                  <q-icon name="sell" />
                </div>
                <div>
                  <div class="text-subtitle2 text-white opacity-80">{{ editing ? 'Edición de Registro' : 'Nuevo Registro' }}</div>
                  <div class="text-h6 text-white text-weight-bold">{{ editing ? 'Editar Venta' : 'Nueva Venta' }}</div>
                </div>
             </div>
             <q-btn icon="close" flat round dense class="text-white" v-close-popup @click="closeDialog" />
          </div>
        </div>

        <q-card-section class="dialog-body">
          <q-form @submit="saveVenta" class="q-gutter-md">
            
            <div class="form-grid">
              <!-- Columna Izquierda: Datos Generales -->
              <div class="form-col">
                <div class="section-label">Datos del Cliente</div>
                <q-select 
                  v-model="form.idTercero" 
                  :options="terceroOptions" 
                  label="Cliente *" 
                  outlined 
                  dense 
                  emit-value 
                  map-options
                  class="input-modern"
                >
                    <template v-slot:prepend><q-icon name="business" color="green-6"/></template>
                </q-select>

                 <div class="row q-col-gutter-sm">
                   <div class="col-6">
                      <q-input v-model="form.fecha" label="Fecha *" type="date" outlined dense class="input-modern" />
                   </div>
                   <div class="col-6">
                      <q-input v-model="form.numeroFactura" label="N° Factura" outlined dense class="input-modern">
                        <template v-slot:prepend><q-icon name="receipt" color="green-6"/></template>
                      </q-input>
                   </div>
                 </div>

                 <div class="row q-col-gutter-sm q-mt-xs">
                    <div class="col-6">
                       <q-select v-model="form.estado" :options="['PENDIENTE','PAGADO','PARCIAL']" label="Estado *" outlined dense class="input-modern" />
                    </div>
                    <div class="col-6">
                       <q-input v-model="form.formaPago" label="Forma Pago" outlined dense class="input-modern" />
                    </div>
                 </div>
                 
                 <q-input 
                    v-model="form.observaciones" 
                    label="Observaciones" 
                    outlined 
                    dense 
                    type="textarea" 
                    rows="2"
                    class="input-modern q-mt-sm" 
                 />
              </div>

              <!-- Columna Derecha: Detalle -->
              <div class="form-col">
                <div class="row items-center justify-between q-mb-sm">
                   <div class="section-label q-mb-none">Productos / Canastas</div>
                   <q-btn label="Agregar Item" icon="add" color="green-6" size="sm" unelevated rounded @click="addDetalle()" />
                </div>

                <div class="detalles-scroll-area custom-scroll">
                   <div v-if="form.detalles.length === 0" class="empty-detalles">
                      <q-icon name="add_shopping_cart" size="md" />
                      <div>Agrega productos a la venta</div>
                   </div>

                   <transition-group name="list" tag="div">
                      <div v-for="(detalle, index) in form.detalles" :key="index" class="detalle-card animate-fade-in-right">
                          <div class="detalle-header">
                             <span class="detail-index">#{{ index + 1 }}</span>
                             <q-btn icon="close" flat round dense color="grey-6" size="sm" @click="removeDetalle(index)" />
                          </div>
                          <div class="detalle-content">
                             <q-select 
                                v-model="detalle.canastaId" 
                                :options="canastaOptions" 
                                label="Canasta *" 
                                outlined 
                                dense 
                                emit-value 
                                map-options
                                class="col-12 q-mb-sm input-white"
                              />
                             <div class="row q-col-gutter-sm">
                                <div class="col-4">
                                   <q-input v-model.number="detalle.cantidad" label="Cant." type="number" outlined dense class="input-white" />
                                </div>
                                <div class="col-4">
                                  <q-input v-model.number="detalle.precioUnitario" label="Precio" prefix="$" type="number" outlined dense class="input-white" />
                                </div>
                                <div class="col-4">
                                   <q-select 
                                     v-model.number="detalle.inventarioOrigen" 
                                     :options="[{label:'Propias',value:1},{label:'Terceros',value:2}]" 
                                     label="Origen" 
                                     outlined 
                                     dense 
                                     emit-value 
                                     map-options
                                     class="input-white"
                                   />
                                </div>
                             </div>
                             <div class="detalle-subtotalq">
                                Total Item: <span>${{ formatNumber(detalle.cantidad * detalle.precioUnitario) }}</span>
                             </div>
                          </div>
                      </div>
                   </transition-group>
                </div>
                
                <div class="total-summary q-mt-md">
                   <div class="row justify-between items-center">
                     <span class="text-grey-7">Total Venta:</span>
                     <span class="text-green-8 text-h5 text-weight-bold">${{ formatNumber(calcularTotal()) }}</span>
                   </div>
                </div>

              </div>
            </div>

          </q-form>
        </q-card-section>

        <q-card-actions class="dialog-footer">
          <q-btn label="Cancelar" flat color="grey-8" @click="closeDialog" />
          <q-btn label="Guardar Venta" icon="save" color="green-7" unelevated padding="8px 20px" rounded @click="saveVenta" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVentasTercerosStore } from 'src/stores/ventas-terceros';
import { useTercerosStore } from 'src/stores/terceros';
import { useCanastasStore } from 'src/stores/canastas';
import { useQuasar, date } from 'quasar';
import type { Venta, CreateVentaDto, UpdateVentaDto } from 'src/types/ventas-terceros';

const $q = useQuasar();
const ventasStore = useVentasTercerosStore();
const tercerosStore = useTercerosStore();
const canastasStore = useCanastasStore();

const viewMode = ref<'cards' | 'table'>('cards');
const dialog = ref(false);
const editing = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);

const form = ref<CreateVentaDto>({
  fecha: new Date().toISOString().split('T')[0] || '',
  idTercero: 0,
  numeroFactura: '',
  estado: 'PENDIENTE',
  formaPago: '',
  observaciones: '',
  detalles: []
});

const columns = [
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' as const, sortable: true },
  { name: 'tercero', label: 'Cliente', field: 'tercero', align: 'left' as const },
  { name: 'numeroFactura', label: 'N° Factura', field: 'numeroFactura', align: 'left' as const },
  { name: 'detalles', label: 'Detalle Canastas', field: 'detalles', align: 'left' as const },
  { name: 'total', label: 'Total', field: 'total', align: 'right' as const, sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' as const, sortable: true },
  { name: 'acciones', label: '', field: 'acciones', align: 'center' as const }
];

const terceroOptions = computed(() => 
  tercerosStore.terceros
    .filter(t => t.cliente && t.activo)
    .map(t => ({ label: t.nombre, value: t.codigo }))
);

const formatDate = (fechaISO: string) => {
  return date.formatDate(fechaISO, 'DD/MM/YYYY');
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'PAGADO': return 'positive';
    case 'PENDIENTE': return 'warning';
    case 'PARCIAL': return 'info';
    default: return 'grey';
  }
};

const addDetalle = () => {
  form.value.detalles.push({
    cantidad: 1,
    precioUnitario: 0,
    canastaId: '',
    inventarioOrigen: 2 // Por defecto terceros
  });
};

const removeDetalle = (index: number) => {
  form.value.detalles.splice(index, 1);
};

const calcularTotal = () => {
  return form.value.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
};

const formatNumber = (value: number) => {
  if (!value || isNaN(value)) return '0';
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const canastaOptions = computed(() =>
  (canastasStore.canastas || []).map(c => ({
    label: `${c.nombre} · ${c.tipoHuevo?.nombre || ''} · ${c.unidadesPorCanasta}u` ,
    value: c.id
  }))
);

// KPIs
const totalVentas = computed(() => ventasStore.ventas.length);
const ventasPendientes = computed(() => ventasStore.ventas.filter(v => v.estado === 'PENDIENTE').length);
const totalIngresado = computed(() => ventasStore.ventas.reduce((s, v) => s + Number(v.total), 0));
const promedioVenta = computed(() => totalVentas.value > 0 ? totalIngresado.value / totalVentas.value : 0);

const filter = ref<{ search: string; estado: string | null }>({ search: '', estado: null });
const estadoOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Parcial', value: 'PARCIAL' }
];

const filteredVentas = computed(() => {
  let rows = ventasStore.ventas;
  const s = filter.value.search?.toLowerCase().trim();
  if (s) {
    rows = rows.filter(v =>
      (v.tercero?.nombre || '').toLowerCase().includes(s) ||
      (v.numeroFactura || '').toLowerCase().includes(s)
    );
  }
  if (filter.value.estado) {
    rows = rows.filter(v => v.estado === filter.value.estado);
  }
  return rows.sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
});

const canastaResumenVenta = (v: Venta): string => {
  const counts = new Map<string, number>();
  (v.detalles || []).forEach(d => {
    const id = d.canastaId || '';
    const nombre = (canastasStore.canastas.find(x => x.id === id)?.nombre) || 'Canasta';
    const prev = counts.get(nombre) || 0;
    counts.set(nombre, prev + Number(d.cantidad || 0));
  });
  return Array.from(counts.entries()).map(([nombre, qty]) => `${nombre}: ${qty}`).join(', ');
};

const openDialog = (venta?: Venta) => {
  if (venta) {
    editing.value = true;
    editingId.value = venta.id;
    form.value = {
      fecha: venta.fecha,
      idTercero: venta.idTercero,
      numeroFactura: venta.numeroFactura,
      estado: venta.estado,
      formaPago: venta.formaPago,
      observaciones: venta.observaciones,
      detalles: venta.detalles?.map(d => ({
        descripcion: d.descripcion || undefined,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        canastaId: d.canastaId,
        inventarioOrigen: d.inventarioOrigen || 1
      })) || []
    };
  } else {
    editing.value = false;
    editingId.value = null;
    form.value = {
      fecha: new Date().toISOString().split('T')[0] || '',
      idTercero: 0,
      numeroFactura: '',
      estado: 'PENDIENTE',
      formaPago: '',
      observaciones: '',
      detalles: []
    };
    addDetalle();
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editing.value = false;
  editingId.value = null;
};

const saveVenta = async () => {
  if (saving.value) return;

  if (form.value.detalles.length === 0) {
    $q.notify({ type: 'negative', message: 'Debe agregar al menos un detalle' });
    return;
  }

  const faltanCanastas = form.value.detalles.some(d => !d.canastaId || String(d.canastaId).trim().length === 0);
  if (faltanCanastas) {
    $q.notify({ type: 'negative', message: 'Seleccione una canasta en cada detalle' });
    return;
  }

  if (!form.value.idTercero || form.value.idTercero === 0) {
    $q.notify({ type: 'negative', message: 'Debe seleccionar un cliente' });
    return;
  }

  saving.value = true;
  try {
    if (editing.value && editingId.value) {
      await ventasStore.updateVenta(editingId.value, form.value as UpdateVentaDto);
      $q.notify({ type: 'positive', message: 'Venta actualizada exitosamente' });
    } else {
      await ventasStore.createVenta(form.value);
      $q.notify({ type: 'positive', message: 'Venta creada exitosamente' });
    }
    closeDialog();
    await fetchData();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al guardar la venta';
    $q.notify({
      type: 'negative',
      message: msg
    });
  } finally {
    saving.value = false;
  }
};

const deleteVenta = (id: string) => {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: '¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await ventasStore.deleteVenta(id);
        $q.notify({ type: 'positive', message: 'Venta eliminada' });
        await fetchData();
      } catch {
        $q.notify({ type: 'negative', message: 'Error al eliminar' });
      }
    })();
  });
};

const markVentaPagada = async (id: string) => {
  try {
    await ventasStore.updateVenta(id, { estado: 'PAGADO' } as UpdateVentaDto);
    $q.notify({ type: 'positive', message: 'Venta marcada como pagada' });
    await fetchData();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al marcar como pagada' });
  }
};

const updateEstadoVenta = async (id: string, estado: string) => {
  try {
    await ventasStore.updateVenta(id, { estado } as UpdateVentaDto);
    $q.notify({ type: 'positive', message: 'Estado actualizado' });
    await fetchData();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al actualizar estado' });
  }
};

const fetchData = async () => {
  await Promise.all([
    ventasStore.fetchVentas(),
    tercerosStore.fetchTerceros(),
    canastasStore.fetchCanastas()
  ]);
};

onMounted(() => {
  void fetchData();
});
</script>

<style scoped>
.modern-page {
  background: #f0f4f8;
  min-height: 100vh;
  padding: 1.5rem;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styles */
.modern-header {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  height: 140px;
}

.header-backdrop {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  opacity: 0.9;
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  height: 100%;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}

.icon-wrapper {
  background: rgba(255,255,255,0.2);
  padding: 1rem;
  border-radius: 16px;
  backdrop-filter: blur(5px);
}

.header-icon {
  font-size: 2.5rem;
  color: white;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-glass {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  font-weight: 600;
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

/* Toggle Styles */
.view-toggle-container {
  background: rgba(255,255,255,0.2);
  padding: 4px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.view-toggle .q-btn {
  border-radius: 8px;
  color: #e0e0e0;
}

.view-toggle .active-view {
  background: white;
  color: #11998e;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.divider {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.3);
  margin: 0 4px;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  border-radius: 20px;
  padding: 1.5rem;
  border: none;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: transform 0.3s ease;
  overflow: hidden;
  position: relative;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-primary { border-left: 5px solid #11998e; }
.kpi-info { border-left: 5px solid #38ef7d; }
.kpi-warning { border-left: 5px solid #ff9a9e; }
.kpi-success { border-left: 5px solid #a8c0ff; }

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1rem;
}

.kpi-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: #f5f7fa;
  color: #555;
}

.kpi-primary .kpi-icon-circle { background: #e0f2f1; color: #11998e; }
.kpi-info .kpi-icon-circle { background: #e8f5e9; color: #38ef7d; }
.kpi-warning .kpi-icon-circle { background: #fff0f3; color: #ff9a9e; }
.kpi-success .kpi-icon-circle { background: #e3f2fd; color: #a8c0ff; }

.kpi-data {
  flex: 1;
}

.kpi-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1.2;
}

.kpi-label {
  font-size: 0.9rem;
  color: #8898aa;
  font-weight: 600;
}

.kpi-trend {
  font-size: 0.8rem;
  color: #8898aa;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Filters */
.filters-section { margin-bottom: 1.5rem; }
.filter-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; }
.filter-row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.search-input { min-width: 300px; }
.filter-select { min-width: 200px; }

/* Cards Grid View */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.venta-card-view {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
  overflow: hidden;
  position: relative;
}

.venta-card-view:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.card-status-strip { height: 4px; width: 100%; position: absolute; top: 0; left: 0; }
.bg-positive { background: #2dce89 !important; }
.bg-warning { background: #fb6340 !important; }
.bg-info { background: #11cdef !important; }

/* Table View */
.modern-table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

/* Dialog Styles */
.modern-dialog { border-radius: 20px; overflow: hidden; }
.dialog-header-bg {
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  padding: 1.5rem;
}
.dialog-header-content { display: flex; justify-content: space-between; align-items: flex-start; }
.dialog-icon-box {
  background: rgba(255,255,255,0.2);
  width: 45px; height: 45px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-right: 1rem;
}
.dialog-body { background: #f8f9fa; flex: 1; overflow-y: auto; padding: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; height: 100%; }
.form-col { display: flex; flex-direction: column; height: 100%; }
.section-label { font-size: 0.9rem; font-weight: 700; color: #11998e; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }

.input-modern :deep(.q-field__control) {
  background: white; border-radius: 10px; border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.input-modern :deep(.q-field__control:hover) { border-color: #11998e; }

.detalles-scroll-area {
  flex: 1; overflow-y: auto; padding-right: 0.5rem; border: 1px solid #e9ecef; border-radius: 12px; background: #fff; padding: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  min-height: 200px;
}
.detalle-card {
  background: #f8f9fa; border-radius: 10px; padding: 0.8rem; margin-bottom: 0.8rem; border: 1px solid #e9ecef; position: relative;
  transition: all 0.2s;
}
.detalle-card:hover { border-color: #cbd5e0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.detalle-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; align-items: center; }
.detail-index { font-weight: bold; color: #adb5bd; font-size: 0.8rem; }
.input-white :deep(.q-field__control) { background: white; }
.detalle-subtotalq { text-align: right; font-size: 0.9rem; color: #525f7f; font-weight: 500; margin-top: 0.5rem; }
.detalle-subtotalq span { font-weight: 800; color: #2dce89; font-size: 1rem; margin-left: 0.5rem; }

.dialog-footer { background: white; border-top: 1px solid #e9ecef; padding: 1rem 1.5rem; justify-content: flex-end; }

.empty-detalles { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #adb5bd; gap: 0.5rem; }

/* Scrollbar */
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
.custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; }

.animate-fade-in-down { animation: fadeInDown 0.5s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
.animate-fade-in-right { animation: fadeInRight 0.3s ease-out; }

@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; gap: 1rem; }
  .modern-header { height: auto; text-align: center; }
  .header-content { flex-direction: column; gap: 1rem; padding: 1.5rem; }
  .header-info { flex-direction: column; text-align: center; }
}
</style>
