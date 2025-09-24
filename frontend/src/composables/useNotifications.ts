import { ref, onMounted, onUnmounted } from 'vue';
import { Notify } from 'quasar';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

interface NotificationEvent {
  type: string;
  data: Notification;
}

export function useNotifications() {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const connected = ref(false);
  const eventSource = ref<EventSource | null>(null);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = () => {
    try {
      // Usar Server-Sent Events para notificaciones en tiempo real
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No hay token de autenticación para notificaciones');
        return;
      }

      const url = `${import.meta.env.VITE_API_URL_DEV || 'http://localhost:3012'}/notifications/stream`;
      eventSource.value = new EventSource(`${url}?token=${token}`);

      eventSource.value.onopen = () => {
        connected.value = true;
        reconnectAttempts.value = 0;
        console.log('Conectado al sistema de notificaciones');
      };

      eventSource.value.onmessage = (event) => {
        try {
          const notificationData: NotificationEvent = JSON.parse(event.data);
          if (notificationData.data && typeof notificationData.data === 'object') {
            handleNotification(notificationData.data);
          }
        } catch (error) {
          console.error('Error al procesar notificación:', error);
        }
      };

      eventSource.value.onerror = () => {
        connected.value = false;
        console.error('Error en conexión de notificaciones');
        
        if (reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.value++;
            connect();
          }, reconnectDelay * reconnectAttempts.value);
        }
      };

    } catch (error) {
      console.error('Error al conectar notificaciones:', error);
    }
  };

  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
      connected.value = false;
    }
  };

  const handleNotification = (notification: Notification) => {
    // Agregar notificación a la lista
    notifications.value.unshift(notification);
    
    // Actualizar contador de no leídas
    if (!notification.read) {
      unreadCount.value++;
    }

    // Mostrar notificación visual
    showVisualNotification(notification);

    // Limitar el número de notificaciones en memoria
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100);
    }
  };

  const showVisualNotification = (notification: Notification) => {
    const config = {
      type: notification.type,
      message: notification.title,
      caption: notification.message,
      position: 'top-right' as const,
      timeout: 5000,
      actions: [
        {
          label: 'Cerrar',
          color: 'white',
          handler: () => {}
        }
      ]
    };

    // Configuraciones específicas por tipo
    switch (notification.type) {
      case 'success':
        config.timeout = 3000;
        break;
      case 'error':
        config.timeout = 8000;
        break;
      case 'warning':
        config.timeout = 6000;
        break;
      default:
        config.timeout = 5000;
    }

    Notify.create(config);
  };

  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  };

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true;
    });
    unreadCount.value = 0;
  };

  const removeNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notification = notifications.value[index];
      if (notification && !notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
    unreadCount.value = 0;
  };

  // Métodos de conveniencia para mostrar notificaciones
  const showSuccess = (message: string, title = 'Éxito') => {
    Notify.create({
      type: 'positive',
      message: title,
      caption: message,
      position: 'top-right',
      timeout: 3000
    });
  };

  const showError = (message: string, title = 'Error') => {
    Notify.create({
      type: 'negative',
      message: title,
      caption: message,
      position: 'top-right',
      timeout: 8000
    });
  };

  const showWarning = (message: string, title = 'Advertencia') => {
    Notify.create({
      type: 'warning',
      message: title,
      caption: message,
      position: 'top-right',
      timeout: 6000
    });
  };

  const showInfo = (message: string, title = 'Información') => {
    Notify.create({
      type: 'info',
      message: title,
      caption: message,
      position: 'top-right',
      timeout: 5000
    });
  };

  // Simular notificaciones para desarrollo (remover en producción)
  const simulateNotification = (type: Notification['type'] = 'info') => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title: `Notificación ${type}`,
      message: `Esta es una notificación de prueba de tipo ${type}`,
      timestamp: new Date(),
      read: false
    };
    handleNotification(notification);
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    notifications,
    unreadCount,
    connected,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    simulateNotification
  };
}