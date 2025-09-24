import { ref, computed, onMounted, onUnmounted } from 'vue';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

interface BackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  retentionDays: number;
  includeFiles: boolean;
  compression: boolean;
  encryption: boolean;
}

interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  duration?: number;
  error?: string;
}

interface BackupStats {
  totalBackups: number;
  totalSize: number;
  lastBackup: string | undefined;
  nextScheduled: string | undefined;
  successRate: number;
}

export function useBackup() {
  const backups = ref<BackupInfo[]>([]);
  const config = ref<BackupConfig>({
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    includeFiles: true,
    compression: true,
    encryption: false
  });
  const loading = ref(false);
  const creating = ref(false);
  const restoring = ref(false);
  const progress = ref(0);
  const checkInterval = ref<NodeJS.Timeout | null>(null);

  // Computed properties
  const stats = computed<BackupStats>(() => {
    const completedBackups = backups.value.filter(b => b.status === 'completed');
    const totalSize = completedBackups.reduce((sum, backup) => sum + backup.size, 0);
    const successRate = backups.value.length > 0 
      ? (completedBackups.length / backups.value.length) * 100 
      : 0;

    const lastBackup = completedBackups
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      totalBackups: completedBackups.length,
      totalSize,
      lastBackup: lastBackup?.createdAt,
      successRate,
      nextScheduled: calculateNextBackup()
    };
  });

  const formatSize = (bytes: number | undefined): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === undefined || bytes === null || bytes === 0) return '0 B';
    const validBytes = bytes;
    const i = Math.floor(Math.log(validBytes) / Math.log(1024));
    return Math.round(validBytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const calculateNextBackup = (): string | undefined => {
    if (!config.value.enabled) return undefined;

    const now = new Date();
    const timeParts = config.value.time.split(':');
    const hours = parseInt(timeParts[0] || '0', 10) || 0;
    const minutes = parseInt(timeParts[1] || '0', 10) || 0;
    const nextBackup = new Date(now);
    nextBackup.setHours(hours, minutes, 0, 0);

    // Si ya pasó la hora de hoy, programar para mañana
    if (nextBackup <= now) {
      nextBackup.setDate(nextBackup.getDate() + 1);
    }

    // Ajustar según la frecuencia
    switch (config.value.frequency) {
      case 'weekly': {
        // Programar para el próximo lunes
        const daysUntilMonday = (1 + 7 - nextBackup.getDay()) % 7;
        if (daysUntilMonday > 0) {
          nextBackup.setDate(nextBackup.getDate() + daysUntilMonday);
        }
        break;
      }
      case 'monthly': {
        // Programar para el primer día del próximo mes
        nextBackup.setMonth(nextBackup.getMonth() + 1, 1);
        break;
      }
    }

    return nextBackup.toISOString();
  };

  // Cargar configuración y backups
  const fetchConfig = async () => {
    try {
      const response = await api.get('/backup/config');
      config.value = { ...config.value, ...response.data };
    } catch (error: unknown) {
      console.error('Error al cargar configuración de backup:', error);
    }
  };

  const fetchBackups = async () => {
    loading.value = true;
    try {
      const response = await api.get('/backup/list');
      backups.value = response.data;
    } catch (error) {
      console.error('Error al cargar lista de backups:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al cargar backups',
        position: 'top-right'
      });
    } finally {
      loading.value = false;
    }
  };

  // Guardar configuración
  const saveConfig = async () => {
    try {
      await api.put('/backup/config', config.value);
      Notify.create({
        type: 'positive',
        message: 'Configuración de backup guardada',
        position: 'top-right'
      });
    } catch (error: unknown) {
      console.error('Error al guardar configuración:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al guardar configuración',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
    }
  };

  // Crear backup manual
  const createBackup = async (description?: string) => {
    creating.value = true;
    progress.value = 0;

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += Math.random() * 15;
        }
      }, 1000);

      const response = await api.post('/backup/create', {
        description,
        type: 'manual',
        includeFiles: config.value.includeFiles,
        compression: config.value.compression,
        encryption: config.value.encryption
      });

      clearInterval(progressInterval);
      progress.value = 100;

      // Actualizar lista de backups
      await fetchBackups();

      Notify.create({
        type: 'positive',
        message: 'Backup creado exitosamente',
        caption: `Archivo: ${response.data.filename}`,
        position: 'top-right'
      });

      return response.data;

    } catch (error: unknown) {
      console.error('Error al crear backup:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al crear backup',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
      throw error;
    } finally {
      creating.value = false;
      progress.value = 0;
    }
  };

  // Restaurar backup
  const restoreBackup = async (backupId: string) => {
    restoring.value = true;
    progress.value = 0;

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += Math.random() * 10;
        }
      }, 1500);

      await api.post(`/backup/${backupId}/restore`);

      clearInterval(progressInterval);
      progress.value = 100;

      Notify.create({
        type: 'positive',
        message: 'Backup restaurado exitosamente',
        caption: 'La aplicación se reiniciará automáticamente',
        position: 'top-right'
      });

      // Recargar la página después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error: unknown) {
      console.error('Error al restaurar backup:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al restaurar backup',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
      throw error;
    } finally {
      restoring.value = false;
      progress.value = 0;
    }
  };

  // Descargar backup
  const downloadBackup = async (backupId: string) => {
    try {
      const response = await api.get(`/backup/${backupId}/download`, {
        responseType: 'blob'
      });

      const backup = backups.value.find(b => b.id === backupId);
      const filename = backup?.filename || `backup_${backupId}.zip`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Notify.create({
        type: 'positive',
        message: 'Backup descargado',
        position: 'top-right'
      });

    } catch (error: unknown) {
      console.error('Error al descargar backup:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al descargar backup',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
    }
  };

  // Eliminar backup
  const deleteBackup = async (backupId: string) => {
    try {
      await api.delete(`/backup/${backupId}`);
      await fetchBackups();

      Notify.create({
        type: 'positive',
        message: 'Backup eliminado',
        position: 'top-right'
      });

    } catch (error: unknown) {
      console.error('Error al eliminar backup:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al eliminar backup',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
    }
  };

  // Verificar estado de backups automáticos
  const checkBackupStatus = async () => {
    try {
      const response = await api.get('/backup/status');
      if (response.data.hasNewBackups) {
        await fetchBackups();
      }
    } catch (error) {
      console.error('Error al verificar estado de backups:', error);
    }
  };

  // Limpiar backups antiguos
  const cleanupOldBackups = async () => {
    try {
      const response = await api.post('/backup/cleanup', {
        retentionDays: config.value.retentionDays
      });

      await fetchBackups();

      Notify.create({
        type: 'positive',
        message: 'Limpieza completada',
        caption: `${response.data.deletedCount} backups eliminados`,
        position: 'top-right'
      });

    } catch (error: unknown) {
      console.error('Error en limpieza de backups:', error);
      Notify.create({
        type: 'negative',
        message: 'Error en limpieza de backups',
        caption: (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message,
        position: 'top-right'
      });
    }
  };

  onMounted(() => {
    void fetchConfig();
    void fetchBackups();

    // Verificar estado cada 5 minutos
    checkInterval.value = setInterval(() => {
      void checkBackupStatus();
    }, 5 * 60 * 1000);
  });

  onUnmounted(() => {
    if (checkInterval.value) {
      clearInterval(checkInterval.value);
    }
  });

  return {
    backups,
    config,
    stats,
    loading,
    creating,
    restoring,
    progress,
    formatSize,
    fetchConfig,
    fetchBackups,
    saveConfig,
    createBackup,
    restoreBackup,
    downloadBackup,
    deleteBackup,
    cleanupOldBackups
  };
}