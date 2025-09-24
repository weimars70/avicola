import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { useAuthStore } from 'src/stores/auth';

export default boot(async ({ app }) => {
  const pinia = createPinia();
  app.use(pinia);
  
  // Inicializar autenticación después de que pinia esté configurado
  const authStore = useAuthStore();
  await authStore.initializeAuth();
});