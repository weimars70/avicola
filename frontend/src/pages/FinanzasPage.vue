<template>
  <q-page class="modern-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <q-icon name="account_balance" class="header-icon" />
          <div>
            <h1 class="page-title">Módulo Financiero</h1>
            <p class="page-subtitle">Gestión de gastos, ingresos y análisis de rendimiento</p>
          </div>
        </div>
        <div class="header-actions">
          <q-btn
            class="action-btn"
            color="secondary"
            icon="sync"
            label="Sincronizar Ingresos"
            @click="syncIngresos"
            :loading="loading"
          />
          <q-btn
            class="add-btn"
            color="primary"
            icon="add"
            label="Nuevo Gasto"
            size="lg"
            @click="openGastoDialog()"
          />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <q-card class="filter-card">
      <q-card-section>
        <div class="filter-content">
          <q-select
            v-model="filtros.periodo"
            :options="periodosOptions"
            label="Período"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="onPeriodoChange"
          />
          
          <q-input
            v-model="filtros.fechaInicio"
            type="date"
            label="Fecha Inicio"
            outlined
            dense
            :disable="filtros.periodo !== 'personalizado'"
            @update:model-value="onFechaChange"
          />
          
          <q-input
            v-model="filtros.fechaFin"
            type="date"
            label="Fecha Fin"
            outlined
            dense
            :disable="filtros.periodo !== 'personalizado'"
            @update:model-value="onFechaChange"
          />
          
          <q-btn
            color="primary"
            icon="refresh"
            label="Actualizar"
            @click="actualizarDatos"
            :loading="loading"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- KPIs Section -->
    <div class="kpi-section" v-if="resumen">
      <div class="kpi-grid">
        <q-card class="kpi-card kpi-ingresos">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="trending_up" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ formatCurrency(resumen.totalIngresos) }}</div>
              <div class="kpi-label">Total Ingresos</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-gastos">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="trending_down" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ formatCurrency(resumen.totalGastos) }}</div>
              <div class="kpi-label">Total Gastos</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card" :class="utilidadClass">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon :name="utilidadIcon" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ formatCurrency(resumen.utilidadNeta) }}</div>
              <div class="kpi-label">Utilidad Neta</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="kpi-card kpi-margen">
          <q-card-section class="kpi-content">
            <div class="kpi-icon">
              <q-icon name="percent" />
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ resumen.margenUtilidad }}%</div>
              <div class="kpi-label">Margen de Utilidad</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabs para diferentes vistas -->
    <q-card class="content-card">
      <q-tabs
        v-model="activeTab"
        class="text-primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="resumen" icon="dashboard" label="Resumen" />
        <q-tab name="gastos" icon="money_off" label="Gastos" />
        <q-tab name="ingresos" icon="attach_money" label="Ingresos" />
        <q-tab name="rendimiento" icon="trending_up" label="Rendimiento" />
        <q-tab name="graficos" icon="bar_chart" label="Gráficos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <!-- Panel Resumen -->
        <q-tab-panel name="resumen">
          <div class="resumen-content">
            <!-- Botones de acción -->
            <div class="row q-gutter-md q-mb-lg">
              <q-btn 
                color="primary" 
                icon="sync" 
                label="Sincronizar Ingresos" 
                @click="syncIngresos"
                :loading="loading"
              />
              <q-btn 
                color="secondary" 
                icon="calculate" 
                label="Calcular Rendimiento Mensual" 
                @click="calcularRendimiento"
                :loading="loading"
              />
            </div>
            
            <!-- Gráfico de gastos por categoría -->
            <div class="chart-container" v-if="resumen?.gastosPorCategoria?.length">
              <h3>Distribución de Gastos por Categoría</h3>
              <div class="pie-chart-wrapper">
                <canvas ref="pieChartRef" width="300" height="300"></canvas>
              </div>
            </div>
            
            <!-- Tabla de gastos por categoría -->
            <q-table
              title="Gastos por Categoría"
              :rows="resumen?.gastosPorCategoria || []"
              :columns="categoriasColumns"
              row-key="categoria"
              flat
              bordered
              class="gastos-categoria-table"
            />
          </div>
        </q-tab-panel>

        <!-- Panel Gastos -->
        <q-tab-panel name="gastos">
          <div class="gastos-content">
            <div class="section-header">
              <h3>Registro de Gastos</h3>
              <div class="section-actions">
                <q-btn
                  color="secondary"
                  icon="category"
                  label="Crear Categorías"
                  @click="seedCategorias"
                  :loading="loading"
                  size="sm"
                />
                <q-btn
                  color="primary"
                  icon="add"
                  label="Nuevo Gasto"
                  @click="openGastoDialog()"
                />
              </div>
            </div>
            
            <q-table
              :rows="gastos"
              :columns="gastosColumns"
              row-key="id"
              flat
              bordered
              :loading="loading"
              :pagination="{ rowsPerPage: 10 }"
              class="finanzas-table"
              :class="{'responsive-table': $q.screen.lt.md}"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    size="sm"
                    @click="editGasto(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="confirmDeleteGasto(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-tab-panel>

        <!-- Panel Ingresos -->
        <q-tab-panel name="ingresos">
          <div class="ingresos-content">
            <div class="section-header">
              <h3>Registro de Ingresos</h3>
              <q-btn
                color="primary"
                icon="add"
                label="Nuevo Ingreso"
                @click="openIngresoDialog()"
              />
            </div>
            
            <q-table
              :rows="ingresos"
              :columns="ingresosColumns"
              row-key="id"
              flat
              bordered
              :loading="loading"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template v-slot:body-cell-tipo="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.value === 'venta' ? 'green' : 'blue'"
                    :label="props.value === 'venta' ? 'Venta' : 'Otro'"
                  />
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
                    @click="editIngreso(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="confirmDeleteIngreso(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-tab-panel>
        
        <!-- Panel Rendimiento -->
        <q-tab-panel name="rendimiento">
          <div class="rendimiento-content">
            <div class="section-header">
              <h3>Análisis de Rendimiento</h3>
              <div class="row items-center q-gutter-sm">
                <q-select
                  v-model="rendOrigen"
                  :options="[{label:'General',value:'general'},{label:'Terceros',value:'terceros'}]"
                  label="Origen"
                  dense
                  outlined
                  emit-value
                  map-options
                  style="width: 160px"
                />
                <q-btn
                  color="secondary"
                  icon="refresh"
                  label="Actualizar Métricas"
                  @click="actualizarDatos"
                  :loading="loading"
                />
              </div>
            </div>
            
            <!-- Calendario Financiero -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">Calendario de Gastos</div>
                <CalendarioFinanciero
                  :datos="datosCalendario"
                  :mostrar-gastos="true"
                  :mostrar-ingresos="false"
                  @cambio-mes="onCambioMes"
                />
              </q-card-section>
            </q-card>
            
            <!-- Métricas de rendimiento -->
            <div class="row q-gutter-md q-mb-lg" v-if="resumen">
              <div class="col-12 col-md-3">
                <q-card class="bg-blue-1">
                  <q-card-section>
                    <div class="text-h6">Promedio Margen</div>
                    <div class="text-h4 text-blue">{{ resumen.margenUtilidad }}%</div>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-3">
                <q-card class="bg-purple-1">
                  <q-card-section>
                    <div class="text-h6">ROI Estimado</div>
                    <div class="text-h4 text-purple">{{ (() => { const roi = (resumen.utilidadNeta / Math.max(resumen.totalGastos, 1)) * 100; return typeof roi === 'number' && !isNaN(roi) ? roi.toFixed(1) : '0.0'; })() }}%</div>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-3">
                <q-card class="bg-green-1">
                  <q-card-section>
                    <div class="text-h6">Eficiencia</div>
                    <div class="text-h5 text-green">
                      {{ resumen.utilidadNeta >= 0 ? 'Positiva' : 'Negativa' }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-3">
                <q-card class="bg-orange-1">
                  <q-card-section>
                    <div class="text-h6">Tendencia</div>
                    <div class="text-h5 text-orange">
                      {{ resumen.utilidadNeta >= 0 ? 'Crecimiento' : 'Mejora Requerida' }}
                    </div>
                    <q-icon 
                      :name="resumen.utilidadNeta >= 0 ? 'trending_up' : 'trending_down'" 
                      size="md" 
                      :color="resumen.utilidadNeta >= 0 ? 'green' : 'red'"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
            
            <!-- Análisis detallado -->
            <q-card class="q-mt-md">
              <q-card-section>
                <div class="text-h6 q-mb-md">Análisis Detallado</div>
                <div v-if="resumen">
                  <div class="q-mb-md">
                    <q-chip :color="rendOrigen === 'terceros' ? 'purple' : 'blue'" text-color="white" :label="'Origen: ' + (rendOrigen === 'terceros' ? 'Terceros' : 'General')" />
                  </div>
                  <p><strong>Ingresos Totales:</strong> {{ formatCurrency(resumen.totalIngresos) }}</p>
                  <p><strong>Gastos Totales:</strong> {{ formatCurrency(resumen.totalGastos) }}</p>
                  <p><strong>Utilidad Neta:</strong> 
                    <span :class="resumen.utilidadNeta >= 0 ? 'text-green' : 'text-red'">
                      {{ formatCurrency(resumen.utilidadNeta) }}
                    </span>
                  </p>
                  <p><strong>Margen de Utilidad:</strong> {{ resumen.margenUtilidad }}%</p>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-tab-panel>

        <!-- Panel Gráficos -->
        <q-tab-panel name="graficos">
          <div class="graficos-content">
            <div class="charts-grid">
              <!-- Gráfico de barras: Ingresos vs Gastos -->
              <div class="chart-container">
                <h3>Ingresos vs Gastos</h3>
                <canvas ref="barChartRef" width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Sección de Inversión Inicial y Recuperación -->
    <q-card class="content-card q-mt-lg">
      <q-card-section>
        <div class="section-header">
          <h3><q-icon name="account_balance" class="q-mr-sm" />Inversión Inicial y Recuperación</h3>
          <q-btn 
            color="primary" 
            :icon="inversionStore.inversionInicial.montoTotal > 0 ? 'edit' : 'add'" 
            :label="inversionStore.inversionInicial.montoTotal > 0 ? 'Modificar Inversión' : 'Configurar Inversión'" 
            @click="openInversionDialog" 
            size="sm"
          />
        </div>
        
        <!-- Estado sin inversión configurada -->
        <div v-if="inversionStore.inversionInicial.montoTotal === 0" class="empty-investment-state">
          <div class="text-center q-pa-xl">
            <q-icon name="account_balance" size="4rem" color="grey-5" class="q-mb-md" />
            <div class="text-h6 text-grey-7 q-mb-sm">No hay inversión inicial configurada</div>
            <div class="text-body2 text-grey-6 q-mb-lg">
              Configure su inversión inicial para realizar un seguimiento de la recuperación y análisis de ROI
            </div>
            <q-btn 
              color="primary" 
              icon="add" 
              label="Configurar Inversión Inicial" 
              @click="openInversionDialog" 
              size="lg"
              unelevated
            />
          </div>
        </div>
        
        <!-- KPIs de Inversión -->
        <div v-else class="inversion-kpis q-mb-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-card class="inversion-card inversion-total full-height">
                <q-card-section class="kpi-content">
                  <div class="kpi-icon">
                    <q-icon name="savings" size="2rem" />
                  </div>
                  <div class="kpi-info">
                    <div class="kpi-value">{{ formatCurrency(inversionStore.inversionInicial.montoTotal) }}</div>
                    <div class="kpi-label">Inversión Total</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-3">
              <q-card class="inversion-card inversion-recuperado full-height">
                <q-card-section class="kpi-content">
                  <div class="kpi-icon">
                    <q-icon name="trending_up" size="2rem" />
                  </div>
                  <div class="kpi-info">
                    <div class="kpi-value">{{ formatCurrency(inversionStore.inversionInicial.montoRecuperado) }}</div>
                    <div class="kpi-label">Recuperado ({{ typeof inversionStore.inversionInicial.porcentajeRecuperado === 'number' ? inversionStore.inversionInicial.porcentajeRecuperado.toFixed(1) : '0.0' }}%)</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-3">
              <q-card class="inversion-card inversion-restante full-height">
                <q-card-section class="kpi-content">
                  <div class="kpi-icon">
                    <q-icon name="schedule" size="2rem" />
                  </div>
                  <div class="kpi-info">
                    <div class="kpi-value">{{ formatCurrency(inversionStore.inversionInicial.montoRestante) }}</div>
                    <div class="kpi-label">Por Recuperar</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-3">
              <q-card class="inversion-card inversion-tiempo full-height">
                <q-card-section class="kpi-content">
                  <div class="kpi-icon">
                    <q-icon name="access_time" size="2rem" />
                  </div>
                  <div class="kpi-info">
                    <div class="kpi-value">{{ inversionStore.tiempoEstimadoRecuperacion || 'N/A' }}</div>
                    <div class="kpi-label">Meses Estimados</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        
        <!-- Progreso de Recuperación -->
        <div class="progress-section q-mb-md">
          <div class="text-subtitle1 q-mb-sm">Progreso de Recuperación</div>
          <q-linear-progress 
            :value="inversionStore.inversionInicial.porcentajeRecuperado / 100" 
            color="green" 
            track-color="grey-3" 
            size="20px" 
            rounded
          />
          <div class="text-center text-caption q-mt-sm">
            {{ typeof inversionStore.inversionInicial.porcentajeRecuperado === 'number' ? inversionStore.inversionInicial.porcentajeRecuperado.toFixed(1) : '0.0' }}% recuperado
          </div>
        </div>
        
        <!-- Análisis de Beneficios Netos Mensuales -->
        <div class="beneficios-section" v-if="comparativoMensual">
          <div class="text-subtitle1 q-mb-md">Análisis de Beneficios Netos Mensuales</div>
          <div class="beneficios-grid">
            <div 
              v-for="mes in comparativoMensual.meses" 
              :key="mes.mes"
              class="beneficio-mes"
            >
              <q-card class="beneficio-card" :class="getBeneficioClass(mes.utilidadOperativa)">
                <q-card-section>
                  <div class="mes-nombre">{{ mes.nombreMes }}</div>
                  <div class="beneficio-valor">{{ formatCurrency(mes.utilidadOperativa) }}</div>
                  <div class="beneficio-detalle">
                    <div class="text-caption">Ingresos: {{ formatCurrency(mes.ingresos) }}</div>
                    <div class="text-caption">Gastos Op.: {{ formatCurrency(mes.gastosOperativos) }}</div>
                    <div class="text-caption">Margen: {{ mes.margenUtilidad }}%</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Resumen de Impacto en Inversión -->
          <div class="impacto-inversion q-mt-lg">
            <q-card class="bg-blue-1">
              <q-card-section>
                <div class="text-h6 text-blue-8 q-mb-md">Impacto en Recuperación de Inversión</div>
                <div class="row q-gutter-md">
                  <div class="col-12 col-md-4">
                    <div class="text-subtitle2 text-blue-7">Beneficio Neto Acumulado</div>
                    <div class="text-h5 text-blue-9">{{ formatCurrency(beneficioNetoAcumulado) }}</div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="text-subtitle2 text-blue-7">Promedio Mensual</div>
                    <div class="text-h5 text-blue-9">{{ formatCurrency(promedioMensualBeneficios) }}</div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="text-subtitle2 text-blue-7">Proyección Recuperación</div>
                    <div class="text-h5 text-blue-9">
                      {{ proyeccionRecuperacion }} meses
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sección de Finanzas de Terceros -->
    <q-card class="content-card q-mt-lg">
      <q-card-section>
        <div class="section-header">
          <h3>
            <q-icon name="handshake" class="q-mr-sm" />
            Finanzas de Terceros
          </h3>
          <q-btn 
            color="primary" 
            icon="refresh" 
            label="Actualizar"
            @click="loadFinanzasTerceros"
            :loading="loadingTercerosFinanzas"
            size="sm"
          />
        </div>

        <!-- KPIs de terceros -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-3">
            <q-card class="inversion-card inversion-total full-height">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="attach_money" size="2rem" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ formatCurrency(ingresosTercerosPagados) }}</div>
                  <div class="kpi-label">Ingresos Terceros (Pagados)</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="inversion-card inversion-recuperado full-height">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="money_off" size="2rem" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ formatCurrency(gastosTercerosPagados) }}</div>
                  <div class="kpi-label">Gastos Terceros (Pagados)</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="inversion-card inversion-restante full-height">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="schedule" size="2rem" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ formatCurrency(ingresosTercerosPendientes) }}</div>
                  <div class="kpi-label">Ingresos Pendientes</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="inversion-card inversion-tiempo full-height">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="pending_actions" size="2rem" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ formatCurrency(gastosTercerosPendientes) }}</div>
                  <div class="kpi-label">Gastos Pendientes</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Filtros y tabla -->
        <q-card class="filter-card q-mb-md">
          <q-card-section>
            <div class="filter-content">
              <q-input
                v-model="finTercerosFilter"
                label="Buscar (tercero o factura)"
                outlined
                dense
                clearable
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-select
                v-model="finTercerosEstado"
                :options="[{ label: 'Todos', value: null }, { label: 'Pagado', value: 'PAGADO' }, { label: 'Pendiente', value: 'PENDIENTE' }, { label: 'Parcial', value: 'PARCIAL' }]"
                label="Estado"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>
          </q-card-section>
        </q-card>

        <q-table
          :rows="finTercerosRowsFiltered"
          :columns="finTercerosColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
          class="finanzas-table"
          :class="{'responsive-table': $q.screen.lt.md}"
        >
          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <q-chip :color="props.value === 'Ingreso' ? 'positive' : 'negative'" text-color="white" :label="props.value" size="sm" />
            </q-td>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip :color="getEstadoColor(props.value)" text-color="white" :label="props.value" size="sm" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog para Modificar Inversión -->
    <q-dialog v-model="inversionDialog" persistent>
      <q-card class="dialog-responsive">
        <q-card-section>
          <div class="text-h6">Modificar Inversión Inicial</div>
        </q-card-section>
        
        <q-card-section>
          <q-form @submit="saveInversion" class="q-gutter-md">
            <q-input
              v-model.number="inversionForm.montoTotal"
              label="Monto Total de Inversión *"
              type="number"
              step="0.01"
              outlined
              prefix="$"
              :rules="[(val: number) => !!val && val > 0 || 'El monto debe ser mayor a 0']"
            />
            
            <q-input
              v-model="inversionForm.fechaInicio"
              label="Fecha de Inicio *"
              type="date"
              outlined
              :rules="[(val: string) => !!val || 'La fecha es requerida']"
            />
            
            <q-input
              v-model.number="inversionForm.metaRecuperacion"
              label="Meta de Recuperación (meses)"
              type="number"
              outlined
              hint="Opcional: tiempo objetivo para recuperar la inversión"
            />
          </q-form>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="closeInversionDialog" />
          <q-btn color="primary" label="Guardar" @click="saveInversion" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para Gastos -->
    <q-dialog v-model="gastoDialog" persistent>
      <q-card class="dialog-responsive">
        <q-card-section>
          <div class="text-h6">{{ editingGasto ? 'Editar Gasto' : 'Nuevo Gasto' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveGasto" class="q-gutter-md">
            <q-input
              v-model="gastoForm.descripcion"
              label="Descripción"
              outlined
            />
            
            <!-- Mostrar campo de monto solo si NO es consumo propio -->
            <q-input
              v-if="!isConsumoPropio"
              v-model.number="gastoForm.monto"
              label="Monto"
              type="number"
              step="0.01"
              outlined
              prefix="$"
            />
            
            <q-input
              v-model="gastoForm.fecha"
              label="Fecha"
              type="date"
              outlined
            />
            
            <q-select
              v-model="gastoForm.categoriaId"
              :options="categoriasOptions"
              label="Categoría"
              outlined
              emit-value
              map-options
              @update:model-value="onCategoriaChange"
            />
            
            <!-- Sección especial para Consumo Propio -->
            <div v-if="isConsumoPropio" class="consumo-propio-section q-mt-md">
              <div class="text-subtitle2 q-mb-md text-primary">
                <q-icon name="egg" class="q-mr-sm" />
                Seleccionar Huevos para Consumo Propio
              </div>
              
              <div class="q-gutter-md">
                <div 
                  v-for="(huevo, index) in consumoPropioForm.huevosConsumidos" 
                  :key="huevo.tipoHuevoId"
                  class="row items-end q-gutter-md q-pa-md bg-grey-1 rounded-borders"
                >
                  <div class="col">
                    <q-select
                         :model-value="consumoPropioForm.huevosConsumidos[index]?.tipoHuevoId"
                         @update:model-value="(val) => { if (consumoPropioForm.huevosConsumidos[index]) consumoPropioForm.huevosConsumidos[index].tipoHuevoId = val }"
                         :options="tiposHuevoOptions"
                         label="Tipo de Huevo"
                         outlined
                         dense
                         emit-value
                         map-options
                       />
                  </div>
                  <div class="col">
                    <q-input
                         :model-value="consumoPropioForm.huevosConsumidos[index]?.unidades"
                         @update:model-value="(val) => { if (consumoPropioForm.huevosConsumidos[index]) consumoPropioForm.huevosConsumidos[index].unidades = Number(val) }"
                         label="Unidades"
                         outlined
                         dense
                         type="number"
                         min="1"
                       />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      icon="delete"
                      color="negative"
                      flat
                      round
                      @click="removeHuevoConsumo(index)"
                      :disable="consumoPropioForm.huevosConsumidos.length === 1"
                    />
                  </div>
                </div>
              </div>
              
              <div class="row justify-between items-center q-mt-md">
                <q-btn
                  icon="add"
                  label="Agregar Tipo de Huevo"
                  color="primary"
                  flat
                  @click="addHuevoConsumo"
                />
                <div class="text-subtitle2 text-primary">
                  <q-icon name="calculate" class="q-mr-sm" />
                  Monto calculado: {{ formatCurrency(montoCalculadoConsumo) }}
                </div>
              </div>
            </div>
            
            <q-input
              v-model="gastoForm.proveedor"
              label="Proveedor"
              outlined
            />
            
            <q-input
              v-model="gastoForm.numeroFactura"
              label="Número de Factura"
              outlined
            />
            
            <q-input
              v-model="gastoForm.observaciones"
              label="Observaciones"
              type="textarea"
              outlined
              rows="3"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="closeGastoDialog" />
          <q-btn color="primary" label="Guardar" @click="saveGasto" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para Ingresos -->
    <q-dialog v-model="ingresoDialog" persistent>
      <q-card class="dialog-responsive">
        <q-card-section>
          <div class="text-h6">{{ editingIngreso ? 'Editar Ingreso' : 'Nuevo Ingreso Manual' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveIngreso" class="q-gutter-md">
            <q-input
              v-model="ingresoForm.descripcion"
              label="Descripción *"
              outlined
              :rules="[(val: string) => !!val || 'La descripción es requerida']"
            />
            
            <q-input
              v-model.number="ingresoForm.monto"
              label="Monto *"
              type="number"
              step="0.01"
              outlined
              prefix="$"
              :rules="[(val: number) => !!val && val > 0 || 'El monto debe ser mayor a 0']"
            />
            
            <q-input
              v-model="ingresoForm.fecha"
              label="Fecha *"
              type="date"
              outlined
              :rules="[(val: string) => !!val || 'La fecha es requerida']"
            />
            
            <q-select
              v-model="ingresoForm.tipo"
              :options="tiposIngresoOptions"
              label="Tipo *"
              outlined
              emit-value
              map-options
            />
            
            <q-input
              v-model="ingresoForm.observaciones"
              label="Observaciones"
              type="textarea"
              outlined
              rows="3"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="closeIngresoDialog" />
          <q-btn color="primary" label="Guardar" @click="saveIngreso" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useFinanzas, type Gasto, type Ingreso, type ComparativoMensual } from 'src/composables/useFinanzas';
import { useInversionInicialStore } from 'src/stores/inversionInicial';
import { useQuasar } from 'quasar';
import Chart from 'chart.js/auto';
import CalendarioFinanciero from 'src/components/CalendarioFinanciero.vue';
import { api } from 'src/boot/axios';
import { useComprasTercerosStore } from 'src/stores/compras-terceros';
import { useVentasTercerosStore } from 'src/stores/ventas-terceros';

// Interfaces para formularios
interface GastoForm {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  categoriaId: number;
  proveedor: string;
  numeroFactura: string;
  observaciones: string;
}

interface IngresoForm {
  descripcion: string;
  monto: number;
  fecha: string;
  tipo: string;
  observaciones: string;
}

const $q = useQuasar();

const {
  categorias,
  gastos,
  ingresos,
  resumenFinanciero: resumen,
  loading,
  fetchCategorias,
  fetchGastos,
  fetchIngresos,
  fetchResumenFinanciero,
  createGasto,
  updateGasto,
  deleteGasto,
  createConsumoPropio,
  createIngreso,
  syncIngresosFromSalidas,
  seedCategorias,
  formatCurrency,
  formatDate,
  fetchComparativoMensual,
} = useFinanzas();

// Stores
const inversionStore = useInversionInicialStore();

// Estados reactivos
const activeTab = ref('resumen');
const gastoDialog = ref(false);
const ingresoDialog = ref(false);
const inversionDialog = ref(false);
const editingGasto = ref<Gasto | null>(null);
const editingIngreso = ref<Ingreso | null>(null);
const pieChartRef = ref<HTMLCanvasElement | null>(null);
const barChartRef = ref<HTMLCanvasElement | null>(null);
let pieChart: Chart | null = null;
let barChart: Chart | null = null;

// Datos del calendario
const datosCalendario = ref<Record<string, { ingresos?: number; gastos?: number; produccion?: number }>>({});

// Filtros
const filtros = ref({
  periodo: 'mes_actual',
  fechaInicio: '' as string,
  fechaFin: '' as string
});

const periodosOptions = [
  { label: 'Mes Actual', value: 'mes_actual' },
  { label: 'Último Mes', value: 'mes_anterior' },
  { label: 'Últimos 3 Meses', value: 'tres_meses' },
  { label: 'Año Actual', value: 'año_actual' },
  { label: 'Personalizado', value: 'personalizado' }
];

// Formularios
const gastoForm = ref<GastoForm>({
  id: '',
  descripcion: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0] as string,
  categoriaId: 0,
  proveedor: '',
  numeroFactura: '',
  observaciones: ''
});

const ingresoForm = ref<IngresoForm>({
  descripcion: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0] as string,
  tipo: 'otro',
  observaciones: ''
});

const inversionForm = ref({
  montoTotal: 0,
  fechaInicio: new Date().toISOString().split('T')[0],
  metaRecuperacion: undefined as number | undefined
});

// Formulario para consumo propio
interface ConsumoHuevoDto {
  tipoHuevoId: string;
  unidades: number;
}

interface ConsumoPropioForm {
  descripcion: string;
  fecha: string;
  observaciones: string;
  huevosConsumidos: ConsumoHuevoDto[];
}

const consumoPropioForm = ref<ConsumoPropioForm>({
  descripcion: '',
  fecha: new Date().toISOString().split('T')[0] as string,
  observaciones: '',
  huevosConsumidos: [{ tipoHuevoId: '', unidades: 1 }]
});

// Estados para tipos de huevo
const tiposHuevo = ref<{ id: string; nombre: string; valorUnidad: number }[]>([]);

// Opciones para selects
const categoriasOptions = computed(() => 
  categorias.value.map(c => ({ label: c.nombre, value: c.id }))
);

const tiposHuevoOptions = computed(() => 
  tiposHuevo.value.map(t => ({ label: t.nombre, value: t.id }))
);

// Computed para detectar si es consumo propio
const isConsumoPropio = computed(() => {
  const categoria = categorias.value.find(c => c.id === gastoForm.value.categoriaId);
  return categoria?.nombre?.toLowerCase().includes('consumo propio') || false;
});

// Computed para calcular monto de consumo propio
const montoCalculadoConsumo = computed(() => {
  if (!isConsumoPropio.value) return 0;
  
  let total = 0;
  consumoPropioForm.value.huevosConsumidos.forEach(huevo => {
    const tipoHuevo = tiposHuevo.value.find(t => t.id === huevo.tipoHuevoId);
    console.log('Calculando monto - Huevo:', huevo, 'TipoHuevo encontrado:', tipoHuevo);
    if (tipoHuevo && huevo.unidades > 0) {
      // Usar valorUnidad en lugar de precio
      const subtotal = (tipoHuevo.valorUnidad || 0) * huevo.unidades;
      console.log('Subtotal calculado:', subtotal, 'valorUnidad:', tipoHuevo.valorUnidad, 'unidades:', huevo.unidades);
      total += subtotal;
    }
  });
  
  console.log('Total calculado:', total);
  return total;
});

const tiposIngresoOptions = [
  { label: 'Venta', value: 'venta' },
  { label: 'Otro', value: 'otro' }
];

// Computadas para KPIs
const utilidadClass = computed(() => {
  if (!resumen.value) return 'kpi-neutral';
  return resumen.value.utilidadNeta >= 0 ? 'kpi-positive' : 'kpi-negative';
});

const utilidadIcon = computed(() => {
  if (!resumen.value) return 'help';
  return resumen.value.utilidadNeta >= 0 ? 'trending_up' : 'trending_down';
});

// Columnas para tablas
const categoriasColumns = [
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' as const },
  { name: 'total', label: 'Total', field: 'total', align: 'right' as const, format: (val: number) => formatCurrency(val) }
];

const gastosColumns = [
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' as const, format: (val: string) => formatDate(val) },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' as const },
  { name: 'categoria', label: 'Categoría', field: (row: Gasto) => row.categoria?.nombre, align: 'left' as const },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'right' as const, format: (val: number) => formatCurrency(val) },
  { name: 'proveedor', label: 'Proveedor', field: 'proveedor', align: 'left' as const },
  { name: 'actions', label: 'Acciones', field: '', align: 'center' as const }
];

