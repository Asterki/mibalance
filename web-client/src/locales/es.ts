const translation = {
	"error-messages": {
		"internal-error":
			"Se produjo un error interno, por favor intente nuevamente más tarde",
		"network-error":
			"No se ha podido conectar al servidor, por favor revise su conexión a internet",
		"invalid-parameters":
			"Por favor, asegúrese de haber proporcionado toda la información requerida en el formato requerido. No es común que ocurra, pero si lo hace, contacte soporte técnico.",
		unauthorized:
			"Su sesión ha expirado o no tiene permiso para acceder a esta página. Por favor, inicie sesión nuevamente.",
		forbidden:
			"No tienes permiso para acceder a esta página o realizar esta acción.",
		"not-found": "El recurso solicitado no fue encontrado.",
	},

	errors: {
		offline: {
			subtitle:
				"Parece que estás sin conexión o el servidor no está disponible en este momento.",
			retry: "Reintentar",
		},
		"404": {
			title: "Página no encontrada",
			description: "La página que busca no existe o ha sido movida.",
			back: "Volver al inicio",
		},
		"403": {
			title: "Acceso prohibido",
			description: "No tiene permiso para acceder a esta página.",
			back: "Volver al inicio",
		},
		"500": {
			title: "Error fatal",
			description:
				"Ha ocurrido un error inesperado en el sistema. Por favor, inténtelo de nuevo más tarde.",
			back: "Volver al inicio",
		},
	},

	accounts: {
		login: {
			back: "Regresar a la página principal",
			title: "Inicia sesión en tu cuenta",
			description:
				"Por favor, proporciona tu correo electrónico y contraseña para iniciar sesión",

			fields: {
				email: "Correo electrónico",
				emailPlaceholder: "Correo electrónico",
				password: "Contraseña",
			},

			submit: "Iniciar sesión",
			forgotPassword: "¿Olvidaste tu contraseña? Haz clic aquí",

			messages: {
				success: "Sesión iniciada correctamente",
				"invalid-credentials":
					"La combinación de correo electrónico y contraseña que proporcionaste no corresponde a ninguna cuenta",
				"invalid-password": "Por favor ingrese una contraseña",
				"invalid-email": "El correo electrónico que proporcionaste es inválido",
				"invalid-tfa-code":
					"El código de autenticación de dos factores es inválido",
				unauthorized: "No autorizado",
				"internal-error":
					"Ocurrió un error interno, por favor intenta nuevamente más tarde",
			},
		},
		logout: {
			title: "Cerrar sesión",
			description: "¿Estás seguro de que deseas cerrar sesión?",
			button: "Cerrar sesión",
			cancel: "Cancelar",
		},
		register: {
			back: "Regresar a la página principal",
			title: "Registra una cuenta",
			description:
				"Por favor, proporciona la información a continuación para registrarte",
			disabled: "El registro para esta plataforma está deshabilitado",

			fields: {
				name: "Nombre",
				namePlaceholder: "Juan Pérez",
				email: "Correo electrónico",
				emailPlaceholder: "cuenta@ejemplo.com",
				password: "Contraseña",
				repeatPassword: "Repite la contraseña",
			},

			errorTitle: "Error",
			errors: {
				"name-required": "El nombre es obligatorio",
				"name-too-short": "El nombre debe tener al menos 3 caracteres",
				"name-too-long": "El nombre debe tener como máximo 255 caracteres",
				"email-required": "El correo electrónico es obligatorio",
				"invalid-email": "El correo electrónico que proporcionaste es inválido",
				"password-required": "La contraseña es obligatoria",
				"password-too-short": "La contraseña debe tener al menos 8 caracteres",
				"password-too-long":
					"La contraseña debe tener como máximo 255 caracteres",
				"repeat-password-required": "Repetir la contraseña es obligatorio",
				"repeat-password-too-short":
					"Repetir la contraseña debe tener al menos 8 caracteres",
				"repeat-password-too-long":
					"Repetir la contraseña debe tener como máximo 255 caracteres",
				"passwords-mismatch": "Las contraseñas que proporcionaste no coinciden",
				"invalid-parameters":
					"Por favor, asegúrate de haber proporcionado toda la información requerida",
				"internal-error":
					"Ocurrió un error interno, por favor intenta nuevamente más tarde",
			},

			submit: "Registrar",
			login: "¿Ya tienes una cuenta? Haz clic aquí",
		},
		forgotPassword: {
			title: "Olvidé mi contraseña",
			submit: "Enviar",

			emailSent: "Se envió un correo electrónico a la dirección proporcionada",

			fields: {
				email: "Correo electrónico",
				emailPlaceholder: "cuenta@ejemplo.com",
			},
			errors: {
				"invalid-email": "El correo electrónico que proporcionaste es inválido",
				"email-not-found":
					"El correo electrónico proporcionado no se encontró como una cuenta registrada",
				"internal-error":
					"Ocurrió un error interno, por favor intenta nuevamente más tarde",
			},
			errorTitle: "Error",
		},
	},

	pos: {
		sidebar: {
			title: "Gestión de Ventas",
	    dashboard: "Página de Inicio",
      menu: "Menú",
			pos: "Caja (POS)",
			newSale: "Registrar nueva venta",
			consultSales: "Consultar ventas",
			salesReports: "Reportes de ventas",
			returns: "Devoluciones",
		},

		index: {
			heading: "Punto de Venta",
			subheading: "Gestiona las ventas y compras de tu tienda",

			modal: {
				title: "Confirmar Cierre de Sesión",
				description:
					"¿Estás seguro de que deseas cerrar esta sesión? Esta acción no se puede deshacer.",
				confirm: "Cerrar Sesión",
				cancel: "Cancelar",
			},

			session: {
				title: "Sesión Actual",
				description: "Detalles de tu sesión activa de punto de venta.",
				status: "Estado",
				store: "Tienda",
				starting: "Monto Inicial",
				cash: "Efectivo (sin el inicial)",
				total: "Efectivo Total",
				totalSales: "Total de Ventas",
				totalRefunds: "Total de Reembolsos",
				totalPayouts: "Total de Pagos",
				totalDeposits: "Total de Depósitos",
				expectedClosing: "Cierre Esperado",
				cashCounted: "Efectivo Contado",
				openedAt: "Abierto el",
				closedAt: "Cerrado el",
				stillOpen: "Aún abierto",
				notes: "Notas",
				closeButton: "Cerrar Sesión",
			},

			sales: {
				title: "Ventas",
				description: "Crea y gestiona las transacciones de ventas.",
				new: "Nueva Venta",
				view: "Ver Ventas",
			},

			purchases: {
				title: "Compras",
				description: "Registra y crea nuevas compras.",
				new: "Nueva Compra",
				view: "Ver Compras",
			},
		},

		status: {
			open: "Abierta",
			closed: "Cerrada",
		},

		"open-session": {
			title: "Abrir Caja Registradora",
			description:
				"Abre una nueva sesión de caja registradora e ingresa el monto inicial",
			placeholder: "Ingresa el monto inicial",
			cancel: "Cancelar",
			open: "Abrir Caja Registradora",
			"select-store": "Seleccionar Tienda",
			messages: {
				"invalid-amount": "El monto proporcionado no es válido",
				"amount-required": "El monto inicial es obligatorio",
				"select-store": "Por favor selecciona una tienda",
			},
		},

		sales: {
			refund: {
				page: {
					title: "Procesar Reembolso de Venta",
					description:
						"Procesando reembolso para la venta con número de recibo {{sale}}, favor completar los detalles a continuación",
				},
				table: {
					product: "Nombre del Producto",
					originalQuantity: "Cantidad Original Vendida",
					quantityToRefund: "Cantidad a Reembolsar",
					amount: "Monto del Reembolso Por Todos Los Productos",
					notice:
						'Los productos serán enviados al inventario "{{warehouseName}}"',
				},
				modals: {
					confirm: {
						title: "Confirmar Solicitud de Reembolso",
						description:
							"¿Está seguro de que desea proceder con este reembolso? Esta acción es irreversible y no se permitirán más reembolsos para esta venta.",
					},
				},
				details: {
					title: "Información del Reembolso",
					date: "Fecha de la Solicitud",
					datePlaceholder: "Fecha de la Solicitud",
					reason: "Motivo del Reembolso",
					reasonPlaceholder:
						"Especifique el motivo de esta solicitud de reembolso",
					notes: "Notas Adicionales",
					notesPlaceholder:
						"Ingrese cualquier información adicional relevante para este reembolso",
				},
				submit: "Enviar Solicitud de Reembolso",
				messages: {
					success: "La solicitud de reembolso se envió correctamente",
					error:
						"Ocurrió un error al enviar la solicitud de reembolso. Por favor, intente nuevamente más tarde.",
					"saleId-required":
						"El identificador de la venta es obligatorio para procesar un reembolso.",
					"storeId-required":
						"Debe seleccionar una tienda válida asociada a la venta.",
					"posSessionId-required":
						"La sesión actual del punto de venta es obligatoria.",
					"warehouseId-required":
						"Debe seleccionar un almacén válido para registrar el reembolso.",

					"items-min":
						"Debe incluir al menos un producto para realizar el reembolso.",
					"item-product-required":
						"El identificador del producto es obligatorio para cada artículo del reembolso.",
					"item-quantity-integer":
						"La cantidad del producto debe ser un número entero.",
					"item-quantity-nonnegative":
						"La cantidad del producto no puede ser negativa.",
					"item-amount-nonnegative":
						"El importe a reembolsar no puede ser negativo.",

					"date-required":
						"Debe proporcionar una fecha válida para el reembolso.",
					"date-invalid": "El formato de la fecha del reembolso no es válido.",

					"reason-required":
						"Debe proporcionar una razón formal y clara para justificar el reembolso.",
				},
			},

			new: {
				page: {
					title: "Nueva Venta",
					description: "Crear una nueva venta",
				},
				actions: {
					addProduct: "Agregar Producto",
					completeSale: "Completar Venta",
					cancelSale: "Cancelar Venta",
					printReceipt: "Imprimir Recibo",
				},
				saleSummary: {
					title: "Resumen de la Venta",
					totalItems: "Total de Artículos",
					totalPrice: "Precio Total",
				},
				saleDetails: {
					title: "Detalles de la Venta",
					customerName: "Nombre del Cliente",
					customerNamePlaceholder: "Ingresa el nombre del cliente",
					customerRTN: "RTN del Cliente",
					customerRTNPlaceholder: "Ingresa el RTN del cliente (opcional)",
					customerPhone: "Teléfono del Cliente",
					customerPhonePlaceholder:
						"Ingresa el teléfono del cliente (opcional)",
					customerEmail: "Correo Electrónico del Cliente",
					customerEmailPlaceholder:
						"Ingresa el correo electrónico del cliente (opcional)",
					transactionDate: "Fecha de la Transacción",
					store: "Tienda",
					storeTooltip:
						"La tienda se selecciona automáticamente según tu sesión actual",
				},
				productList: {
					title: "Lista de Productos",
					selectWarehouse: "Seleccionar Almacén",
					addByBarcode: "Agregar por Código de Barras",
					addByBarcodePlaceholder: "Escanea o ingresa el código de barras",
					searchProduct: "Buscar un producto por su nombre",
					searchProductPlaceholder: "Buscar un producto",
					productNotFound:
						"El código de barras proporcionado no corresponde a ningún producto",
					table: {
						name: "Nombre del Producto",
						unitPrice: "Precio de Venta",
						quantity: "Cantidad",
						discount: "Descuento",
						totalPrice: "Precio Total",
						quantityError: "No hay suficiente stock disponible, la venta no se podrá realizar",
						actions: "Acciones",
					},
					tableActions: {
						edit: "Editar",
						remove: "Eliminar",
					},
				},
				paymentDetails: {
					title: "Detalles de Pago",
					button: "Agregar Método de Pago",
				},
				modals: {
					confirmSale: {
						title: "Confirmar Venta",
						description: "¿Estás seguro de que deseas realizar esta venta?",
						create: "Crear Venta",
						messages: {
							success: "La venta se creó exitosamente",
							error: "Hubo un error interno al crear la venta",
						},
					},

					discount: {
						title: "Aplicar descuento al total",
						description:
							"Ingresa un porcentaje o un monto total de descuento. El descuento se aplicará sobre el total de todos los productos vendidos, no por unidad.",
						amount: "Monto total",
						amountPlaceholder:
							"Ingresa el monto total de descuento (ej. 120 si se vendieron 4 unidades de $40)",
						percentage: "Porcentaje",
						percentagePlaceholder:
							"Ingresa el % de descuento sobre el total (ej. 15 para un 15%)",
						summary:
							"{{productName}} — Precio original: ${{originalPrice}} — Precio con descuento: ${{discountedPrice}}",
						messages: {
							success: "Descuento aplicado correctamente",
							error: "Hubo un error al aplicar el descuento",
							"invalid-amount":
								"El monto de descuento no puede ser negativo ni exceder el total",
							"invalid-percentage":
								"El porcentaje de descuento debe estar entre 0 y 100",
						},
					},

					payment: {
						title: "Pago",
						receipt: {
							title: "Recibo",
							description: "Imprimir el recibo para esta venta",
							yes: "Incluir Recibo",
							no: "No incluir recibo",
						},
						taxes: {
							title: "Impuestos",
							description:
								"Selecciona los impuestos a aplicar en esta venta. Algunos productos ya pueden tener impuestos aplicados, estos no se añadirán nuevamente.",
							placeholder: "Seleccionar Impuestos",
						},
						totalAmount: {
							title: "Monto Total",
							subtotal: "Subtotal",
							discount: "Descuento",
							tax: "Impuesto",
							shipping: "Envío",
							total: "Total",
						},
						discount: {
							title: "Descuento",
							description: "Ingresa el monto o porcentaje de descuento",
							amount: "Monto",
							percentage: "Porcentaje",
						},
						method: {
							title: "Método de Pago",
							description: "Selecciona el método de pago para esta venta",
							cash: "Efectivo",
							card: "Tarjeta",
							transfer: "Transferencia",
							cashMethod: {
								title: "Efectivo",
								amount: "Monto",
								amountPlaceholder: "Ingresa el monto recibido en efectivo",
								change: "Cambio",
								changePlaceholder: "Cambio a devolver al cliente",
							},
						},
						completeSale: "Completar Venta",
						messages: {
							success: "Venta creada exitosamente",
							error: "Hubo un error al crear la venta",
							"invalid-date": "Formato de fecha inválido",
							"invalid-store": "Tienda inválida",
							"invalid-name": "Nombre del cliente inválido",
							"empty-sale": "La venta no puede estar vacía",
							"invalid-quantity": "Cantidad inválida",
							"invalid-discount": "Descuento inválido",
							"invalid-tax": "Por favor selecciona al menos un impuesto",
							"invalid-payment-method":
								"Por favor selecciona un método de pago",
							"invalid-payment": "Asegúrate de que el pago sea válido",
							"invalid-payment-amount":
								"Asegúrate de que el cliente pague el monto correcto",
							"invalid-warehouse": "Por favor selecciona un almacén",
						},
					},
				},
			},
		},
	},

	dashboard: {
		sidebar: {
			title: "Panel de Control",
			index: "Página de Inicio",
			products: "Productos",
			stores: "Tiendas",
			warehouses: "Almacenes",
			sales: "Ventas",
			purchases: "Compras",
			returns: "Devoluciones",
			suppliers: "Proveedores",
			accounts: "Cuentas",
			settings: "Ajustes Del Sitio",
		},

		common: {
			loggedInAs: "Actualmente ha iniciado sesión como {{name}} ({{email}})",
			create: "Crear",
			search: "Buscar",
			cancel: "Cancelar",
			delete: "Eliminar",
			edit: "Editar",
			filter: "Filtrar",
			min: "Mínimo",
			max: "Máximo",
			from: "Desde",
			to: "Hasta",
			reset: "Resetear",
			view: "Ver",
			save: "Guardar",
			close: "Cerrar",
			actions: "Acciones",
			confirm: "Confirmar",
			loading: "Cargando",
			noResults: "Sin resultados",
			yes: "Sí",
			no: "No",
			loadMore: "Cargar más",
			description: "Descripción",
			name: "Nombre",
			tags: "Etiquetas",
			actionNecessary: "Acción necesaria",
			actionNotNecessary: "Acción no necesaria",
			actionNotAllowed: "Acción no permitida",
			optional: "Opcional",
			showCount: "{{count}} por página",
			page: "Página {{page}}",
		},

		returns: {
			page: {
				title: "Devoluciones",
				description:
					"Consulta y gestiona las devoluciones de productos realizadas por los clientes.",
				createReturn: "Registrar una devolución",
			},

			table: {
				actions: "Opciones",
			},

			modals: {
				// Puedes añadir aquí textos para modales si los usas.
			},

			messages: {
				"create-return":
					"Para registrar una devolución, accede al módulo de ventas, selecciona la venta correspondiente, y utiliza la opción 'Devolver' disponible en los detalles de la transacción.",
			},
		},

		index: {
			greetings: {
				morning: "Buenos días",
				afternoon: "Buenas tardes",
				evening: "Buenas noches",
			},

			logout: "¿No eres tú? Inicia sesión con otra cuenta",
			login: "Iniciar sesión",

			links: {
				posTitle: "Punto de Venta",
				posButton: "Ir al POS",
				settingsTitle: "Configuraciones",
				settingsButton: "Administrar Configuraciones",
				productsTitle: "Productos",
				productsButton: "Administrar Productos",
				categoriesTitle: "Categorías",
				categoriesButton: "Ver Categorías",
				storesTitle: "Tiendas",
				storesButton: "Ver Tiendas",
				warehousesTitle: "Almacenes",
				warehousesButton: "Ver Almacenes",
				stockTitle: "Inventario",
				stockButton: "Ver Stock",
				salesTitle: "Ventas",
				salesButton: "Ver Ventas",
				purchasesTitle: "Compras",
				purchasesButton: "Ver Compras",
				suppliersTitle: "Proveedores",
				suppliersButton: "Ver Proveedores",
				accountsTitle: "Usuarios",
				accountsButton: "Administrar Usuarios",
			},
		},

		config: {
			page: {
				title: "Ajustes de sitio",
				description: "Cambia los ajustes de este sistema",
			},

			currency: {
				title: "Moneda",
				fields: {
					currency: "Moneda",
					symbol: "Símbolo de moneda",
					position: "Posición del símbolo de la moneda",
					left: "Izquierda",
					right: "Derecha",
				},
			},
			taxes: {
				title: "Impuestos",
				addTax: "Añadir Impuesto",
				removeTax: "Eliminar Impuesto",
				fields: {
					name: "Nombre del Impuesto",
				},
			},
			invoice: {
				title: "Recibos",
				fields: {
					start: "Inicio del rango",
					end: "Fin del rango",
					current: "Factura actual (Cuidado al editar)",
				},
			},
			inventory: {
				title: "Inventario",
				fields: {
					lowStockAlerts: "Alertar cuando se llega a los mínimos de stock?",
				},
			},
			notifications: {
				title: "Notificaciones",
				fields: {
					email: "Notificar por email",
					sms: "Notificar por teléfono (Opción no disponible)",
					push: "Notificar por notificaciones emergentes (Opción no disponible)",
				},
			},

			messages: {
				success: "Los ajustes se guardaron correctamente",
				error: "Ocurrió un error al guardar los ajustes",
				"invalid-currency": "La moneda es inválida.",
				"invalid-currencySymbol": "El símbolo de moneda es inválido.",
				"invalid-currencyPosition":
					"La posición de la moneda es inválida. Debe ser 'left' o 'right'.",

				"invalid-taxes-name": "El nombre del impuesto no puede estar vacío.",
				"invalid-taxes-rate": "La tasa del impuesto debe ser un número válido.",
				"duplicate-taxes-name":
					"Los nombres de los impuestos deben ser únicos.",
				"invalid-taxes": "Al menos un impuesto es requerido.",

				"invalid-invoiceNumberRange-start":
					"El inicio del número de factura es inválido.",
				"invalid-invoiceNumberRange-end":
					"El fin del número de factura es inválido.",
				"invalid-invoiceNumberRange-current":
					"El número de factura actual es inválido.",
				"invalid-invoice-number-range":
					"El rango de números de factura es inválido. El inicio debe ser menor que el fin y el número actual debe estar dentro de este rango.",

				"invalid-inventorySettings-lowStockAlerts":
					"La configuración de alerta de bajo stock es inválida.",

				"invalid-notifications-email":
					"La configuración de notificaciones por correo electrónico es inválida.",
				"invalid-notifications-sms":
					"La configuración de notificaciones por SMS es inválida.",
				"invalid-notifications-push":
					"La configuración de notificaciones push es inválida.",
			},
		},

		stock: {
			page: {
				title: "Gestión de Inventario",
				description:
					"Supervise y administre los niveles de inventario de todos sus productos en diferentes almacenes desde este panel centralizado.",
				searchPlaceholder:
					"Busque productos por nombre, código de barras o categoría...",
				manageProducts: "Ir a Gestión de Productos",
				manageWarehouses: "Ir a Gestión de Almacenes",
				stockValue: "Valor Total del Inventario",
			},

			selectWarehouse:
				"Seleccione un almacén para ver el stock actual de sus productos.",

			notice:
				"No es necesario crear entradas de inventario manualmente. Los registros de inventario para productos y almacenes se generan automáticamente al añadir un nuevo producto o almacén. Estos registros también se actualizan automáticamente al registrar compras o ventas, garantizando que su inventario se mantenga preciso en tiempo real.",

			table: {
				product: "Nombre del Producto",
				barcode: "Código de Barras",
				category: "Categoría del Producto",
				quantity: "Stock Disponible",
				actions: "Acciones",
				editStock: "Ajustar Cantidad en Stock",
			},

			modals: {
				adjustStock: {
					title: "Ajustar Stock del Producto",
					description:
						"Actualice manualmente la cantidad en stock de este producto. Utilice esta opción solo si está seguro de que el nivel de stock actual es incorrecto. Para actualizaciones rutinarias, como nuevas existencias o ventas, se recomienda registrar una compra o una venta.",
					quantity: "Cantidad Actualizada",
					quantityPlaceholder: "Ingrese la nueva cantidad en stock",
					messages: {
						error:
							"Ocurrió un error al actualizar el stock. Por favor, intente nuevamente.",
						success: "La cantidad en stock se actualizó correctamente.",
						"not-negative": "La cantidad en stock no puede ser menor que cero.",
					},
				},
			},
		},

		warehouses: {
			page: {
				title: "Gestión de Almacenes",
				description:
					"Consulte su lista de almacenes, cree nuevas ubicaciones, edite entradas existentes y gestione la distribución de inventario en múltiples sitios.",
				createWarehouse: "Agregar Nuevo Almacén",
				manageStock: "Ajustar y Supervisar Inventario",
				searchPlaceholder:
					"Buscar por nombre de almacén, dirección o etiquetas...",
			},

			table: {
				name: "Nombre del Almacén",
				description: "Descripción Breve",
				address: "Dirección Física",
				tags: "Etiquetas o Categorías",
				actions: "Acciones Disponibles",
				editTooltip: "Editar los detalles de este almacén",
				deleteTooltip: "Eliminar permanentemente este almacén",
			},

			modals: {
				create: {
					title: "Agregar un Nuevo Almacén",
					modalDescription:
						"Complete los campos a continuación para registrar un nuevo almacén. Asegúrese de incluir información precisa para facilitar la logística y la distribución del inventario.",
					name: "Nombre del Almacén",
					namePlaceholder:
						"Ingrese un nombre para identificar este almacén (por ejemplo, 'Centro de Distribución Central')",
					description: "Descripción Breve",
					descriptionPlaceholder:
						"Proporcione un resumen breve sobre el propósito o características de este almacén",
					address: "Dirección",
					addressPlaceholder:
						"Ingrese la dirección completa de este almacén (por ejemplo, 'Av. Industrial 123, Oficina 400')",
					tags: "Palabras Clave o Etiquetas",
					tagsPlaceholder:
						"Agregue etiquetas relevantes (por ejemplo, refrigerado, alta prioridad, desbordamiento)",
					messages: {
						"invalid-name-length":
							"El nombre del almacén debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 300 caracteres.",
						"invalid-address-length":
							"La dirección debe tener entre 5 y 200 caracteres.",
						"invalid-tags-length":
							"Las etiquetas deben ser una lista de cadenas breves.",
						"invalid-tag":
							"Por favor, proporcione las etiquetas como una lista de palabras o frases.",
						"too-many-tags": "El número máximo de etiquetas permitidas es 10.",
						success: "El almacén se creó correctamente.",
						error:
							"Ocurrió un error al intentar crear el almacén. Por favor, intente nuevamente.",
					},
				},
				delete: {
					title: "Confirmar Eliminación del Almacén",
					description:
						"Esta acción eliminará permanentemente el almacén seleccionado y todos los datos asociados. ¿Está completamente seguro de que desea continuar?",
					messages: {
						success: "El almacén se eliminó correctamente.",
						error:
							"Hubo un problema al eliminar el almacén. Por favor, intente más tarde.",
					},
				},
				update: {
					title: "Editar Detalles del Almacén",
					modalDescription:
						"Modifique los campos a continuación para actualizar la información de este almacén. Todos los cambios se guardarán inmediatamente tras la confirmación.",
					name: "Nombre del Almacén",
					namePlaceholder:
						"Actualizar el nombre del almacén (por ejemplo, 'Centro Norte')",
					description: "Descripción",
					descriptionPlaceholder:
						"Actualizar el resumen o propósito del almacén",
					address: "Dirección",
					addressPlaceholder: "Actualizar la ubicación física del almacén",
					tags: "Etiquetas",
					tagsPlaceholder:
						"Editar o agregar etiquetas para mejor categorización y filtrado",
					messages: {
						"invalid-name-length":
							"El nombre del almacén debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 300 caracteres.",
						"invalid-address-length":
							"La dirección debe tener entre 5 y 200 caracteres.",
						"invalid-tags-length":
							"Las etiquetas deben ser una lista de cadenas.",
						"invalid-tags":
							"Las etiquetas deben ser una lista de cadenas breves o palabras clave.",
						"too-many-tags": "El número máximo de etiquetas permitidas es 10.",
						success: "Los detalles del almacén se actualizaron correctamente.",
						error:
							"Ocurrió un error al actualizar el almacén. Por favor, revise los campos e intente nuevamente.",
					},
				},
			},
		},

		roles: {
			page: {
				title: "Roles de Cuenta",
				description: "Cree, administre y elimine roles.",
				createRole: "Crear un Rol",
				searchPlaceholder: "Buscar Roles",
				returnToAccounts: "Volver a Cuentas",
			},

			table: {
				name: "Nombre",
				level: "Nivel",
				totalPermissions: "Permisos Totales",
				actions: "Acciones",
				editTooltip: "Editar Rol",
				deleteTooltip: "Eliminar Rol",
			},

			modals: {
				delete: {
					title: "Eliminar Rol",
					description:
						"¿Está seguro de que desea eliminar este rol? Esta acción es irreversible.",
					messages: {
						success: "El rol se eliminó correctamente",
						error: "Ocurrió un error al intentar eliminar el rol",
					},
				},

				create: {
					title: "Crear Rol",
					description:
						"Complete los campos correspondientes para crear un nuevo rol",
					name: "Nombre",
					namePlaceholder: "Nombre del Rol",
					level: "Nivel",
					levelPlaceholder: "Nivel del Rol",
					messages: {
						"invalid-name": "El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-level": "El nivel debe ser un número positivo.",
						"level-in-use": "Este nivel ya está siendo utilizado por otro rol.",
						"level-too-high":
							"No puede crear un rol con un nivel superior al suyo.",
						success: "El rol se creó correctamente",
						error: "Ocurrió un error al crear el rol",
					},
				},

				update: {
					title: "Actualizar Rol",
					description:
						"Complete los campos correspondientes para actualizar el rol",
					name: "Nombre",
					namePlaceholder: "Nombre del Rol",
					level: "Nivel",
					levelPlaceholder: "Nivel del Rol",
					requiresTwoFactor: "Requiere Autenticación de Dos Factores",
					requiresTwoFactorTooltip:
						"Este rol requiere autenticación de dos factores para acceder a la plataforma",
					permissions: "Permisos",
					permissionsPlaceholder: "Seleccione los Permisos",
					create: "Crear",
					update: "Actualizar",
					delete: "Eliminar",
					refund: "Reembolsar",
					view: "Ver",
					discount: "Descuento",
					enableAll: "Activar Todos",
					products: "Productos",
					purchases: "Compras",
					sales: "Ventas",
					warehouses: "Almacenes",
					roles: "Roles",
					accounts: "Cuentas",
					settings: "Configuración",
					reports: "Informes",
					categories: "Categorías",
					stores: "Tiendas",
					suppliers: "Proveedores",
					messages: {
						"invalid-name-length":
							"El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-level": "El nivel debe ser un número positivo.",
						"level-in-use": "Este nivel ya está siendo utilizado por otro rol.",
						"level-too-high":
							"No puede crear un rol con un nivel superior al suyo.",
						"invalid-permissions":
							"No puede asignar permisos que usted no posee.",
						success: "El rol se actualizó correctamente",
						error: "Ocurrió un error al actualizar el rol",
					},
				},
			},
		},

		sales: {
			page: {
				title: "Ventas",
				description:
					"Ver y gestionar todas las ventas realizadas a través del sistema POS.",
				createSale: "Nueva Venta",
				searchPlaceholder:
					"Buscar por nombre del cliente o número de recibo...",
			},

			table: {
				date: "Fecha",
				customer: "Cliente",
				total: "Monto Total",
				refund: "Devolución",
				"refund-total": "Devolución Completa",
				"refund-partial": "Devolución Parcial",
				"refund-no-refund": "No Se Ha Devuelto",
				paymentMethod: "Método de Pago",
				status: "Estado de Pago",
				store: "Tienda",
				employee: "Procesado Por",
				actions: "Acciones",
				receipt: "Recibo #",

				editTooltip: "Editar esta venta",
				deleteTooltip: "Eliminar esta venta",
				viewTooltip: "Ver detalles de la venta",
				printReceiptTooltip: "Imprimir recibo",

				saleCount: "{{total}} ventas encontradas",

				searchByReceipt: "Filtrar por número de recibo",
				searchByCustomer: "Filtrar por nombre del cliente",

				paid: "Pagado",
				unpaid: "No Pagado",
				partially_paid: "Parcialmente Pagado",
			},

			modals: {
				delete: {
					title: "Eliminar Venta",
					description:
						"¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer. Esto no restaurará el inventario de los productos vendidos. Si deseas restaurar el inventario, hazlo mediante un reembolso.",
					messages: {
						success: "La venta fue eliminada exitosamente.",
						error:
							"Hubo un error al intentar eliminar la venta. Por favor, intenta de nuevo.",
					},
				},

				selected: {
					title: "Detalles de la Venta",
					refund: "Reembolsar Esta Venta",
					generalInfo: {
						title: "Información General",
						receipt: "Número de Recibo",
						date: "Fecha",
						store: "Tienda",
						processedBy: "Procesado Por",
					},
					customerInfo: {
						title: "Información del Cliente",
						name: "Nombre",
						email: "Correo Electrónico",
						phone: "Teléfono",
						rtn: "RTN",
					},
					payment: {
						title: "Información de Pago",
						total: "Monto Total",
						totalPaid: "Monto Pagado",
						change: "Cambio",
						status: "Estado de Pago",
					},
					products: {
						title: "Productos",
						product: "Producto",
						quantity: "Cantidad",
						unitPrice: "Precio Unitario",
						total: "Total",
					},
				},
			},
		},

		products: {
			page: {
				title: "Catálogo de Productos",
				description:
					"Agregue, vea, edite o elimine productos de su inventario. Organice los productos en categorías para facilitar el seguimiento de inventario y ventas.",
				createProduct: "Agregar Nuevo Producto",
				manageCategories: "Organizar Categorías de Productos",
				searchPlaceholder:
					"Buscar productos por nombre, código de barras o categoría...",
				showDeleted: "Mostrar Productos Eliminados",
			},

			table: {
				fieldsSelect: "Seleccionar Campos A Mostrar",
				image: "Vista Previa de la Imagen del Producto",
				barcode: "Código de Barras del Producto",
				sku: "SKU",
				description: "Descripción del Producto",
				noDescription: "Sin Descripción",
				createdAt: "Creado",
				subcategories: "Subcategorías",
				noSubcategories: "Sin Subcategorías",
				name: "Nombre del Producto",
				category: "Categoría del Producto",
				sellingPrice: "Precio de Venta (al Cliente)",
				costPrice: "Precio de Costo (Interno)",
				actions: "Acciones",

				filterCategoryPlaceholder: "Seleccionar Categoría",
				missingCategoryTooltip:
					"La categoría de este producto ha sido eliminada. Asigne una nueva categoría para mantener la organización.",
				editTooltip: "Editar los detalles del producto",
				printBarcodesTooltip: "Generar códigos de barras imprimibles",
				statisticsTooltip: "Ver métricas de rendimiento del producto",
				deleteTooltip: "Eliminar producto permanentemente",
				deleted: "Eliminado",
				deletedTooltip: "Este producto ha sido eliminado permanentemente",
				count: "Se encontraron {{total}} productos (Mostrando {{range}})",
			},

			modals: {
				generateBarcode: {
					title: "Generar Códigos de Barras",
					description:
						"Ingrese la cantidad de códigos de barras únicos que desea generar para este producto.",
					count: "Cantidad",
					countPlaceholder: "ejemplo: 10",
					generate: "Generar Códigos de Barras",
					messages: {
						"invalid-count": "La cantidad debe ser un número positivo.",
						error:
							"No se pudo generar los códigos de barras. Por favor, intente nuevamente.",
						success:
							"Códigos de barras generados exitosamente. Su descarga comenzará en breve.",
					},
				},

				delete: {
					title: "Eliminar Producto",
					description:
						"¿Está seguro de que desea eliminar este producto de manera permanente? Esta acción no se puede deshacer.",
					messages: {
						success: "Producto eliminado correctamente.",
						error:
							"Ocurrió un error al eliminar el producto. Por favor, intente nuevamente más tarde.",
					},
				},

				create: {
					create: "Agregar Producto",
					description:
						"Ingrese los detalles del producto a continuación para agregarlo a su inventario.",
					name: "Nombre del Producto",
					namePlaceholder:
						"Ingrese el nombre del producto (por ejemplo, 'Ratón Inalámbrico')",
					barcode: "Código de Barras",
					barcodePlaceholder:
						"Ingrese o genere un código de barras único para el producto",
					generateBarcodeTooltip:
						"Haga clic para generar automáticamente un código de barras",
					category: "Categoría del Producto",
					selectCategory: "Elija una categoría",
					sellingPrice: "Precio de Venta",
					sellingPricePlaceholder:
						"Ingrese el precio con el que vende este producto",
					costPrice: "Precio de Costo",
					costPricePlaceholder: "Ingrese cuánto le cuesta este producto",
					messages: {
						"invalid-name":
							"El nombre del producto debe tener entre 1 y 100 caracteres.",
						"invalid-category":
							"Por favor, seleccione una categoría válida para el producto.",
						"invalid-selling-price":
							"El precio de venta debe ser un número positivo.",
						"invalid-cost-price":
							"El precio de costo debe ser un número positivo.",
						"invalid-barcode":
							"El código de barras debe tener entre 1 y 32 caracteres.",
						"price-lower-than-cost":
							"Advertencia: El precio de venta es inferior al precio de costo.",
						"barcode-already-exists": "El código de barra ya está en uso",
						warning:
							"Por favor revise los campos resaltados antes de continuar.",
						error: "Ocurrió un error al crear el producto.",
						success: "Producto agregado al inventario correctamente.",
					},
				},

				update: {
					title: "Editar Producto",
					description:
						"Actualice cualquier detalle relacionado con este producto utilizando las secciones a continuación.",

					general: {
						title: "Información Básica",
						name: "Nombre del Producto",
						namePlaceholder: "Actualice el nombre del producto",
						description: "Descripción del Producto (Opcional)",
						descriptionPlaceholder:
							"Proporcione más detalles sobre el producto (características, marca, etc.)",
						barcode: "Código de Barras",
						barcodePlaceholder: "Edite o regenere el código de barras",
						generateBarcode: "Generar Nuevo Código de Barras",
						images: "Imágenes del Producto (Opcional)",
						imagesUpload: "Haga clic o arrastre archivos para cargar imágenes",
						deleteImageTooltip: "Eliminar esta imagen",
						currentImagesPreview: "Imágenes Actuales del Producto",
					},

					categories: {
						title: "Categorías",
						category: "Categoría Principal",
						selectCategory: "Elija la categoría principal",
						subcategories: "Subcategorías",
						selectSubcategories: "Seleccione todas las que correspondan",
					},

					productInformation: {
						title: "Especificaciones del Producto",
						type: "Tipo de Producto",
						typePlaceholder: "Elija si este producto es físico o digital",
						physical: "Artículo Físico",
						digital: "Artículo Digital",
						unit: "Unidad de Medición",
						unitPlaceholder:
							"Seleccione cómo se mide este producto (ejemplo: pieza, caja, litro)",
						physicalInformation: "¿Incluir dimensiones físicas?",
						width: "Ancho (cm)",
						height: "Alto (cm)",
						depth: "Profundidad (cm)",
						weight: "Peso (kg)",
						physicalInformationNotice: "Si no aplica, establezca en 0",
					},

					prices: {
						title: "Detalles de Precios",
						sellingPrice: "Precio de Venta",
						sellingPricePlaceholder: "Precio al cliente",
						costPrice: "Costo para la Empresa",
						costPricePlaceholder: "Cuánto le cuesta este artículo a su empresa",
						taxIncluded: "¿El precio de venta incluye impuestos?",
					},

					messages: {
						error: "Ocurrió un error al actualizar el producto.",
						warning:
							"Asegúrese de que todos los campos requeridos estén llenados correctamente.",
						success: "Producto actualizado correctamente.",
						"invalid-name":
							"El nombre del producto debe tener entre 1 y 100 caracteres.",
						"invalid-description":
							"La descripción debe tener entre 1 y 400 caracteres.",
						"invalid-barcode":
							"El código de barras debe tener entre 1 y 32 caracteres.",
						"invalid-image-urls": "Las imágenes deben ser URLs válidas.",
						"invalid-category": "La categoría es obligatoria.",
						"invalid-subcategories":
							"Las subcategorías deben ser una lista de etiquetas de texto.",
						"invalid-type":
							"Seleccione un tipo de producto válido: físico o digital.",
						"invalid-unit": "La unidad de medición es obligatoria.",
						"invalid-dimensions":
							"Las dimensiones deben ser números no negativos.",
						"invalid-weight": "El peso debe ser 0 o mayor.",
						"invalid-physical-info":
							"Información física proporcionada no válida.",
						"invalid-selling-price":
							"El precio de venta debe ser un número positivo.",
						"invalid-cost-price":
							"El precio de costo debe ser un número positivo.",
						"invalid-tax-included":
							"El valor de impuestos incluidos debe ser verdadero o falso.",
						"invalid-tag": "Cada etiqueta debe tener entre 1 y 16 caracteres.",
						"invalid-tags": "Las etiquetas deben ser una lista de cadenas.",
						"invalid-metadata":
							"Los metadatos deben estar en formato de objeto.",
						"unknown-error":
							"Ocurrió un error desconocido. Por favor, intente nuevamente más tarde.",
						"product-updated":
							"Información del producto guardada correctamente.",
						"price-lower-than-cost":
							"Advertencia: El precio de venta es inferior al precio de costo.",
						"barcode-already-exists":
							"Este código de barras ya está en uso. Por favor ingrese un código único o haga clic en 'Generar Código de Barras'.",
					},
				},
			},
		},

		purchases: {
			page: {
				title: "Compras",
				description:
					"Cree, gestione y elimine registros de compras de manera eficiente.",
				createPurchase: "Registrar Nueva Compra",
			},

			table: {
				total: "Número Total de Compras",
				date: "Fecha de Compra",
				supplier: "Proveedor",
				totalAmount: "Monto Total",
				paymentStatus: "Estado del Pago",
				status: "Estado de la Compra",
				store: "Tienda Asociada",
				warehouse: "Inventario / Almacén",
				actions: "Acciones Disponibles",
				editTooltip: "Editar Información de la Compra",
				deleteTooltip: "Eliminar Registro de Compra",
				viewTooltip: "Ver Detalle de la Compra",
				received: "Recibido",
				pending: "Pendiente",
				shipped: "Enviado",
			},

			modals: {
				selected: {
					title: "Detalle de la Compra",
					generalInfo: {
						title: "Información General de la Compra",
						orderDate: "Fecha de la Orden",
						expectedDelivery: "Fecha Estimada de Entrega",
						actualDelivery: "Fecha Real de Entrega",
						store: "Tienda Asociada",
						processedBy: "Procesado Por",
					},
					supplierInfo: {
						title: "Datos del Proveedor",
						name: "Nombre del Proveedor",
					},
					payment: {
						title: "Detalles de Pago",
						method: "Método de Pago Utilizado",
						subtotal: "Subtotal de la Compra",
						shippingCost: "Costo de Envío",
						taxes: "Impuestos Aplicados",
						discount: "Descuento Aplicado",
						totalAmount: "Monto Total",
						totalPaid: "Total Pagado",
						status: "Estado del Pago",
						statuses: {
							paid: "Pagado",
							partially_paid: "Parcialmente Pagado",
							unpaid: "No Pagado",
						},
					},
					products: {
						title: "Productos Incluidos",
						product: "Nombre del Producto",
						quantity: "Cantidad Adquirida",
						unitCost: "Costo Unitario",
						totalCost: "Costo Total por Producto",
					},
					attachments: {
						title: "Archivos Adjuntos",
					},
					status: {
						title: "Estado Actual de la Compra",
						status: "Estado",
						pending: "Pendiente",
						shipped: "Enviado",
						received: "Recibido",
						canceled: "Cancelado",
						returned: "Devuelto",
					},
				},

				delete: {
					title: "Confirmar Eliminación de Compra",
					description:
						"¿Está seguro de que desea eliminar esta compra? Esta acción no se puede deshacer.",
					messages: {
						success: "La compra ha sido eliminada correctamente.",
						error:
							"Ocurrió un error al intentar eliminar la compra. Por favor, intente nuevamente.",
					},
				},

				create: {
					title: "Registrar Nueva Compra",
					description:
						"Complete los campos necesarios para registrar una nueva compra en el sistema.",

					general: {
						title: "Datos Generales",
						status: "Estado de la Compra",
						selectStatus: "Seleccione un Estado",
						supplier: "Proveedor",
						selectSupplier: "Seleccione un Proveedor",
						warehouse: "Almacén de Destino",
						selectWarehouse: "Seleccione un Almacén",
						store: "Tienda Responsable",
						selectStore: "Seleccione una Tienda",
						received: "Recibido",
						pending: "Pendiente",
						shipped: "Enviado",
					},
					dates: {
						title: "Fechas Relevantes",
						orderDate: "Fecha de Orden de Compra",
						expectedDeliveryDate: "Fecha Estimada de Entrega",
						actualDeliveryDate: "Fecha Real de Entrega",
					},
					products: {
						title: "Productos a Incluir",
						product: "Buscar Productos",
						quantity: "Indicar Cantidad",
						table: {
							product: "Nombre del Producto",
							quantity: "Cantidad",
							unitCost: "Costo Unitario",
							totalCost: "Costo Total",
							actions: "Acciones",
							deleteTooltip: "Eliminar Producto de la Lista",
						},
					},
					attachments: {
						title: "Documentación Adjunta",
						description:
							"Adjunte documentos relevantes relacionados con esta compra.",
						upload: "Subir Archivos",
						successUpload: "Archivos subidos correctamente.",
						successDelete: "Archivos eliminados correctamente.",
						errorUpload: "Error al subir los archivos. Intente nuevamente.",
						errorDelete: "Error al eliminar los archivos. Intente nuevamente.",
					},
					payment: {
						title: "Información de Pago",
						method: "Método de Pago",
						selectMethod: "Seleccione un Método de Pago",
						cash: "Efectivo",
						credit_card: "Tarjeta de Crédito",
						debit_card: "Tarjeta de Débito",
						online: "Pago en Línea",
						gift_card: "Tarjeta de Regalo",
						partially_paid: "Pago Parcial",
						subtotal: "Subtotal",
						subtotalTooltip:
							"Este valor se calcula automáticamente y no puede modificarse.",
						shippingCost: "Costo de Envío (ingrese 0 si no aplica)",
						discount: "Descuento Aplicado",
						taxes: "Impuestos",
						paymentStatus: "Estado del Pago",
						selectPaymentStatus: "Seleccione el Estado del Pago",
						paid: "Pagado",
						unpaid: "No Pagado",
						"partially-paid": "Pago Parcial",
						partialPayment:
							"Como seleccionó pago parcial, indique el monto pagado.",
					},
					messages: {
						success: "La compra se ha registrado exitosamente.",
						error:
							"Ocurrió un error inesperado al intentar registrar la compra.",
						"invalid-supplier-id": "Debe seleccionar un proveedor válido.",
						"invalid-warehouse-id": "Debe seleccionar un almacén válido.",
						"invalid-store-id": "Debe seleccionar una tienda válida.",
						"no-items": "Debe incluir al menos un producto en la compra.",
						"invalid-order-date":
							"La fecha de la orden debe tener un formato ISO válido.",
						"attachment-upload-success": "Archivo cargado correctamente.",
						"attachment-upload-error":
							"Error al cargar el archivo. Intente nuevamente.",
						"delete-attachment-success": "Archivo eliminado correctamente.",
						"delete-attachment-error":
							"Error al eliminar el archivo. Intente nuevamente.",
						"invalid-product-id":
							"Cada producto debe tener un identificador válido.",
						"quantity-must-be-at-least-one":
							"La cantidad mínima por producto debe ser 1.",
						"unit-cost-cannot-be-negative":
							"El costo unitario no puede ser negativo.",
						"attachment-name-required":
							"Cada archivo adjunto debe tener un nombre.",
						"attachment-url-required":
							"Cada archivo adjunto debe incluir una URL válida.",
						"invalid-payment-method":
							"El método de pago seleccionado no es válido o no está soportado.",
						"subtotal-cannot-be-negative":
							"El subtotal no puede ser un valor negativo.",
						"shipping-cost-cannot-be-negative":
							"El costo de envío no puede ser negativo.",
						"taxes-cannot-be-negative":
							"Los impuestos no pueden ser un valor negativo.",
						"discount-cannot-be-negative":
							"El descuento no puede ser negativo.",
						"total-paid-required":
							"Debe ingresar un monto total pagado válido.",
						"invalid-status":
							"El estado de la compra debe ser 'pending', 'shipped' o 'received'.",
					},
				},
			},
		},

		suppliers: {
			page: {
				title: "Proveedores",
				description:
					"Agregue y administre su lista de proveedores de productos. Mantener esta información actualizada ayuda a agilizar su proceso de adquisición.",
				createSupplier: "Agregar Nuevo Proveedor",
				searchPlaceholder:
					"Buscar proveedores por nombre, correo electrónico o teléfono...",
			},

			table: {
				name: "Nombre del Proveedor",
				description: "Descripción Breve",
				email: "Correo Electrónico",
				address: "Dirección Física",
				phone: "Número de Teléfono",
				website: "URL del Sitio Web",
				actions: "Acciones Disponibles",
				editTooltip: "Editar detalles del proveedor",
				deleteTooltip: "Eliminar este proveedor",
			},

			modals: {
				create: {
					title: "Agregar Nuevo Proveedor",
					modalDescription:
						"Ingrese los detalles del proveedor que desea agregar. La información de contacto es opcional, pero se recomienda para futuras comunicaciones.",
					name: "Nombre del Proveedor",
					namePlaceholder: "ejemplo: Global Electronics Inc.",
					description: "Descripción del Proveedor",
					descriptionPlaceholder:
						"Resumen breve de los productos que ofrece este proveedor",
					email: "Correo Electrónico",
					emailPlaceholder: "ejemplo: contacto@proveedor.com",
					address: "Dirección",
					addressPlaceholder: "Calle, Ciudad, País (opcional)",
					phone: "Número de Teléfono",
					phonePlaceholder: "ejemplo: +1 555 123 4567",
					website: "Sitio Web",
					websitePlaceholder: "ejemplo: https://www.proveedor.com",
					messages: {
						success: "Proveedor creado correctamente.",
						"invalid-name-length":
							"El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 200 caracteres.",
						"invalid-phone-length":
							"El número de teléfono debe tener entre 7 y 20 caracteres.",
						"invalid-email-format":
							"El correo electrónico no tiene un formato válido.",
						"invalid-website-format": "El sitio web no tiene una URL válida.",
						"invalid-address-length":
							"La dirección debe tener entre 5 y 200 caracteres.",
					},
				},

				update: {
					title: "Editar Detalles del Proveedor",
					general: "Información Básica",
					name: "Nombre del Proveedor",
					descriptionLabel: "Descripción",
					description: "Resumen breve del negocio de este proveedor",

					contact: {
						title: "Detalles de Contacto",
						address: "Dirección",
						email: "Correo Electrónico",
						phone: "Número de Teléfono",
						website: "Sitio Web",
					},

					messages: {
						success: "Proveedor actualizado correctamente.",
						"invalid-name-length":
							"El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 200 caracteres.",
						"invalid-phone-length":
							"El número de teléfono debe tener entre 7 y 20 caracteres.",
						"invalid-email-format":
							"El correo electrónico no tiene un formato válido.",
						"invalid-website-format": "El sitio web no tiene una URL válida.",
						"invalid-address-length":
							"La dirección debe tener entre 5 y 200 caracteres.",
					},
				},

				delete: {
					title: "Eliminar Proveedor",
					description:
						"¿Está seguro de que desea eliminar este proveedor de manera permanente? Esto eliminará toda su información de contacto y no podrá deshacerse.",
					messages: {
						success: "Proveedor eliminado correctamente.",
						error:
							"Ocurrió un error al intentar eliminar el proveedor. Por favor, intente nuevamente.",
					},
				},
			},
		},

		stores: {
			page: {
				title: "Tiendas",
				description:
					"Administra todas tus ubicaciones de venta al por menor o almacenes. Puedes crear nuevas tiendas, asignar gerentes y actualizar o eliminar las existentes.",
				createStore: "Agregar Nueva Tienda",
				searchPlaceholder: "Buscar tiendas por nombre, ubicación o gerente...",
			},

			table: {
				name: "Nombre de la Tienda",
				location: "Ubicación",
				manager: "Gerente de la Tienda",
				actions: "Acciones Disponibles",
				editTooltip: "Editar detalles de la tienda",
				deleteTooltip: "Eliminar esta tienda",
			},

			modals: {
				create: {
					title: "Crear Nueva Tienda",
					name: "Nombre de la Tienda",
					namePlaceholder: "ejemplo: Outlet del Centro",
					location: "Ubicación",
					locationPlaceholder: "ejemplo: Calle Principal 123, Springfield",
					manager: "Gerente",
					managerPlaceholder: "ejemplo: Juan Pérez",
					phone: "Teléfono",
					phonePlaceholder: "ejemplo: +1 555 123 4567",
					email: "Correo Electrónico",
					emailPlaceholder: "ejemplo: ejemplo@sitio.com",
					messages: {
						"invalid-name":
							"El nombre de la tienda debe contener al menos 3 caracteres.",
						"invalid-location":
							"La ubicación debe contener al menos 3 caracteres.",
						"invalid-manager":
							"Debe seleccionar un gerente válido para la tienda.",
						"invalid-employee":
							"Uno o más empleados seleccionados no son válidos.",
						"invalid-email":
							"El correo electrónico proporcionado no tiene un formato válido.",
						"invalid-phone":
							"El número de teléfono proporcionado no tiene un formato válido.",
						success: "La tienda se creó correctamente.",
					},
				},

				delete: {
					title: "Eliminar Tienda",
					description:
						"¿Está seguro de que desea eliminar esta tienda? Esta acción es irreversible: la tienda dejará de estar disponible para ventas, compras u operaciones futuras. Sin embargo, seguirá apareciendo en los registros históricos. No será posible restaurarla posteriormente.",
					messages: {
						success: "La tienda ha sido eliminada correctamente.",
					},
				},

				update: {
					title: "Editar Detalles de la Tienda",

					general: {
						title: "Información General de la Tienda",
						name: "Nombre de la Tienda",
						namePlaceholder: "ejemplo: Outlet del Centro",
						location: "Ubicación",
						locationPlaceholder: "ejemplo: Calle Principal 123, Springfield",
						manager: "Gerente",
						managerPlaceholder: "ejemplo: Juan Pérez",
					},

					contact: {
						title: "Detalles de Contacto de la Tienda",
						phone: "Número de Teléfono",
						phonePlaceholder: "ejemplo: +1 555 987 6543",
						email: "Correo Electrónico",
						emailPlaceholder: "ejemplo: contacto@tienda.com",
					},

					employees: {
						title: "Asignar Empleados",
						searchEmployee: "Buscar empleados por nombre o ID",
						addEmployee: "Agregar a la Tienda",
						notice:
							"Seleccione los empleados que deben ser asignados a esta tienda. Puede designar uno como el gerente.",
						manager: "Gerente Designado",
					},

					messages: {
						"invalid-name":
							"El nombre de la tienda debe contener al menos 3 caracteres.",
						"invalid-location":
							"La ubicación debe contener al menos 3 caracteres.",
						"invalid-manager":
							"Debe seleccionar un gerente válido para la tienda.",
						"invalid-employee":
							"Uno o más empleados seleccionados no son válidos.",
						"invalid-email":
							"El correo electrónico proporcionado no tiene un formato válido.",
						"invalid-phone":
							"El número de teléfono proporcionado no tiene un formato válido.",
						success: "La tienda ha sido actualizada correctamente.",
					},
				},
			},

			messages: {
				"error-fetching":
					"Ocurrió un error al intentar recuperar la lista de tiendas.",
				"invalid-name":
					"El nombre de la tienda debe tener entre 1 y 100 caracteres.",
				"invalid-location":
					"La ubicación debe ser una dirección válida entre 5 y 200 caracteres.",
				"invalid-manager":
					"Por favor, seleccione un gerente válido para la tienda.",
				"create-success": "La tienda fue creada con éxito.",
				"create-error":
					"Hubo un problema al crear la tienda. Por favor, intente nuevamente.",
				"update-success":
					"Los detalles de la tienda fueron actualizados con éxito.",
				"update-error":
					"Ocurrió un error al actualizar la información de la tienda.",
				"delete-success": "La tienda fue eliminada correctamente.",
				"delete-error":
					"Hubo un error al intentar eliminar la tienda. Por favor, intente más tarde.",
			},
		},

		categories: {
			page: {
				title: "Categorías de Productos",
				description:
					"Define y administra categorías para agrupar productos similares para una mejor organización y una navegación más fácil.",
				createCategory: "Agregar Nueva Categoría",
				returnToProducts: "Volver a la Lista de Productos",
				searchPlaceholder: "Buscar categorías por nombre o etiqueta...",
				showDeleted: "Mostrar Categorías Eliminadas",
			},

			table: {
				name: "Nombre de la Categoría",
				description: "Descripción de la Categoría",
				tags: "Etiquetas Asociadas",
				image: "Imagen de la Categoría",
				actions: "Acciones Disponibles",
				editTooltip: "Editar esta categoría",
				deleteTooltip: "Eliminar esta categoría",
				total: "Se encontraron {{total}} categorías (Mostrando {{range}})",
				deleted: "Eliminada",
			},

			modals: {
				create: {
					title: "Agregar Nueva Categoría",
					modalDescription:
						"Complete los campos a continuación para crear una nueva categoría de producto. Las categorías ayudan a organizar tu inventario y mejorar la capacidad de búsqueda.",
					name: "Nombre de la Categoría",
					namePlaceholder: "ejemplo: Electrónica, Suministros de Oficina",
					description: "Descripción Detallada",
					descriptionPlaceholder:
						"Describe qué tipo de productos pertenecen a esta categoría",
					tags: "Palabras clave/Etiquetas",
					tagsPlaceholder:
						"Ingrese etiquetas (ejemplo: gadgets, papel, accesorios)",
					uploadImageLabel: "Imagen de la Categoría (Opcional)",
					uploadImage: "Subir Imagen",
					removeImage: "Eliminar Imagen Actual",
					messages: {
						"invalid-name-length":
							"El nombre de la categoría debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 500 caracteres.",
						"invalid-tags-length":
							"Las etiquetas deben tener entre 1 y 16 caracteres.",
						"too-many-tags": "Solo se permiten hasta 10 etiquetas.",
						"image-upload-error":
							"No se pudo cargar la imagen. Por favor, intente nuevamente.",
						"image-upload-success": "Imagen cargada con éxito.",
						"image-delete-error":
							"No se pudo eliminar la imagen. Por favor, intente nuevamente.",
						"image-delete-success": "Imagen eliminada con éxito.",
						success: "Categoría creada con éxito.",
						error:
							"Ocurrió un error al crear la categoría. Por favor, intente nuevamente.",
					},
				},

				delete: {
					title: "Eliminar Categoría",
					description:
						"¿Está seguro de que desea eliminar esta categoría de forma permanente? Esto no se puede deshacer y puede afectar a los productos asociados.",
					messages: {
						success: "Categoría eliminada correctamente.",
						error:
							"No se pudo eliminar la categoría. Por favor, intente más tarde.",
					},
				},

				update: {
					title: "Editar Categoría",
					modalDescription:
						"Actualice los detalles de la categoría a continuación. Utilice esto para cambiar el nombre de la categoría, su descripción, etiquetas o actualizar su imagen.",
					name: "Nombre de la Categoría",
					namePlaceholder:
						"Ingrese un nuevo nombre o nombre actualizado de la categoría",
					description: "Descripción de la Categoría",
					descriptionPlaceholder:
						"Actualice la descripción para mayor claridad",
					tags: "Etiquetas/Palabras clave",
					tagsPlaceholder: "Actualice o agregue nuevas etiquetas",
					uploadImageLabel: "Subir Nueva Imagen (Opcional)",
					uploadImage: "Subir Imagen",
					removeImage: "Eliminar Imagen Existente",
					currentImage: "Imagen Actual de la Categoría",
					messages: {
						"invalid-name-length":
							"El nombre de la categoría debe tener entre 1 y 100 caracteres.",
						"invalid-description-length":
							"La descripción debe tener entre 1 y 500 caracteres.",
						"invalid-tags-length":
							"Las etiquetas deben tener entre 1 y 16 caracteres.",
						"too-many-tags": "Solo se permiten hasta 10 etiquetas.",
						"image-upload-error":
							"No se pudo cargar la imagen. Por favor, intente nuevamente.",
						"image-upload-success": "Imagen cargada con éxito.",
						"image-delete-error":
							"No se pudo eliminar la imagen. Por favor, intente nuevamente.",
						"image-delete-success": "Imagen eliminada con éxito.",
						success: "Categoría actualizada con éxito.",
						error:
							"Ocurrió un error al actualizar la categoría. Por favor, intente nuevamente.",
					},
				},
			},
		},

		accounts: {
			page: {
				title: "Cuentas",
				description:
					"Administra las cuentas de usuarios y empleados desde esta página.",
				searchPlaceholder: "Buscar una cuenta",
				manageRoles: "Gestionar Roles de Cuenta",
				createAccount: "Crear Cuenta",
			},

			table: {
				name: "Nombre",
				email: "Correo Electrónico",
				role: "Rol",
				actions: "Acciones",
				editTooltip: "Editar Cuenta",
				deleteTooltip: "Eliminar Cuenta",
			},

			modals: {
				create: {
					title: "Crear Cuenta",
					description:
						"Llena los campos correspondientes para crear una cuenta",
					name: "Nombre",
					namePlaceholder: "Nombre de la Cuenta",
					email: "Correo Electrónico",
					emailPlaceholder: "Correo Electrónico de la Cuenta",
					password: "Contraseña",
					passwordPlaceholder: "Contraseña de la Cuenta",
					role: "Rol",
					selectRole: "Seleccionar Rol",
					messages: {
						"invalid-name-length":
							"El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-email": "El formato del correo electrónico es inválido.",
						"invalid-password-length":
							"La contraseña debe tener al menos 8 caracteres.",
						"invalid-role": "El rol es obligatorio.",
						"email-in-use":
							"El correo electrónico proporcionado ya está en uso",
						success: "Cuenta creada con éxito",
						error: "Hubo un error al crear la cuenta",
					},
				},
				update: {
					title: "Actualizar Cuenta",
					description:
						"Llena los campos correspondientes para actualizar una cuenta",
					name: "Nombre",
					namePlaceholder: "Nombre de la Cuenta",
					email: "Correo Electrónico",
					emailPlaceholder: "Correo Electrónico de la Cuenta",
					password: "Contraseña",
					passwordPlaceholder: "Contraseña de la Cuenta",
					role: "Rol",
					selectRole: "Seleccionar Rol",
					disableTwoFactor: "Desactivar Autenticación de Dos Factores",
					disableTwoFactorTooltip:
						"Esto desactivará la autenticación de dos factores para esta cuenta",
					messages: {
						"invalid-name-length":
							"El nombre debe tener entre 1 y 100 caracteres.",
						"invalid-email": "El formato del correo electrónico es inválido.",
						"invalid-password-length":
							"La contraseña debe tener al menos 8 caracteres.",
						"invalid-role": "El rol es obligatorio.",
						"email-in-use":
							"El correo electrónico proporcionado ya está en uso",
						success: "Cuenta actualizada con éxito",
						error: "Hubo un error al actualizar la cuenta",
					},
				},
				delete: {
					title: "Eliminar Cuenta",
					description:
						"¿Está seguro de que desea eliminar esta cuenta? Esta acción es irreversible.",
					messages: {
						success: "Cuenta eliminada.",
						error: "Hubo un error al intentar eliminar la cuenta.",
					},
				},
			},
		},
	},
};

export default translation;
