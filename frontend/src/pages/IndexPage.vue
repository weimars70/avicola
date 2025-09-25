<template>
  <q-page class="q-pa-lg" style="background-color: #F5F6FA; min-height: 100vh;">
    <div class="row q-gutter-md">
      <!-- Header Section -->
      <div class="col-12 fade-in">
        <div class="q-pa-xl" style="background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%, #34495E 100%); color: white; margin: -16px -16px 32px -16px; position: relative; overflow: hidden; border-radius: 0 0 24px 24px;">
          <div class="absolute-top-right q-pa-md" style="opacity: 0.1;">
            <q-icon name="agriculture" size="120px" />
          </div>
          <div class="text-h3 text-weight-bold q-mb-sm" style="font-family: 'Poppins', sans-serif; position: relative; z-index: 1;">
            <q-icon name="dashboard" class="q-mr-md" size="lg" />
            Sistema Avícola Dashboard
          </div>
          <div class="text-h6 q-mb-md" style="opacity: 0.9; font-family: 'Inter', sans-serif; position: relative; z-index: 1;">
            📊 Gestión integral de producción y inventario
          </div>
          <div class="row q-gutter-sm" style="position: relative; z-index: 1;">
            <q-chip outline color="white" text-color="white" icon="schedule" label="Tiempo real" />
            <q-chip outline color="white" text-color="white" icon="trending_up" label="Analytics" />
            <q-chip outline color="white" text-color="white" icon="security" label="Seguro" />
          </div>
        </div>
      </div>

      <!-- KPIs Section -->
      <div class="col-12 fade-in">
        <div class="text-h6 text-weight-bold q-mb-md" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
          📊 Indicadores Clave de Rendimiento
        </div>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(46, 204, 113, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="trending_up" class="q-mr-xs" size="sm" />
                  Producción Total
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.produccionTotal }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="arrow_upward" class="q-mr-xs" size="xs" color="light-green-3" />
                  +8.5% vs mes anterior
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="egg_alt" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #6C63FF 0%, #5A52D5 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(108, 99, 255, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="payments" class="q-mr-xs" size="sm" />
                  Ingresos del Mes
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">${{ stats.ingresosDelMes }}K</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="arrow_upward" class="q-mr-xs" size="xs" color="light-green-3" />
                  +12.3% vs mes anterior
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="account_balance_wallet" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(27, 31, 59, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="inventory_2" class="q-mr-xs" size="sm" />
                  Inventario Actual
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.inventarioActual }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="check_circle" class="q-mr-xs" size="xs" color="light-green-3" />
                  Stock óptimo
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="warehouse" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #E67E22 0%, #D35400 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(230, 126, 34, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="agriculture" class="q-mr-xs" size="sm" />
                  Galpones Activos
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.galponesActivos }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="check_circle" class="q-mr-xs" size="xs" color="light-green-3" />
                  75% capacidad
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="domain" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Additional KPIs Section -->
      <div class="col-12 fade-in">
        <div class="text-h6 text-weight-bold q-mb-md" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
          🐔 Estadísticas de Gallinas y Galpones
        </div>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="pets" class="q-mr-xs" size="sm" />
                  Gallinas Totales
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.gallinasTotal }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="info" class="q-mr-xs" size="xs" color="light-blue-3" />
                  Capacidad total
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="pets" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(78, 205, 196, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="favorite" class="q-mr-xs" size="sm" />
                  Gallinas Activas
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.gallinasActivas }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="check_circle" class="q-mr-xs" size="xs" color="light-green-3" />
                  En producción
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="favorite" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #A8E6CF 0%, #7FCDCD 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(168, 230, 207, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="home_work" class="q-mr-xs" size="sm" />
                  Total Galpones
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.totalGalpones }}</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="info" class="q-mr-xs" size="xs" color="light-blue-3" />
                  Instalaciones totales
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="home_work" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card" style="background: linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(255, 217, 61, 0.3);">
          <q-card-section class="text-white q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-80" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="analytics" class="q-mr-xs" size="sm" />
                  Eficiencia
                </div>
                <div class="text-h3 text-weight-bold q-mt-sm" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ Math.round((stats.galponesActivos / stats.totalGalpones) * 100) }}%</div>
                <div class="text-body2 opacity-80 q-mt-xs" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="trending_up" class="q-mr-xs" size="xs" color="light-green-3" />
                  Galpones activos
                </div>
              </div>
              <div class="col-auto">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="analytics" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Calendario Financiero -->
      <div class="col-12 fade-in">
        <div class="text-h6 text-weight-bold q-mb-md" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
          📅 Calendario Financiero
        </div>
      </div>
      
      <div class="col-12 fade-in">
        <q-card class="modern-card" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          <q-card-section class="q-pa-lg">
            <div class="text-h5 text-weight-bold q-mb-lg" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
              <q-icon name="calendar_month" class="q-mr-sm" color="primary" size="md" />
              Vista Mensual de Ingresos y Producción
            </div>
            <CalendarioFinanciero
              :datos="datosCalendario"
              :mostrar-ingresos="true"
              :mostrar-gastos="false"
              :mostrar-produccion="true"
              @cambio-mes="onCambioMes"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity -->
      <div class="col-12 col-md-8 fade-in">
        <q-card class="modern-card" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          <q-card-section class="q-pa-lg">
            <div class="text-h5 text-weight-bold q-mb-lg" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
              <q-icon name="timeline" class="q-mr-sm" color="primary" size="md" />
              Actividad Reciente
              <q-badge color="primary" floating transparent>
                {{ recentActivity.length }}
              </q-badge>
            </div>
            <div class="activity-timeline">
              <div v-if="actividadesLoading" class="text-center q-py-lg">
                <q-spinner-dots size="40px" color="primary" />
                <div class="text-body2 q-mt-sm" style="color: #6C757D;">Cargando actividades...</div>
              </div>
              <div v-else-if="recentActivity.length === 0" class="text-center q-py-lg">
                <q-icon name="inbox" size="48px" color="grey-4" />
                <div class="text-body2 q-mt-sm" style="color: #6C757D;">No hay actividades recientes</div>
              </div>
              <div v-else v-for="(activity, index) in recentActivity" :key="activity.id" class="activity-item q-mb-md" :class="{ 'activity-item-last': index === recentActivity.length - 1 }">
                <div class="activity-content" style="background: #F8F9FA; border-radius: 12px; padding: 16px; border-left: 4px solid;" :style="`border-left-color: ${activity.color === 'positive' ? '#2ECC71' : activity.color === 'negative' ? '#E74C3C' : '#6C63FF'}`">
                  <div class="row items-center q-gutter-md">
                    <div class="col-auto">
                      <q-avatar :color="activity.color" text-color="white" :icon="activity.icon" size="md" class="shadow-2" />
                    </div>
                    <div class="col">
                      <div class="text-weight-bold text-body1" style="font-family: 'Inter', sans-serif; color: #2C3E50;">{{ activity.descripcion }}</div>
                      <div class="text-body2 q-mt-xs" style="color: #6C757D; font-family: 'Inter', sans-serif;">{{ formatActivityDate(activity.fecha) }}</div>
                      <div class="row items-center q-mt-sm q-gutter-xs" v-if="activity.monto">
                        <q-icon name="attach_money" size="xs" color="grey-6" />
                        <span class="text-caption text-weight-bold" style="color: #2ECC71; font-family: 'Inter', sans-serif;">{{ formatActivityCurrency(activity.monto) }}</span>
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-btn flat round icon="more_vert" size="sm" color="grey-6">
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item clickable v-close-popup>
                              <q-item-section>Ver detalles</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center q-mt-lg">
              <q-btn outline color="primary" icon="refresh" label="Actualizar actividades" class="q-px-lg" style="border-radius: 8px;" @click="fetchActividadesRecientes(5)" :loading="actividadesLoading" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-4 fade-in">
        <q-card class="modern-card" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          <q-card-section class="q-pa-lg">
            <div class="text-h5 text-weight-bold q-mb-lg" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
              <q-icon name="bolt" class="q-mr-sm" color="orange" size="md" />
              Acciones Rápidas
            </div>
            <div class="q-gutter-md">
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="$router.push('/entradas-produccion')">
                <div class="row items-center no-wrap">
                  <div class="col-auto q-mr-md">
                    <q-icon name="add_circle" size="32px" color="white" />
                  </div>
                  <div class="col">
                    <div class="text-white text-weight-bold" style="font-family: 'Inter', sans-serif;">Registrar Producción</div>
                    <div class="text-white opacity-80 text-caption">Agregar producción diaria</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="arrow_forward_ios" size="sm" color="white" class="opacity-60" />
                  </div>
                </div>
              </div>
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="$router.push('/galpones')">
                <div class="row items-center no-wrap">
                  <div class="col-auto q-mr-md">
                    <q-icon name="home" size="32px" color="white" />
                  </div>
                  <div class="col">
                    <div class="text-white text-weight-bold" style="font-family: 'Inter', sans-serif;">Gestionar Galpones</div>
                    <div class="text-white opacity-80 text-caption">Control de instalaciones</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="arrow_forward_ios" size="sm" color="white" class="opacity-60" />
                  </div>
                </div>
              </div>
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="$router.push('/inventario')">
                <div class="row items-center no-wrap">
                  <div class="col-auto q-mr-md">
                    <q-icon name="inventory_2" size="32px" color="white" />
                  </div>
                  <div class="col">
                    <div class="text-white text-weight-bold" style="font-family: 'Inter', sans-serif;">Ver Inventario</div>
                    <div class="text-white opacity-80 text-caption">Control de stock y almacén</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="arrow_forward_ios" size="sm" color="white" class="opacity-60" />
                  </div>
                </div>
              </div>
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="$router.push('/resumen')">
                <div class="row items-center no-wrap">
                  <div class="col-auto q-mr-md">
                    <q-icon name="assessment" size="32px" color="white" />
                  </div>
                  <div class="col">
                    <div class="text-white text-weight-bold" style="font-family: 'Inter', sans-serif;">Generar Reporte</div>
                    <div class="text-white opacity-80 text-caption">Análisis y estadísticas</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="arrow_forward_ios" size="sm" color="white" class="opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Inventory Summary -->
      <div class="col-12 fade-in">
        <q-card class="modern-card" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          <q-card-section class="q-pa-lg">
            <div class="text-h5 text-weight-bold q-mb-lg" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
              <q-icon name="warehouse" class="q-mr-sm" color="primary" size="md" />
              Resumen de Inventario
              <q-btn flat round icon="refresh" size="sm" color="grey-6" class="q-ml-sm" @click="loadDashboardData">
                <q-tooltip>Actualizar datos</q-tooltip>
              </q-btn>
              <q-btn flat round icon="sync" size="sm" color="secondary" class="q-ml-sm" @click="syncIngresos" :loading="finanzasLoading">
                <q-tooltip>Sincronizar ingresos desde salidas</q-tooltip>
              </q-btn>
            </div>
            
            <!-- Estadísticas rápidas del inventario -->
            <div class="row q-gutter-md q-mb-lg">
              <div class="col">
                <div class="inventory-stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 16px; color: white;">
                  <div class="text-h6 text-weight-bold">{{ inventorySummary.length }}</div>
                  <div class="text-caption opacity-80">Productos Total</div>
                </div>
              </div>
              <div class="col">
                <div class="inventory-stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 16px; color: white;">
                  <div class="text-h6 text-weight-bold">{{ inventorySummary.filter((item: any) => item.stockActual > 50).length }}</div>
                  <div class="text-caption opacity-80">Stock Alto</div>
                </div>
              </div>
              <div class="col">
                <div class="inventory-stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; padding: 16px; color: white;">
                  <div class="text-h6 text-weight-bold">{{ inventorySummary.filter((item: any) => item.stockActual <= 50).length }}</div>
                  <div class="text-caption opacity-80">Stock Bajo</div>
                </div>
              </div>
            </div>
            
            <q-table
              :rows="inventorySummary"
              :columns="inventoryColumns"
              :row-key="(row: any) => `${row.galpon?.id || 'all'}-${row.tipoHuevo.id}`"
              :loading="loading"
              :pagination="{ rowsPerPage: 5 }"
              flat
              class="modern-inventory-table"
              style="border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);"
              table-header-style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600;"
              table-style="font-family: 'Inter', sans-serif;"
            >
              <template v-slot:body-cell-stockActual="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm">
                    <q-circular-progress
                      :value="(props.value / 200) * 100"
                      size="24px"
                      :thickness="0.3"
                      :color="props.value > 100 ? 'positive' : props.value > 50 ? 'warning' : 'negative'"
                      track-color="grey-3"
                    />
                    <span class="text-weight-medium">{{ props.value }}</span>
                  </div>
                </q-td>
              </template>
              
              <template v-slot:body-cell-valorTotal="props">
                <q-td :props="props">
                  <div class="text-weight-bold text-positive" style="font-size: 1.1em;">
                    ${{ formatCurrency(props.value) }}
                  </div>
                </q-td>
              </template>
              
              <template v-slot:header="props">
                <q-tr :props="props" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-white text-weight-bold">
                    <q-icon :name="getColumnIcon(col.name)" class="q-mr-xs" size="sm" />
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useInventarioStore } from 'src/stores/inventario';
import { useActividades } from 'src/composables/useActividades';
import { useFinanzas } from 'src/composables/useFinanzas';
import { useQuasar } from 'quasar';
import CalendarioFinanciero from 'src/components/CalendarioFinanciero.vue';

