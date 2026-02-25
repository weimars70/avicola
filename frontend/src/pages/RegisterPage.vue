<template>
  <q-page class="flex flex-center bg-gradient">
    <div class="register-container">
      <q-card class="register-card q-pa-lg">
        <q-card-section class="text-center">
          <q-icon name="person_add" size="4rem" color="primary" class="q-mb-md" />
          <div class="text-h4 text-primary q-mb-sm">Crear Cuenta</div>
          <div class="text-subtitle2 text-grey-7">Regístrate para empezar</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.nombre"
                  label="Nombre"
                  outlined
                  :rules="[val => !!val || 'El nombre es requerido']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.apellido"
                  label="Apellido"
                  outlined
                  :rules="[val => !!val || 'El apellido es requerido']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
            </div>

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
              :rules="[val => !!val || 'La contraseña es requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']"
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

            <q-input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              label="Confirmar Contraseña"
              outlined
              :rules="[
                val => !!val || 'Debes confirmar la contraseña',
                val => val === form.password || 'Las contraseñas no coinciden'
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="lock_reset" />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="full-width q-mt-md"
              :loading="loading"
              :disable="!isFormValid"
            >
              <q-icon name="how_to_reg" class="q-mr-sm" />
              Registrarse
            </q-btn>
          </q-form>
        </q-card-section>

        <q-card-section class="text-center">
          <div class="text-caption text-grey-6">
            ¿Ya tienes una cuenta?
            <q-btn flat color="primary" size="sm" @click="goToLogin">
              Iniciar Sesión
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
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const router = useRouter();
const $q = useQuasar();

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);
const loading = ref(false);

const isFormValid = computed(() => {
  return form.value.nombre && 
         form.value.apellido && 
         form.value.email && 
         form.value.password && 
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword &&
         isValidEmail(form.value.email);
});

const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const onSubmit = async () => {
  loading.value = true;
  try {
    console.log('📤 Enviando datos de registro:', { ...form.value, password: '***' });
    await api.post('/auth/register', {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      password: form.value.password
    });
    
    console.log('✅ Respuesta de registro exitosa');
    $q.notify({
      type: 'positive',
      message: 'Registro exitoso. Ahora puedes iniciar sesión.',
      position: 'top'
    });
    
    void router.push('/login');
  } catch (error: unknown) {
    console.error('❌ Error en el registro:', error);
    let message = 'Error al registrar usuario';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      message = axiosError.response?.data?.message || message;
    }
    $q.notify({
      type: 'negative',
      message: message,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  void router.push('/login');
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.register-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .register-container {
    padding: 10px;
  }
  
  .register-card {
    margin: 0;
  }
}
</style>
