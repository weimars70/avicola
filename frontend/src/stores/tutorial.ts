import { defineStore } from 'pinia';

interface TutorialStep {
    title: string;
    text: string;
    icon?: string;
}

interface StepDetail {
    title: string;
    description: string;
    image?: string;
}

interface PageTutorial {
    title: string;
    description: string;
    steps: TutorialStep[];
    tips?: string[];
    extended?: {
        intro: string;
        sections: {
            title: string;
            steps: StepDetail[];
        }[];
    };
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
                ],
                extended: {
                    intro: 'El Dashboard es tu tablero de comando. Aquí te explicamos cómo sacarle el máximo provecho para tu operación avícola.',
                    sections: [
                        {
                            title: '1. Monitoreo de KPIs',
                            steps: [
                                { title: 'Población Total', description: 'Muestra la suma de aves de todos los galpones activos. Si este número baja drásticamente, revisa el reporte de mortalidad.' },
                                { title: 'Producción del Día', description: 'Es el acumulado de huevos recolectados en las últimas 24 horas. Compáralo visualmente con el gráfico de barras inferior.' },
                                { title: 'Balance Financiero', description: 'Calcula Ingresos - Egresos. Si está en rojo, revisa tus gastos de alimento en la sección de finanzas.' }
                            ]
                        },
                        {
                            title: '2. Análisis Gráfico',
                            steps: [
                                { title: 'Gráfico de Postura', description: 'La línea azul representa la producción histórica. Si ves picos hacia abajo, puede indicar estrés calórico o falta de alimento.' },
                                { title: 'Navegación Visual', description: 'Puedes pasar el mouse sobre los puntos del gráfico para ver la cantidad exacta de huevos de ese día específico.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'Los galpones son las unidades de producción. Un buen manejo aquí garantiza la trazabilidad de tu granja.',
                    sections: [
                        {
                            title: 'Creación de Galpones',
                            steps: [
                                { title: 'Paso 1: Identificación', description: 'Haz clic en el botón (+). Asigna un nombre único y una descripción (Ej: Galpón Norte - Gallinas Jóvenes).' },
                                { title: 'Paso 2: Capacidad', description: 'Ingresa la capacidad máxima. El sistema usará este dato para calcular el porcentaje de ocupación.' },
                                { title: 'Paso 3: Encasete', description: 'Define la fecha en que las aves entraron al galpón para llevar el control de semanas de vida.' }
                            ]
                        },
                        {
                            title: 'Operaciones de Gestión',
                            steps: [
                                { title: 'Crear Galpón', description: 'Usa el botón flotante (+) en la esquina inferior derecha. Al abrirse el formulario, rellena el nombre, la capacidad y los datos de encasete. Dale a "Guardar" para activar el nuevo galpón.' },
                                { title: 'Editar Información', description: 'En la esquina superior derecha de cada tarjeta de galpón encontrarás el icono de "Lápiz". Úsalo para actualizar la capacidad o corregir el nombre sin perder el historial de producción.' },
                                { title: 'Desactivar / Eliminar', description: 'El icono de "Basura/Archivo" permite ocultar galpones que ya no usas. El sistema archiva la información histórica para que tus reportes pasados no se alteren.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'La clasificación del huevo es lo que determina el valor de tu producción en el mercado.',
                    sections: [
                        {
                            title: 'Operaciones de Gestión',
                            steps: [
                                { title: 'Nuevo Producto', description: 'Presiona el botón (+) para abrir el formulario de creación. Aquí defines el nombre comercial del huevo.' },
                                { title: 'Modificar Precios', description: 'Haz clic en el icono de "Editar" en la fila correspondiente para actualizar el valor por unidad sugerido.' },
                                { title: 'Estado del Producto', description: 'Usa el interruptor (Switch) en la tabla para marcar un tipo de huevo como "Inactivo" si decides dejar de comercializarlo temporalmente.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'Las canastas son recipientes reutilizables fundamentales para el transporte de huevo.',
                    sections: [
                        {
                            title: 'Operaciones de Gestión',
                            steps: [
                                { title: 'Crear Tipo de Canasta', description: 'Usa el botón (+) para registrar un nuevo modelo de canasta. Define su capacidad y nombre descriptivo.' },
                                { title: 'Actualizar Datos', description: 'El icono de "Lápiz" en la tabla permite corregir la capacidad o el nombre si es necesario.' },
                                { title: 'Eliminar Registro', description: 'Solo puedes eliminar canastas que no tengan movimientos vinculados. Usa el icono de "Basura" para retirarla del catálogo.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El registro de producción es el corazón de la granja. Un dato preciso aquí permite calcular la rentabilidad real de cada galpón.',
                    sections: [
                        {
                            title: '1. Recolección Diaria',
                            steps: [
                                { title: 'Selección del Galpón', description: 'Elige el galpón de donde provienen los huevos. Es vital para saber qué aves son más productivas.' },
                                { title: 'Conteo por Categoría', description: 'Ingresa la cantidad exacta de huevos por cada tipo (AAA, AA, etc.). El sistema sumará el total automáticamente.' },
                                { title: 'Ajuste de Fecha', description: 'Si estás registrando datos de ayer, recuerda cambiar la fecha antes de guardar para no alterar las estadísticas.' }
                            ]
                        },
                        {
                            title: '2. Almacenamiento',
                            steps: [
                                { title: 'Ingreso a Bodega', description: 'Al presionar "Registrar", estos huevos se suman inmediatamente a tu inventario disponible para la venta.' },
                                { title: 'Errores de Digitación', description: 'Si te equivocas en un número, puedes corregirlo en la sección de Inventario o Historial antes de cerrar el día.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'Controlar las bajas es fundamental para mantener el censo exacto de gallinas vivas y medir la viabilidad del lote.',
                    sections: [
                        {
                            title: 'Gestión de Mortalidad',
                            steps: [
                                { title: 'Registro Inmediato', description: 'Cada ave muerta debe registrarse asignándola a su galpón correspondiente.' },
                                { title: 'Análisis de Causas', description: 'Usa el campo de observaciones para anotar si la muerte fue por calor, picaje u otras causas. Esto ayuda a tomar medidas preventivas.' }
                            ]
                        },
                        {
                            title: 'Ventas de Descarte',
                            steps: [
                                { title: 'Venta de Gallinas', description: 'Cuando un lote termina su ciclo (gallina vieja), regístralo aquí como venta. Esto retirará todas las aves del inventario activo.' },
                                { title: 'Cierre de Lote', description: 'Al llegar a cero aves, el galpón quedará disponible para el siguiente encasete.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'La gestión financiera te permite tener una visión clara de la rentabilidad de tu negocio avícola. Un registro disciplinado es la clave.',
                    sections: [
                        {
                            title: 'Administración de Caja',
                            steps: [
                                { title: 'Registro de Ingresos', description: 'Además de las ventas automáticas, puedes registrar ingresos extra (Ej: Venta de gallinaza, servicios de transporte).' },
                                { title: 'Control de Gastos', description: 'Registra facturas de alimento, insumos médicos y nómina. Asigna cada gasto a una categoría para analizar fugas de dinero.' }
                            ]
                        },
                        {
                            title: 'Operaciones Financieras',
                            steps: [
                                { title: 'Registrar Nuevo', description: 'Usa los botones superiores "Nuevo Gasto" o "Nuevo Ingreso". Se abrirá un diálogo para capturar el monto, la categoría y la fecha del movimiento.' },
                                { title: 'Modificar Registro', description: 'El icono de "Lápiz" en la tabla permite corregir errores en el monto o la descripción de transacciones que aún no han sido cerradas.' },
                                { title: 'Eliminar Movimiento', description: 'Usa el icono de "Basura" para borrar un registro. Ten en cuenta que esto afectará inmediatamente tu balance neto acumulado.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El historial es tu herramienta de auditoría. Aquí puedes verificar la veracidad de cada registro financiero.',
                    sections: [
                        {
                            title: 'Auditoría de Movimientos',
                            steps: [
                                { title: 'Búsqueda Avanzada', description: 'Utiliza el buscador para localizar transacciones por concepto o valor. Ideal para aclarar dudas con proveedores.' },
                                { title: 'Filtrado por Rango', description: 'Ajusta las fechas para ver el flujo de caja de periodos específicos, como el último lote de aves.' }
                            ]
                        },
                        {
                            title: 'Gestión de Registros',
                            steps: [
                                { title: 'Anulación de Transacción', description: 'En el historial, el icono de "Basura" no borra físicamente el dato (para auditoría), sino que lo marca como "Anulado", revirtiendo su efecto en el balance pero dejando la evidencia del error.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El control de inventario te permite conocer la disponibilidad real de tus productos y activos en tiempo real.',
                    sections: [
                        {
                            title: 'Monitoreo de Existencias',
                            steps: [
                                { title: 'Stock de Huevos', description: 'Visualiza la cantidad total de huevos clasificados por tipo. El sistema descuenta automáticamente lo vendido y suma lo producido.' },
                                { title: 'Insumos y Alimento', description: 'Si registras compras de concentrado, aquí verás el saldo actual. Es vital para no quedarte sin alimento para las aves.' }
                            ]
                        },
                        {
                            title: 'Precisión de Datos',
                            steps: [
                                { title: 'Ajustes de Inventario', description: 'Si al hacer un conteo físico encuentras diferencias, usa la función de ajuste. Ten en cuenta que esto afectará tus reportes de rentabilidad.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El resumen consolidado es la herramienta definitiva para la toma de decisiones estratégicas en tu granja.',
                    sections: [
                        {
                            title: 'Análisis de Productividad',
                            steps: [
                                { title: 'Eficiencia de Lote', description: 'Compara el rendimiento de diferentes galpones bajo las mismas condiciones para identificar las mejores prácticas.' },
                                { title: 'Control de Mortalidad', description: 'Observa tendencias de bajas. Un aumento porcentual puede ser una alerta temprana de problemas sanitarios.' }
                            ]
                        },
                        {
                            title: 'Planificación Futura',
                            steps: [
                                { title: 'Proyecciones de Venta', description: 'Basándote en la curva de producción, puedes pre-vender tu mercancía con mayor seguridad de cumplimiento.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'Un listado organizado de terceros es la base para una facturación y cobranza eficiente.',
                    sections: [
                        {
                            title: 'Organización de Contactos',
                            steps: [
                                { title: 'Búsqueda Rápida', description: 'Usa el buscador para localizar terceros por nombre, NIT o ciudad. Esto agiliza la toma de pedidos telefónicos.' },
                                { title: 'Filtrado Estratégico', description: 'Separa tus proveedores de alimento de tus clientes habituales usando los filtros de rol para una mejor gestión visual.' }
                            ]
                        },
                        {
                            title: 'Operaciones de Gestión',
                            steps: [
                                { title: 'Añadir Tercero', description: 'Usa el botón (+) para registrar un nuevo cliente o proveedor. Se abrirá un formulario completo para datos legales y de contacto.' },
                                { title: 'Editar Perfil', description: 'Haz clic en el icono "Editar" de la fila o directamente sobre el nombre para actualizar teléfonos, direcciones o roles.' },
                                { title: 'Eliminar / Inactivar', description: 'Usa el icono de "Basura" para dar de baja a un tercero. Si tiene facturas pendientes, el sistema te avisará para que cierres sus saldos primero.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El registro correcto de un tercero asegura que tus documentos legales (facturas/recibos) sean válidos.',
                    sections: [
                        {
                            title: 'Pasos para el Registro',
                            steps: [
                                { title: 'Identificación Legal', description: 'Ingresa el NIT o Cédula sin puntos ni comas. El sistema validará que no esté duplicado.' },
                                { title: 'Categorización de Rol', description: 'Es fundamental marcar si es Clientes o Proveedor. Un cliente aparecerá solo en ventas, y un proveedor solo en compras.' }
                            ]
                        },
                        {
                            title: 'Datos de Localización',
                            steps: [
                                { title: 'Gestión de Ciudad', description: 'Selecciona la ciudad del menú desplegable para que el cálculo de fletes y logística sea más sencillo.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'El módulo de compras automatiza la entrada de insumos a tu bodega y actualiza tus cuentas por pagar.',
                    sections: [
                        {
                            title: 'Flujo de Compra',
                            steps: [
                                { title: 'Identificación del Suministro', description: 'Busca al proveedor primero. Si no existe, debes crearlo en la sección de Terceros.' },
                                { title: 'Ingreso de Ítems', description: 'Añade cada producto de la factura del proveedor. El sistema calculará el IVA y el total automáticamente.' }
                            ]
                        },
                        {
                            title: 'Contabilidad de Costos',
                            steps: [
                                { title: 'Gestión de Crédito', description: 'Si la compra es a crédito, el saldo se sumará a tu cuenta por pagar con ese proveedor específico.' }
                            ]
                        }
                    ]
                }
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
                ],
                extended: {
                    intro: 'Este módulo gestiona la salida de producción y la generación de ingresos de tu granja.',
                    sections: [
                        {
                            title: 'Proceso de Venta',
                            steps: [
                                { title: 'Validación de Stock', description: 'El sistema no permitirá vender más unidades de las que tienes en inventario para evitar errores de logística.' },
                                { title: 'Precios Dinámicos', description: 'Aunque el sistema sugiere el precio base configurado, puedes ajustarlo si negocias un precio especial con el cliente.' }
                            ]
                        }
                        // Missing secciones can be added later
                    ]
                }
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