interface Galpon {
  id: string;
  nombre: string;
}

interface TipoHuevo {
  id: string;
  nombre: string;
}

interface InventorySummaryItem {
  galpon?: Galpon;
  tipoHuevo: TipoHuevo;
  stockActual: number;
  valorTotal: number;
  totalEntradas: number;
  totalSalidas: number;
  galponId?: string;
}

const inventarioStore = useInventarioStore();
const { syncIngresosFromSalidas, loading: finanzasLoading } = useFinanzas();
const $q = useQuasar();

const loading = ref(false);

const stats = ref({
  produccionTotal: 0,
  ingresosDelMes: 0,
  inventarioActual: 0,
  galponesActivos: 0,
  totalGalpones: 0,
  gallinasTotal: 0,
  gallinasActivas: 0
});

// Usar el composable de actividades
const { 
  actividades: recentActivity, 
  loading: actividadesLoading, 
  fetchActividadesRecientes,
  formatDate: formatActivityDate,
  formatCurrency: formatActivityCurrency
} = useActividades();

const inventorySummary = ref<InventorySummaryItem[]>([]);

// Variables para el calendario financiero
const datosCalendario = ref<Record<string, { ingresos: number; produccion: number; gastos: number }>>({});

const inventoryColumns = [
  {
    name: 'galpon',
    label: 'Galpón',
    align: 'left' as const,
    field: (row: InventorySummaryItem) => row.galpon?.nombre || 'Todos'
  },
  {
    name: 'tipoHuevo',
    label: 'Tipo de Huevo',
    align: 'left' as const,
    field: (row: InventorySummaryItem) => row.tipoHuevo.nombre
  },
  {
    name: 'stockActual',
    label: 'Stock Actual',
    align: 'center' as const,
    field: 'stockActual'
  },
  {
    name: 'valorTotal',
    label: 'Valor Total',
    align: 'right' as const,
    field: 'valorTotal'
  }
];