const ingresosColumns = [
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' as const, format: (val: string) => formatDate(val) },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' as const },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center' as const },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'right' as const, format: (val: number) => formatCurrency(val) },
  { name: 'actions', label: 'Acciones', field: '', align: 'center' as const }
];

// Funciones
const onPeriodoChange = () => {
  const hoy = new Date();
  
  switch (filtros.value.periodo) {
    case 'mes_actual':
      filtros.value.fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0] as string;
      filtros.value.fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0] as string;
      break;
    case 'mes_anterior':
      filtros.value.fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1).toISOString().split('T')[0] as string;
      filtros.value.fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0).toISOString().split('T')[0] as string;
      break;
    case 'tres_meses':
      filtros.value.fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1).toISOString().split('T')[0] as string;
      filtros.value.fechaFin = hoy.toISOString().split('T')[0] as string;
      break;
    case 'año_actual':
      filtros.value.fechaInicio = new Date(hoy.getFullYear(), 0, 1).toISOString().split('T')[0] as string;
      filtros.value.fechaFin = new Date(hoy.getFullYear(), 11, 31).toISOString().split('T')[0] as string;
      break;
  }
  
  if (filtros.value.periodo !== 'personalizado') {
    void actualizarDatos();
  }
};

const onFechaChange = () => {
  if (filtros.value.fechaInicio && filtros.value.fechaFin) {
    void actualizarDatos();
  }
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
        fechaFin: fechaFin.toISOString().split('T')[0]
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

const actualizarDatos = async () => {
  const { fechaInicio, fechaFin } = filtros.value;
  
  await Promise.all([
    fetchResumenFinancieroWithOrigen(fechaInicio || undefined, fechaFin || undefined, rendOrigen.value),
    fetchGastos(fechaInicio || undefined, fechaFin || undefined),
    fetchIngresos(),
    cargarDatosCalendario()
  ]);
  
  await nextTick();
  updateCharts();
};

// Origen para rendimiento (General/Terceros)
const rendOrigen = ref<'general' | 'terceros'>('general');

const fetchResumenFinancieroWithOrigen = async (
  fechaInicio?: string,
  fechaFin?: string,
  origen: 'general' | 'terceros' = 'general'
) => {
  let url = '/finanzas/resumen';
  const params: string[] = [];
  if (fechaInicio && fechaFin) {
    params.push(`fechaInicio=${fechaInicio}`, `fechaFin=${fechaFin}`);
  }
  if (origen === 'terceros') {
    params.push('origen=terceros');
  }
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  const response = await api.get(url);
  resumen.value = response.data;
  return response.data;
};

const syncIngresos = async () => {
  try {
    await syncIngresosFromSalidas();
    await actualizarDatos();
  } catch (error) {
    console.error('Error sincronizando ingresos:', error);
  }
};

// Funciones de diálogos
const openGastoDialog = (gasto?: Gasto) => {
  if (gasto) {
    editingGasto.value = gasto;
    gastoForm.value = {
      id: gasto.id,
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      fecha: gasto.fecha.split('T')[0] as string,
      categoriaId: gasto.categoriaId,
      proveedor: gasto.proveedor || '',
      numeroFactura: gasto.numeroFactura || '',
      observaciones: gasto.observaciones || ''
    };
  } else {
    editingGasto.value = null;
    gastoForm.value = {
      id: '',
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0] as string,
      categoriaId: 0,
      proveedor: '',
      numeroFactura: '',
      observaciones: ''
    };
  }
  gastoDialog.value = true;
};

