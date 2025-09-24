import { ref, computed } from 'vue';

export type ViewMode = 'cards' | 'table';

export function useViewMode(defaultMode: ViewMode = 'cards') {
  const viewMode = ref<ViewMode>(defaultMode);

  const isCardsView = computed(() => viewMode.value === 'cards');
  const isTableView = computed(() => viewMode.value === 'table');

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'cards' ? 'table' : 'cards';
  };

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode;
  };

  return {
    viewMode,
    isCardsView,
    isTableView,
    toggleViewMode,
    setViewMode
  };
}