const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getColumnIcon = (columnName: string) => {
  const iconMap: Record<string, string> = {
    'tipoHuevo': 'egg',
    'galpon': 'home',
    'stockActual': 'inventory',
    'valorTotal': 'attach_money',
    'actions': 'settings'
  };
  return iconMap[columnName] || 'info';
};

// Métodos para el calendario financiero
const cargarDatosCalendario = async (mes?: number, año?: number) => {
  try {
    const fechaActual = new Date();
    // Usar el mismo formato que otras páginas para consistencia
    const mesCalendario = mes ?? fechaActual.getMonth();
    const añoCalendario = año ?? fechaActual.getFullYear();
    
    const fechaInicio = new Date(añoCalendario, mesCalendario, 1);
    const fechaFin = new Date(añoCalendario, mesCalendario + 1, 0);
    
    const response = await api.get('/finanzas/datos-diarios', {
      params: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0]
      }
    });
    
    // Forzar reactividad
    datosCalendario.value = { ...response.data };
  } catch (error) {
    console.error('Error cargando datos del calendario:', error);
  }
};

const onCambioMes = (mes: number, año: number) => {
  void cargarDatosCalendario(mes, año);
};

const syncIngresos = async () => {
  try {
    await syncIngresosFromSalidas();
    await cargarDatosCalendario();
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



const loadDashboardData = async () => {
  loading.value = true;
  try {
    // Cargar KPIs reales del backend
    const response = await api.get('/finanzas/dashboard-kpis');
    const kpis = response.data;
    
    // Actualizar estadísticas con datos reales
    stats.value = {
      produccionTotal: kpis.produccionTotal,
      ingresosDelMes: kpis.ingresosDelMes,
      inventarioActual: kpis.inventarioActual,
      galponesActivos: kpis.galponesActivos,
      totalGalpones: kpis.totalGalpones || 0,
      gallinasTotal: kpis.gallinasTotal || 0,
      gallinasActivas: kpis.gallinasActivas || 0
    };

    // Cargar datos adicionales para la tabla de inventario, actividades recientes y calendario
    await Promise.all([
      inventarioStore.fetchResumenInventario(),
      fetchActividadesRecientes(5), // Cargar las últimas 5 actividades
      cargarDatosCalendario() // Cargar datos del calendario para el mes actual
    ]);

    // Actualizar resumen de inventario
    inventorySummary.value = inventarioStore.resumenInventario.slice(0, 5);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Fallback a datos por defecto en caso de error
    stats.value = {
      produccionTotal: 0,
      ingresosDelMes: 0,
      inventarioActual: 0,
      galponesActivos: 0,
      totalGalpones: 0,
      gallinasTotal: 0,
      gallinasActivas: 0
    };
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadDashboardData();
});
</script>

<style scoped>
/* Importar fuentes de Google */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

/* Estilos para las tarjetas modernas */
.modern-card {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
}

/* Estilos para las tarjetas de KPI */
.kpi-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6C63FF, #2ECC71);
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0,0,0,0.1) !important;
}

