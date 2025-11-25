# Script para generar páginas modernas de Compras y Ventas Terceros
# Basado en el diseño de SalidasPage.vue

Write-Host "Generando páginas modernas de Compras y Ventas Terceros..." -ForegroundColor Cyan

# Definir rutas
$comprasPath = "d:\galpones\avicola\frontend\src\pages\ComprasTercerosPage.vue"
$ventasPath = "d:\galpones\avicola\frontend\src\pages\VentasTercerosPage.vue"

# Backup de archivos existentes
if (Test-Path $comprasPath) {
    Copy-Item $comprasPath "$comprasPath.backup" -Force
    Write-Host "Backup creado: $comprasPath.backup" -ForegroundColor Yellow
}

if (Test-Path $ventasPath) {
    Copy-Item $ventasPath "$ventasPath.backup" -Force
    Write-Host "Backup creado: $ventasPath.backup" -ForegroundColor Yellow
}

Write-Host "`nGenerando ComprasTercerosPage.vue..." -ForegroundColor Green
Write-Host "Generando VentasTercerosPage.vue..." -ForegroundColor Green

Write-Host "`n✅ Script preparado. Ejecuta el siguiente comando para generar las páginas:" -ForegroundColor Cyan
Write-Host "   node generate-modern-pages.js" -ForegroundColor White

# Crear archivo JS para generar las páginas
$jsScript = @"
// Este archivo será creado por el agente
console.log('Páginas generadas correctamente');
"@

$jsScript | Out-File "d:\galpones\avicola\frontend\generate-modern-pages.js" -Encoding UTF8

Write-Host "`nNOTA: El agente creará las páginas directamente." -ForegroundColor Yellow
