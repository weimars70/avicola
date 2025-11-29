<template>
  <q-page class="modern-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <q-icon name="shopping_cart" class="header-icon" />
          <div>
            <h1 class="page-title">Compras a Terceros</h1>
            <p class="page-subtitle">Registra y controla compras externas</p>
          </div>
        </div>
        <div class="row q-gutter-md items-center">
          <q-btn class="add-btn" color="primary" icon="add" label="Nueva Compra" @click="openDialog()" />
          <q-btn color="secondary" icon="refresh" label="Actualizar" @click="fetchData()" />
        </div>
      </div>
    </div>

    <div class="kpi-section">
      <div class="kpi-grid">
        <q-card class="kpi-card kpi-primary">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="shopping_cart" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalCompras }}</div>
              <div class="kpi-label">Total Compras</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-warning">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="hourglass_bottom" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ comprasPendientes }}</div>
              <div class="kpi-label">Pendientes</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-success">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="check_circle" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ comprasPagadas }}</div>
              <div class="kpi-label">Pagadas</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-info">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="attach_money" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${{ formatNumber(totalGastado) }}</div>
              <div class="kpi-label">Total Gastado</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="filter-card">
      <q-card-section>
        <div class="filter-content">
          <q-input v-model="filter.search" placeholder="Buscar por proveedor o factura" outlined dense class="search-input">
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
          <q-select v-model="filter.estado" :options="estadoOptions" label="Estado" outlined dense clearable emit-value map-options class="filter-select" />
          <q-btn color="primary" icon="refresh" label="Actualizar" @click="fetchData" class="refresh-btn" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-table
        :rows="filteredCompras"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="comprasStore.loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-tercero="props">
          <q-td :props="props">
            {{ props.row.tercero?.nombre || 'N/A' }}
          </q-td>
        </template>
        <template v-slot:body-cell-detalles="props">
          <q-td :props="props">
            {{ canastaResumen(props.row) || '—' }}
          </q-td>
        </template>
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            ${{ formatNumber(Number(props.row.total)) }}
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip :color="getEstadoColor(getCompraEstado(props.row))" text-color="white" :label="getCompraEstado(props.row)" size="sm">
              <q-popup-edit v-model="filter.estado" title="Cambiar estado" buttons v-slot="scope" @save="val => updateEstadoCompra(props.row.id, val as string)">
                <q-select v-model="scope.value" :options="['PENDIENTE','PAGADO','PARCIAL']" dense outlined />
              </q-popup-edit>
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn flat round color="primary" icon="edit" size="sm" @click="openDialog(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteCompra(props.row.id)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn v-if="props.row.estado !== 'PAGADO'" flat round color="positive" icon="check_circle" size="sm" @click="markCompraPagada(props.row.id)">
              <q-tooltip>Marcar como Pagado</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog" persistent :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-responsive" :style="$q.screen.lt.sm ? 'width: 100%' : 'min-width: 600px; max-width: 90vw'">
        <q-card-section class="dialog-header">
          <div class="text-h6">{{ editing ? 'Editar Compra' : 'Nueva Compra' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
        </q-card-section>
        <q-card-section class="q-pa-md-lg">
          <q-form @submit="saveCompra" class="q-gutter-md">
            <q-select v-model="form.idTercero" :options="terceroOptions" label="Proveedor *" outlined dense emit-value map-options />
            <q-input v-model="form.fecha" label="Fecha *" type="date" outlined dense />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.numeroFactura" label="Número de Factura" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.estado" :options="['PENDIENTE','PAGADO','PARCIAL']" label="Estado *" outlined dense />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.formaPago" label="Forma de Pago" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.observaciones" label="Observaciones" type="textarea" outlined dense />
              </div>
            </div>
            <div class="text-subtitle1">Detalles</div>
            <div v-for="(detalle, index) in form.detalles" :key="index" class="detalle-box">
              <div class="row q-gutter-md">
                <q-input v-model="detalle.descripcion" label="Descripción" outlined dense class="col" />
                <q-input v-model.number="detalle.cantidad" label="Cantidad *" type="number" outlined dense class="col-12 col-sm-3" />
                <q-input v-model.number="detalle.precioUnitario" label="Precio Unit. *" type="number" outlined dense class="col-12 col-sm-3" />
                <q-select v-model="detalle.canastaId" :options="canastaOptions" label="Canasta" outlined dense emit-value map-options class="col-12 col-sm-4" />
                <q-btn flat round icon="delete" color="negative" @click="removeDetalle(index)" />
              </div>
              <div class="detalle-subtotal">Subtotal: ${{ (detalle.cantidad * detalle.precioUnitario).toFixed(2) }}</div>
            </div>
            <q-btn flat label="Agregar Detalle" icon="add" @click="addDetalle()" />
            <div class="total-box">Total: ${{ calcularTotal().toFixed(2) }}</div>
            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat @click="closeDialog()" />
              <q-btn label="Guardar" type="submit" color="primary" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useComprasTercerosStore } from 'src/stores/compras-terceros';
import { useTercerosStore } from 'src/stores/terceros';
import { useCanastasStore } from 'src/stores/canastas';
import { useQuasar } from 'quasar';
import type { Compra, CreateCompraDto, UpdateCompraDto, DetalleCompra } from 'src/types/compras-terceros';

const $q = useQuasar();
const comprasStore = useComprasTercerosStore();
const tercerosStore = useTercerosStore();
const canastasStore = useCanastasStore();

const dialog = ref(false);
const editing = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);

