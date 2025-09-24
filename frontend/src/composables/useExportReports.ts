import { ref } from 'vue';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
  includeCharts?: boolean;
  template?: string;
}

interface ReportConfig {
  title: string;
  endpoint: string;
  filename: string;
  supportedFormats: ('pdf' | 'excel' | 'csv')[];
  defaultFilters?: Record<string, unknown>;
}

export function useExportReports() {
  const exporting = ref(false);
  const progress = ref(0);

  // Configuraciones de reportes disponibles
  const reportConfigs: Record<string, ReportConfig> = {
    inventario: {
      title: 'Reporte de Inventario',
      endpoint: '/reportes/inventario',
      filename: 'inventario',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    entradas: {
      title: 'Reporte de Entradas de Producción',
      endpoint: '/reportes/entradas-produccion',
      filename: 'entradas-produccion',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    salidas: {
      title: 'Reporte de Salidas',
      endpoint: '/reportes/salidas',
      filename: 'salidas',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    galpones: {
      title: 'Reporte de Galpones',
      endpoint: '/reportes/galpones',
      filename: 'galpones',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    tiposHuevo: {
      title: 'Reporte de Tipos de Huevo',
      endpoint: '/reportes/tipos-huevo',
      filename: 'tipos-huevo',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    canastas: {
      title: 'Reporte de Canastas',
      endpoint: '/reportes/canastas',
      filename: 'canastas',
      supportedFormats: ['pdf', 'excel', 'csv']
    },
    produccion: {
      title: 'Reporte de Producción Consolidado',
      endpoint: '/reportes/produccion-consolidado',
      filename: 'produccion-consolidado',
      supportedFormats: ['pdf', 'excel']
    },
    financiero: {
      title: 'Reporte Financiero',
      endpoint: '/reportes/financiero',
      filename: 'reporte-financiero',
      supportedFormats: ['pdf', 'excel']
    }
  };

  const exportReport = async (reportType: string, options: ExportOptions) => {
    const config = reportConfigs[reportType];
    if (!config) {
      throw new Error(`Tipo de reporte no válido: ${reportType}`);
    }

    if (!config.supportedFormats.includes(options.format)) {
      throw new Error(`Formato ${options.format} no soportado para ${config.title}`);
    }

    exporting.value = true;
    progress.value = 0;

    try {
      // Preparar parámetros de la solicitud
      const params = new URLSearchParams();
      params.append('format', options.format);
      
      if (options.dateRange) {
        params.append('fechaInicio', options.dateRange.start);
        params.append('fechaFin', options.dateRange.end);
      }

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            const stringValue = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' 
              ? String(value) 
              : JSON.stringify(value);
            params.append(key, stringValue);
          }
        });
      }

      if (options.includeCharts !== undefined) {
        params.append('includeCharts', options.includeCharts.toString());
      }

      if (options.template) {
        params.append('template', options.template);
      }

      // Simular progreso
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += Math.random() * 20;
        }
      }, 500);

      // Realizar solicitud de exportación
      const response = await api.get(`${config.endpoint}?${params.toString()}`, {
        responseType: 'blob',
        timeout: 60000 // 60 segundos timeout
      });

      clearInterval(progressInterval);
      progress.value = 100;

      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const extension = getFileExtension(options.format);
      const filename = `${config.filename}_${timestamp}.${extension}`;

      // Descargar archivo
      downloadBlob(response.data, filename, getMimeType(options.format));

      Notify.create({
        type: 'positive',
        message: 'Reporte exportado exitosamente',
        caption: `Archivo: ${filename}`,
        position: 'top-right'
      });

      return { success: true, filename };

    } catch (error: unknown) {
      console.error('Error al exportar reporte:', error);
      
      const errorMessage = (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 
                          (error as Error).message || 
                          'Error desconocido al exportar reporte';
      
      Notify.create({
        type: 'negative',
        message: 'Error al exportar reporte',
        caption: errorMessage,
        position: 'top-right'
      });

      return { success: false, error: errorMessage };

    } finally {
      exporting.value = false;
      progress.value = 0;
    }
  };

  const getFileExtension = (format: string): string => {
    switch (format) {
      case 'pdf': return 'pdf';
      case 'excel': return 'xlsx';
      case 'csv': return 'csv';
      default: return 'txt';
    }
  };

  const getMimeType = (format: string): string => {
    switch (format) {
      case 'pdf': return 'application/pdf';
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv': return 'text/csv';
      default: return 'application/octet-stream';
    }
  };

  const downloadBlob = (blob: Blob, filename: string, mimeType: string) => {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Función para obtener plantillas disponibles
  const getAvailableTemplates = async (reportType: string) => {
    try {
      const response = await api.get(`/reportes/${reportType}/templates`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      return [];
    }
  };

  // Función para previsualizar reporte
  const previewReport = async (reportType: string, options: Omit<ExportOptions, 'format'>) => {
    const config = reportConfigs[reportType];
    if (!config) {
      throw new Error(`Tipo de reporte no válido: ${reportType}`);
    }

    try {
      const params = new URLSearchParams();
      params.append('preview', 'true');
      
      if (options.dateRange) {
        params.append('fechaInicio', options.dateRange.start);
        params.append('fechaFin', options.dateRange.end);
      }

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            const stringValue = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' 
              ? String(value) 
              : JSON.stringify(value);
            params.append(key, stringValue);
          }
        });
      }

      const response = await api.get(`${config.endpoint}?${params.toString()}`);
      return response.data;

    } catch (error: unknown) {
      console.error('Error al previsualizar reporte:', error);
      throw error;
    }
  };

  return {
    exporting,
    progress,
    reportConfigs,
    exportReport,
    getAvailableTemplates,
    previewReport
  };
}