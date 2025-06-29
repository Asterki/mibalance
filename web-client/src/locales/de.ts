const translation = {
  "error-messages": {
    "internal-error":
      "Ein interner Fehler ist aufgetreten, bitte versuchen Sie es später erneut.",
    "network-error":
      "Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.",
    "invalid-parameters":
      "Bitte stellen Sie sicher, dass Sie alle erforderlichen Informationen im richtigen Format angegeben haben. Es ist ungewöhnlich, aber falls dies passiert, wenden Sie sich an den technischen Support.",
    unauthorized:
      "Ihre Sitzung ist abgelaufen oder Sie haben keine Berechtigung, auf diese Seite zuzugreifen. Bitte melden Sie sich erneut an.",
    forbidden:
      "Sie haben keine Berechtigung, auf diese Seite zuzugreifen oder diese Aktion durchzuführen.",
    "not-found": "Die angeforderte Ressource wurde nicht gefunden.",
    "invalid-credentials":
      "Die angegebenen Zugangsdaten sind falsch. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort und versuchen Sie es erneut.",
  },

  home: {
    title: "Asterki - MiBalance",
    subtitle:
      "Ihr ultimatives Dashboard zur Verfolgung von Einkommen, Ausgaben und Zielen – online oder offline.",
    cta: {
      login: "Melden Sie sich in Ihrem Konto an",
    },
    quickActions: "Schnell starten",
    login: "Anmelden",
    dashboard: "Dashboard",
    budget: "Budget-Tracker",
    featuresTitle: "Tools, die Ihre Finanzen stärken",
    features: {
      aiAssistant: {
        title: "KI-Assistent",
        desc: "Fragen Sie nach Ausgabentrends oder erstellen Sie Budgetzusammenfassungen in Sekunden.",
      },
      analytics: {
        title: "Visuelle Einblicke",
        desc: "Sehen Sie genau, wohin Ihr Geld fließt, mit schönen Diagrammen und individuellen Berichten.",
      },
      budgeting: {
        title: "Intelligentes Budgetieren",
        desc: "Planen Sie voraus mit kategoriebasierten Budgets und Warnungen bei Überschreitungen.",
      },
      integration: {
        title: "Verbundene Tools",
        desc: "Synchronisieren Sie einfach mit Ihrer Bank, Steuer-Software und Zahlungs-Apps.",
      },
    },
    testimonialsTitle: "Was unsere Nutzer sagen",
    testimonials: [
      {
        text: "„Seit ich MiBalance nutze, habe ich endlich jeden Monat die Kontrolle über mein Geld.“",
        author: "— Carla D., Freiberuflerin",
      },
      {
        text: "„Die Budgetierungsfunktionen haben mir geholfen, in nur zwei Wochen 300 $ zu sparen.“",
        author: "— José R., Student",
      },
    ],
    support: {
      title: "Brauchen Sie Hilfe beim Einstieg?",
      desc: "Besuchen Sie unsere Dokumentation oder wenden Sie sich jederzeit an unser Support-Team.",
      contact: "Support kontaktieren",
      docs: "Dokumentation ansehen",
    },
    rights: "Alle Rechte vorbehalten.",
  },

  errors: {
    offline: {
      subtitle:
        "Es sieht so aus, als wären Sie offline oder der Server ist derzeit nicht verfügbar.",
      retry: "erneut versuchen",
    },
    "404": {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      back: "Zur Startseite zurückkehren",
    },
    "403": {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen.",
      back: "Zur Startseite zurückkehren",
    },
    "500": {
      title: "Schwerer Fehler",
      description:
        "Ein unerwarteter Fehler ist im System aufgetreten. Bitte versuchen Sie es später erneut.",
      back: "Zur Startseite zurückkehren",
    },
  },

  accounts: {
    login: {
      back: "Zurück zur Hauptseite",
      title: "Melden Sie sich bei Ihrem Konto an",
      description:
        "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein, um sich anzumelden",
      fields: {
        email: "E-Mail",
        emailPlaceholder: "E-Mail",
        password: "Passwort",
      },
      submit: "Anmelden",
      forgotPassword: "Passwort vergessen? Hier klicken",
      noAccount: "Noch kein Konto? Hier klicken, um sich zu registrieren",
      tfaModal: {
        title: "Zwei-Faktor-Authentifizierung",
        description:
          "Ihr Konto erfordert eine Zwei-Faktor-Authentifizierung. Bitte geben Sie den von Ihrer Authentifikator-App bereitgestellten Code ein.",
        fields: {
          tfaCode: "Authentifizierungscode",
          tfaCodePlaceholder: "Geben Sie den Authentifizierungscode ein",
        },
        submit: "Code überprüfen",
      },
      messages: {
        success: "Erfolgreich angemeldet",
        "invalid-credentials":
          "Die eingegebene Kombination aus E-Mail und Passwort stimmt mit keinem Konto überein",
        "invalid-password": "Bitte geben Sie ein Passwort ein",
        "invalid-email": "Die eingegebene E-Mail ist ungültig",
        "requires-tfa":
          "Ihr Konto erfordert eine Zwei-Faktor-Authentifizierung. Bitte geben Sie den Authentifizierungscode ein.",
        "invalid-tfa-code":
          "Der Zwei-Faktor-Authentifizierungscode ist ungültig",
        unauthorized: "Nicht autorisiert",
        "internal-error":
          "Ein interner Fehler ist aufgetreten, bitte versuchen Sie es später erneut",
      },
    },
    logout: {
      title: "Abmelden",
      description: "Möchten Sie sich wirklich abmelden?",
      button: "Abmelden",
      cancel: "Abbrechen",
    },
    register: {
      back: "Zurück zur Hauptseite",
      title: "Ein Konto registrieren",
      description:
        "Bitte geben Sie die untenstehenden Informationen zur Anmeldung ein",
      disabled: "Die Registrierung für diese Plattform ist deaktiviert",
      fields: {
        name: "Name",
        namePlaceholder: "John Smith",
        email: "E-Mail",
        emailPlaceholder: "konto@example.com",
        password: "Passwort",
        repeatPassword: "Passwort wiederholen",
      },
      alreadyHaveAccount: "Sie haben bereits ein Konto?",
      loginHere: "Hier anmelden",
      messages: {
        "invalid-email": "Ungültige E-Mail-Adresse.",
        "name-too-short": "Der Name muss mindestens 2 Zeichen lang sein.",
        "name-too-long": "Der Name darf höchstens 34 Zeichen lang sein.",
        "password-too-short":
          "Das Passwort muss mindestens 8 Zeichen lang sein.",
        "password-too-long":
          "Das Passwort darf höchstens 100 Zeichen lang sein.",
        success: "Registrierung erfolgreich! Willkommen in unserem System.",
        emailAlreadyUsed: "Die E-Mail wird bereits verwendet.",
      },
      submit: "Registrieren",
      login: "Sie haben bereits ein Konto? Hier klicken",
    },
    forgotPassword: {
      title: "Passwort vergessen?",
      desc: "Geben Sie Ihre E-Mail ein und wir senden Ihnen Anweisungen zum Zurücksetzen Ihres Passworts.",
      back: "Zurück zur Anmeldung",
      submit: "Anweisungen senden",
      emailSent: "E-Mail erfolgreich gesendet",
      emailSentDescription:
        "Wenn die E-Mail registriert ist, erhalten Sie Anweisungen zum Zurücksetzen Ihres Passworts.",
      fields: {
        email: "E-Mail",
        emailPlaceholder: "ihreemail@example.com",
      },
      errors: {
        "invalid-email": "Die E-Mail ist nicht gültig.",
        "invalid-parameters": "Die angegebenen Daten sind ungültig.",
        "user-not-found": "Kein Benutzer mit dieser E-Mail gefunden.",
        unexpected:
          "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
    },
  },

  dashboard: {
    sidebar: {
      title: "Asterki MiBalance",
      wallets: "Geldbörsen",
      index: "Startseite",
      budgets: "Budgets",
      transactions: "Transaktionen",
      profile: "Profil",
      settings: "Einstellungen",
    },
    greetings: {
      morning: "Guten Morgen",
      afternoon: "Guten Tag",
      evening: "Guten Abend",
      night: "Gute Nacht",
    },
    common: {
      loggedInAs: "Derzeit angemeldet als {{name}} ({{email}})",
      create: "Erstellen",
      search: "Suchen",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      filter: "Filtern",
      min: "Min",
      max: "Max",
      from: "Von",
      to: "Bis",
      reset: "Zurücksetzen",
      view: "Ansehen",
      save: "Speichern",
      close: "Schließen",
      actions: "Aktionen",
      confirm: "Bestätigen",
      loading: "Lädt",
      noResults: "Keine Ergebnisse",
      yes: "Ja",
      no: "Nein",
      on: "Ein",
      off: "Aus",
      loadMore: "Mehr laden",
      description: "Beschreibung",
      name: "Name",
      tags: "Tags",
      actionNecessary: "Aktion erforderlich",
      actionNotNecessary: "Keine Aktion erforderlich",
      actionNotAllowed: "Aktion nicht erlaubt",
      optional: "Optional",
      showCount: "{{count}} pro Seite",
      page: "Seite {{page}}",
    },
    wallets: {
      page: {
        title: "Geldbörsen",
        description:
          "Hier können Sie alle Ihre Konten und Geldbörsen ansehen und verwalten. Sie können Konten nach Bedarf hinzufügen, bearbeiten oder löschen.",
        createWallet: "Neue Geldbörse erstellen",
      },
      table: {
        total: "{{range}} von {{total}} Geldbörsen",
        name: "Name",
        description: "Beschreibung",
        balance: "Kontostand",
        currency: "Währung",
        type: "Typ",
        institution: "Institut",
        color: "Farbe",
        icon: "Icon",
        colorIcon: "Farbe/Icon",
        primary: "Primär",
        "type.cash": "Bargeld",
        "type.bank": "Bank",
        "type.credit": "Kredit",
        "type.investment": "Investition",
        "type.other": "Andere",
        isPrimary: "Primär",
        actions: "Aktionen",
        deleted: "Gelöscht",
        editTooltip: "Geldbörse bearbeiten",
        deleteTooltip: "Geldbörse löschen",
      },
      modals: {
        update: {
          title: "Bestehende Geldbörse aktualisieren",
          ok: "Aktualisieren",
          cancel: "Abbrechen",
          name: "Name",
          description: "Beschreibung",
          balance: "Anfangssaldo",
          currency: "Währung (ISO 4217-Code)",
          type: "Geldbörsentyp",
          "type.cash": "Bargeld",
          "type.bank": "Bank",
          "type.credit": "Kredit",
          "type.investment": "Investition",
          "type.other": "Andere",
          institution: "Finanzinstitut",
          isPrimary: "Primäre Geldbörse",
          color: "Farbe",
          "color-placeholder": "Beispiel: #FF5733 oder rot",
          icon: "Icon",
          "icon-placeholder": "Icon-Name oder URL",
          messages: {
            "name-too-short": "Der Name der Geldbörse ist erforderlich.",
            "name-too-long":
              "Der Name der Geldbörse darf 100 Zeichen nicht überschreiten.",
            "description-too-long":
              "Die Beschreibung der Geldbörse darf 500 Zeichen nicht überschreiten.",
            "balance-negative":
              "Der Anfangssaldo darf keinen negativen Wert haben.",
            "currency-required":
              "Sie müssen eine Währung für die Geldbörse angeben.",
            "currency-invalid-length":
              "Der Währungscode muss gemäß ISO 4217 genau 3 Zeichen lang sein.",
            "type-invalid": "Der angegebene Geldbörsentyp ist ungültig.",
            "type-required": "Sie müssen einen Geldbörsentyp auswählen.",
            "institution-too-long":
              "Der Name des Instituts darf 100 Zeichen nicht überschreiten.",
            "color-too-long":
              "Der Farbwert darf 16 Zeichen nicht überschreiten.",
            "icon-too-long":
              "Der Icon-Bezeichner darf 64 Zeichen nicht überschreiten.",
            success: "Geldbörse erfolgreich aktualisiert",
          },
        },
        create: {
          title: "Neue Geldbörse erstellen",
          ok: "Erstellen",
          cancel: "Abbrechen",
          name: "Name",
          description: "Beschreibung",
          balance: "Anfangssaldo",
          currency: "Währung (ISO 4217-Code)",
          type: "Geldbörsentyp",
          "type.cash": "Bargeld",
          "type.bank": "Bank",
          "type.credit": "Kredit",
          "type.investment": "Investition",
          "type.other": "Andere",
          institution: "Finanzinstitut",
          isPrimary: "Primäre Geldbörse",
          color: "Farbe",
          "color-placeholder": "Beispiel: #FF5733 oder rot",
          icon: "Icon",
          "icon-placeholder": "Icon-Name oder URL",
          messages: {
            "name-too-short": "Der Name der Geldbörse ist erforderlich.",
            "name-too-long":
              "Der Name der Geldbörse darf 100 Zeichen nicht überschreiten.",
            "description-too-long":
              "Die Beschreibung der Geldbörse darf 500 Zeichen nicht überschreiten.",
            "balance-negative":
              "Der Anfangssaldo darf keinen negativen Wert haben.",
            "currency-required":
              "Sie müssen eine Währung für die Geldbörse angeben.",
            "currency-invalid-length":
              "Der Währungscode muss gemäß ISO 4217 genau 3 Zeichen lang sein.",
            "type-invalid": "Der angegebene Geldbörsentyp ist ungültig.",
            "type-required": "Sie müssen einen Geldbörsentyp auswählen.",
            "institution-too-long":
              "Der Name des Instituts darf 100 Zeichen nicht überschreiten.",
            "color-too-long":
              "Der Farbwert darf 16 Zeichen nicht überschreiten.",
            "icon-too-long":
              "Der Icon-Bezeichner darf 64 Zeichen nicht überschreiten.",
            success: "Geldbörse erfolgreich erstellt",
          },
        },
        delete: {
          title: "Geldbörse löschen",
          ok: "Löschen",
          cancel: "Abbrechen",
          description:
            "Sind Sie sicher, dass Sie diese Geldbörse löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
          messages: {
            success: "Geldbörse erfolgreich gelöscht",
            error: "Fehler beim Löschen der Geldbörse",
          },
        },
      },
    },

    budgets: {
      page: {
        title: "Budgets",
        description:
          "Hier können Sie alle Ihre Budgets ansehen und verwalten. Sie können Budgets nach Bedarf erstellen, bearbeiten oder löschen.",
        createBudget: "Neues Budget erstellen",
      },
      table: {
        total: "{{range}} von {{total}} Budgets",
        name: "Name",
        description: "Beschreibung",
        amount: "Betrag",
        currency: "Währung",
        startDate: "Startdatum",
        endDate: "Enddatum",
        actions: "Aktionen",
        editTooltip: "Budget bearbeiten",
        deleteTooltip: "Budget löschen",
      },
      modals: {
        update: {
          title: "Bestehendes Budget aktualisieren",
          ok: "Aktualisieren",
          cancel: "Abbrechen",
          name: "Budgetname",
          description: "Budgetbeschreibung",
          amount: "Budgetbetrag (in der gewählten Währung)",
          currency: "Währung (ISO 4217-Code)",
          startDate: "Budget-Startdatum (JJJJ-MM-TT)",
          endDate: "Budget-Enddatum (JJJJ-MM-TT)",
          messages: {
            "name-too-short": "Budgetname ist erforderlich.",
            "name-too-long": "Budgetname darf 100 Zeichen nicht überschreiten.",
            "description-too-long":
              "Budgetbeschreibung darf 500 Zeichen nicht überschreiten.",
            "amount-negative": "Budgetbetrag darf nicht negativ sein.",
            "currency-required":
              "Sie müssen eine Währung für das Budget angeben.",
            "currency-invalid-length":
              "Der Währungscode muss genau 3 Zeichen lang sein, gemäß ISO 4217.",
            success: "Budget erfolgreich aktualisiert",
          },
        },
        create: {
          title: "Neues Budget erstellen",
          ok: "Erstellen",
          cancel: "Abbrechen",
          name: "Budgetname",
          description: "Budgetbeschreibung",
          amount: "Budgetbetrag (in der gewählten Währung)",
          currency: "Währung (ISO 4217-Code)",
          startDate: 'Budget-Startdatum (Format JJJJ-MM-TT, z.B. "{{date}}")',
          endDate: 'Budget-Enddatum (Format JJJJ-MM-TT, z.B. "{{date}}")',
          messages: {
            "name-too-short": "Budgetname ist erforderlich.",
            "name-too-long": "Budgetname darf 100 Zeichen nicht überschreiten.",
            "description-too-long":
              "Budgetbeschreibung darf 500 Zeichen nicht überschreiten.",
            "amount-negative": "Budgetbetrag darf nicht negativ sein.",
            "currency-required":
              "Sie müssen eine Währung für das Budget angeben.",
            "currency-invalid-length":
              "Der Währungscode muss genau 3 Zeichen lang sein, gemäß ISO 4217.",
            success: "Budget erfolgreich erstellt",
          },
        },
      },
    },

    transactions: {
      page: {
        title: "Transaktionen",
        description:
          "Hier können Sie alle Ihre Transaktionen ansehen und verwalten. Sie können Transaktionen nach Bedarf hinzufügen, bearbeiten oder löschen.",
        createTransaction: "Neue Transaktion erstellen",
      },
      table: {
        total: "{{range}} von {{total}} Transaktionen",
        wallet: "Wallet",
        isRecurring: "Wiederkehrend",
        date: "Datum",
        amount: "Betrag",
        currency: "Währung",
        type: "Typ",
        recurrence: "Wiederholung",
        category: "Kategorie",
        subcategory: "Unterkategorie",
        description: "Beschreibung",
        tags: "Tags",
        actions: "Aktionen",
        editTooltip: "Transaktion bearbeiten",
        deleteTooltip: "Transaktion löschen",
      },
      categories: {
        housing: "🏠 Wohnen",
        transport: "🚗 Transport",
        health: "🩺 Gesundheit",
        education: "🎓 Bildung",
        leisure: "🎮 Freizeit",
        savings: "💰 Ersparnisse",
        utilities: "💡 Versorgungsleistungen",
        income: "💵 Einkommen",
        donations: "🙏 Spenden",
        subscriptions: "📦 Abonnements",
        pets: "🐾 Haustiere",
        clothing: "👕 Kleidung",
        personal_care: "🧴 Körperpflege",
        taxes: "📄 Steuern",
        gifts: "🎁 Geschenke",
        business: "🏢 Geschäft",
        home_supplies: "🧹 Haushaltswaren",
        childcare: "🧒 Kinderbetreuung",
        insurance: "🛡️ Versicherung",
        debt: "💳 Schulden",
        events: "📅 Veranstaltungen",
        technology: "💻 Technologie",
        legal: "⚖️ Rechtliches",
        relocation: "📦 Umzug",
        environment: "🌱 Umwelt",
        side_hustles: "🛠️ Nebenjobs",
        investments: "📈 Investitionen",
        repair: "🔧 Reparaturen",
        hospitality: "🏨 Gastgewerbe",
        banking: "🏦 Bankwesen",
      },

      subcategories: {
        "banking-account_maintenance": "Kontopflege",
        "banking-atm_withdrawals": "Geldautomaten-Abhebungen",
        "banking-fees": "Bankgebühren",
        "banking-interest_charges": "Zinskosten",
        "banking-wire_transfers": "Überweisungen",
        "business-consulting": "Beratung",
        "business-marketing": "Marketing",
        "business-services": "Dienstleistungen",
        "business-software": "Software",
        "business-supplies": "Bürobedarf",
        "business-travel": "Geschäftsreisen",
        "childcare-activities": "Kinderaktivitäten",
        "childcare-clothing": "Kinderkleidung",
        "childcare-daycare": "Kindertagesstätte",
        "childcare-school_supplies": "Schulmaterial",
        "childcare-toys": "Spielzeug",
        "clothing-accessories": "Accessoires",
        "clothing-apparel": "Kleidung",
        "clothing-footwear": "Schuhe",
        "clothing-formal_wear": "Festliche Kleidung",
        "clothing-seasonal_clothing": "Saisonale Kleidung",
        "clothing-tailoring": "Schneiderei",
        "debt-credit_card_payments": "Kreditkartenzahlungen",
        "debt-debt_consolidation": "Schuldenkonsolidierung",
        "debt-loans": "Kredite",
        "debt-mortgage_payments": "Hypothekenzahlungen",
        "debt-student_loans": "Studentendarlehen",
        "donations-church": "Kirchenspenden",
        "donations-charity": "Wohltätigkeit",
        "donations-fundraisers": "Spendenaktionen",
        "donations-gifts": "Wohltätige Geschenke",
        "donations-nonprofit_support":
          "Unterstützung gemeinnütziger Organisationen",
        "education-books": "Bücher",
        "education-certifications": "Zertifikate",
        "education-courses": "Kurse",
        "education-exam_fees": "Prüfungsgebühren",
        "education-online_learning": "Online-Lernen",
        "education-supplies": "Schulmaterial",
        "education-tuition": "Studiengebühren",
        "environment-carbon_offsetting": "CO2-Kompensation",
        "environment-donations": "Umweltspenden",
        "environment-recycling_services": "Recyclingdienste",
        "environment-sustainable_products": "Nachhaltige Produkte",
        "events-anniversaries": "Jahrestage",
        "events-birthdays": "Geburtstage",
        "events-conferences": "Konferenzen",
        "events-parties": "Partys",
        "events-weddings": "Hochzeiten",
        "gifts-birthdays": "Geburtstagsgeschenke",
        "gifts-graduations": "Abschlussgeschenke",
        "gifts-holidays": "Urlaubsgeschenke",
        "gifts-weddings": "Hochzeitsgeschenke",
        "gifts-anniversaries": "Jubiläumsgeschenke",
        "health-dental": "Zahnarzt",
        "health-health_insurance": "Krankenversicherung",
        "health-medical": "Medizinische Ausgaben",
        "health-medications": "Medikamente",
        "health-mental_health": "Psychische Gesundheit",
        "health-therapy": "Therapie",
        "health-vision": "Sehhilfe",
        "home_supplies-appliances": "Geräte",
        "home_supplies-cleaning_supplies": "Reinigungsmittel",
        "home_supplies-decorations": "Dekorationen",
        "home_supplies-furniture": "Möbel",
        "home_supplies-tools": "Werkzeuge",
        "hospitality-bars": "Bars",
        "hospitality-cafes": "Cafés",
        "hospitality-hotels": "Hotels",
        "hospitality-restaurants": "Restaurants",
        "hospitality-tips": "Trinkgelder",
        "income-bonus": "Bonus",
        "income-freelance": "Freiberufliche Arbeit",
        "income-rental_income": "Mieteinnahmen",
        "income-royalties": "Lizenzgebühren",
        "income-salary": "Gehalt",
        "income-side_income": "Nebeneinkünfte",
        "housing-rent": "Miete",
        "housing-mortgage": "Hypothek",
        "housing-property_tax": "Grundsteuer",
        "housing-home_insurance": "Hausversicherung",
        "housing-repairs": "Hausreparaturen",
        "housing-hoa_fees": "Hausverwaltungsgebühren",
        "housing-furnishing": "Ausstattung",
        "transport-fuel": "Kraftstoff",
        "transport-public_transport": "Öffentlicher Verkehr",
        "transport-car_maintenance": "Autopflege",
        "transport-parking": "Parkgebühren",
        "transport-ride_sharing": "Fahrgemeinschaft",
        "transport-vehicle_registration": "Fahrzeugzulassung",
        "transport-tolls": "Mautgebühren",
        "leisure-entertainment": "Unterhaltung",
        "leisure-hobbies": "Hobbys",
        "leisure-vacation": "Urlaub",
        "leisure-concerts": "Konzerte",
        "leisure-games": "Spiele",
        "leisure-movies": "Filme",
        "leisure-sports": "Sport",
        "savings-emergency_fund": "Notfallfonds",
        "savings-retirement": "Rente",
        "savings-investments": "Investitionen",
        "savings-travel_savings": "Reisesparen",
        "savings-education_savings": "Bildungssparen",
        "savings-big_purchase_savings": "Sparen für größere Anschaffungen",
        "utilities-electricity": "Strom",
        "utilities-water": "Wasser",
        "utilities-gas": "Gas",
        "utilities-internet": "Internet",
        "utilities-trash_collection": "Müllabfuhr",
        "utilities-phone_plan": "Telefonvertrag",
        "utilities-sewage": "Abwasser",
        "subscriptions-streaming_services": "Streaming-Dienste",
        "subscriptions-magazines": "Magazine",
        "subscriptions-software": "Software",
        "subscriptions-newsletters": "Newsletter",
        "subscriptions-cloud_storage": "Cloud-Speicher",
        "subscriptions-memberships": "Mitgliedschaften",
        "pets-food": "Tierfutter",
        "pets-veterinary_care": "Tierarztkosten",
        "pets-grooming": "Pflege",
        "pets-toys": "Spielzeug",
        "pets-adoption_fees": "Adoptionsgebühren",
        "pets-insurance": "Tierkrankenversicherung",
        "personal_care-cosmetics": "Kosmetik",
        "personal_care-haircuts": "Haarschnitte",
        "personal_care-spa": "Spa",
        "personal_care-massage": "Massage",
        "personal_care-skincare": "Hautpflege",
        "personal_care-gym_membership": "Fitnessstudio",
        "taxes-income_tax": "Einkommensteuer",
        "taxes-property_tax": "Grundsteuer",
        "taxes-self_employment_tax": "Selbständigensteuer",
        "taxes-tax_preparation_fees": "Steuerberatungskosten",
        "insurance-auto_insurance": "Autoversicherung",
        "insurance-life_insurance": "Lebensversicherung",
        "insurance-home_insurance": "Hausversicherung",
        "insurance-health_insurance": "Krankenversicherung",
        "insurance-travel_insurance": "Reiseversicherung",
        "technology-gadgets": "Gadgets",
        "technology-software": "Software",
        "technology-hardware": "Hardware",
        "technology-repairs": "Technikreparaturen",
        "technology-subscriptions": "Technik-Abos",
        "legal-consultations": "Rechtsberatung",
        "legal-documents": "Rechtsdokumente",
        "legal-court_fees": "Gerichtskosten",
        "legal-legal_retainer": "Rechtsbeistand",
        "relocation-moving_costs": "Umzugskosten",
        "relocation-storage": "Lagerung",
        "relocation-travel_expenses": "Reisekosten beim Umzug",
        "relocation-new_rent_deposit": "Neue Mietkaution",
        "side_hustles-freelancing_income": "Freiberufliche Einkünfte",
        "side_hustles-product_sales": "Produktverkäufe",
        "side_hustles-affiliate_income": "Affiliate-Einnahmen",
        "side_hustles-services_rendered": "Erbrachte Dienstleistungen",
        "investments-stocks": "Aktien",
        "investments-bonds": "Anleihen",
        "investments-crypto": "Kryptowährung",
        "investments-real_estate": "Immobilien",
        "investments-mutual_funds": "Investmentfonds",
        "repair-home_repair": "Hausreparatur",
        "repair-car_repair": "Autoreparatur",
        "repair-appliance_repair": "Gerätereparatur",
        "repair-electronics_repair": "Elektronikreparatur",
      },

      types: {
        income: "Einnahmen",
        expense: "Ausgaben",
        transfer: "Überweisung",
      },
      recurrence: {
        none: "Keine",
        daily: "Täglich",
        weekly: "Wöchentlich",
        biweekly: "Alle zwei Wochen",
        monthly: "Monatlich",
        quarterly: "Vierteljährlich",
        yearly: "Jährlich",
      },
      payment: {
        cash: "Bar",
        credit_card: "Kreditkarte",
        debit_card: "Debitkarte",
        bank_transfer: "Banküberweisung",
        crypto: "Kryptowährung",
        other: "Andere",
      },
      modals: {
        delete: {
          title: "Transaktion löschen",
          confirm: "Löschen",
          cancel: "Abbrechen",
          confirmation:
            "Möchten Sie diese Transaktion wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden. Änderungen am Kontostand werden zurückgesetzt.",
          messages: {
            success: "Transaktion erfolgreich gelöscht",
            error: "Fehler beim Löschen der Transaktion",
          },
        },
        create: {
          confirm: "Transaktion erstellen",
          cancel: "Abbrechen",
          title: "Neue Transaktion erstellen",
          sections: {
            basic: "Basisinformationen",
            advanced: "Erweiterte Optionen",
            recurrence: "Wiederholungsoptionen",
          },
          type: "Transaktionstyp",
          amount: "Betrag",
          wallet: "Wallet",
          category: "Kategorie",
          subcategory: "Unterkategorie",
          date: "Datum",
          description: "Beschreibung",
          paymentMethod: "Zahlungsmethode",
          tags: "Tags (kommagetrennt)",
          notes: "Zusätzliche Notizen",
          isRecurring: "Ist diese Transaktion wiederkehrend?",
          recurrence: {
            frequency: "Wiederholungsfrequenz",
            startDate: "Startdatum",
            endDate: "Enddatum",
            interval: "Intervall (in Tagen)",
            occurrences: "Anzahl der Wiederholungen",
          },
          messages: {
            success: "Transaktion erfolgreich erstellt",
            "invalid-recurrence-frequency": "Ungültige Wiederholungsfrequenz.",
            "invalid-end-date": "Ungültiges Enddatum.",
            "invalid-recurrence-interval": "Ungültiges Wiederholungsintervall.",
            "invalid-file-url": "Ungültige Dateiadresse.",
            "invalid-file-name": "Ungültiger Dateiname.",
            "invalid-uploadedAt": "Ungültiges Hochladedatum.",
            "wallet-id-required": "Sie müssen ein gültiges Wallet auswählen.",
            "invalid-transaction-type": "Ungültiger Transaktionstyp.",
            "invalid-amount": "Ungültiger Betrag.",
            "invalid-currency": "Ungültiger Währungscode.",
            "invalid-category": "Ungültige Kategorie.",
            "invalid-subcategory": "Ungültige Unterkategorie.",
            "invalid-date": "Ungültiges Datum.",
            "invalid-description": "Beschreibung ist zu lang oder ungültig.",
            "invalid-payment-method": "Ungültige Zahlungsmethode.",
            "invalid-tag": "Ungültiges Tag.",
            "invalid-tags": "Ungültige Tags.",
            "invalid-notes": "Ungültige Notizen.",
            "invalid-attachments": "Ungültige Anhänge.",
          },
        },
      },
    },

    settings: {
      page: {
        title: "Einstellungen",
        description:
          "Hier kannst du deine Kontoeinstellungen anpassen, einschließlich Benachrichtigungen, Sicherheit und mehr.",
        updateProfile: "Profil aktualisieren",
        changePassword: "Passwort ändern",
        deleteAccount: "Konto löschen",
      },
      panels: {
        account: {
          title: "Konto",
          actions: {
            "change-name": "Namen ändern",
            "change-password": "Passwort ändern",
            "change-email": "E-Mail ändern",
            "enable-tfa": "Zwei-Faktor-Authentifizierung (2FA) aktivieren",
            "disable-tfa": "Zwei-Faktor-Authentifizierung (2FA) deaktivieren",
          },
        },
        preferences: {
          title: "Einstellungen",
          description: "Verwalte deine Sprach- und Designpräferenzen.",
          fields: {
            theme: "Design",
            language: "Sprache",
            notificationsLabel: "Benachrichtigungen",
            notifications: {
              options: {
                "new-logins": "Neue Anmeldungen",
                "password-changes": "Passwortänderungen",
                "wallet-updates": "Wallet-Aktualisierungen",
                "account-status-changes": "Kontostatusänderungen",
                "email-changes": "E-Mail-Änderungen",
                "profile-changes": "Profiländerungen",
                "security-alerts": "Sicherheitswarnungen",
                "general-updates": "Allgemeine Updates",
                marketing: "Marketing-Mitteilungen",
              },
            },
          },
          options: {
            light: "Hell",
            dark: "Dunkel",
            en: "Englisch 🇺🇸",
            es: "Spanisch 🇪🇸",
            fr: "Französisch 🇫🇷",
            de: "Deutsch 🇩🇪",
            zh: "Chinesisch 🇨🇳",
            ja: "Japanisch 🇯🇵",
            ru: "Russisch 🇷🇺",
            ar: "Arabisch 🇸🇦",
            pt: "Portugiesisch 🇵🇹",
            it: "Italienisch 🇮🇹",
            hi: "Hindi 🇮🇳",
            ko: "Koreanisch 🇰🇷",
          },
          messages: {
            success: "Einstellungen erfolgreich aktualisiert",
            error: "Fehler beim Aktualisieren der Einstellungen",
          },
        },
      },
      modals: {
        "change-name": {
          title: "Namen ändern",
          fields: {
            "new-name": "Neuer Name",
          },
          messages: {
            success: "Name erfolgreich geändert",
            error: "Fehler beim Ändern des Namens",
            "name-too-short": "Name muss mindestens 2 Zeichen lang sein",
            "name-too-long": "Name darf nicht länger als 100 Zeichen sein",
          },
        },
        "change-email": {
          title: "E-Mail ändern",
          fields: {
            password: "Aktuelles Passwort",
            "new-email": "Neue E-Mail",
          },
          messages: {
            success: "E-Mail erfolgreich geändert",
            error: "Fehler beim Ändern der E-Mail",
            "invalid-email": "Neue E-Mail ist ungültig",
            "email-already-used": "Neue E-Mail ist bereits vergeben",
            "password-required": "Aktuelles Passwort ist erforderlich",
            "invalid-credentials": "Ungültige Zugangsdaten",
            "new-email-required": "Neue E-Mail ist erforderlich",
          },
        },
        "change-password": {
          title: "Passwort ändern",
          fields: {
            "current-password": "Aktuelles Passwort",
            "new-password": "Neues Passwort",
            "confirm-new-password": "Neues Passwort bestätigen",
          },
          messages: {
            success: "Passwort erfolgreich geändert",
            error: "Fehler beim Ändern des Passworts",
            "passwords-not-match": "Passwörter stimmen nicht überein",
            "current-password-required": "Aktuelles Passwort ist erforderlich",
            "new-password-required":
              "Neues Passwort muss mindestens 8 Zeichen lang sein",
            "new-password-max-length":
              "Neues Passwort darf nicht länger als 100 Zeichen sein",
            "confirm-new-password-required":
              "Bestätigung des neuen Passworts ist erforderlich",
            "confirm-new-password-max-length":
              "Bestätigung darf nicht länger als 100 Zeichen sein",
            "passwords-do-not-match":
              "Passwörter stimmen nicht überein, bitte überprüfe deine Eingabe",
          },
        },
        "enable-tfa": {
          title: "Zwei-Faktor-Authentifizierung (2FA) aktivieren",
          description:
            "Zur Verbesserung der Kontosicherheit kannst du die Zwei-Faktor-Authentifizierung aktivieren. Beim Einloggen wird dann ein zusätzlicher Code verlangt.",
          instructions:
            "Scanne den angezeigten Code mit deiner Authentifikator-App (z.B. Google Authenticator oder Authy) und gib den generierten Code ein.",
          fields: {
            code: "Authentifizierungscode",
            password: "Aktuelles Passwort",
          },
          messages: {
            success: "Zwei-Faktor-Authentifizierung erfolgreich aktiviert",
            "password-required":
              "Aktuelles Passwort wird zum Aktivieren der 2FA benötigt",
            "tfa-code-required": "Authentifizierungscode ist erforderlich",
            "invalid-credentials": "Das eingegebene Passwort ist falsch",
            "invalid-tfa-code":
              "Der Authentifizierungscode ist ungültig oder abgelaufen, bitte versuche es erneut",
            error: "Fehler beim Aktivieren der Zwei-Faktor-Authentifizierung",
          },
        },
        "disable-tfa": {
          title: "Zwei-Faktor-Authentifizierung (2FA) deaktivieren",
          description:
            "Um die Zwei-Faktor-Authentifizierung zu deaktivieren, gib dein aktuelles Passwort und den Authentifizierungscode ein.",
          fields: {
            code: "Authentifizierungscode",
            password: "Aktuelles Passwort",
          },
          messages: {
            success: "Zwei-Faktor-Authentifizierung erfolgreich deaktiviert",
            "invalid-credentials": "Das eingegebene Passwort ist falsch",
            "invalid-tfa-code":
              "Der Authentifizierungscode ist ungültig oder abgelaufen, bitte versuche es erneut",
            error: "Fehler beim Deaktivieren der Zwei-Faktor-Authentifizierung",
          },
        },
      },
    },
  },
};

export default translation;