const closeGastoDialog = () => {
  gastoDialog.value = false;
  editingGasto.value = null;
};

const saveGasto = async () => {
  try {
    // Validar campos básicos
    if (!gastoForm.value.descripcion || !gastoForm.value.categoriaId || !gastoForm.value.fecha) {
      $q.notify({
        type: 'negative',
        message: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    // Si es consumo propio, usar endpoint especial
    if (isConsumoPropio.value) {
      // Validar huevos consumidos
      const huevosValidos = consumoPropioForm.value.huevosConsumidos.every(
        huevo => huevo.tipoHuevoId && huevo.unidades > 0
      );
      
      if (!huevosValidos) {
        $q.notify({
          type: 'negative',
          message: 'Por favor complete todos los tipos de huevo y cantidades'
        });
        return;
      }

      const consumoPropioData = {
        descripcion: gastoForm.value.descripcion,
        fecha: gastoForm.value.fecha,
        observaciones: gastoForm.value.observaciones || '',
        huevosConsumidos: consumoPropioForm.value.huevosConsumidos
      };

      await createConsumoPropio(consumoPropioData);
      
      $q.notify({
        type: 'positive',
        message: 'Consumo propio registrado correctamente'
      });
    } else {
      // Validar monto para gastos normales
      if (!gastoForm.value.monto || gastoForm.value.monto <= 0) {
        $q.notify({
          type: 'negative',
          message: 'El monto debe ser mayor a 0'
        });
        return;
      }

      const gastoData = {
        descripcion: gastoForm.value.descripcion,
        monto: Number(gastoForm.value.monto),
        fecha: gastoForm.value.fecha,
        categoriaId: Number(gastoForm.value.categoriaId),
        proveedor: gastoForm.value.proveedor || '',
        numeroFactura: gastoForm.value.numeroFactura || '',
        observaciones: gastoForm.value.observaciones || ''
      };
      
      if (editingGasto.value) {
        const gastoDataWithId = { ...gastoData, id: editingGasto.value.id };
        await updateGasto(editingGasto.value.id, gastoDataWithId);
      } else {
        await createGasto(gastoData);
      }
      
      $q.notify({
        type: 'positive',
        message: editingGasto.value ? 'Gasto actualizado correctamente' : 'Gasto creado correctamente'
      });
    }
    
    closeGastoDialog();
    await actualizarDatos();
  } catch (error) {
    console.error('Error guardando gasto:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el gasto'
    });
  }
};

const editGasto = (gasto: Gasto) => {
  openGastoDialog(gasto);
};

const confirmDeleteGasto = (gasto: Gasto) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar el gasto "${gasto.descripcion}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
    try {
      await deleteGasto(gasto.id);
      await actualizarDatos();
    } catch (error) {
      console.error('Error eliminando gasto:', error);
    }
  });
};

