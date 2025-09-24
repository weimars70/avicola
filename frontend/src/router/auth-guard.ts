import { useAuthStore } from 'src/stores/auth';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login'];

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.includes(to.path)) {
    // Si ya está autenticado y trata de ir al login, redirigir al dashboard
    if (to.path === '/login' && authStore.isAuthenticated) {
      next('/');
      return;
    }
    next();
    return;
  }

  // Para rutas protegidas, verificar autenticación
  if (!authStore.isAuthenticated) {
    next('/login');
    return;
  }

  // Si está autenticado, permitir acceso
  next();
};