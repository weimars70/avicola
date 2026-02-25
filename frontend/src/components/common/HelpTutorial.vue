<template>
  <div v-if="tutorial" class="help-tutorial-container">
    <q-btn
      flat
      round
      dense
      icon="lightbulb"
      class="tutorial-btn"
      :class="{ 'animate-pulse': !hasOpened }"
      @click="showTutorial = true"
    >
      <q-tooltip>¿Necesitas ayuda con esta página?</q-tooltip>
    </q-btn>

    <q-dialog v-model="showTutorial" :maximized="$q.screen.lt.sm" transition-show="scale" transition-hide="scale">
      <q-card class="tutorial-card" style="min-width: 350px; border-radius: 16px;">
        <q-card-section class="bg-primary text-white q-pa-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6 font-poppins">{{ tutorial.title }}</div>
              <div class="text-subtitle2 opacity-80">Tutorial de uso</div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-scroll-area :style="{ height: $q.screen.lt.sm ? '70vh' : '500px' }" class="q-pa-lg">
            <div class="text-body1 text-grey-9 q-mb-md" style="line-height: 1.6;">
              {{ tutorial.description }}
            </div>

            <div class="text-subtitle1 text-weight-bold q-mb-sm font-poppins text-primary">
              <q-icon name="menu_book" class="q-mr-xs" />
              Cómo utilizar esta página
            </div>

            <q-list padding class="q-pt-none">
              <q-item v-for="(step, index) in tutorial.steps" :key="index" class="q-px-none q-mb-md">
                <q-item-section avatar top>
                  <q-avatar color="blue-1" text-color="blue-9" :icon="step.icon || 'star'" size="md" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-grey-9 text-h6" style="font-size: 1rem;">{{ step.title }}</q-item-label>
                  <q-item-label class="text-grey-8 text-body2 q-mt-xs">{{ step.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-if="tutorial.tips && tutorial.tips.length > 0" class="tips-container q-pa-md bg-amber-1 rounded-borders q-mt-lg">
              <div class="text-subtitle1 text-weight-bold text-amber-9 q-mb-sm font-poppins">
                <q-icon name="tips_and_updates" class="q-mr-xs" />
                Consejos de Experto (Pro-Tips)
              </div>
              <q-list dense>
                <q-item v-for="(tip, index) in tutorial.tips" :key="index" class="q-px-none min-height-0">
                  <q-item-section avatar class="min-width-0 q-pr-sm">
                    <q-icon name="bolt" color="amber-9" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-grey-8 text-body2">
                    {{ tip }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Entendido" color="primary" v-close-popup class="q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTutorialStore } from 'src/stores/tutorial';
import { useQuasar } from 'quasar';

const route = useRoute();
const tutorialStore = useTutorialStore();
const $q = useQuasar();

const showTutorial = ref(false);
const hasOpened = ref(false);

const tutorial = computed(() => {
  return tutorialStore.getTutorialByPath(route.path);
});

// Reset hasOpened when navigating to a new page with a tutorial
watch(() => route.path, () => {
  hasOpened.value = false;
});

watch(showTutorial, (val) => {
  if (val) hasOpened.value = true;
});

</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.tutorial-btn {
  color: #fbbf24; /* Amber-400 */
}

@keyframes pulse-animation {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-pulse {
  animation: pulse-animation 2s infinite ease-in-out;
}

.tutorial-card {
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.tips-container {
  border-left: 4px solid #f59e0b;
}

.min-height-0 {
  min-height: 0;
}

.min-width-0 {
  min-width: 0;
}

li {
  margin-bottom: 4px;
}
</style>
