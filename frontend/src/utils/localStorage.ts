// Utilidad para manejar el localStorage de manera consistente
export const clearAllLocalStorage = () => {
  console.log('Limpiando completamente el localStorage...');
  localStorage.clear();
  console.log('localStorage limpiado completamente');
};

export const resetEmpresaData = () => {
  console.log('Reiniciando datos de empresa...');
  
  // Limpiar datos específicos de empresa
  const keysToRemove = [
    'id_empresa',
    'empresa_data',
    'finanzas_cache',
    'inventario_cache',
    'produccion_cache',
    'terceros_cache',
    'ajustes_cache',
    'rendimiento_cache',
    'actividades_cache',
    'gastos_cache',
    'ingresos_cache',
    'salidas_cache',
    'canastas_cache',
    'tipos_huevo_cache',
    'entradas_produccion_cache',
    'galpones_cache'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Datos de empresa reiniciados');
};

export const forceEmpresaRefresh = (newIdEmpresa: number) => {
  console.log(`Forzando actualización a empresa ${newIdEmpresa}...`);
  
  // Limpiar datos de empresa anterior
  resetEmpresaData();
  
  // Establecer nueva empresa
  localStorage.setItem('id_empresa', newIdEmpresa.toString());
  
  // Forzar recarga completa de la página
  window.location.reload();
};