// Funciones para consumo propio
const onCategoriaChange = (categoriaId: number) => {
  const categoria = categorias.value.find(c => c.id === categoriaId);
  if (categoria?.nombre?.toLowerCase().includes('consumo propio')) {
    // Resetear formulario de consumo propio
    consumoPropioForm.value = {
      descripcion: gastoForm.value.descripcion || 'Consumo propio de huevos',
      fecha: gastoForm.value.fecha,
      observaciones: gastoForm.value.observaciones || '',
      huevosConsumidos: [{ tipoHuevoId: '', unidades: 1 }]
    };
  }
};

const addHuevoConsumo = () => {
  consumoPropioForm.value.huevosConsumidos.push({
    tipoHuevoId: '',
    unidades: 1
  });
};

const removeHuevoConsumo = (index: number) => {
  if (consumoPropioForm.value.huevosConsumidos.length > 1) {
    consumoPropioForm.value.huevosConsumidos.splice(index, 1);
  }
};

const fetchTiposHuevo = async (reintentos = 3) => {
  try {
    const response = await api.get('/tipos-huevo');
    tiposHuevo.value = response.data;
    console.log('Tipos de huevo cargados:', tiposHuevo.value);
    console.log('Primer tipo de huevo:', tiposHuevo.value[0]);
  } catch (error) {
    console.error('Error cargando tipos de huevo:', error);
    
    // Implementar retry automático para errores de timeout
    if (reintentos > 0 && (error as Error & { code?: string })?.code === 'ECONNABORTED') {
      console.log(`Reintentando carga de tipos de huevo... (${4 - reintentos}/3)`);
      setTimeout(() => {
        void fetchTiposHuevo(reintentos - 1);
      }, 2000); // Esperar 2 segundos antes de reintentar
    } else {
      // Fallback a datos por defecto si fallan todos los reintentos
      tiposHuevo.value = [
        { id: '1', nombre: 'Huevo Grande', valorUnidad: 0 },
        { id: '2', nombre: 'Huevo Mediano', valorUnidad: 0 },
        { id: '3', nombre: 'Huevo Pequeño', valorUnidad: 0 }
      ];
      console.warn('Usando tipos de huevo por defecto debido a errores de conexión');
    }
  }
};



