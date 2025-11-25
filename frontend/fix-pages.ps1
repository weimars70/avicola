# Script para corregir errores de sintaxis en las páginas creadas
$ErrorActionPreference = "Stop"

Write-Host "Corrigiendo ComprasTercerosPage.vue..." -ForegroundColor Cyan

$content = Get-Content "d:\galpones\avicola\frontend\src\pages\ComprasTercerosPage.vue" -Raw -Encoding UTF8

# Corregir todos los errores de espacios en nombres de variables
$content = $content 
    -replace 'Compras a Terceros', 'compras' 
    -replace 'Compra a Tercero', 'compra' 
    -replace 'useCompras a TercerosStore', 'useComprasTercerosStore' 
    -replace 'from ''src/stores/Compras a Terceros''', 'from ''src/stores/compras-terceros''' 
    -replace 'from ''src/stores/compras a terceros''', 'from ''src/stores/compras-terceros''' 
    -replace 'CreateCompraDto, UpdateCompraDto\) from ''src/stores/Compras a Terceros''', 'CreateCompraDto, UpdateCompraDto } from ''src/types/compras-terceros''' 
    -replace 'filteredCompras a Terceros', 'filteredCompras' 
    -replace 'totalCompras a Terceros', 'totalCompras' 
    -replace 'Compras a TercerosHoy', 'comprasHoy' 
    -replace 'Compras a Tercerostr', 'compraStr' 
    -replace 'fetchCompras a Terceros', 'fetchCompras' 
    -replace 'CompraDate', 'compraDate' 
    -replace '\.Compras a Terceros', '.compras'

$content | Out-File "d:\galpones\avicola\frontend\src\pages\ComprasTercerosPage.vue" -Encoding UTF8 -NoNewline

Write-Host " ComprasTercerosPage.vue corregido" -ForegroundColor Green

Write-Host "Corrigiendo VentasTercerosPage.vue..." -ForegroundColor Cyan

$content = Get-Content "d:\galpones\avicola\frontend\src\pages\VentasTercerosPage.vue" -Raw -Encoding UTF8

# Corregir todos los errores de espacios en nombres de variables
$content = $content 
    -replace 'Ventas a Terceros', 'ventas' 
    -replace 'Venta a Tercero', 'venta' 
    -replace 'useVentas a TercerosStore', 'useVentasTercerosStore' 
    -replace 'from ''src/stores/Ventas a Terceros''', 'from ''src/stores/ventas-terceros''' 
    -replace 'from ''src/stores/ventas a terceros''', 'from ''src/stores/ventas-terceros''' 
    -replace 'CreateVentaDto, UpdateVentaDto\) from ''src/stores/Ventas a Terceros''', 'CreateVentaDto, UpdateVentaDto } from ''src/types/ventas-terceros''' 
    -replace 'filteredVentas a Terceros', 'filteredVentas' 
    -replace 'totalVentas a Terceros', 'totalVentas' 
    -replace 'Ventas a TercerosHoy', 'ventasHoy' 
    -replace 'Ventas a Tercerostr', 'ventaStr' 
    -replace 'fetchVentas a Terceros', 'fetchVentas' 
    -replace 'VentaDate', 'ventaDate' 
    -replace '\.Ventas a Terceros', '.ventas'

$content | Out-File "d:\galpones\avicola\frontend\src\pages\VentasTercerosPage.vue" -Encoding UTF8 -NoNewline

Write-Host " VentasTercerosPage.vue corregido" -ForegroundColor Green

Write-Host "
 Ambas páginas corregidas exitosamente!" -ForegroundColor Green
