import { defineStore } from 'pinia';

interface TutorialStep {
    title: string;
    text: string;
    icon?: string;
}

interface PageTutorial {
    title: string;
    description: string;
    steps: TutorialStep[];
    tips?: string[];
}

export const useTutorialStore = defineStore('tutorial', {
    state: () => ({
        tutorials: {
            '/': {
                title: 'Panel de Control (Dashboard)',
                description: 'Este es el centro neurálgico de tu granja. Aquí puedes ver el rendimiento general en tiempo real sin entrar en menús complicados.',
                steps: [
                    { title: 'Indicadores Clave', text: 'Los cuadros superiores muestran el total de aves vivas, la producción del día y el balance financiero actual.', icon: 'speed' },
                    { title: 'Gráficos de Producción', text: 'Observa la curva de postura de tus gallinas. Te permite identificar caídas de producción por clima, alimento o salud.', icon: 'trending_up' },
                    { title: 'Movimientos Recientes', text: 'Una lista rápida de las últimas 5 acciones (compras, ventas o muertes) realizadas.', icon: 'list' },
                    { title: 'Botón de Menú', text: 'Usa el icono de tres rayas arriba a la izquierda para navegar entre los módulos de inventario, finanzas y terceros.', icon: 'menu' }
                ],
                tips: [
                    'Haz clic en cualquier indicador para ir a su sección detallada.',
                    'Revisa el dashboard cada mañana para detectar anomalías temprano.'
                ]
            } as PageTutorial,

            '/galpones': {
                title: 'Gestión de Galpones',
                description: 'Aquí organizas tus aves por grupos (galpones). Es fundamental para llevar un control sanitario y de productividad separado.',
                steps: [
                    { title: 'Tarjetas de Galpón', text: 'Cada cuadro representa un galpón físico. Muestra la población actual y el tipo de ave.', icon: 'home' },
                    { title: 'Creación (+)', text: 'Usa el botón azul (+) abajo a la derecha para añadir un nuevo galpón. Indica nombre, capacidad máxima y fecha de encasete.', icon: 'add' },
                    { title: 'Estado del Galpón', text: 'Puedes "desactivar" un galpón cuando esté en periodo de vacío sanitario o limpieza profunda.', icon: 'settings' },
                    { title: 'Capacidad vs Población', text: 'El sistema te avisará si intentas registrar más aves de las que el galpón puede soportar.', icon: 'group' }
                ],
                tips: [
                    'Mantén los nombres de los galpones claros (Ej: Galpón 01, Galpón Postura Alta).',
                    'Actualiza la capacidad máxima si realizas ampliaciones físicas.'
                ]
            } as PageTutorial,

            '/tipos-huevo': {
                title: 'Tipos de Huevo',
                description: 'Configura las categorías de huevo que produces (AAA, AA, A, B, etc.). Esto define cómo se clasifica tu inventario.',
                steps: [
                    { title: 'Definir Categorías', text: 'Crea los tipos de huevo que manejas comercialmente. Es vital para el registro de producción.', icon: 'category' },
                    { title: 'Precios Base', text: 'Puedes asignar precios referenciales para facilitar las ventas posteriores.', icon: 'attach_money' },
                    { title: 'Orden de Visualización', text: 'Organiza los tipos por tamaño o calidad para que aparezcan en ese orden al registrar entradas.', icon: 'sort' }
                ],
                tips: [
                    'Usa nomenclaturas estándar del mercado para facilitar la venta a terceros.',
                    'Si dejas de producir un tipo, puedes desactivarlo para no confundirte.'
                ]
            } as PageTutorial,

            '/canastas': {
                title: 'Gestión de Canastas',
                description: 'Lleva el control físico de tus canastas plásticas o de cartón. Son activos de la granja que deben controlarse.',
                steps: [
                    { title: 'Tipos de Canastas', text: 'Registra canastas por capacidad (Ej: Canasta 30 unidades, Canasta 180 unidades).', icon: 'shopping_basket' },
                    { title: 'Stock Disponible', text: 'Mira cuántas canastas tienes libres para recolectar producción o despachar ventas.', icon: 'inventory_2' },
                    { title: 'Reposición', text: 'Registra cuando compres canastas nuevas para aumentar tu inventario operativo.', icon: 'add_shopping_cart' }
                ],
                tips: [
                    'El control de canastas evita pérdidas de material en entregas a clientes.',
                    'Verifica periódicamente que el stock físico coincida con el del sistema.'
                ]
            } as PageTutorial,

            '/entradas-produccion': {
                title: 'Registro de Producción',
                description: 'Esta es la tarea diaria más importante. Aquí registras cuántos huevos puso cada galpón hoy.',
                steps: [
                    { title: 'Selección de Galpón', text: 'Primero elige de qué galpón proviene la recolección.', icon: 'holiday_village' },
                    { title: 'Clasificación', text: 'Ingresa la cantidad de huevos por cada tipo (AAA, AA, etc.). El sistema calculará el total automáticamente.', icon: 'fact_check' },
                    { title: 'Fecha de Recolección', text: 'Por defecto es hoy, pero puedes registrar producciones atrasadas si es necesario.', icon: 'event' },
                    { title: 'Guardado Seguro', text: 'Haz clic en "Registrar" para que los huevos pasen de la granja al inventario disponible para la venta.', icon: 'save' }
                ],
                tips: [
                    'Registra la producción a la misma hora todos los días para estadísticas precisas.',
                    'Si hubo huevos rotos, regístralos en una categoría especial si la creaste.'
                ]
            } as PageTutorial,

            '/salidas': {
                title: 'Salidas y Mortalidad',
                description: 'Controla el flujo de salida de la granja, ya sea por venta comercial o por muerte natural de las aves.',
                steps: [
                    { title: 'Venta de Gallinas (Bajas)', text: 'Registra cuando vendes gallinas de descarte al final de su ciclo.', icon: 'shopping_cart' },
                    { title: 'Reporte de Mortalidad', text: '⚠️ CRÍTICO: Si una gallina muere, debes registrarla aquí. Selecciona el galpón y la cantidad.', icon: 'warning_amber' },
                    { title: 'Impacto en Inventario', text: 'Al registrar una salida, el stock del galpón se descuenta inmediatamente.', icon: 'calculate' }
                ],
                tips: [
                    'Registrar las muertes al instante te ayuda a monitorear brotes de enfermedades.',
                    'Usa las notas para indicar la causa sospechosa de muerte.'
                ]
            } as PageTutorial,

            '/finanzas': {
                title: 'Gestión Financiera',
                description: 'Visión general de la salud económica de tu negocio. Ingresos vs Gastos.',
                steps: [
                    { title: 'Ingresos Totales', text: 'Suma de todas tus ventas de huevo, gallinas y subproductos.', icon: 'monetization_on' },
                    { title: 'Gastos y Costos', text: 'Registro de compra de alimento, nómina, medicinas y servicios.', icon: 'payments' },
                    { title: 'Balance Neto', text: 'Tu utilidad real después de restar los gastos de los ingresos.', icon: 'account_balance_wallet' }
                ],
                tips: [
                    'Categoriza bien tus gastos (Alimento, Bioseguridad, Personal) para reportes detallados.',
                    'Registra cada pequeño gasto para que el balance sea real.'
                ]
            } as PageTutorial,

            '/historial-financiero': {
                title: 'Historial de Transacciones',
                description: 'Un libro contable digital donde queda registro de cada centavo que entra o sale.',
                steps: [
                    { title: 'Listado Cronológico', text: 'Mira los movimientos desde el más reciente al más antiguo.', icon: 'history' },
                    { title: 'Filtros de Fecha', text: 'Busca transacciones de un mes específico o una semana puntual.', icon: 'date_range' },
                    { title: 'Detalle de Movimiento', text: 'Haz clic en una fila para ver quién hizo el registro y la descripción completa.', icon: 'info' }
                ],
                tips: [
                    'Usa el buscador para encontrar rápidamente transacciones por nombre de cliente o concepto.',
                    'Este listado es ideal para auditorías de caja.'
                ]
            } as PageTutorial,

            '/inventario': {
                title: 'Control de Inventario',
                description: 'Consulta cuánta mercancía tienes acumulada en tus bodegas antes de vender.',
                steps: [
                    { title: 'Stock de Huevos', text: 'Mira cuántas canastas o unidades tienes de cada tipo de huevo listas para despacho.', icon: 'egg' },
                    { title: 'Stock de Alimento', text: 'Si registras compras de bultos, aquí verás cuánto alimento te queda.', icon: 'grass' },
                    { title: 'Ajustes Manuales', text: 'Solo en casos excepcionales, puedes ajustar el inventario si hay diferencias de conteo físico.', icon: 'tune' }
                ],
                tips: [
                    'Realiza un conteo físico semanal para asegurar que el sistema está al día.',
                    'El stock se actualiza solo cuando registras entradas de producción o ventas.'
                ]
            } as PageTutorial,

            '/resumen': {
                title: 'Resumen Consolidado',
                description: 'Una vista técnica y profunda de los números acumulados de la granja.',
                steps: [
                    { title: 'Mortalidad Acumulada', text: 'Porcentaje de bajas históricas por cada galpón.', icon: 'person_off' },
                    { title: 'Conversión de Alimento', text: 'Cálculo de cuánta comida necesitan tus aves para poner cierta cantidad de huevos.', icon: 'analytics' },
                    { title: 'Proyecciones', text: 'Estimaciones de cuánto producirás en el próximo periodo basadas en datos actuales.', icon: 'query_stats' }
                ],
                tips: [
                    'Usa este resumen para tomar decisiones de compra de nuevas aves.',
                    'Compáralo con los estándares de la raza de tus gallinas.'
                ]
            } as PageTutorial,

            '/terceros': {
                title: 'Listado de Terceros',
                description: 'Administra a todas las personas y empresas con las que haces negocios.',
                steps: [
                    { title: 'Busqueda de Contactos', text: 'Encuentra rápidamente a un cliente por su nombre o identificación.', icon: 'search' },
                    { title: 'Perfil de Tercero', text: 'Al hacer clic, verás su saldo pendiente (si te debe dinero o tú a él).', icon: 'contact_page' },
                    { title: 'Clasificación', text: 'Clasifícalos como CLIENTES (quienes te compran) o PROVEEDORES (quienes te venden insumos).', icon: 'groups' }
                ],
                tips: [
                    'Mantener los teléfonos y correos actualizados te facilita el contacto para cobros o pedidos.',
                    'Usa el filtro por tipo para separar proveedores de clientes.'
                ]
            } as PageTutorial,

            '/terceros/formulario': {
                title: 'Crear / Editar Tercero',
                description: 'Registra la información oficial de un nuevo contacto comercial.',
                steps: [
                    { title: 'Datos Básicos', text: 'Nombre comercial o personal y número de documento (NIT/Cédula).', icon: 'badge' },
                    { title: 'Información de Contacto', text: 'Dirección de entrega, ciudad y teléfono celular.', icon: 'phone' },
                    { title: 'Tipo de Relación', text: 'Marca si es un cliente, un proveedor o ambos.', icon: 'handshake' }
                ],
                tips: [
                    'Ingresa la dirección exacta para evitar confusiones en el despacho de logística.',
                    'Un tercero puede tener múltiples roles en la empresa.'
                ]
            } as PageTutorial,

            '/terceros/compras': {
                title: 'Compras a Terceros',
                description: 'Registra cuando compras insumos, bultos de comida, aves nuevas o suministros.',
                steps: [
                    { title: 'Seleccionar Proveedor', text: 'Elige a quién le estás comprando el producto.', icon: 'storefront' },
                    { title: 'Detalle de Compra', text: 'Ingresa los productos, cantidades y el costo unitario negociado.', icon: 'add_shopping_cart' },
                    { title: 'Forma de Pago', text: 'Registra si pagaste de contado o si es una compra a crédito por pagar después.', icon: 'account_balance' },
                    { title: 'Cargar al Inventario', text: 'Al guardar, los productos comprados se suman automáticamente a tu stock.', icon: 'archive' }
                ],
                tips: [
                    'Registra el número de factura del proveedor para tener soporte legal.',
                    'Verifica que el precio unitario coincida con lo pactado antes de guardar.'
                ]
            } as PageTutorial,

            '/terceros/ventas': {
                title: 'Ventas a Clientes',
                description: 'Control de salida de mercancía facturada a tus clientes finales o distribuidores.',
                steps: [
                    { title: 'Cliente y Fecha', text: 'Identifica a quién le vendes y cuándo se realizó la entrega.', icon: 'person' },
                    { title: 'Selección de Mercancía', text: 'Elige los tipos de huevo o aves que estás vendiendo.', icon: 'egg' },
                    { title: 'Control de Saldo', text: 'Si la venta es a crédito, se sumará automáticamente a la deuda del cliente.', icon: 'receipt_long' },
                    { title: 'Finalizar Venta', text: 'Confirma para que el inventario se descuente y se genere el ingreso financiero.', icon: 'point_of_sale' }
                ],
                tips: [
                    'Revisa siempre el stock disponible antes de prometer una venta grande.',
                    'Puedes imprimir o enviar el comprobante de venta digital al cliente.'
                ]
            } as PageTutorial
        } as Record<string, PageTutorial>
    }),
    getters: {
        getTutorialByPath: (state) => (path: string) => {
            // Intentar coincidencia exacta
            if (state.tutorials[path]) return state.tutorials[path];

            // Intentar coincidencia por base (ej. /terceros/editar/1 -> /terceros/formulario)
            if (path.startsWith('/terceros/formulario')) return state.tutorials['/terceros/formulario'];

            return null;
        }
    }
});