const openIngresoDialog = (ingreso?: Ingreso) => {
  if (ingreso) {
    editingIngreso.value = ingreso;
    ingresoForm.value = {
      descripcion: ingreso.descripcion,
      monto: ingreso.monto,
      fecha: ingreso.fecha,
      tipo: ingreso.tipo,
      observaciones: ingreso.observaciones || ''
    };
  } else {
    editingIngreso.value = null;
    ingresoForm.value = {
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0] as string,
      tipo: 'otro',
      observaciones: ''
    };
  }
  ingresoDialog.value = true;
};

const closeIngresoDialog = () => {
  ingresoDialog.value = false;
};

const saveIngreso = async () => {
  try {
    // Validar que todos los campos requeridos estén presentes
    if (!ingresoForm.value.descripcion || !ingresoForm.value.monto || ingresoForm.value.monto <= 0 || !ingresoForm.value.fecha) {
      $q.notify({
        type: 'negative',
        message: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    const ingresoData = {
      descripcion: ingresoForm.value.descripcion,
      monto: Number(ingresoForm.value.monto),
      fecha: ingresoForm.value.fecha,
      tipo: ingresoForm.value.tipo,
      observaciones: ingresoForm.value.observaciones || ''
    };

    await createIngreso(ingresoData);
    
    $q.notify({
      type: 'positive',
      message: 'Ingreso creado correctamente'
    });
    
    closeIngresoDialog();
    await actualizarDatos();
  } catch (error) {
    console.error('Error guardando ingreso:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el ingreso'
    });
  }
};

// Funciones de gráficos
const updateCharts = () => {
  updatePieChart();
  updateBarChart();
};

const updatePieChart = () => {
  if (!pieChartRef.value || !resumen.value?.gastosPorCategoria?.length) return;
  
  if (pieChart) {
    pieChart.destroy();
  }
  
  const ctx = pieChartRef.value.getContext('2d');
  if (!ctx) return;
  
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: resumen.value.gastosPorCategoria.map(item => item.categoria),
      datasets: [{
        data: resumen.value.gastosPorCategoria.map(item => item.total),
        backgroundColor: resumen.value.gastosPorCategoria.map(item => 
          item.color || `hsl(${Math.random() * 360}, 70%, 60%)`
        )
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10
          }
        }
      }
    }
  });
};

