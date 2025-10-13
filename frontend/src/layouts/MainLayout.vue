<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white" style="box-shadow: 0 2px 8px rgba(27, 31, 59, 0.15);">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-weight-bold">
          <q-icon name="egg" class="q-mr-sm" size="md" />
          <span style="font-family: 'Poppins', sans-serif; font-size: 1.2rem;">Sistema Avícola</span>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="account_circle"
          class="q-ml-sm"
        >
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 220px">
              <q-item-label header class="text-grey-8 text-weight-medium">
                <q-icon name="person" class="q-mr-sm" />
                {{ authStore.user?.nombre || 'Usuario' }}
              </q-item-label>
              <q-item-label header class="text-grey-6 text-caption q-pb-sm">
                {{ authStore.user?.email || 'Sesión expirada' }}
              </q-item-label>
              <q-separator class="q-my-sm" />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Cerrar Sesión</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
      :width="280"
      style="border-right: 1px solid #E5E7EB;"
    >
      <div class="q-pa-md bg-primary text-white">
        <div class="text-h6 text-weight-bold" style="font-family: 'Poppins', sans-serif;">
          <q-icon name="dashboard" class="q-mr-sm" />
          Panel de Control
        </div>
        <div class="text-caption opacity-80">Gestión Avícola</div>
      </div>
      
      <q-list class="q-pa-sm">
        <q-item-label header class="text-grey-8 text-weight-bold q-px-md q-pt-md" style="font-family: 'Poppins', sans-serif;">
          <q-icon name="dashboard" class="q-mr-sm" color="secondary" />
          Menú Principal
        </q-item-label>

        <q-item
          v-for="link in menuItems"
          :key="link.title"
          :to="link.to"
          clickable
          v-ripple
          exact-active-class="bg-secondary text-white"
          class="q-mx-sm q-my-xs rounded-borders"
          style="border-radius: 12px;"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium" style="font-family: 'Poppins', sans-serif;">{{ link.title }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md q-mx-md" />

        <q-item-label header class="text-grey-8 text-weight-bold q-px-md" style="font-family: 'Poppins', sans-serif;">
          <q-icon name="inventory" class="q-mr-sm" color="accent" />
          Inventario
        </q-item-label>

        <q-item
          v-for="inventoryItem in inventoryItems"
          :key="inventoryItem.title"
          :to="inventoryItem.to"
          clickable
          v-ripple
          exact-active-class="bg-secondary text-white"
          class="q-mx-sm q-my-xs rounded-borders"
          style="border-radius: 12px;"
        >
          <q-item-section avatar>
            <q-icon :name="inventoryItem.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium" style="font-family: 'Poppins', sans-serif;">{{ inventoryItem.title }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{ inventoryItem.caption }}</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-separator class="q-my-md q-mx-md" />

        <q-item-label header class="text-grey-8 text-weight-bold q-px-md" style="font-family: 'Poppins', sans-serif;">
          <q-icon name="people" class="q-mr-sm" color="primary" />
          Terceros
        </q-item-label>

        <q-item
          v-for="terceroItem in tercerosItems"
          :key="terceroItem.title"
          :to="terceroItem.to"
          clickable
          v-ripple
          exact-active-class="bg-secondary text-white"
          class="q-mx-sm q-my-xs rounded-borders"
          style="border-radius: 12px;"
        >
          <q-item-section avatar>
            <q-icon :name="terceroItem.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium" style="font-family: 'Poppins', sans-serif;">{{ terceroItem.title }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{ terceroItem.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

const menuItems = [
  {
    title: 'Dashboard',
    caption: 'Panel principal',
    icon: 'dashboard',
    to: '/'
  },
  {
    title: 'Galpones',
    caption: 'Gestión de galpones',
    icon: 'home',
    to: '/galpones'
  },
  {
    title: 'Tipos de Huevo',
    caption: 'Configuración de tipos',
    icon: 'egg',
    to: '/tipos-huevo'
  },
  {
    title: 'Canastas',
    caption: 'Gestión de canastas',
    icon: 'shopping_basket',
    to: '/canastas'
  },
  {
    title: 'Entradas de Producción',
    caption: 'Registro de entradas',
    icon: 'input',
    to: '/entradas-produccion'
  },
  {
    title: 'Salidas',
    caption: 'Registro de salidas',
    icon: 'output',
    to: '/salidas'
  },
  {
    title: 'Finanzas',
    caption: 'Gestión financiera',
    icon: 'account_balance',
    to: '/finanzas'
  },
  {
    title: 'Historial Financiero',
    caption: 'Registro completo de transacciones',
    icon: 'history',
    to: '/historial-financiero'
  }
];

const tercerosItems = [
  {
    title: 'Listado de Terceros',
    caption: 'Gestión de clientes y proveedores',
    icon: 'people',
    to: '/terceros'
  },
  {
    title: 'Nuevo Tercero',
    caption: 'Crear nuevo cliente o proveedor',
    icon: 'person_add',
    to: '/terceros/formulario'
  }
];

const inventoryItems = [
  {
    title: 'Inventario',
    caption: 'Vista general del inventario',
    icon: 'inventory_2',
    to: '/inventario'
  },
  {
    title: 'Resumen',
    caption: 'Estado del inventario',
    icon: 'assessment',
    to: '/resumen'
  }
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
  try {
    // Limpiar el store de autenticación
    authStore.logout();
    
    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Sesión cerrada correctamente',
      position: 'top',
      timeout: 2000
    });
    
    // Redirigir al login
    await router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    // Forzar limpieza y redirección en caso de error
    authStore.logout();
    
    $q.notify({
      type: 'warning',
      message: 'Sesión cerrada (con errores)',
      position: 'top',
      timeout: 2000
    });
    
    await router.push('/login');
  }
};

onMounted(() => {
  void authStore.initializeAuth();
});
</script>