const form = ref<CreateCompraDto>({
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
  { name: 'tercero', label: 'Proveedor', field: 'tercero', align: 'left' as const },
  { name: 'numeroFactura', label: 'Factura', field: 'numeroFactura', align: 'left' as const },
  { name: 'total', label: 'Total', field: 'total', align: 'right' as const, format: (val: number) => `$${val.toFixed(2)}` },
  { name: 'detalles', label: 'Canastas', field: 'detalles', align: 'left' as const },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const }
];

const terceroOptions = computed(() => 
  tercerosStore.terceros
    .filter(t => t.proveedor && t.activo)
    .map(t => ({ label: t.nombre, value: t.codigo }))
);

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
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    canastaId: ''
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
    label: `${c.nombre} · ${c.tipoHuevo?.nombre || ''} · ${c.unidadesPorCanasta}u`,
    value: c.id
  }))
);

const totalCompras = computed(() => comprasStore.compras.length);
const comprasPagadas = computed(() => comprasStore.compras.filter(c => getCompraEstado(c) === 'PAGADO').length);
const comprasPendientes = computed(() => comprasStore.compras.filter(c => getCompraEstado(c) !== 'PAGADO').length);
const totalGastado = computed(() => comprasStore.compras.reduce((s, c) => s + Number(c.total), 0));

const filter = ref<{ search: string; estado: string | null }>({ search: '', estado: null });
const estadoOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Parcial', value: 'PARCIAL' }
];

const filteredCompras = computed(() => {
  let rows = comprasStore.compras;
  const s = filter.value.search?.toLowerCase().trim();
  if (s) {
    rows = rows.filter(c =>
      (c.tercero?.nombre || '').toLowerCase().includes(s) ||
      (c.numeroFactura || '').toLowerCase().includes(s)
    );
  }
  if (filter.value.estado) {
    rows = rows.filter(c => getCompraEstado(c) === filter.value.estado);
  }
  return rows;
});

const canastaResumen = (c: Compra): string => {
  const counts = new Map<string, number>();
  (c.detalles || []).forEach((d: DetalleCompra & { canasta?: { id?: string } }) => {
    const id = d.canastaId || (d.canasta?.id || '');
    const nombre = (canastasStore.canastas.find(x => x.id === id)?.nombre) || 'Canasta';
    const prev = counts.get(nombre) || 0;
    counts.set(nombre, prev + Number(d.cantidad || 0));
  });
  return Array.from(counts.entries()).map(([nombre, qty]) => `${nombre}: ${qty}`).join(', ');
};

const getCompraEstado = (c: Compra): 'PAGADO' | 'PENDIENTE' | 'PARCIAL' => {
  return c.estado || 'PENDIENTE';
};