const updateBarChart = () => {
  if (!barChartRef.value || !resumen.value) return;
  
  if (barChart) {
    barChart.destroy();
  }
  
  const ctx = barChartRef.value.getContext('2d');
  if (!ctx) return;
  
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        label: 'Monto',
        data: [resumen.value.totalIngresos, resumen.value.totalGastos],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(Number(value));
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
};

// Watchers
watch(activeTab, async () => {
  if (activeTab.value === 'graficos') {
    await nextTick();
    updateCharts();
  }
});

// Funciones adicionales para ingresos y rendimiento
const editIngreso = (ingreso: Ingreso) => {
  openIngresoDialog(ingreso);
};

const confirmDeleteIngreso = (ingreso: Ingreso) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro de eliminar el ingreso "${ingreso.descripcion}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // TODO: Implement deleteIngreso function
    void actualizarDatos();
  });
};

const calcularRendimiento = async () => {
  try {
    await fetchResumenFinanciero();
    $q.notify({
      type: 'positive',
      message: 'Rendimiento calculado correctamente'
    });
  } catch (error) {
    console.error('Error calculando rendimiento:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al calcular el rendimiento'
    });
  }
};

// Estado para comparativo mensual
const comparativoMensual = ref<ComparativoMensual | null>(null);

// Función para cargar comparativo mensual
const loadComparativoMensual = async () => {
  try {
    const data = await fetchComparativoMensual();
    comparativoMensual.value = data;
  } catch (error) {
    console.error('Error loading comparativo mensual:', error);
  }
};

