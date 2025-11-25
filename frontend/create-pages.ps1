# Script para crear las páginas de Compras y Ventas Terceros
# Este script copia SalidasPage.vue y hace las modificaciones necesarias

$ErrorActionPreference = "Stop"

Write-Host "Creando ComprasTercerosPage.vue..." -ForegroundColor Cyan

# Leer el contenido de SalidasPage
$content = Get-Content "d:\galpones\avicola\frontend\src\pages\SalidasPage.vue" -Raw -Encoding UTF8

# Modificaciones para ComprasTercerosPage
$comprasContent = $content `
    -replace 'Salidas', 'Compras a Terceros' `
    -replace 'salidas', 'compras' `
    -replace 'Salida', 'Compra' `
    -replace 'salida', 'compra' `
    -replace 'output', 'shopping_cart' `
    -replace 'useSalidasStore', 'useComprasTercerosStore' `
    -replace 'salidasStore', 'comprasStore' `
    -replace 'from ''src/stores/salidas''', 'from ''src/stores/compras-terceros''' `
    -replace 'CreateSalidaDto, UpdateSalidaDto', 'CreateCompraDto, UpdateCompraDto' `
    -replace 'Registra y gestiona las salidas de huevos', 'Registra y gestiona las compras realizadas a proveedores' `
    -replace 'Nueva Salida', 'Nueva Compra' `
    -replace 'Total Salidas', 'Total Compras' `
    -replace 'Unidades Vendidas', 'Total Gastado' `
    -replace 'Salidas Hoy', 'Compras del Mes' `
    -replace 'Promedio/Salida', 'Promedio/Compra' `
    -replace 'Buscar salidas...', 'Buscar compras...' `
    -replace 'No hay salidas registradas', 'No hay compras registradas' `
    -replace 'Comienza registrando tu primera salida de huevos', 'Comienza registrando tu primera compra a proveedores' `
    -replace 'Editar Salida', 'Editar Compra' `
    -replace 'Error al cargar las salidas', 'Error al cargar las compras' `
    -replace 'Error al guardar la salida', 'Error al guardar la compra' `
    -replace 'Salida actualizada correctamente', 'Compra actualizada correctamente' `
    -replace 'Salida creada correctamente', 'Compra creada correctamente' `
    -replace 'Error al eliminar la salida', 'Error al eliminar la compra' `
    -replace 'Salida eliminada correctamente', 'Compra eliminada correctamente'

# Guardar ComprasTercerosPage
$comprasContent | Out-File "d:\galpones\avicola\frontend\src\pages\ComprasTercerosPage.vue" -Encoding UTF8 -NoNewline

Write-Host "✓ ComprasTercerosPage.vue creado" -ForegroundColor Green

Write-Host "Creando VentasTercerosPage.vue..." -ForegroundColor Cyan

# Modificaciones para VentasTercerosPage
$ventasContent = $content `
    -replace 'Salidas', 'Ventas a Terceros' `
    -replace 'salidas', 'ventas' `
    -replace 'Salida', 'Venta' `
    -replace 'salida', 'venta' `
    -replace 'output', 'point_of_sale' `
    -replace 'useSalidasStore', 'useVentasTercerosStore' `
    -replace 'salidasStore', 'ventasStore' `
    -replace 'from ''src/stores/salidas''', 'from ''src/stores/ventas-terceros''' `
    -replace 'CreateSalidaDto, UpdateSalidaDto', 'CreateVentaDto, UpdateVentaDto' `
    -replace 'Registra y gestiona las salidas de huevos', 'Registra y gestiona las ventas realizadas a clientes' `
    -replace 'Nueva Salida', 'Nueva Venta' `
    -replace 'Total Salidas', 'Total Ventas' `
    -replace 'Unidades Vendidas', 'Total Ingresado' `
    -replace 'Salidas Hoy', 'Ventas Pendientes' `
    -replace 'Promedio/Salida', 'Promedio/Venta' `
    -replace 'Buscar salidas...', 'Buscar ventas...' `
    -replace 'No hay salidas registradas', 'No hay ventas registradas' `
    -replace 'Comienza registrando tu primera salida de huevos', 'Comienza registrando tu primera venta a clientes' `
    -replace 'Editar Salida', 'Editar Venta' `
    -replace 'Error al cargar las salidas', 'Error al cargar las ventas' `
    -replace 'Error al guardar la salida', 'Error al guardar la venta' `
    -replace 'Salida actualizada correctamente', 'Venta actualizada correctamente' `
    -replace 'Salida creada correctamente', 'Venta creada correctamente' `
    -replace 'Error al eliminar la salida', 'Error al eliminar la venta' `
    -replace 'Salida eliminada correctamente', 'Venta eliminada correctamente'

# Guardar VentasTercerosPage
$ventasContent | Out-File "d:\galpones\avicola\frontend\src\pages\VentasTercerosPage.vue" -Encoding UTF8 -NoNewline

Write-Host "✓ VentasTercerosPage.vue creado" -ForegroundColor Green

Write-Host "`n✅ Ambas páginas creadas exitosamente!" -ForegroundColor Green
Write-Host "Ahora debes actualizar routes.ts y MainLayout.vue" -ForegroundColor Yellow
