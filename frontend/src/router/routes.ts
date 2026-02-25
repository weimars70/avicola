import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RegisterPage.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'galpones', component: () => import('pages/GalponesPage.vue') },
      { path: 'tipos-huevo', component: () => import('pages/TiposHuevoPage.vue') },
      { path: 'canastas', component: () => import('pages/CanastasPage.vue') },
      { path: 'entradas-produccion', component: () => import('pages/EntradasProduccionPage.vue') },
      { path: 'salidas', component: () => import('pages/SalidasPage.vue') },
      { path: 'inventario', component: () => import('pages/InventarioPage.vue') },
      { path: 'resumen', component: () => import('pages/ResumenPage.vue') },
      { path: 'finanzas', component: () => import('pages/FinanzasPage.vue') },
      { path: 'historial-financiero', component: () => import('pages/HistorialFinancieroPage.vue') },
      // Rutas de terceros
      { path: 'terceros', component: () => import('pages/ListadoTercerosPage.vue') },
      { path: 'terceros/formulario', component: () => import('pages/FormularioTerceroPage.vue') },
      { path: 'terceros/formulario/:id', component: () => import('pages/FormularioTerceroPage.vue') },
      { path: 'terceros/compras', component: () => import('pages/ComprasTercerosPage.vue') },
      { path: 'terceros/ventas', component: () => import('pages/VentasTercerosPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