/* Estilos para números grandes */
.kpi-number {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #1B1F3B, #6C63FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Estilos para la tabla moderna */
.modern-table {
  border: 1px solid #E5E7EB;
}

.modern-table .q-table__top {
  background-color: #F8F9FA;
  border-bottom: 2px solid #E5E7EB;
}

.modern-table tbody tr:hover {
  background-color: #F0F4F8;
}

/* Animaciones suaves */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Inventory Statistics Cards */
.inventory-stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.inventory-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

/* Modern Inventory Table */
.modern-inventory-table .q-table__top,
.modern-inventory-table .q-table__bottom,
.modern-inventory-table thead tr:first-child th {
  background-color: transparent;
}

.modern-inventory-table tbody tr:hover {
  background-color: rgba(103, 126, 234, 0.05);
}

.modern-inventory-table .q-table th {
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Enhanced Timeline Styles */
.timeline-item {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.timeline-item:hover {
  border-left-color: #667eea;
  background-color: rgba(103, 126, 234, 0.02);
  transform: translateX(4px);
}

/* Pulse Animation for Badges */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 126, 234, 0);
  }
}

.pulse-badge {
  animation: pulse 2s infinite;
}

/* Loading Skeleton Effect */
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s infinite;
}

/* Efectos hover para tarjetas de acción */
.action-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.action-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.action-card:hover::before {
  left: 100%;
}

.action-card:active {
  transform: translateY(-2px) scale(1.01);
}

/* Mejoras para KPI cards */
.kpi-icon-container {
  transition: all 0.3s ease;
}

.kpi-card:hover .kpi-icon-container {
  transform: scale(1.1) rotate(5deg);
}

/* Timeline de actividades */
.activity-timeline {
  position: relative;
}

.activity-item {
  position: relative;
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(8px);
}

.activity-content {
  transition: all 0.3s ease;
  position: relative;
}

.activity-content:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modern-card {
    margin-bottom: 16px;
  }
  
  .kpi-card {
    margin-bottom: 12px;
  }
  
  .kpi-number {
    font-size: 2rem;
  }
  
  .action-card {
    margin-bottom: 12px;
  }
  
  .activity-item:hover {
    transform: translateX(4px);
  }
}

/* Efectos de carga */
.modern-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulso para badges */
.q-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
