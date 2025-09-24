<template>
  <q-btn-toggle
    v-model="currentMode"
    :options="[
      { label: 'Tarjetas', value: 'cards', icon: 'view_module' },
      { label: 'Tabla', value: 'table', icon: 'table_rows' }
    ]"
    color="primary"
    toggle-color="primary"
    unelevated
    rounded
    @update:model-value="$emit('update:viewMode', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ViewMode } from 'src/composables/useViewMode';

interface Props {
  viewMode: ViewMode;
}

interface Emits {
  (e: 'update:viewMode', value: ViewMode): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const currentMode = computed({
  get: () => props.viewMode,
  set: () => {
    // El emit se maneja en el template
  }
});
</script>

<style scoped>
.q-btn-toggle {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>