const beneficioNetoAcumulado = computed(() => {
  if (!resumen.value) return 0;
  return resumen.value.utilidadNeta;
});

const promedioMensualBeneficios = computed(() => {
  if (!comparativoMensual.value) return 0;
  const meses = comparativoMensual.value.meses || [];
  if (meses.length === 0) return 0;
  const total = meses.reduce((sum: number, mes) => sum + (mes.utilidadOperativa || 0), 0);
  return total / meses.length;
});

const proyeccionRecuperacion = computed(() => {
  if (promedioMensualBeneficios.value <= 0 || !inversionStore.inversionInicial.montoRestante) return 'N/A';
  return Math.ceil(inversionStore.inversionInicial.montoRestante / promedioMensualBeneficios.value);
});

// Métodos para inversión
const getBeneficioClass = (utilidad: number) => {
  return utilidad >= 0 ? 'beneficio-positivo' : 'beneficio-negativo';
};

const openInversionDialog = () => {
  inversionForm.value = {
    montoTotal: inversionStore.inversionInicial.montoTotal,
    fechaInicio: inversionStore.inversionInicial.fechaInicio || new Date().toISOString().split('T')[0],
    metaRecuperacion: inversionStore.inversionInicial.metaRecuperacion || 12
  };
  inversionDialog.value = true;
};

const closeInversionDialog = () => {
  inversionDialog.value = false;
};

const saveInversion = async () => {
  loading.value = true;
  try {
    if (!inversionForm.value.montoTotal || inversionForm.value.montoTotal <= 0) {
      $q.notify({
        type: 'negative',
        message: 'El monto debe ser mayor a 0'
      });
      return;
    }

    if (!inversionForm.value.fechaInicio) {
      $q.notify({
        type: 'negative',
        message: 'La fecha de inicio es requerida'
      });
      return;
    }

    const inversionData: { montoTotal: number; fechaInicio: string; metaRecuperacion?: number } = {
      montoTotal: inversionForm.value.montoTotal,
      fechaInicio: inversionForm.value.fechaInicio
    };
    
    if (inversionForm.value.metaRecuperacion !== undefined) {
      inversionData.metaRecuperacion = inversionForm.value.metaRecuperacion;
    }
    
    await inversionStore.setInversionInicial(inversionData);

    $q.notify({
      type: 'positive',
      message: 'Inversión inicial guardada correctamente'
    });

    closeInversionDialog();
  } catch (error) {
    console.error('Error guardando inversión:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la inversión'
    });
  } finally {
    loading.value = false;
  }
};

const loadingTercerosFinanzas = ref(false);
const finTercerosFilter = ref('');
const finTercerosEstado = ref<string | null>(null);

interface FinTercerosRow {
  id: string;
  tipo: 'Ingreso' | 'Gasto';
  fecha: string;
  tercero: string;
  numeroFactura?: string;
  estado: string;
  total: number;
}

const finTercerosColumns = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center' as const },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' as const, format: (val: string) => formatDate(val) },
  { name: 'tercero', label: 'Tercero', field: 'tercero', align: 'left' as const },
  { name: 'numeroFactura', label: 'Factura', field: 'numeroFactura', align: 'left' as const },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' as const },
  { name: 'total', label: 'Total', field: 'total', align: 'right' as const, format: (val: number) => formatCurrency(val) }
];

