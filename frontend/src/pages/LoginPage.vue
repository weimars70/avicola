<template>
  <q-page class="flex flex-center bg-gradient">
    <div class="login-container">
      <q-card class="login-card q-pa-lg">
        <q-card-section class="text-center">
          <q-icon name="egg" size="4rem" color="primary" class="q-mb-md" />
          <div class="text-h4 text-primary q-mb-sm">Sistema de Galpones</div>
          <div class="text-subtitle2 text-grey-7">Iniciar Sesión</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.email"
              type="email"
              label="Correo Electrónico"
              outlined
              :rules="[val => !!val || 'El correo es requerido', val => isValidEmail(val) || 'Correo inválido']"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              outlined
              :rules="[val => !!val || 'La contraseña es requerida']"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-checkbox v-model="rememberMe" label="Recordarme" />
              <q-btn flat color="primary" size="sm" @click="forgotPassword">
                ¿Olvidaste tu contraseña?
              </q-btn>
            </div>

            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              :loading="authStore.loading"
              :disable="!isFormValid"
            >
              <q-icon name="login" class="q-mr-sm" />
              Iniciar Sesión
            </q-btn>
          </q-form>
        </q-card-section>

        <q-card-section class="text-center">
          <div class="text-caption text-grey-6">
            ¿No tienes cuenta?
            <q-btn flat color="primary" size="sm" @click="goToRegister">
              Registrarse
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const form = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);

const isFormValid = computed(() => {
  return form.value.email && form.value.password && isValidEmail(form.value.email);
});

const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const onSubmit = async () => {
  try {
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password
    });
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Inicio de sesión exitoso',
        position: 'top'
      });
      void router.push('/');
    } else {
      $q.notify({
        type: 'negative',
        message: result.message || 'Error al iniciar sesión',
        position: 'top'
      });
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error de conexión',
      position: 'top'
    });
  }
};

const forgotPassword = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidad en desarrollo',
    position: 'top'
  });
};

const goToRegister = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidad en desarrollo',
    position: 'top'
  });
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    margin: 0;
  }
}
</style>