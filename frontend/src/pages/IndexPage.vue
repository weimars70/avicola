<template>
  <q-page class="q-pa-lg" style="background-color: #F5F6FA; min-height: 100vh;">
    <div class="row q-gutter-md">
      <!-- Header Section -->
      <div class="col-12 fade-in">
        <div class="dashboard-header q-pa-md q-pa-lg-xl" style="background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%, #34495E 100%); color: white; margin: -16px -16px 32px -16px; position: relative; overflow: hidden; border-radius: 0 0 24px 24px;">
          <div class="absolute-top-right q-pa-md header-bg-icon" style="opacity: 0.1;">
            <q-icon name="agriculture" class="header-icon-size" />
          </div>
          <div class="header-content" style="position: relative; z-index: 1;">
            <div class="header-title text-weight-bold q-mb-sm" style="font-family: 'Poppins', sans-serif;">
              <q-icon name="dashboard" class="q-mr-sm header-title-icon" />
              <span class="header-title-text">Sistema Avícola Dashboard</span>
            </div>
            <div class="header-subtitle q-mb-md" style="opacity: 0.9; font-family: 'Inter', sans-serif;">
              📊 Gestión integral de producción y inventario
            </div>
            <div class="header-chips row q-gutter-sm">
              <q-chip outline color="white" text-color="white" icon="schedule" label="Tiempo real" class="header-chip" />
              <q-chip outline color="white" text-color="white" icon="trending_up" label="Analytics" class="header-chip" />
              <q-chip outline color="white" text-color="white" icon="security" label="Seguro" class="header-chip" />
            </div>
          </div>
        </div>
      </div>

      <!-- KPIs Section -->
      <div class="col-12 fade-in">
        <div class="kpi-section-title text-weight-bold q-mb-md" style="color: #2C3E50; font-family: 'Poppins', sans-serif;">
          📊 Indicadores Clave de Rendimiento
        </div>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card responsive-kpi-card" style="background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(46, 204, 113, 0.3);">
          <q-card-section class="text-white kpi-card-section">
            <div class="kpi-content">
              <div class="kpi-main-content">
                <div class="kpi-label" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="trending_up" class="kpi-label-icon" />
                  <span class="kpi-label-text">Producción Total</span>
                </div>
                <div class="kpi-value text-weight-bold" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.produccionTotal }}</div>
                <div class="kpi-change" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="arrow_upward" class="kpi-change-icon" color="light-green-3" />
                  <span class="kpi-change-text">+8.5% vs mes anterior</span>
                </div>
              </div>
              <div class="kpi-icon-wrapper">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="egg_alt" class="kpi-main-icon" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card responsive-kpi-card" style="background: linear-gradient(135deg, #6C63FF 0%, #5A52D5 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(108, 99, 255, 0.3);">
          <q-card-section class="text-white kpi-card-section">
            <div class="kpi-content">
              <div class="kpi-main-content">
                <div class="kpi-label" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="payments" class="kpi-label-icon" />
                  <span class="kpi-label-text">Ingresos del Mes</span>
                </div>
                <div class="kpi-value text-weight-bold" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">${{ stats.ingresosDelMes }}K</div>
                <div class="kpi-change" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="arrow_upward" class="kpi-change-icon" color="light-green-3" />
                  <span class="kpi-change-text">+12.3% vs mes anterior</span>
                </div>
              </div>
              <div class="kpi-icon-wrapper">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="account_balance_wallet" class="kpi-main-icon" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card responsive-kpi-card" style="background: linear-gradient(135deg, #1B1F3B 0%, #2C3E50 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(27, 31, 59, 0.3);">
          <q-card-section class="text-white kpi-card-section">
            <div class="kpi-content">
              <div class="kpi-main-content">
                <div class="kpi-label" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="inventory_2" class="kpi-label-icon" />
                  <span class="kpi-label-text">Inventario Actual</span>
                </div>
                <div class="kpi-value text-weight-bold" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.inventarioActual }}</div>
                <div class="kpi-change" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="check_circle" class="kpi-change-icon" color="light-green-3" />
                  <span class="kpi-change-text">Stock óptimo</span>
                </div>
              </div>
              <div class="kpi-icon-wrapper">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="warehouse" class="kpi-main-icon" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3 fade-in">
        <q-card class="kpi-card responsive-kpi-card" style="background: linear-gradient(135deg, #E67E22 0%, #D35400 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(230, 126, 34, 0.3);">
          <q-card-section class="text-white kpi-card-section">
            <div class="kpi-content">
              <div class="kpi-main-content">
                <div class="kpi-label" style="font-family: 'Inter', sans-serif; font-weight: 500;">
                  <q-icon name="agriculture" class="kpi-label-icon" />
                  <span class="kpi-label-text">Galpones Activos</span>
                </div>
                <div class="kpi-value text-weight-bold" style="font-family: 'Poppins', sans-serif; letter-spacing: -1px;">{{ stats.galponesActivos }}</div>
                <div class="kpi-change" style="font-family: 'Inter', sans-serif;">
                  <q-icon name="check_circle" class="kpi-change-icon" color="light-green-3" />
                  <span class="kpi-change-text">75% capacidad</span>
                </div>
              </div>
              <div class="kpi-icon-wrapper">
                <div class="kpi-icon-container" style="background: rgba(255,255,255,0.15); border-radius: 16px; padding: 16px;">
                  <q-icon name="domain" class="kpi-main-icon" />
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
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="router.push('/entradas-produccion')">
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
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="router.push('/galpones')">
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
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="router.push('/inventario')">
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
              
              <div class="action-card hover-lift" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease;" @click="router.push('/resumen')">
                <div class="row items-center no-wrap action-card-content">
                  <div class="col-auto q-mr-md action-icon-container">
                    <q-icon name="assessment" size="32px" color="white" class="action-icon" />
                  </div>
                  <div class="col action-text-container">
                    <div class="text-white text-weight-bold action-title" style="font-family: 'Inter', sans-serif;">Generar Reporte</div>
                    <div class="text-white opacity-80 text-caption action-subtitle">Análisis y estadísticas</div>
                  </div>
                  <div class="col-auto action-arrow">
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
              class="modern-inventory-table responsive-inventory-table"
              style="border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);"
              table-header-style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600;"
              table-style="font-family: 'Inter', sans-serif;"
              :grid="$q.screen.lt.md"
              :card-container-class="$q.screen.lt.md ? 'q-col-gutter-md' : ''"
            >
              <!-- Mobile Card Template -->
              <template v-slot:item="props" v-if="$q.screen.lt.md">
                <div class="col-12 col-sm-6 col-md-4">
                  <q-card class="inventory-mobile-card" flat bordered>
                    <q-card-section class="inventory-card-header">
                      <div class="row items-center justify-between">
                        <div class="inventory-card-title">
                          <q-icon name="home" class="q-mr-xs" size="sm" />
                          {{ props.row.galpon?.nombre || 'Todos' }}
                        </div>
                        <q-chip 
                          :color="props.row.stockActual > 100 ? 'positive' : props.row.stockActual > 50 ? 'warning' : 'negative'"
                          text-color="white"
                          size="sm"
                          class="inventory-status-chip"
                        >
                          {{ props.row.stockActual > 100 ? 'Alto' : props.row.stockActual > 50 ? 'Medio' : 'Bajo' }}
                        </q-chip>
                      </div>
                    </q-card-section>
                    
                    <q-card-section class="inventory-card-content">
                      <div class="inventory-card-row">
                        <div class="inventory-card-label">
                          <q-icon name="egg" class="q-mr-xs" size="sm" />
                          Tipo de Huevo
                        </div>
                        <div class="inventory-card-value">{{ props.row.tipoHuevo.nombre }}</div>
                      </div>
                      
                      <div class="inventory-card-row">
                        <div class="inventory-card-label">
                          <q-icon name="inventory" class="q-mr-xs" size="sm" />
                          Stock Actual
                        </div>
                        <div class="inventory-card-value inventory-stock-value">
                          <q-circular-progress
                            :value="(props.row.stockActual / 200) * 100"
                            size="20px"
                            :thickness="0.3"
                            :color="props.row.stockActual > 100 ? 'positive' : props.row.stockActual > 50 ? 'warning' : 'negative'"
                            track-color="grey-3"
                            class="q-mr-sm"
                          />
                          {{ props.row.stockActual }}
                        </div>
                      </div>
                      
                      <div class="inventory-card-row">
                        <div class="inventory-card-label">
                          <q-icon name="attach_money" class="q-mr-xs" size="sm" />
                          Valor Total
                        </div>
                        <div class="inventory-card-value inventory-value-total">
                          ${{ formatCurrency(props.row.valorTotal) }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>

              <!-- Desktop Table Templates -->
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
import { useRouter } from 'vue-router';
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
const router = useRouter();

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

    // Actualizar resumen de inventario - forzar reactividad
    inventorySummary.value = [...inventarioStore.resumenInventario.slice(0, 5)];
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
  
  /* Header responsive styles */
  .dashboard-header {
    padding: 16px !important;
    margin: -16px -16px 24px -16px !important;
  }
  
  .header-title {
    font-size: 1.5rem !important;
    text-align: center;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .header-title-icon {
    font-size: 2rem !important;
  }
  
  .header-title-text {
    font-size: 1.2rem;
    line-height: 1.3;
  }
  
  .header-subtitle {
    font-size: 0.9rem !important;
    text-align: center;
    margin-bottom: 16px !important;
  }
  
  .header-chips {
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px !important;
  }
  
  .header-chip {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .header-bg-icon {
    display: none;
  }
  
  .header-icon-size {
    font-size: 80px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 12px !important;
    border-radius: 0 0 16px 16px !important;
  }
  
  .header-title {
    font-size: 1.3rem !important;
  }
  
  .header-title-text {
    font-size: 1.1rem;
  }
  
  .header-subtitle {
    font-size: 0.8rem !important;
  }
  
  .header-chips {
    gap: 6px !important;
  }
  
  .header-chip {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}

@media (min-width: 769px) {
  .header-title {
    font-size: 2.5rem;
    display: flex;
    align-items: center;
  }
  
  .header-title-icon {
    font-size: 3rem;
  }
  
  .header-subtitle {
    font-size: 1.25rem;
  }
  
  .header-icon-size {
    font-size: 120px;
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

/* KPI Cards Responsive Styles */
.kpi-section-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.responsive-kpi-card {
  transition: all 0.3s ease;
  height: 100%;
  min-height: 140px;
}

.kpi-card-section {
  padding: 1.5rem;
  height: 100%;
}

.kpi-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 1rem;
}

.kpi-main-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.kpi-label-icon {
  font-size: 1rem;
}

.kpi-label-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  font-size: 2rem;
  line-height: 1.2;
  margin: 0.5rem 0;
}

.kpi-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.kpi-change-icon {
  font-size: 0.875rem;
}

.kpi-change-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-icon-wrapper {
  flex-shrink: 0;
}

.kpi-main-icon {
  font-size: 2.5rem;
}

/* Mobile Responsive Styles for KPI Cards */
@media (max-width: 768px) {
  .kpi-section-title {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .responsive-kpi-card {
    margin-bottom: 1rem;
    min-height: 120px;
  }
  
  .kpi-card-section {
    padding: 1rem;
  }
  
  .kpi-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .kpi-main-content {
    order: 2;
  }
  
  .kpi-icon-wrapper {
    order: 1;
  }
  
  .kpi-label {
    justify-content: center;
    font-size: 0.8rem;
  }
  
  .kpi-value {
    font-size: 1.75rem;
  }
  
  .kpi-change {
    justify-content: center;
    font-size: 0.7rem;
  }
  
  .kpi-main-icon {
    font-size: 2rem;
  }
  
  .kpi-icon-container {
    padding: 12px !important;
  }
}

@media (max-width: 480px) {
  .kpi-section-title {
    font-size: 1rem;
  }
  
  .responsive-kpi-card {
    min-height: 110px;
  }
  
  .kpi-card-section {
    padding: 0.75rem;
  }
  
  .kpi-label {
    font-size: 0.75rem;
  }
  
  .kpi-label-text {
    font-size: 0.75rem;
  }
  
  .kpi-value {
    font-size: 1.5rem;
  }
  
  .kpi-change {
    font-size: 0.65rem;
  }
  
  .kpi-main-icon {
    font-size: 1.75rem;
  }
  
  .kpi-icon-container {
    padding: 10px !important;
  }
}

/* Tablet Landscape Optimization */
@media (min-width: 769px) and (max-width: 1024px) {
  .kpi-value {
    font-size: 1.8rem;
  }
  
  .kpi-main-icon {
    font-size: 2.25rem;
  }
}

/* Inventory Mobile Cards */
.inventory-mobile-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
}

.inventory-mobile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.inventory-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
}

.inventory-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.inventory-status-chip {
  font-size: 0.75rem;
  font-weight: 600;
}

.inventory-card-content {
  padding: 16px;
}

.inventory-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.inventory-card-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.inventory-card-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.inventory-card-value {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.inventory-stock-value {
  display: flex;
  align-items: center;
}

.inventory-value-total {
  color: #4caf50;
  font-size: 1rem;
  font-weight: 700;
}

/* Responsive Inventory Stats */
@media (max-width: 768px) {
  .inventory-stat-card {
    padding: 12px !important;
    text-align: center;
  }
  
  .inventory-stat-card .text-h6 {
    font-size: 1.2rem !important;
  }
  
  .inventory-stat-card .text-caption {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .inventory-mobile-card {
    margin-bottom: 12px;
  }
  
  .inventory-card-header {
    padding: 10px 12px;
  }
  
  .inventory-card-title {
    font-size: 0.85rem;
  }
  
  .inventory-status-chip {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
  
  .inventory-card-content {
    padding: 12px;
  }
  
  .inventory-card-row {
    margin-bottom: 10px;
    padding: 6px 0;
  }
  
  .inventory-card-label {
    font-size: 0.8rem;
  }
  
  .inventory-card-value {
    font-size: 0.85rem;
  }
  
  .inventory-value-total {
    font-size: 0.9rem;
  }
  
  .inventory-stat-card {
    padding: 10px !important;
  }
  
  .inventory-stat-card .text-h6 {
    font-size: 1.1rem !important;
  }
  
  .inventory-stat-card .text-caption {
    font-size: 0.7rem !important;
  }
}

/* Responsive Quick Actions Styles */
.responsive-actions-card {
  transition: all 0.3s ease;
}

.actions-header {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.responsive-action-card {
  min-height: 80px;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.responsive-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.responsive-action-card:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

.action-card-content {
  position: relative;
  z-index: 2;
}

.action-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.action-icon {
  transition: transform 0.3s ease;
}

.responsive-action-card:hover .action-icon {
  transform: scale(1.1);
}

.action-text-container {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: 1rem;
  line-height: 1.2;
  margin-bottom: 4px;
}

.action-subtitle {
  font-size: 0.875rem;
  line-height: 1.2;
}

.action-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  transition: transform 0.3s ease;
}

.responsive-action-card:hover .action-arrow {
  transform: translateX(4px);
}

/* Mobile Responsive Styles for Quick Actions */
@media (max-width: 768px) {
  .responsive-actions-card {
    margin-bottom: 16px;
  }
  
  .actions-header {
    font-size: 1.125rem;
    margin-bottom: 16px !important;
  }
  
  .actions-container {
    gap: 12px;
  }
  
  .responsive-action-card {
    min-height: 70px;
    padding: 16px !important;
    border-radius: 12px !important;
  }
  
  .action-icon-container {
    min-width: 40px;
    margin-right: 12px !important;
  }
  
  .action-icon {
    font-size: 28px !important;
  }
  
  .action-title {
    font-size: 0.95rem;
  }
  
  .action-subtitle {
    font-size: 0.8rem;
  }
  
  .action-arrow {
    min-width: 20px;
  }
}

@media (max-width: 480px) {
  .responsive-actions-card .q-card-section {
    padding: 16px !important;
  }
  
  .actions-header {
    font-size: 1rem;
    margin-bottom: 12px !important;
  }
  
  .actions-container {
    gap: 10px;
  }
  
  .responsive-action-card {
    min-height: 65px;
    padding: 14px !important;
    border-radius: 10px !important;
  }
  
  .action-icon-container {
    min-width: 36px;
    margin-right: 10px !important;
  }
  
  .action-icon {
    font-size: 24px !important;
  }
  
  .action-title {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }
  
  .action-subtitle {
    font-size: 0.75rem;
  }
  
  .action-arrow {
    min-width: 18px;
  }
  
  .action-arrow .q-icon {
    font-size: 14px !important;
  }
}

/* Tablet Responsive Styles for Quick Actions */
@media (min-width: 769px) and (max-width: 1024px) {
  .responsive-action-card {
    min-height: 75px;
  }
  
  .action-title {
    font-size: 0.975rem;
  }
  
  .action-subtitle {
    font-size: 0.825rem;
  }
}

/* Large Screen Styles for Quick Actions */
@media (min-width: 1025px) {
  .responsive-action-card {
    min-height: 85px;
  }
  
  .action-title {
    font-size: 1.05rem;
  }
  
  .action-subtitle {
    font-size: 0.9rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .responsive-action-card {
    min-height: 75px;
    padding: 18px !important;
  }
  
  .responsive-action-card:hover {
    transform: none;
  }
  
  .responsive-action-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  .action-icon-container {
    min-width: 44px;
  }
  
  .action-icon {
    font-size: 30px !important;
  }
}
</style>