const finTercerosRows = computed<FinTercerosRow[]>(() => {
  const rows: FinTercerosRow[] = [];
  const gastosLista = (gastos.value || []) as Gasto[];
  // Gastos de terceros: categoría específica
  gastosLista.forEach((g: Gasto) => {
    const esTerceros = (g.categoria?.nombre || '').toLowerCase() === 'compras de terceros' || (g.observaciones || '').toLowerCase().includes('[origen=terceros]');
    if (esTerceros) {
      rows.push({
        id: g.id,
        tipo: 'Gasto',
        fecha: formatDate(g.fecha),
        tercero: g.proveedor || '',
        numeroFactura: g.numeroFactura || '',
        estado: 'PAGADO',
        total: Number(g.monto)
      });
    }
  });
  // Compras pendientes de terceros que aún no tienen gasto
  (comprasStore.compras || []).forEach(c => {
    const existeGasto = gastosLista.some((g: Gasto) => ((g.categoria?.nombre || '').toLowerCase() === 'compras de terceros') && ((g.numeroFactura || '') === (c.numeroFactura || '')) && ((g.proveedor || '') === (c.tercero?.nombre || '')));
    if (!existeGasto) {
      rows.push({
        id: c.id,
        tipo: 'Gasto',
        fecha: formatDate(c.fecha),
        tercero: c.tercero?.nombre || '',
        numeroFactura: c.numeroFactura || '',
        estado: 'PENDIENTE',
        total: Number(c.total)
      });
    }
  });
  // Ingresos de terceros: tienen referencia y tipo 'venta'
  (ingresos.value || []).forEach((i: Ingreso) => {
    const esTerceros = (i.tipo === 'venta') && !i.salidaId && ((i.referencia || '').length > 0) && ((i.descripcion || '').toLowerCase().includes('[origen=terceros]'));
    if (esTerceros) {
      const ventaRef = ventasStore.ventas.find(v => v.id === i.referencia);
      rows.push({
        id: i.id,
        tipo: 'Ingreso',
        fecha: formatDate(i.fecha),
        tercero: (i.descripcion || '').replace('Venta terceros', '').replace('[origen=terceros]', '').trim(),
        numeroFactura: '',
        estado: ventaRef ? (ventaRef.estado || 'PENDIENTE') : 'PENDIENTE',
        total: Number(i.monto)
      });
    }
  });
  return rows;
});

const finTercerosRowsFiltered = computed(() => {
  let r = finTercerosRows.value;
  const s = finTercerosFilter.value.toLowerCase().trim();
  if (s) {
    r = r.filter(x => (x.tercero || '').toLowerCase().includes(s) || (x.numeroFactura || '').toLowerCase().includes(s));
  }
  if (finTercerosEstado.value) {
    r = r.filter(x => x.estado === finTercerosEstado.value);
  }
  return r;
});

// KPIs de terceros basados en estado real de compras/ventas de terceros
const comprasStore = useComprasTercerosStore();
const ventasStore = useVentasTercerosStore();

const ingresosTercerosPagados = computed(() => ventasStore.ventas.filter(v => v.estado === 'PAGADO').reduce((s, v) => s + Number(v.total), 0));
const ingresosTercerosPendientes = computed(() => ventasStore.ventas.filter(v => v.estado !== 'PAGADO').reduce((s, v) => s + Number(v.total), 0));
const gastosTercerosPagados = computed(() => comprasStore.compras.filter(c => c.estado === 'PAGADO').reduce((s, c) => s + Number(c.total), 0));
const gastosTercerosPendientes = computed(() => comprasStore.compras.filter(c => c.estado !== 'PAGADO').reduce((s, c) => s + Number(c.total), 0));

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'PAGADO': return 'positive';
    case 'PENDIENTE': return 'warning';
    case 'PARCIAL': return 'info';
    default: return 'grey';
  }
};

const loadFinanzasTerceros = async () => {
  loadingTercerosFinanzas.value = true;
  try {
    await Promise.all([
      fetchGastos(),
      fetchIngresos(),
      comprasStore.fetchCompras(),
      ventasStore.fetchVentas()
    ]);
  } finally {
    loadingTercerosFinanzas.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await fetchCategorias();
  await fetchTiposHuevo();
  await inversionStore.loadInversionInicial();
  onPeriodoChange(); // Esto cargará los datos iniciales
  await loadComparativoMensual();
  await loadFinanzasTerceros();
});
</script>

<style scoped>
.modern-page {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 48px;
  color: #1976d2;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #7f8c8d;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  border-radius: 8px;
  padding: 8px 16px;
}

.add-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.kpi-section {
  margin-bottom: 24px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.kpi-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.kpi-ingresos .kpi-icon {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.kpi-gastos .kpi-icon {
  background: linear-gradient(135deg, #F44336, #d32f2f);
}

.kpi-positive .kpi-icon {
  background: linear-gradient(135deg, #2196F3, #1976d2);
}

.kpi-negative .kpi-icon {
  background: linear-gradient(135deg, #FF9800, #f57c00);
}

.kpi-margen .kpi-icon {
  background: linear-gradient(135deg, #9C27B0, #7b1fa2);
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.kpi-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
}

.section-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-container {
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  text-align: center;
}

.pie-chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  max-height: 350px;
  margin: 0 auto;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.gastos-categoria-table {
  margin-top: 20px;
}

/* Estilos para sección de inversión */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    color: #1976d2;
    display: flex;
    align-items: center;
  }
}

.inversion-kpis {
  .inversion-card {
    border-radius: 12px;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    &.inversion-total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    &.inversion-recuperado {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }
    
    &.inversion-restante {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }
    
    &.inversion-tiempo {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      color: #333;
    }
    
    .kpi-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      
      .kpi-icon {
        opacity: 0.9;
      }
      
      .kpi-info {
        flex: 1;
        
        .kpi-value {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        
        .kpi-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
      }
    }
  }
}

.progress-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.beneficios-section {
  .beneficios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .beneficio-card {
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &.beneficio-positivo {
        border-left: 4px solid #4caf50;
        background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
      }
      
      &.beneficio-negativo {
        border-left: 4px solid #f44336;
        background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .mes-nombre {
        font-weight: bold;
        color: #1976d2;
        margin-bottom: 0.5rem;
      }
      
      .beneficio-valor {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
      }
      
      .beneficio-detalle {
        .text-caption {
          margin-bottom: 0.25rem;
          opacity: 0.8;
        }
      }
    }
  }
}

.impacto-inversion {
  .text-h5 {
    font-weight: bold;
  }
}

.empty-investment-state {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  
  .q-icon {
    opacity: 0.6;
  }
  
  .text-h6 {
    font-weight: 600;
  }
  
  .text-body2 {
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.5;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-content {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .beneficios-grid {
    grid-template-columns: 1fr;
  }
  
  .inversion-kpis .row {
    flex-direction: column;
  }
  
  .dialog-responsive {
    width: 90vw !important;
    max-width: 90vw !important;
  }
}
</style>
