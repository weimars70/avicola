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