const openDialog = (compra?: Compra) => {
  if (compra) {
    editing.value = true;
    editingId.value = compra.id;
    form.value = {
      fecha: compra.fecha,
      idTercero: compra.idTercero,
      numeroFactura: compra.numeroFactura,
      estado: compra.estado,
      formaPago: compra.formaPago,
      observaciones: compra.observaciones,
      detalles: (compra.detalles || []).map((d: DetalleCompra & { canasta?: { id?: string } }) => ({
        descripcion: d.descripcion || undefined,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        canastaId: d.canastaId || d.canasta?.id || ''
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
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editing.value = false;
  editingId.value = null;
};

const saveCompra = async () => {
  if (form.value.detalles.length === 0) {
    $q.notify({ type: 'negative', message: 'Debe agregar al menos un detalle' });
    return;
  }
  const faltanCanastas = form.value.detalles.some(d => !d.canastaId || String(d.canastaId).trim().length === 0);
  if (faltanCanastas) {
    $q.notify({ type: 'negative', message: 'Seleccione una canasta en cada detalle' });
    return;
  }

  saving.value = true;
  try {
    if (editing.value && editingId.value) {
      await comprasStore.updateCompra(editingId.value, form.value as UpdateCompraDto);
      $q.notify({ type: 'positive', message: 'Compra actualizada' });
    } else {
      await comprasStore.createCompra(form.value);
      $q.notify({ type: 'positive', message: 'Compra creada' });
}
    closeDialog();
    await fetchData();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar' });
  } finally {
    saving.value = false;
  }
};

const deleteCompra = (id: string) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Eliminar esta compra?',
    cancel: true
  }).onOk(() => {
    void (async () => {
      try {
        await comprasStore.deleteCompra(id);
        $q.notify({ type: 'positive', message: 'Compra eliminada' });
        await fetchData();
      } catch {
        $q.notify({ type: 'negative', message: 'Error al eliminar' });
      }
    })();
  });
};

const markCompraPagada = async (id: string) => {
  try {
    await comprasStore.updateCompra(id, { estado: 'PAGADO' } as UpdateCompraDto);
    $q.notify({ type: 'positive', message: 'Compra marcada como pagada' });
    await fetchData();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al marcar como pagada' });
  }
};

const updateEstadoCompra = async (id: string, estado: string) => {
  try {
    await comprasStore.updateCompra(id, { estado } as UpdateCompraDto);
    $q.notify({ type: 'positive', message: 'Estado actualizado' });
    await fetchData();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al actualizar estado' });
  }
};

const fetchData = async () => {
  await Promise.all([
    comprasStore.fetchCompras(),
    tercerosStore.fetchTerceros(),
    canastasStore.fetchCanastas()
  ]);
};

onMounted(() => {
  void fetchData();
});
</script>

<style scoped>
.modern-page { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; padding: 2rem; }
.page-header { background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%); color: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.header-title { display: flex; align-items: center; gap: 1rem; }
.header-icon { font-size: 3rem; opacity: 0.9; }
.page-title { margin: 0; font-size: 2rem; font-weight: 700; }
.page-subtitle { margin: 0.25rem 0 0 0; opacity: 0.85; }
.add-btn { border-radius: 12px; padding: 0.6rem 1.4rem; font-weight: 600; text-transform: none; }
.kpi-section { margin: 1.5rem 0; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.kpi-card { border-radius: 14px; box-shadow: 0 4px 18px rgba(0,0,0,0.08); color: #fff; }
.kpi-content { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; color: #fff; }
.kpi-icon { font-size: 2rem; color: #fff; }
.kpi-info { flex: 1; color: #fff; }
.kpi-value { font-size: 1.8rem; font-weight: 700; color: #fff; }
.kpi-label { font-weight: 500; opacity: 0.95; color: #fff; }
.kpi-primary, .kpi-warning, .kpi-success, .kpi-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.filter-card { border-radius: 14px; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }
.filter-content { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 240px; }
.filter-select { min-width: 180px; }
.refresh-btn { border-radius: 10px; font-weight: 600; }
.dialog-header { display: flex; align-items: center; }
.detalle-box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.03); margin-bottom: 1rem; }
.detalle-subtotal { font-size: 0.9rem; color: #2c3e50; font-weight: 600; margin-top: 0.5rem; }
.total-box { font-size: 1.25rem; font-weight: 700; padding: 0.75rem; border-radius: 12px; background: #f8f9fa; }
.kpi-icon .q-icon { color: #fff; }
@media (max-width: 768px) { .modern-page { padding: 0.75rem; } .page-header { padding: 1rem; border-radius: 12px; } .header-content { flex-direction: column; text-align: center; } .page-title { font-size: 1.5rem; } .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
