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
    "invalid-credentials":
      "Las credenciales proporcionadas son incorrectas. Por favor, verifique su correo electrónico y contraseña e intente nuevamente.",
  },

  home: {
    title: "Asterki - MiBalance",
    subtitle:
      "Your ultimate dashboard for tracking income, expenses, and goals — online or offline.",
    cta: {
      login: "Log in to Your Account",
    },
    quickActions: "Get Started Fast",
    login: "Login",
    dashboard: "Dashboard",
    budget: "Budget Tracker",
    featuresTitle: "Tools That Empower Your Finances",
    features: {
      aiAssistant: {
        title: "AI Assistant",
        desc: "Ask about spending trends or generate budget summaries in seconds.",
      },
      analytics: {
        title: "Visual Insights",
        desc: "See exactly where your money goes with beautiful charts and custom reports.",
      },
      budgeting: {
        title: "Smart Budgeting",
        desc: "Plan ahead with category-based budgets and overspend alerts.",
      },
      integration: {
        title: "Connected Tools",
        desc: "Sync with your bank, tax software, and payment apps easily.",
      },
    },
    testimonialsTitle: "See What Our Users Say",
    testimonials: [
      {
        text: "“Since using MiBalance, I finally feel in control of my money every month.”",
        author: "— Carla D., Freelancer",
      },
      {
        text: "“The budgeting features helped me save $300 in just two weeks.”",
        author: "— José R., College Student",
      },
    ],
    support: {
      title: "Need Help Getting Started?",
      desc: "Visit our documentation or reach out to our support team anytime.",
      contact: "Contact Support",
      docs: "View Documentation",
    },
    rights: "All rights reserved.",
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
      noAccount: "¿No tienes una cuenta? Haz clic aquí para registrarte",

      tfaModal: {
        title: "Autenticación de dos factores",
        description:
          "Tu cuenta requiere autenticación de dos factores. Por favor, ingresa el código de autenticación proporcionado por tu aplicación de autenticación.",
        fields: {
          tfaCode: "Código de autenticación",
          tfaCodePlaceholder: "Ingresa el código de autenticación",
        },

        submit: "Verificar código",
      },

      messages: {
        success: "Sesión iniciada correctamente",
        "invalid-credentials":
          "La combinación de correo electrónico y contraseña que proporcionaste no corresponde a ninguna cuenta",
        "invalid-password": "Por favor ingrese una contraseña",
        "invalid-email": "El correo electrónico que proporcionaste es inválido",
        "requires-tfa":
          "Tu cuenta requiere autenticación de dos factores. Por favor, ingresa el código de autenticación.",
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

      alreadyHaveAccount: "Ya tienes una cuenta?",
      loginHere: "Ingresa aquí",

      messages: {
        "invalid-email": "Dirección de correo electrónico inválida.",
        "name-too-short": "El nombre debe tener al menos 2 caracteres.",
        "name-too-long": "El nombre debe tener como máximo 34 caracteres.",
        "password-too-short": "La contraseña debe tener al menos 8 caracteres.",
        "password-too-long":
          "La contraseña debe tener como máximo 100 caracteres.",
        success: "¡Registro exitoso! Bienvenido a nuestro sistema.",
        emailAlreadyUsed: "El correo electrónico ya está en uso.",
      },

      submit: "Registrar",
      login: "¿Ya tienes una cuenta? Haz clic aquí",
    },
    forgotPassword: {
      title: "¿Olvidaste tu contraseña?",
      desc: "Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.",
      back: "Volver al inicio de sesión",
      submit: "Enviar instrucciones",
      emailSent: "Correo enviado con éxito",
      emailSentDescription:
        "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
      fields: {
        email: "Correo electrónico",
        emailPlaceholder: "tucorreo@ejemplo.com",
      },
      errors: {
        "invalid-email": "El correo electrónico no es válido.",
        "invalid-parameters": "Los datos introducidos no son válidos.",
        "user-not-found": "No se encontró un usuario con ese correo.",
        unexpected:
          "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
      },
    },
  },

  dashboard: {
    sidebar: {
      title: "Asterki MiBalance",
      wallets: "Carteras",
      index: "Página de Inicio",
      budgets: "Presupuestos",
      transactions: "Transacciones",
      profile: "Perfil",
      settings: "Configuraciones",
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

    wallets: {
      page: {
        title: "Carteras",
        description:
          "Aquí puedes ver y administrar todas tus cuentas y carteras. Puedes agregar, editar o eliminar cuentas según sea necesario.",
        createWallet: "Crear nueva cartera",
      },

      table: {
        total: "{{range}} de {{total}} billeteras",
        name: "Nombre",
        description: "Descripción",
        balance: "Saldo",
        currency: "Moneda",
        type: "Tipo",
        institution: "Institución",
        color: "Color",
        icon: "Ícono",
        colorIcon: "Color/Ícono",
        primary: "Principal",
        "type.cash": "Efectivo",
        "type.bank": "Banco",
        "type.credit": "Crédito",
        "type.investment": "Inversión",
        "type.other": "Otro",
        isPrimary: "Principal",
        actions: "Acciones",
        deleted: "Eliminado",
        editTooltip: "Editar billetera",
        deleteTooltip: "Eliminar billetera",
      },

      modals: {
        update: {
          title: "Actualizar billetera existente",
          ok: "Actualizar",
          cancel: "Cancelar",
          name: "Nombre",
          description: "Descripción",
          balance: "Saldo inicial",
          currency: "Moneda (código ISO 4217)",
          type: "Tipo de billetera",
          "type.cash": "Efectivo",
          "type.bank": "Banco",
          "type.credit": "Crédito",
          "type.investment": "Inversión",
          "type.other": "Otro",
          institution: "Institución financiera",
          isPrimary: "Billetera principal",
          color: "Color",
          "color-placeholder": "Ejemplo: #FF5733 o rojo",
          icon: "Ícono",
          "icon-placeholder": "Nombre del ícono o URL",

          messages: {
            "name-too-short": "El nombre de la cartera es obligatorio.",
            "name-too-long":
              "El nombre de la cartera no puede exceder los 100 caracteres.",
            "description-too-long":
              "La descripción de la cartera no puede exceder los 500 caracteres.",
            "balance-negative":
              "El saldo inicial no puede ser un valor negativo.",
            "currency-required": "Debe especificar una moneda para la cartera.",
            "currency-invalid-length":
              "El código de moneda debe tener exactamente 3 caracteres según la norma ISO 4217.",
            "type-invalid": "El tipo de cartera especificado no es válido.",
            "type-required": "Debe seleccionar un tipo de cartera.",
            "institution-too-long":
              "El nombre de la institución no puede exceder los 100 caracteres.",
            "color-too-long":
              "El valor del color no puede exceder los 16 caracteres.",
            "icon-too-long":
              "El identificador del icono no puede exceder los 64 caracteres.",
            success: "Cartera actualizada con éxito",
          },
        },

        create: {
          title: "Crear nueva billetera",
          ok: "Crear",
          cancel: "Cancelar",
          name: "Nombre",
          description: "Descripción",
          balance: "Saldo inicial",
          currency: "Moneda (código ISO 4217)",
          type: "Tipo de billetera",
          "type.cash": "Efectivo",
          "type.bank": "Banco",
          "type.credit": "Crédito",
          "type.investment": "Inversión",
          "type.other": "Otro",
          institution: "Institución financiera",
          isPrimary: "Billetera principal",
          color: "Color",
          "color-placeholder": "Ejemplo: #FF5733 o rojo",
          icon: "Ícono",
          "icon-placeholder": "Nombre del ícono o URL",

          messages: {
            "name-too-short": "El nombre de la cartera es obligatorio.",
            "name-too-long":
              "El nombre de la cartera no puede exceder los 100 caracteres.",
            "description-too-long":
              "La descripción de la cartera no puede exceder los 500 caracteres.",
            "balance-negative":
              "El saldo inicial no puede ser un valor negativo.",
            "currency-required": "Debe especificar una moneda para la cartera.",
            "currency-invalid-length":
              "El código de moneda debe tener exactamente 3 caracteres según la norma ISO 4217.",
            "type-invalid": "El tipo de cartera especificado no es válido.",
            "type-required": "Debe seleccionar un tipo de cartera.",
            "institution-too-long":
              "El nombre de la institución no puede exceder los 100 caracteres.",
            "color-too-long":
              "El valor del color no puede exceder los 16 caracteres.",
            "icon-too-long":
              "El identificador del icono no puede exceder los 64 caracteres.",
            success: "Cartera creada con éxito",
          },
        },

        delete: {
          title: "Eliminar billetera",
          ok: "Eliminar",
          cancel: "Cancelar",
          description:
            "¿Estás seguro de que deseas eliminar esta billetera? Esta acción no se puede deshacer.",
          messages: {
            success: "Cartera eliminada con éxito",
            error: "Error al eliminar la cartera",
          },
        },
      },
    },

    budgets: {
      page: {
        title: "Presupuestos",
        description:
          "Aquí puedes ver y administrar todos tus presupuestos. Puedes crear, editar o eliminar presupuestos según sea necesario.",
        createBudget: "Crear nuevo presupuesto",
      },

      table: {
        total: "{{range}} de {{total}} presupuestos",
        name: "Nombre",
        description: "Descripción",
        amount: "Monto",
        currency: "Moneda",
        startDate: "Fecha de inicio",
        endDate: "Fecha de finalización",
        actions: "Acciones",
        editTooltip: "Editar presupuesto",
        deleteTooltip: "Eliminar presupuesto",
      },

      modals: {
        update: {
          title: "Actualizar presupuesto existente",
          ok: "Actualizar",
          cancel: "Cancelar",
          name: "Nombre del presupuesto",
          description: "Descripción del presupuesto",
          amount: "Monto del presupuesto (en la moneda seleccionada)",
          currency: "Moneda (código ISO 4217)",
          startDate: "Fecha de inicio del presupuesto (YYYY-MM-DD)",
          endDate: "Fecha de finalización del presupuesto (YYYY-MM-DD)",

          messages: {
            "name-too-short": "El nombre del presupuesto es obligatorio.",
            "name-too-long":
              "El nombre del presupuesto no puede exceder los 100 caracteres.",
            "description-too-long":
              "La descripción del presupuesto no puede exceder los 500 caracteres.",
            "amount-negative":
              "El monto del presupuesto no puede ser negativo.",
            "currency-required":
              "Debe especificar una moneda para el presupuesto.",
            "currency-invalid-length":
              "El código de moneda debe tener exactamente 3 caracteres según la norma ISO 4217.",
            success: "Presupuesto actualizado con éxito",
          },
        },

        create: {
          title: "Crear nuevo presupuesto",
          ok: "Crear",
          cancel: "Cancelar",
          name: "Nombre del presupuesto",
          description: "Descripción del presupuesto",
          amount: "Monto del presupuesto (en la moneda seleccionada)",
          currency: "Moneda (código ISO 4217)",
          startDate:
            'Fecha de inicio del presupuesto (formato YYYY-MM-DD, por ejemplo, "{{date}}")',
          endDate:
            'Fecha de finalización del presupuesto (formato YYYY-MM-DD, por ejemplo, "{{date}}")',

          messages: {
            "name-too-short": "El nombre del presupuesto es obligatorio.",
            "name-too-long":
              "El nombre del presupuesto no puede exceder los 100 caracteres.",
            "description-too-long":
              "La descripción del presupuesto no puede exceder los 500 caracteres.",
            "amount-negative":
              "El monto del presupuesto no puede ser negativo.",
            "currency-required":
              "Debe especificar una moneda para el presupuesto.",
            "currency-invalid-length":
              "El código de moneda debe tener exactamente 3 caracteres según la norma ISO 4217.",
            success: "Presupuesto creado con éxito",
          },
        },
      },
    },

    transactions: {
      page: {
        title: "Transacciones",
        description:
          "Aquí puedes ver y administrar todas tus transacciones. Puedes agregar, editar o eliminar transacciones según sea necesario.",
        createTransaction: "Crear nueva transacción",
      },

      table: {
        total: "{{range}} de {{total}} transacciones",
        wallet: "Cartera",
        isRecurring: "Recurrente",
        date: "Fecha",
        amount: "Monto",
        currency: "Moneda",
        type: "Tipo",
        recurrence: "Recurrencia",
        category: "Categoría",
        subcategory: "Subcategoría",
        description: "Descripción",
        tags: "Etiquetas",
        actions: "Acciones",
        editTooltip: "Editar transacción",
        deleteTooltip: "Eliminar transacción",
      },

      categories: {
        housing: "🏠 Vivienda",
        transport: "🚗 Transporte",
        health: "🩺 Salud",
        education: "🎓 Educación",
        leisure: "🎮 Ocio",
        savings: "💰 Ahorros",
        utilities: "💡 Servicios",
        income: "💵 Ingresos",
        donations: "🙏 Donaciones",
        subscriptions: "📦 Suscripciones",
        pets: "🐾 Mascotas",
        clothing: "👕 Ropa",
        personal_care: "🧴 Cuidado personal",
        taxes: "📄 Impuestos",
        gifts: "🎁 Regalos",
        business: "🏢 Negocios",
        home_supplies: "🧹 Suministros del hogar",
        childcare: "🧒 Cuidado infantil",
        insurance: "🛡️ Seguro",
        debt: "💳 Deudas",
        events: "📅 Eventos",
        technology: "💻 Tecnología",
        legal: "⚖️ Legal",
        relocation: "📦 Reubicación",
        environment: "🌱 Medio ambiente",
        side_hustles: "🛠️ Trabajos extra",
        investments: "📈 Inversiones",
        repair: "🔧 Reparaciones",
        hospitality: "🏨 Hospitalidad",
        banking: "🏦 Banca",
      },

      subcategories: {
        "banking-account_maintenance": "Mantenimiento de cuenta",
        "banking-atm_withdrawals": "Retiros en cajero",
        "banking-fees": "Comisiones bancarias",
        "banking-interest_charges": "Cargos por intereses",
        "banking-wire_transfers": "Transferencias bancarias",
        "business-consulting": "Consultoría",
        "business-marketing": "Marketing",
        "business-services": "Servicios",
        "business-software": "Software",
        "business-supplies": "Suministros",
        "business-travel": "Viajes de negocios",
        "childcare-activities": "Actividades infantiles",
        "childcare-clothing": "Ropa infantil",
        "childcare-daycare": "Guardería",
        "childcare-school_supplies": "Útiles escolares",
        "childcare-toys": "Juguetes",
        "clothing-accessories": "Accesorios",
        "clothing-apparel": "Ropa",
        "clothing-footwear": "Calzado",
        "clothing-formal_wear": "Ropa formal",
        "clothing-seasonal_clothing": "Ropa de temporada",
        "clothing-tailoring": "Sastrería",
        "debt-credit_card_payments": "Pagos de tarjeta de crédito",
        "debt-debt_consolidation": "Consolidación de deudas",
        "debt-loans": "Préstamos",
        "debt-mortgage_payments": "Pagos hipotecarios",
        "debt-student_loans": "Préstamos estudiantiles",
        "donations-church": "Donaciones a la iglesia",
        "donations-charity": "Caridad",
        "donations-fundraisers": "Recaudaciones de fondos",
        "donations-gifts": "Regalos solidarios",
        "donations-nonprofit_support": "Apoyo a ONG",
        "education-books": "Libros",
        "education-certifications": "Certificaciones",
        "education-courses": "Cursos",
        "education-exam_fees": "Cuotas de exámenes",
        "education-online_learning": "Aprendizaje en línea",
        "education-supplies": "Material escolar",
        "education-tuition": "Matrícula",
        "environment-carbon_offsetting": "Compensación de carbono",
        "environment-donations": "Donaciones ecológicas",
        "environment-recycling_services": "Servicios de reciclaje",
        "environment-sustainable_products": "Productos sostenibles",
        "events-anniversaries": "Aniversarios",
        "events-birthdays": "Cumpleaños",
        "events-conferences": "Conferencias",
        "events-parties": "Fiestas",
        "events-weddings": "Bodas",
        "gifts-birthdays": "Regalos de cumpleaños",
        "gifts-graduations": "Regalos de graduación",
        "gifts-holidays": "Regalos navideños",
        "gifts-weddings": "Regalos de boda",
        "gifts-anniversaries": "Regalos de aniversario",
        "health-dental": "Dentista",
        "health-health_insurance": "Seguro de salud",
        "health-medical": "Gastos médicos",
        "health-medications": "Medicamentos",
        "health-mental_health": "Salud mental",
        "health-therapy": "Terapia",
        "health-vision": "Visión",
        "home_supplies-appliances": "Electrodomésticos",
        "home_supplies-cleaning_supplies": "Artículos de limpieza",
        "home_supplies-decorations": "Decoración",
        "home_supplies-furniture": "Muebles",
        "home_supplies-tools": "Herramientas",
        "hospitality-bars": "Bares",
        "hospitality-cafes": "Cafeterías",
        "hospitality-hotels": "Hoteles",
        "hospitality-restaurants": "Restaurantes",
        "hospitality-tips": "Propinas",
        "income-bonus": "Bonificación",
        "income-freelance": "Trabajo independiente",
        "income-rental_income": "Ingreso por alquiler",
        "income-royalties": "Regalías",
        "income-salary": "Salario",
        "income-side_income": "Ingreso adicional",
        "housing-rent": "Alquiler",
        "housing-mortgage": "Hipoteca",
        "housing-property_tax": "Impuesto predial",
        "housing-home_insurance": "Seguro del hogar",
        "housing-repairs": "Reparaciones del hogar",
        "housing-hoa_fees": "Cuotas de asociación",
        "housing-furnishing": "Amueblado",

        "transport-fuel": "Combustible",
        "transport-public_transport": "Transporte público",
        "transport-car_maintenance": "Mantenimiento del auto",
        "transport-parking": "Estacionamiento",
        "transport-ride_sharing": "Servicios de transporte",
        "transport-vehicle_registration": "Registro vehicular",
        "transport-tolls": "Peajes",

        "leisure-entertainment": "Entretenimiento",
        "leisure-hobbies": "Pasatiempos",
        "leisure-vacation": "Vacaciones",
        "leisure-concerts": "Conciertos",
        "leisure-games": "Juegos",
        "leisure-movies": "Cine",
        "leisure-sports": "Deportes",

        "savings-emergency_fund": "Fondo de emergencia",
        "savings-retirement": "Jubilación",
        "savings-investments": "Inversiones",
        "savings-travel_savings": "Ahorros para viajes",
        "savings-education_savings": "Ahorros educativos",
        "savings-big_purchase_savings": "Ahorros para grandes compras",

        "utilities-electricity": "Electricidad",
        "utilities-water": "Agua",
        "utilities-gas": "Gas",
        "utilities-internet": "Internet",
        "utilities-trash_collection": "Recolección de basura",
        "utilities-phone_plan": "Plan telefónico",
        "utilities-sewage": "Alcantarillado",

        "subscriptions-streaming_services": "Servicios de streaming",
        "subscriptions-magazines": "Revistas",
        "subscriptions-software": "Software",
        "subscriptions-newsletters": "Boletines",
        "subscriptions-cloud_storage": "Almacenamiento en la nube",
        "subscriptions-memberships": "Membresías",

        "pets-food": "Comida para mascotas",
        "pets-veterinary_care": "Cuidado veterinario",
        "pets-grooming": "Peluquería",
        "pets-toys": "Juguetes",
        "pets-adoption_fees": "Cuotas de adopción",
        "pets-insurance": "Seguro para mascotas",

        "personal_care-cosmetics": "Cosméticos",
        "personal_care-haircuts": "Cortes de cabello",
        "personal_care-spa": "Spa",
        "personal_care-massage": "Masaje",
        "personal_care-skincare": "Cuidado de la piel",
        "personal_care-gym_membership": "Membresía de gimnasio",

        "taxes-income_tax": "Impuesto sobre la renta",
        "taxes-property_tax": "Impuesto a la propiedad",
        "taxes-self_employment_tax": "Impuesto de autónomos",
        "taxes-tax_preparation_fees": "Honorarios por declaración",

        "insurance-auto_insurance": "Seguro de auto",
        "insurance-life_insurance": "Seguro de vida",
        "insurance-home_insurance": "Seguro del hogar",
        "insurance-health_insurance": "Seguro de salud",
        "insurance-travel_insurance": "Seguro de viaje",

        "technology-gadgets": "Dispositivos",
        "technology-software": "Software",
        "technology-hardware": "Hardware",
        "technology-repairs": "Reparaciones tecnológicas",
        "technology-subscriptions": "Suscripciones tecnológicas",

        "legal-consultations": "Consultas legales",
        "legal-documents": "Documentos legales",
        "legal-court_fees": "Costas judiciales",
        "legal-legal_retainer": "Honorarios legales",

        "relocation-moving_costs": "Costos de mudanza",
        "relocation-storage": "Almacenamiento",
        "relocation-travel_expenses": "Gastos de traslado",
        "relocation-new_rent_deposit": "Depósito de nuevo alquiler",

        "side_hustles-freelancing_income": "Ingresos de freelance",
        "side_hustles-product_sales": "Ventas de productos",
        "side_hustles-affiliate_income": "Ingresos de afiliados",
        "side_hustles-services_rendered": "Servicios prestados",

        "investments-stocks": "Acciones",
        "investments-bonds": "Bonos",
        "investments-crypto": "Criptomonedas",
        "investments-real_estate": "Bienes raíces",
        "investments-mutual_funds": "Fondos mutuos",

        "repair-home_repair": "Reparación del hogar",
        "repair-car_repair": "Reparación de auto",
        "repair-appliance_repair": "Reparación de electrodomésticos",
        "repair-electronics_repair": "Reparación de electrónicos",
      },

      types: {
        income: "Ingreso",
        expense: "Gasto",
        transfer: "Transferencia",
      },

      recurrence: {
        none: "Ninguno",
        daily: "Diariamente",
        weekly: "Semanalmente",
        biweekly: "Quincenalmente",
        monthly: "Mensualmente",
        quarterly: "Trimestralmente",
        yearly: "Anualmente",
      },

      payment: {
        cash: "Efectivo",
        credit_card: "Tarjeta de crédito",
        debit_card: "Tarjeta de débito",
        bank_transfer: "Transferencia bancaria",
        crypto: "Criptomoneda",
        other: "Otro",
      },

      modals: {
        delete: {
          title: "Eliminar transacción",
          confirm: "Eliminar",
          cancel: "Cancelar",
          confirmation:
            "¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer. Los cambios de saldo en la cartera se revertirán.",
          messages: {
            success: "Transacción eliminada con éxito",
            error: "Error al eliminar la transacción",
          },
        },

        create: {
          confirm: "Crear transacción",
          cancel: "Cancelar",
          title: "Crear nueva transacción",
          sections: {
            basic: "Información básica",
            advanced: "Opciones avanzadas",
            recurrence: "Opciones de recurrencia",
          },
          type: "Tipo de transacción",
          amount: "Monto de la transacción",
          wallet: "Cartera",
          category: "Categoría",
          subcategory: "Subcategoría",
          date: "Fecha de la transacción",
          description: "Descripción de la transacción",
          paymentMethod: "Método de pago",
          tags: "Etiquetas (separadas por comas)",
          notes: "Notas adicionales",
          isRecurring: "¿Esta transacción se repite?",
          recurrence: {
            frequency: "Frecuencia de recurrencia",
            startDate: "Fecha de inicio",
            endDate: "Fecha de finalización",
            interval: "Intervalo (en días)",
            occurrences: "Número de ocurrencias",
          },

          messages: {
            success: "Transacción creada con éxito",
            "invalid-recurrence-frequency":
              "La frecuencia de repetición no es válida.",
            "invalid-end-date": "La fecha de finalización no es válida.",
            "invalid-recurrence-interval":
              "El intervalo de repetición no es válido.",
            "invalid-file-url": "La URL del archivo no es válida.",
            "invalid-file-name": "El nombre del archivo no es válido.",
            "invalid-uploadedAt": "La fecha de subida no es válida.",
            "wallet-id-required": "Debe seleccionar una billetera válida.",
            "invalid-transaction-type": "El tipo de transacción no es válido.",
            "invalid-amount": "El monto ingresado no es válido.",
            "invalid-currency": "El código de moneda no es válido.",
            "invalid-category": "La categoría ingresada no es válida.",
            "invalid-subcategory": "La subcategoría ingresada no es válida.",
            "invalid-date": "La fecha ingresada no es válida.",
            "invalid-description":
              "La descripción excede el límite permitido o es inválida.",
            "invalid-payment-method":
              "El método de pago seleccionado no es válido.",
            "invalid-tag": "La etiqueta ingresada no es válida.",
            "invalid-tags": "Las etiquetas ingresadas no son válidas.",
            "invalid-notes": "Las notas ingresadas no son válidas.",
            "invalid-attachments": "Los archivos adjuntos no son válidos.",
          },
        },
      },
    },

    settings: {
      page: {
        title: "Configuraciones",
        description:
          "Aquí puedes ajustar la configuración de tu cuenta, incluyendo, notificaciones, seguridad y más.",
        updateProfile: "Actualizar perfil",
        changePassword: "Cambiar contraseña",
        deleteAccount: "Eliminar cuenta",
      },

      panels: {
        account: {
          title: "Cuenta",
          actions: {
            "change-password": "Cambiar contraseña",
            "change-email": "Cambiar correo electrónico",
            "enable-tfa": "Habilitar autenticación de dos factores (TFA)",
            "disable-tfa": "Deshabilitar autenticación de dos factores (TFA)",
          },
        },
      },

      modals: {
        "change-email": {
          title: "Cambiar correo electrónico",
          fields: {
            password: "Contraseña actual",
            "new-email": "Nuevo correo electrónico",
          },
          messages: {
            success: "Correo electrónico cambiado con éxito",
            error: "Error al cambiar el correo electrónico",
          },
        },
        "change-password": {
          title: "Cambiar contraseña",
          fields: {
            "current-password": "Contraseña actual",
            "new-password": "Nueva contraseña",
            "confirm-new-password": "Confirmar nueva contraseña",
          },
          messages: {
            success: "Contraseña cambiada con éxito",
            error: "Error al cambiar la contraseña",
            "passwords-not-match": "Las contraseñas no coinciden",
            "current-password-required": "La contraseña actual es obligatoria",
            "new-password-required": "La nueva contraseña es obligatoria",
            "confirm-new-password-required":
              "La confirmación de la nueva contraseña es obligatoria",
          },
        },
        "enable-tfa": {
          title: "Habilitar autenticación de dos factores (TFA)",
          description:
            "Para mejorar la seguridad de tu cuenta, puedes habilitar la autenticación de dos factores. Esto requerirá un código adicional al iniciar sesión.",
          instructions:
            "Escanea el código en pantalla con tu aplicación de autenticación (como Google Authenticator o Authy) y proporciona el código generado.",
          fields: {
            code: "Código de autenticación",
            password: "Contraseña actual",
          },
          messages: {
            success: "Autenticación de dos factores habilitada con éxito",
            "invalid-credentials":
              "La contraseña que proporcionaste no es correcta",
            "invalid-tfa-code":
              "El código de autenticación de dos factores es inválido o ha expirado, por favor intenta nuevamente",
            error: "Error al habilitar la autenticación de dos factores",
          },
        },

        "disable-tfa": {
          title: "Deshabilitar autenticación de dos factores (TFA)",
          description:
            "Si deseas deshabilitar la autenticación de dos factores, proporciona tu contraseña actual y el código de autenticación.",
          fields: {
            code: "Código de autenticación",
            password: "Contraseña actual",
          },
          messages: {
            success: "Autenticación de dos factores deshabilitada con éxito",
            "invalid-credentials":
              "La contraseña que proporcionaste no es correcta",
            "invalid-tfa-code":
              "El código de autenticación de dos factores es inválido o ha expirado, por favor intenta nuevamente",
            error: "Error al deshabilitar la autenticación de dos factores",
          },
        },
      },
    },
  },
};

export default translation;
