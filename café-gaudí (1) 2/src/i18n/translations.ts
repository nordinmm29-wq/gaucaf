import { Language } from './LanguageContext';

export interface TranslationDict {
  nav: {
    home: string;
    menu: string;
    reservations: string;
    gallery: string;
    reviews: string;
    location: string;
    bookTable: string;
    callUs: string;
    openToday: string;
    orderTray: string;
    admin: string;
    openMenu: string;
    language: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlinePart2: string;
    subtitle: string;
    btnMenu: string;
    btnReserve: string;
    btnMap: string;
    burgersTitle: string;
    burgersDesc: string;
    coffeeTitle: string;
    coffeeDesc: string;
    terraceTitle: string;
    terraceDesc: string;
    artisanalTitle: string;
    artisanalDesc: string;
  };
  menu: {
    badge: string;
    title: string;
    subtitle: string;
    downloadPdf: string;
    downloadPdfGenerating: string;
    downloadFullPdf: string;
    downloading: string;
    downloadSectionPdf: string;
    downloadSectionPdfShort: string;
    pageSelectorTitle: string;
    pageIndicator: string;
    searchPlaceholder: string;
    filterAll: string;
    filterSpecial: string;
    filterVegetarian: string;
    filterVeg: string;
    filterVegan: string;
    filterGlutenFree: string;
    filterNew: string;
    filterBy: string;
    sectionsTitle: string;
    sectionsCount: string;
    activeSection: string;
    pdfSection: string;
    prev: string;
    next: string;
    noDishesFound: string;
    noDishesDesc: string;
    resetFilters: string;
    new: string;
    speciality: string;
    format: string;
    wineNose: string;
    wineMouth: string;
    winePairing: string;
    supplementsTitle: string;
    supplementsSubtitle: string;
    supplementsTable: string;
    languageSelectorTitle: string;
    viewAllSectionsMobile: string;
    closeSectionsModal: string;
    orderNow: string;
    addToOrder: string;
    itemUnavailable: string;
    soldOut: string;
    allergensBtn: string;
    allergensGuide: string;
    allergensTitle: string;
    allergensSubtitle: string;
    allergensNotice: string;
    understood: string;
    orderDrawerTitle: string;
    orderDrawerEmpty: string;
    orderDrawerEmptyHelp: string;
    tableNumberLabel: string;
    tableNumberPlaceholder: string;
    sendWhatsAppBtn: string;
    clearOrderBtn: string;
    totalAmount: string;
    glass: string;
    bottle: string;
    pairing: string;
    aroma: string;
    taste: string;
    pages: {
      p1Tab: string;
      p1Title: string;
      p1Desc: string;
      p2Tab: string;
      p2Title: string;
      p2Desc: string;
      p3Tab: string;
      p3Title: string;
      p3Desc: string;
      p4Tab: string;
      p4Title: string;
      p4Desc: string;
      p5Tab: string;
      p5Title: string;
      p5Desc: string;
      p6Tab: string;
      p6Title: string;
      p6Desc: string;
      p7Tab: string;
      p7Title: string;
      p7Desc: string;
      p8Tab: string;
      p8Title: string;
      p8Desc: string;
    };
    sections: Record<string, { title: string; subtitle: string }>;
  };
  reservation: {
    badge: string;
    title: string;
    subtitle: string;
    tabNew: string;
    tabCheck: string;
    dateLabel: string;
    quickToday: string;
    quickTomorrow: string;
    quickWeekend: string;
    serviceLabel: string;
    serviceBrunch: string;
    serviceLunch: string;
    serviceAfternoon: string;
    serviceDinner: string;
    earlyCloseNotice: string;
    scheduleBannerEarly: string;
    scheduleBannerRegular: string;
    timeLabel: string;
    guestsLabel: string;
    guestSingular: string;
    guestPlural: string;
    zoneLabel: string;
    zoneTerrace: string;
    zoneSalon: string;
    zoneTerraceDesc: string;
    zoneSalonDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successSubtitle: string;
    codeLabel: string;
    detailsLabel: string;
    statusConfirmed: string;
    shareWhatsApp: string;
    downloadPass: string;
    previewEmail: string;
    newBookingBtn: string;
    myBookingsTitle: string;
    myBookingsEmpty: string;
    myBookingsHelp: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    catAll: string;
    catGoogle: string;
    catBurgers: string;
    catCoffee: string;
    catAtmosphere: string;
    btnCarousel: string;
    btnGrid: string;
    btnPause: string;
    btnAuto: string;
    openGoogleMaps: string;
    photoCounter: string;
    verifiedGoogle: string;
    source: string;
  };
  reviews: {
    badge: string;
    title: string;
    subtitle: string;
    ratingScore: string;
    ratingOutOf: string;
    totalReviewsText: string;
    verifiedGoogle: string;
    viewAllOnGoogle: string;
    writeReview: string;
    filterAll: string;
    filterCoffee: string;
    filterBurgers: string;
    filterTapas: string;
    filterSweets: string;
    filterService: string;
    localGuide: string;
    reviewsCount: string;
    responseFromOwner: string;
    dishesRecommended: string;
    satisfactionRate: string;
    satisfactionSub: string;
    searchPlaceholder: string;
  };
  location: {
    badge: string;
    title: string;
    subtitle: string;
    googleBadge: string;
    streetView: string;
    streetViewTitle: string;
    verifiedListing: string;
    startGps: string;
    openInGoogleMaps: string;
    openInAppleMaps: string;
    recenterMap: string;
    addressTitle: string;
    addressLine1: string;
    addressLine2: string;
    scheduleTitle: string;
    scheduleTueSat: string;
    scheduleTueSatHours: string;
    scheduleSunMon: string;
    scheduleSunMonHours: string;
    phoneTitle: string;
    emailTitle: string;
    howToArriveTitle: string;
    trainTitle: string;
    trainWalkingTime: string;
    trainDesc: string;
    carTitle: string;
    carDesc: string;
    busTitle: string;
    busDesc: string;
    viewSatellite: string;
    viewMap: string;
    viewStylized: string;
    openGoogleMaps: string;
    copyAddress: string;
    copied: string;
    scheduleCardBadge: string;
    scheduleCardType: string;
    scheduleCardTitle: string;
    scheduleTueSatDays: string;
    scheduleTueSatTime: string;
    scheduleTueSatNote: string;
    scheduleTueSatClose: string;
    scheduleSunMonDays: string;
    scheduleSunMonTime: string;
    scheduleSunMonNote: string;
    scheduleSunMonClose: string;
    whatsappDirect: string;
  };
  footer: {
    brandSubtitle: string;
    description: string;
    navTitle: string;
    navigation: string;
    contactTitle: string;
    hoursTitle: string;
    schedule: string;
    scheduleWeek: string;
    scheduleWeekend: string;
    qualityTitle: string;
    qualityDesc: string;
    qualityBadge: string;
    rights: string;
    craftedWith: string;
    adminPanel: string;
  };
  allergens: Record<
    string,
    {
      name: string;
      desc: string;
    }
  >;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menú Digital',
      reservations: 'Reservas',
      gallery: 'Galería',
      reviews: 'Reseñas',
      location: 'Ubicación & Mapa',
      bookTable: 'Reservar Mesa',
      callUs: 'Llamar al restaurante',
      openToday: 'Abierto hoy',
      orderTray: 'Comanda',
      admin: 'Admin',
      openMenu: 'Abrir menú',
      language: 'Idioma',
    },
    hero: {
      badge: 'Carrer Germans Thos i Codina, 20 • Mataró',
      headlinePart1: 'El sabor del Maresme en',
      headlinePart2: 'cada detalle',
      subtitle:
        'En Café Gaudí unimos café de especialidad de tueste natural, desayunos artesanos, focaccias crujientes, platos combinados a la plancha, carnes nobles y una terraza acogedora en Mataró.',
      btnMenu: 'Consultar Menú Digital',
      btnReserve: 'Reservar una Mesa',
      btnMap: 'Ver Ubicación',
      burgersTitle: 'Burgers & Tapas',
      burgersDesc: 'Hamburguesas Black Angus y bravas hojaldradas',
      coffeeTitle: 'Café & Desayunos',
      coffeeDesc: '100% Arábica de tueste natural y bollería artesana',
      terraceTitle: 'Terraza & Salón',
      terraceDesc: 'Carrer Germans Thos i Codina, 20 (Mataró)',
      artisanalTitle: 'Cocina Artesanal',
      artisanalDesc: 'Platos combinados, tapas, focaccias y menú diario',
    },
    menu: {
      badge: 'Carta Oficial 2026',
      title: 'Carta & Menú Digital',
      subtitle:
        'Explora nuestra carta completa estructurada en 8 páginas temáticas. Selecciona una sección para ver los platos detallados, ingredientes, alérgenos y precios actualizados.',
      downloadPdf: 'Descargar Carta Completa (PDF)',
      downloadPdfGenerating: 'Generando PDF...',
      downloadFullPdf: 'Descargar Carta PDF',
      downloading: 'Generando...',
      downloadSectionPdf: 'Descargar Esta Sección en PDF',
      downloadSectionPdfShort: 'PDF de Sección',
      pageSelectorTitle: 'Selecciona una Página del Menú:',
      pageIndicator: 'Página {current} de {total}',
      searchPlaceholder: 'Buscar plato, ingrediente o alérgeno...',
      filterAll: 'Todos los platos',
      filterSpecial: 'Estrella de la casa',
      filterVegetarian: 'Vegetariano',
      filterVeg: 'Vegetariano',
      filterVegan: 'Vegano',
      filterGlutenFree: 'Sin Gluten',
      filterNew: 'Novedad',
      filterBy: 'Filtrar por:',
      sectionsTitle: 'Secciones de la Carta',
      sectionsCount: '8 páginas',
      activeSection: 'Sección activa',
      pdfSection: 'Página de la carta',
      prev: 'Anterior',
      next: 'Siguiente',
      noDishesFound: 'No se encontraron platos',
      noDishesDesc: 'Prueba a cambiar los filtros o el término de búsqueda para ver más platos.',
      resetFilters: 'Restablecer filtros',
      new: 'Nuevo',
      speciality: 'Especialidad',
      format: 'Formato / Ración:',
      wineNose: 'En Nariz:',
      wineMouth: 'En Boca:',
      winePairing: 'Maridaje Recomendado:',
      supplementsTitle: 'Suplementos e Ingredientes Extra Disponibles:',
      supplementsSubtitle: 'Personaliza tu bocadillo, hamburguesa, ensalada o plato combinado con nuestros extras frescos.',
      supplementsTable: 'Tabla de Suplementos y Extras',
      languageSelectorTitle: 'Selecciona el idioma del menú:',
      viewAllSectionsMobile: 'Ver todas las secciones',
      closeSectionsModal: 'Cerrar',
      orderNow: 'Pedir',
      addToOrder: 'Añadir a la comanda',
      itemUnavailable: 'Temporalmente no disponible',
      soldOut: 'Agotado hoy',
      allergensBtn: 'Información de Alérgenos (Reglamento UE 1169/2011)',
      allergensGuide: 'Guía de Alérgenos',
      allergensTitle: 'Información Oficial sobre Alérgenos',
      allergensSubtitle: 'Declaración obligatoria según el Reglamento Europeo 1169/2011 sobre alérgenos alimentarios.',
      allergensNotice:
        'Si padeces cualquier alergia o intolerancia alimentaria, por favor comunícaselo a nuestro personal antes de realizar tu pedido. Disponemos de pan sin gluten y adaptaciones especiales.',
      understood: 'Entendido y Cerrar',
      orderDrawerTitle: 'Tu Comanda para el Camarero',
      orderDrawerEmpty: 'Tu comanda está vacía',
      orderDrawerEmptyHelp: 'Selecciona platos de la carta para añadirlos a tu lista antes de llamar al camarero o enviar tu pedido.',
      tableNumberLabel: 'Número de Mesa o Terraza (opcional):',
      tableNumberPlaceholder: 'Ej. Mesa 4 / Terraza 2',
      sendWhatsAppBtn: 'Enviar Comanda por WhatsApp',
      clearOrderBtn: 'Vaciar Comanda',
      totalAmount: 'Total estimado:',
      glass: 'Copa',
      bottle: 'Botella',
      pairing: 'Maridaje sugerido:',
      aroma: 'Nariz:',
      taste: 'Boca:',
      pages: {
        p1Tab: '1. Ofertas & Menús',
        p1Title: 'PÁGINA 1: CARTA DE OFERTAS & MENÚS',
        p1Desc: 'Ofertas matinales, vermút y menús de mediodía',
        p2Tab: '2. Desayunos & Torradas',
        p2Title: 'PÁGINA 2: DESAYUNOS (BEBIDAS, MINIS, BOCADILLOS Y TORRADAS)',
        p2Desc: 'Cafés, tés, zumos, minis crujientes y torradas con pan de payés',
        p3Tab: '3. Bocadillos Calientes',
        p3Title: 'PÁGINA 3: BOCADILLOS ESPECIALES & CALIENTES',
        p3Desc: 'Recetas de la casa BE-1 al BE-7 y carnes a la plancha recién hechas',
        p4Tab: '4. Focaccias Artesanas',
        p4Title: 'PÁGINA 4: FOCACCIAS ARTESANAS',
        p4Desc: 'Nuestras 11 recetas exclusivas sobre pan italiano horneado con romero',
        p5Tab: '5. Combos & Carnes',
        p5Title: 'PÁGINA 5: CARNE Y PESCADO A LA PLANCHA & PLATOS COMBOS',
        p5Desc: 'Platos combinados completos COMBI 1 al 8 con patatas caseras',
        p6Tab: '6. Tapas & Ensaladas',
        p6Title: 'PÁGINA 6: PARA PICAR Y COMPARTIR & ENSALADAS FRESCAS',
        p6Desc: 'Tapas caseras, raciones de mercado y ensaladas mediterráneas',
        p7Tab: '7. Burguers & Postres',
        p7Title: 'PÁGINA 7: BURGUERS PREMIUM & POSTRES CASEROS',
        p7Desc: 'Hamburguesas 100% Black Angus y dulces artesanos para culminar',
        p8Tab: '8. Carta de Vinos',
        p8Title: 'PÁGINA 8: CARTA DE VINOS (TINTOS Y VERDEJOS / BLANCOS)',
        p8Desc: 'Selección de D.O. Rioja, Ribera del Duero y Rueda por copa o botella',
      },
      sections: {
        'OFERTAS MATINALES (LUNES A VIERNES)': {
          title: 'OFERTAS MATINALES (LUNES A VIERNES)',
          subtitle: 'Café, agua o té incluido en todas las ofertas matinales (8:00h a 13:00h)',
        },
        'PACK VERMÚT & MENÚ INFANTIL': {
          title: 'PACK VERMÚT & MENÚ INFANTIL',
          subtitle: 'Aperitivos de mediodía y menú adaptado para los más pequeños',
        },
        'MENÚ PLATOS COMBOS DE MEDIODÍA': {
          title: 'MENÚ PLATOS COMBOS DE MEDIODÍA',
          subtitle: 'De lunes a viernes (13:00h a 16:00h) Platos Combos + Bebida + Postre o Café. Jueves: Paella • Viernes: Fideuá.',
        },
        'BEBIDAS DE CAFETERÍA & TÉS': {
          title: 'BEBIDAS DE CAFETERÍA & TÉS',
          subtitle: 'Cafés de tueste natural, infusiones selectas y zumos naturales',
        },
        'MINIS Y BOCADILLOS (DESAYUNOS)': {
          title: 'MINIS Y BOCADILLOS (DESAYUNOS)',
          subtitle: 'Pan crujiente con tomate de colgar y aceite de oliva virgen extra',
        },
        'TORRADAS CON PAN DE PAYÉS': {
          title: 'TORRADAS CON PAN DE PAYÉS',
          subtitle: 'Rebanadas generosas tostadas al momento con ingredientes frescos',
        },
        'BOCADILLOS ESPECIALES (BE-1 AL BE-7)': {
          title: 'BOCADILLOS ESPECIALES (BE-1 AL BE-7)',
          subtitle: 'Combinaciones maestras de la casa con pan recién horneado',
        },
        'BOCADILLOS CALIENTES DE LA PLANCHA': {
          title: 'BOCADILLOS CALIENTES DE LA PLANCHA',
          subtitle: 'Carnes, embutidos artesanos y salchichas preparadas al momento',
        },
        'FOCACCIAS ARTESANAS': {
          title: 'FOCACCIAS ARTESANAS',
          subtitle: 'Nuestras 11 recetas exclusivas de focaccia con masa crujiente',
        },
        'CARNE Y PESCADO A LA PLANCHA': {
          title: 'CARNE Y PESCADO A LA PLANCHA',
          subtitle: 'Piezas nobles cocinadas al punto con patatas caseras y ensalada',
        },
        'PLATOS COMBOS (COMBI 1 AL 8)': {
          title: 'PLATOS COMBOS (COMBI 1 AL 8)',
          subtitle: 'Combinaciones completas y sabrosas con patatas caseras, ensalada o huevo',
        },
        'PARA PICAR Y COMPARTIR': {
          title: 'PARA PICAR Y COMPARTIR',
          subtitle: 'Tapas caseras y raciones elaboradas con producto fresco',
        },
        'ENSALADAS FRESCAS': {
          title: 'ENSALADAS FRESCAS',
          subtitle: 'Brotes selectos, verduras frescas y aderezos de la casa',
        },
        'BURGUERS PREMIUM': {
          title: 'BURGUERS PREMIUM',
          subtitle: 'Carne 100% Black Angus y pechuga crujiente con pan brioche y papitas caseras',
        },
        'POSTRES CASEROS': {
          title: 'POSTRES CASEROS',
          subtitle: 'El broche de oro dulce elaborado en nuestra cocina',
        },
        'VINOS TINTOS': {
          title: 'VINOS TINTOS',
          subtitle: 'Disponibles por copa o botella',
        },
        'VINOS VERDEJO / BLANCOS': {
          title: 'VINOS VERDEJO / BLANCOS',
          subtitle: 'Disponibles por copa o botella',
        },
      },
    },
    reservation: {
      badge: 'Reserva Online Directa',
      title: 'Reserva tu Mesa en Café Gaudí',
      subtitle:
        'Asegura tu lugar en nuestro salón climatizado o en la terraza exterior. Confirmación instantánea por email y WhatsApp.',
      tabNew: 'Nueva Reserva',
      tabCheck: 'Mis Reservas',
      dateLabel: 'Fecha de la reserva',
      quickToday: 'Hoy',
      quickTomorrow: 'Mañana',
      quickWeekend: 'Fin de Semana',
      serviceLabel: 'Turno o Servicio',
      serviceBrunch: 'Desayuno / Brunch (09:30 - 12:15)',
      serviceLunch: 'Almuerzo / Comida (13:00 - 15:00)',
      serviceAfternoon: 'Tardeo / Aperitivo (17:30 - 19:45)',
      serviceDinner: 'Cenas (20:30 - 22:00)',
      earlyCloseNotice: 'Nota: Los domingos y lunes cerramos a las 16:00h (solo servicio de mañana y mediodía).',
      scheduleBannerEarly: 'Domingo y Lunes: cerramos a las 16:00 h (cocina hasta las 15:30 h). Turnos de tarde y cena no disponibles.',
      scheduleBannerRegular: 'Martes a Sábado: abierto de 08:00 a 23:00 h (cierre a las 23:00 h).',
      timeLabel: 'Hora deseada',
      guestsLabel: 'Número de Comensales',
      guestSingular: 'persona',
      guestPlural: 'personas',
      zoneLabel: 'Zona preferida',
      zoneTerrace: 'Terraza Exterior',
      zoneSalon: 'Salón Interior Climatizado',
      zoneTerraceDesc: 'Ambiente al aire libre en calle semipeatonal tranquila.',
      zoneSalonDesc: 'Espacio acogedor con aire acondicionado y música agradable.',
      nameLabel: 'Nombre y Apellidos',
      namePlaceholder: 'Ej. Laura Martínez Gómez',
      phoneLabel: 'Teléfono de Contacto (con prefijo)',
      phonePlaceholder: '+34 600 000 000',
      emailLabel: 'Correo Electrónico para la confirmación',
      emailPlaceholder: 'ejemplo@gmail.com',
      notesLabel: 'Peticiones especiales, alérgenos o trona infantil (opcional)',
      notesPlaceholder: 'Ej. Venimos con carrito de bebé, o un comensal es celíaco...',
      submitBtn: 'Confirmar Reserva de Mesa',
      submitting: 'Procesando tu reserva...',
      successTitle: '¡Reserva Confirmada con Éxito!',
      successSubtitle: 'Hemos registrado tu reserva y te hemos enviado el comprobante.',
      codeLabel: 'Código de Reserva:',
      detailsLabel: 'Detalles de tu cita:',
      statusConfirmed: 'CONFIRMADA',
      shareWhatsApp: 'Enviar Comprobante a mi WhatsApp',
      downloadPass: 'Descargar Pase de Reserva',
      previewEmail: 'Ver Email de Confirmación',
      newBookingBtn: 'Hacer otra reserva',
      myBookingsTitle: 'Tus Reservas Guardadas en este dispositivo',
      myBookingsEmpty: 'Aún no tienes ninguna reserva activa registrada.',
      myBookingsHelp: 'Cuando completes una reserva, aparecerá aquí con su código y estado en tiempo real.',
    },
    gallery: {
      badge: 'Especialidades & Ambiente en Mataró',
      title: 'Galería Fotográfica',
      subtitle:
        'Explora las fotos de nuestros platos y creaciones en Café Gaudí: hamburguesas Black Angus, tapas, patatas bravas, café de especialidad y la atmósfera en Carrer Germans Thos i Codina 20, Mataró.',
      catAll: 'Todas las fotos',
      catGoogle: 'Google Maps (4.8 ★)',
      catBurgers: 'Hamburguesas & Tapas',
      catCoffee: 'Café & Brunch',
      catAtmosphere: 'Local & Terraza',
      btnCarousel: 'Carrusel',
      btnGrid: 'Cuadrícula',
      btnPause: 'Pausa',
      btnAuto: 'Auto',
      openGoogleMaps: 'Ver fotos y opiniones en Google Maps',
      photoCounter: 'Foto {current} a {visible} de {total}',
      verifiedGoogle: 'Foto verificada en Google Maps',
      source: 'Fuente:',
    },
    reviews: {
      badge: 'Opiniones Verificadas en Google',
      title: 'Lo que Dicen Nuestros Clientes',
      subtitle:
        'Reseñas reales y contrastadas de clientes en Google Maps sobre Café Gaudí en Mataró: nuestro café de barista, hamburguesas Black Angus, tapas caseras y el trato familiar.',
      ratingScore: '4.8',
      ratingOutOf: 'de 5.0 en Google Maps',
      totalReviewsText: '+700 Reseñas Reales',
      verifiedGoogle: 'Valoración oficial verificada en Google Business',
      viewAllOnGoogle: 'Ver todas las reseñas en Google',
      writeReview: 'Escribir mi reseña',
      filterAll: 'Todas las reseñas',
      filterCoffee: 'Café & Desayunos',
      filterBurgers: 'Hamburguesas Gourmet',
      filterTapas: 'Focaccias & Tapas',
      filterSweets: 'Gofres & Meriendas',
      filterService: 'Servicio & Terraza',
      localGuide: 'Local Guide',
      reviewsCount: 'reseñas',
      responseFromOwner: 'Respuesta del propietario',
      dishesRecommended: 'Platos y especialidades mencionadas:',
      satisfactionRate: '98% Opiniones Positivas',
      satisfactionSub: 'Basado en más de 700 valoraciones públicas en Google',
      searchPlaceholder: 'Buscar por plato, ingrediente o palabra clave (ej: café, bravas, hamburguesa)...',
    },
    location: {
      badge: 'Visítanos en Mataró',
      title: 'Cómo Llegar & Ubicación',
      subtitle:
        'Encuéntranos en Cafetería Gaudí (C/ Germans Thos i Codina / C/ Cooperativa, Mataró), a tan solo 4 minutos a pie de la Estación de Rodalies de Mataró.',
      googleBadge: 'Ficha oficial de Google Maps',
      streetView: 'Google Street View',
      streetViewTitle: 'Vista a pie de calle en Google Street View',
      verifiedListing: 'Ficha verificada',
      startGps: 'Iniciar Navegación GPS',
      openInGoogleMaps: 'Abrir en Google Maps',
      openInAppleMaps: 'Apple Maps',
      recenterMap: 'Centrar en Café Gaudí',
      addressTitle: 'Nuestra Dirección',
      addressLine1: 'Carrer Germans Thos i Codina, 20',
      addressLine2: '08301 Mataró (Barcelona)',
      scheduleTitle: 'Horarios de Apertura',
      scheduleTueSat: 'Martes a Sábado:',
      scheduleTueSatHours: '08:00h a 23:00h (Cocina ininterrumpida)',
      scheduleSunMon: 'Domingo y Lunes:',
      scheduleSunMonHours: '08:00h a 16:00h (Tarde cerrado)',
      phoneTitle: 'Teléfono',
      emailTitle: 'Correo Electrónico',
      howToArriveTitle: 'Cómo llegar a Café Gaudí',
      trainTitle: 'En Tren (Renfe Rodalies R1)',
      trainWalkingTime: '4 min a pie',
      trainDesc:
        'A solo 400 metros de la Estació de Mataró. Sal de la estación en dirección al centro y accede rápidamente por Carrer Germans Thos i Codina.',
      carTitle: 'En Coche & Aparcamientos',
      carDesc:
        '• Pàrquing Plaça de les Tereses: a 350m.\n• Pàrquing Estació / Port de Mataró: a 400m.\nZona azul y aparcamientos cubiertos 24h a pie de calle.',
      busTitle: 'Mataró Bus Urbano & Interurbano',
      busDesc:
        'Paradas a 2 minutos en Camí Ral y Muralla dels Genovesos (Líneas 1, 2, 3, 4 y bus exprés a Barcelona).',
      viewSatellite: 'Google Satélite',
      viewMap: 'Google Callejero',
      viewStylized: 'Mapa Estilizado',
      openGoogleMaps: 'Abrir Navegación en Google Maps',
      copyAddress: 'Copiar Dirección',
      copied: '¡Dirección Copiada!',
      scheduleCardBadge: 'Horarios de Atención',
      scheduleCardType: 'Café Bar & Restaurante',
      scheduleCardTitle: 'Horarios & Reservas',
      scheduleTueSatDays: 'Martes a Sábado',
      scheduleTueSatTime: '08:00 - 23:00 h',
      scheduleTueSatNote: 'Desayunos, comidas, tardeo y cenas',
      scheduleTueSatClose: 'Cierre a las 23:00h',
      scheduleSunMonDays: 'Domingo y Lunes',
      scheduleSunMonTime: '08:00 - 16:00 h',
      scheduleSunMonNote: 'Desayunos, brunch y comidas',
      scheduleSunMonClose: 'Cierre a las 16:00h',
      whatsappDirect: 'WhatsApp Directo',
    },
    footer: {
      brandSubtitle: 'Cafetería • Tapas • Mataró',
      description:
        'Gastronomía mediterránea con alma marinera, focaccias artesanales, combos a la plancha, café de finca y tapas en el centro de Mataró.',
      navTitle: 'Navegación',
      navigation: 'Navegación',
      contactTitle: 'Contacto & Dirección',
      hoursTitle: 'Horario',
      schedule: 'Horario',
      scheduleWeek: 'Martes a Sábado: 08:00 - 23:00 h',
      scheduleWeekend: 'Domingo y Lunes: 08:00 - 16:00 h',
      qualityTitle: 'Calidad & Compromiso',
      qualityDesc:
        'Cocina de mercado con ingredientes frescos seleccionados a diario. Pasión por la gastronomía bien hecha.',
      qualityBadge: 'Garantía de frescura & elaboración diaria',
      rights: 'Todos los derechos reservados.',
      craftedWith: 'Café Gaudí • Pasión por el buen comer en Mataró',
      adminPanel: 'Panel de Administración',
    },
    allergens: {
      gluten: { name: 'Gluten / Cereales', desc: 'Trigo, centeno, cebada, avena y panes' },
      crustaceos: { name: 'Crustáceos', desc: 'Gambas, langostinos, cangrejos y derivados' },
      huevos: { name: 'Huevos', desc: 'Tortillas, mayonesas caseras y rebozados' },
      pescado: { name: 'Pescado', desc: 'Atún, anchoas, bacalao y derivados' },
      cacahuetes: { name: 'Cacahuetes', desc: 'Cacahuetes y trazas en aperitivos' },
      soja: { name: 'Soja', desc: 'Salsas de soja y lecitinas vegetales' },
      lacteos: { name: 'Lácteos / Leche', desc: 'Quesos Gouda, Manchego, Brie, mantequilla' },
      frutos_cascara: { name: 'Frutos de Cáscara', desc: 'Nueces, almendras, avellanas' },
      apio: { name: 'Apio', desc: 'Caldos de verduras y sofritos' },
      mostaza: { name: 'Mostaza', desc: 'Salsas especiales y aderezos' },
      sesamo: { name: 'Sésamo', desc: 'Panes de hamburguesa y panes tostados' },
      sulfitos: { name: 'Sulfitos', desc: 'Vinos de mesa, vinagres y encurtidos' },
      altramuces: { name: 'Altramuces', desc: 'Harinas vegetales y aperitivos' },
      moluscos: { name: 'Moluscos', desc: 'Mejillones, calamares, sepias y pulpo' },
    },
  },

  cat: {
    nav: {
      home: 'Inici',
      menu: 'Menú Digital',
      reservations: 'Reserves',
      gallery: 'Galeria',
      reviews: 'Ressenyes',
      location: 'Ubicació & Mapa',
      bookTable: 'Reservar Taula',
      callUs: 'Trucar al restaurant',
      openToday: 'Obert avui',
      orderTray: 'Comanda',
      admin: 'Admin',
      openMenu: 'Obrir menú',
      language: 'Idioma',
    },
    hero: {
      badge: 'Carrer Germans Thos i Codina, 20 • Mataró',
      headlinePart1: 'El sabor del Maresme en',
      headlinePart2: 'cada detall',
      subtitle:
        "A Café Gaudí unim cafè d'especialitat de torrat natural, esmorzars artesans, focaccies cruixents, plats combinats a la planxa, carns nobles i una terrassa acollidora a Mataró.",
      btnMenu: 'Consultar Menú Digital',
      btnReserve: 'Reservar una Taula',
      btnMap: 'Veure Ubicació',
      burgersTitle: 'Burgers & Tapes',
      burgersDesc: 'Hamburgueses Black Angus i braves de la casa',
      coffeeTitle: 'Cafè & Esmorzars',
      coffeeDesc: "100% Aràbica de torrat natural i brioxeria artesana",
      terraceTitle: 'Terrassa & Saló',
      terraceDesc: 'Carrer Germans Thos i Codina, 20 (Mataró)',
      artisanalTitle: 'Cuina Artesanal',
      artisanalDesc: 'Plats combinats, tapes, focaccies i menú diari',
    },
    menu: {
      badge: 'Carta Oficial 2026',
      title: 'Carta & Menú Digital',
      subtitle:
        'Explora la nostra carta completa estructurada en 8 pàgines temàtiques. Selecciona una secció per veure els plats detallats, ingredients, al·lèrgens i preus actualitzats.',
      downloadPdf: 'Descarregar Carta Completa (PDF)',
      downloadPdfGenerating: 'Generant PDF...',
      downloadFullPdf: 'Descarregar Carta PDF',
      downloading: 'Generant...',
      downloadSectionPdf: 'Descarregar Aquesta Secció en PDF',
      downloadSectionPdfShort: 'PDF de Secció',
      pageSelectorTitle: 'Selecciona una Pàgina del Menú:',
      pageIndicator: 'Pàgina {current} de {total}',
      searchPlaceholder: "Cercar plat, ingredient o al·lèrgen...",
      filterAll: 'Tots els plats',
      filterSpecial: 'Estrella de la casa',
      filterVegetarian: 'Vegetarià',
      filterVeg: 'Vegetarià',
      filterVegan: 'Vegà',
      filterGlutenFree: 'Sense Gluten',
      filterNew: 'Novetat',
      filterBy: 'Filtrar per:',
      sectionsTitle: 'Seccions de la Carta',
      sectionsCount: '8 pàgines',
      activeSection: 'Secció activa',
      pdfSection: 'Pàgina de la carta',
      prev: 'Anterior',
      next: 'Següent',
      noDishesFound: 'No sha trobat cap plat',
      noDishesDesc: 'Prova a canviar els filtres o el terme de cerca per veure més plats.',
      resetFilters: 'Restablir filtres',
      new: 'Nou',
      speciality: 'Especialitat',
      format: 'Format / Ració:',
      wineNose: 'En Nas:',
      wineMouth: 'En Boca:',
      winePairing: 'Maridatge Recomanat:',
      supplementsTitle: 'Suplements i Ingredients Extra Disponibles:',
      supplementsSubtitle: 'Personalitza el teu entrepà, hamburguesa, amanida o plat combinat amb els nostres extres frescos.',
      supplementsTable: 'Taula de Suplements i Extres',
      languageSelectorTitle: 'Selecciona l’idioma de la carta:',
      viewAllSectionsMobile: 'Veure totes les seccions',
      closeSectionsModal: 'Tancar',
      orderNow: 'Demanar',
      addToOrder: 'Afegir a la comanda',
      itemUnavailable: 'Temporalment no disponible',
      soldOut: 'Esgotat avui',
      allergensBtn: "Informació d'Al·lèrgens (Reglament UE 1169/2011)",
      allergensGuide: "Guia d'Al·lèrgens",
      allergensTitle: "Informació Oficial sobre Al·lèrgens",
      allergensSubtitle: "Declaració obligatòria segons el Reglament Europeu 1169/2011 sobre al·lèrgens alimentaris.",
      allergensNotice:
        "Si pateixes qualsevol al·lèrgia o intolerància alimentària, si us plau comunica-ho al nostre personal abans de fer la teva comanda. Disposem de pa sense gluten i adaptacions especials.",
      understood: 'Entès i Tancar',
      orderDrawerTitle: 'La teva Comanda per al Cambrer',
      orderDrawerEmpty: 'La teva comanda està buida',
      orderDrawerEmptyHelp: 'Selecciona plats de la carta per afegir-los a la teva llista abans de cridar el cambrer o enviar la comanda.',
      tableNumberLabel: 'Número de Taula o Terrassa (opcional):',
      tableNumberPlaceholder: 'Ex. Taula 4 / Terrassa 2',
      sendWhatsAppBtn: 'Enviar Comanda per WhatsApp',
      clearOrderBtn: 'Buidar Comanda',
      totalAmount: 'Total estimat:',
      glass: 'Copa',
      bottle: 'Ampolla',
      pairing: 'Maridatge suggerit:',
      aroma: 'Nas:',
      taste: 'Boca:',
      pages: {
        p1Tab: '1. Ofertes & Menús',
        p1Title: "PÀGINA 1: CARTA D'OFERTES & MENÚS",
        p1Desc: 'Ofertes matinals, vermut i menús de migdia',
        p2Tab: '2. Esmorzars & Torrades',
        p2Title: 'PÀGINA 2: ESMORZARS (BEGUDES, MINIS, ENTREPANS I TORRADES)',
        p2Desc: 'Cafès, tes, sucs, minis cruixents i torrades amb pa de pagès',
        p3Tab: '3. Entrepans Calents',
        p3Title: 'PÀGINA 3: ENTREPANS ESPECIALS & CALENTS',
        p3Desc: 'Receptes de la casa BE-1 al BE-7 i carns a la planxa acabades de fer',
        p4Tab: '4. Focaccies Artesanes',
        p4Title: 'PÀGINA 4: FOCACCIES ARTESANES',
        p4Desc: 'Les nostres 11 receptes exclusives sobre pa italià enfornat amb romaní',
        p5Tab: '5. Combos & Carns',
        p5Title: 'PÀGINA 5: CARN I PEIX A LA PLANXA & PLATS COMBOS',
        p5Desc: 'Plats combinats complets COMBI 1 al 8 amb patates casolanes',
        p6Tab: '6. Tapes & Amanides',
        p6Title: 'PÀGINA 6: PER PICAR I COMPARTIR & AMANIDES FRESCQUES',
        p6Desc: 'Tapes casolanes, racions de mercat i amanides mediterrànies',
        p7Tab: '7. Burguers & Postres',
        p7Title: 'PÀGINA 7: BURGUERS PREMIUM & POSTRES CASOLANS',
        p7Desc: 'Hamburgueses 100% Black Angus i dolços artesans per culminar',
        p8Tab: '8. Carta de Vins',
        p8Title: 'PÀGINA 8: CARTA DE VINS (NEGRES I VERDEJOS / BLANCS)',
        p8Desc: 'Selecció de D.O. Rioja, Ribera del Duero i Rueda per copa o ampolla',
      },
      sections: {
        'OFERTAS MATINALES (LUNES A VIERNES)': {
          title: 'OFERTES MATINALS (DILLUNS A DIVENDRES)',
          subtitle: 'Cafè, aigua o te inclòs en totes les ofertes matinals (8:00h a 13:00h)',
        },
        'PACK VERMÚT & MENÚ INFANTIL': {
          title: 'PACK VERMUT & MENÚ INFANTIL',
          subtitle: 'Aperitius de migdia i menú adaptat per als més menuts',
        },
        'MENÚ PLATOS COMBOS DE MEDIODÍA': {
          title: 'MENÚ PLATS COMBOS DE MIGDIA',
          subtitle: 'De dilluns a divendres (13:00h a 16:00h) Plats Combos + Beguda + Postres o Cafè. Dijous: Paella • Divendres: Fideuà.',
        },
        'BEBIDAS DE CAFETERÍA & TÉS': {
          title: 'BEGUDES DE CAFETERIA & TES',
          subtitle: 'Cafès de torrat natural, infusions selectes i sucs naturals',
        },
        'MINIS Y BOCADILLOS (DESAYUNOS)': {
          title: 'MINIS I ENTREPANS (ESMORZARS)',
          subtitle: 'Pa cruixent amb tomàquet de penjar i oli d’oliva verge extra',
        },
        'TORRADAS CON PAN DE PAYÉS': {
          title: 'TORRADES AMB PA DE PAGÈS',
          subtitle: 'Llesques generoses torrades al moment amb ingredients frescos',
        },
        'BOCADILLOS ESPECIALES (BE-1 AL BE-7)': {
          title: 'ENTREPANS ESPECIALS (BE-1 AL BE-7)',
          subtitle: 'Combinacions mestres de la casa amb pa acabat d’enfornar',
        },
        'BOCADILLOS CALIENTES DE LA PLANCHA': {
          title: 'ENTREPANS CALENTS DE LA PLANXA',
          subtitle: 'Carns, embotits artesans i salsitxes preparades al moment',
        },
        'FOCACCIAS ARTESANAS': {
          title: 'FOCACCIES ARTESANES',
          subtitle: 'Les nostres 11 receptes exclusives de focaccia amb massa cruixent',
        },
        'CARNE Y PESCADO A LA PLANCHA': {
          title: 'CARN I PEIX A LA PLANXA',
          subtitle: 'Peces nobles cuinades al punt amb patates casolanes i amanida',
        },
        'PLATOS COMBOS (COMBI 1 AL 8)': {
          title: 'PLATS COMBOS (COMBI 1 AL 8)',
          subtitle: 'Combinacions completes i gustoses amb patates casolanes, amanida o ou',
        },
        'PARA PICAR Y COMPARTIR': {
          title: 'PER PICAR I COMPARTIR',
          subtitle: 'Tapes casolanes i racions elaborades amb producte fresc',
        },
        'ENSALADAS FRESCAS': {
          title: 'AMANIDES FRESCQUES',
          subtitle: 'Brots selectes, verdures fresques i amaniments de la casa',
        },
        'BURGUERS PREMIUM': {
          title: 'BURGUERS PREMIUM',
          subtitle: 'Carn 100% Black Angus i pitrera cruixent amb pa brioix i patates casolanes',
        },
        'POSTRES CASEROS': {
          title: 'POSTRES CASOLANS',
          subtitle: 'El colofó dolç elaborat a la nostra pròpia cuina',
        },
        'VINOS TINTOS': {
          title: 'VINS NEGRES',
          subtitle: 'Disponibles per copa o ampolla',
        },
        'VINOS VERDEJO / BLANCOS': {
          title: 'VINS VERDEJO / BLANCS',
          subtitle: 'Disponibles per copa o ampolla',
        },
      },
    },
    reservation: {
      badge: 'Reserva Online Directa',
      title: 'Reserva la teva Taula a Café Gaudí',
      subtitle:
        'Assegura el teu lloc al nostre saló climatitzat o a la terrassa exterior. Confirmació instantània per correu i WhatsApp.',
      tabNew: 'Nova Reserva',
      tabCheck: 'Les Meves Reserves',
      dateLabel: 'Data de la reserva',
      quickToday: 'Avui',
      quickTomorrow: 'Demà',
      quickWeekend: 'Cap de Setmana',
      serviceLabel: 'Torn o Servei',
      serviceBrunch: 'Esmorzar / Brunch (09:30 - 12:15)',
      serviceLunch: 'Dinar / Migdia (13:00 - 15:00)',
      serviceAfternoon: 'Tarda / Aperitiu (17:30 - 19:45)',
      serviceDinner: 'Sopars (20:30 - 22:00)',
      earlyCloseNotice: 'Nota: Diumenges i dilluns tanquem a les 16:00h (només servei de matí i migdia).',
      scheduleBannerEarly: 'Diumenge i Dilluns: tanquem a les 16:00 h (cuina fins a les 15:30 h). Torns de tarda i sopar no disponibles.',
      scheduleBannerRegular: 'Dimarts a Dissabte: obert de 08:00 a 23:00 h (tancament a les 23:00 h).',
      timeLabel: 'Hora desitjada',
      guestsLabel: 'Nombre de Comensals',
      guestSingular: 'persona',
      guestPlural: 'persones',
      zoneLabel: 'Zona preferida',
      zoneTerrace: 'Terrassa Exterior',
      zoneSalon: 'Saló Interior Climatitzat',
      zoneTerraceDesc: 'Ambient a l’aire lliure en carrer de vianants tranquil.',
      zoneSalonDesc: 'Espai acollidor amb aire condicionat i música agradable.',
      nameLabel: 'Nom i Cognoms',
      namePlaceholder: 'Ex. Laura Martínez Gómez',
      phoneLabel: 'Telèfon de Contacte (amb prefix)',
      phonePlaceholder: '+34 600 000 000',
      emailLabel: 'Correu Electrònic per a la confirmació',
      emailPlaceholder: 'exemple@gmail.com',
      notesLabel: 'Peticions especials, al·lèrgens o cadira infantil (opcional)',
      notesPlaceholder: 'Ex. Venim amb cotxet de nadó, o un comensal és celíac...',
      submitBtn: 'Confirmar Reserva de Taula',
      submitting: 'Processant la teva reserva...',
      successTitle: 'Reserva Confirmada amb Èxit!',
      successSubtitle: 'Hem registrat la teva reserva i t’hem enviat el justificant.',
      codeLabel: 'Codi de Reserva:',
      detailsLabel: 'Detalls de la teva cita:',
      statusConfirmed: 'CONFIRMADA',
      shareWhatsApp: 'Enviar Justificant al meu WhatsApp',
      downloadPass: 'Descarregar Passi de Reserva',
      previewEmail: 'Veure Correu de Confirmació',
      newBookingBtn: 'Fer una altra reserva',
      myBookingsTitle: 'Les Teves Reserves Guardades en aquest dispositiu',
      myBookingsEmpty: 'Encara no tens cap reserva activa registrada.',
      myBookingsHelp: 'Quan completis una reserva, apareixerà aquí amb el seu codi i estat en temps real.',
    },
    gallery: {
      badge: 'Especialitats & Ambient a Mataró',
      title: 'Galeria Fotogràfica',
      subtitle:
        'Explora les fotos dels nostres plats i creacions a Café Gaudí: hamburgueses Black Angus, tapes, patates braves, cafè d’especialitat i l’atmosfera al Carrer Germans Thos i Codina 20, Mataró.',
      catAll: 'Totes les fotos',
      catGoogle: 'Google Maps (4.8 ★)',
      catBurgers: 'Hamburgueses & Tapes',
      catCoffee: 'Cafè & Brunch',
      catAtmosphere: 'Local & Terrassa',
      btnCarousel: 'Carrusel',
      btnGrid: 'Quadrícula',
      btnPause: 'Pausa',
      btnAuto: 'Auto',
      openGoogleMaps: 'Veure fotos i opinions a Google Maps',
      photoCounter: 'Foto {current} a {visible} de {total}',
      verifiedGoogle: 'Foto verificada a Google Maps',
      source: 'Font:',
    },
    reviews: {
      badge: 'Opinions Verificades a Google',
      title: 'Què Diuen els Nostres Clients',
      subtitle:
        'Ressenyes reals i contrastades de clients a Google Maps sobre Café Gaudí a Mataró: el nostre cafè de barista, hamburgueses Black Angus, tapes casolanes i el tracte familiar.',
      ratingScore: '4.8',
      ratingOutOf: 'de 5.0 a Google Maps',
      totalReviewsText: '+700 Ressenyes Reals',
      verifiedGoogle: 'Valoració oficial verificada a Google Business',
      viewAllOnGoogle: 'Veure totes les ressenyes a Google',
      writeReview: 'Escriure la meva ressenya',
      filterAll: 'Totes les ressenyes',
      filterCoffee: 'Cafè & Esmorzars',
      filterBurgers: 'Hamburgueses Gourmet',
      filterTapas: 'Focaccies & Tapes',
      filterSweets: 'Gofres & Berenars',
      filterService: 'Servei & Terrassa',
      localGuide: 'Local Guide',
      reviewsCount: 'ressenyes',
      responseFromOwner: 'Resposta del propietari',
      dishesRecommended: 'Plats i especialitats mencionades:',
      satisfactionRate: '98% Opinions Positives',
      satisfactionSub: 'Basat en més de 700 valoracions públiques a Google',
      searchPlaceholder: 'Cercar per plat, ingredient o paraula clau (ex: cafè, braves, hamburguesa)...',
    },
    location: {
      badge: 'Visita’ns a Mataró',
      title: 'Com Arribar & Ubicació',
      subtitle:
        'Troba’ns a Cafeteria Gaudí (C/ Germans Thos i Codina / C/ Cooperativa, Mataró), a només 4 minuts a peu de l’Estació de Rodalies de Mataró.',
      googleBadge: 'Fitxa oficial de Google Maps',
      streetView: 'Google Street View',
      streetViewTitle: 'Vista a peu de carrer a Google Street View',
      verifiedListing: 'Fitxa verificada',
      startGps: 'Iniciar Navegació GPS',
      openInGoogleMaps: 'Obrir a Google Maps',
      openInAppleMaps: 'Apple Maps',
      recenterMap: 'Centrar a Café Gaudí',
      addressTitle: 'La Nostra Adreça',
      addressLine1: 'Carrer Germans Thos i Codina, 20',
      addressLine2: '08301 Mataró (Barcelona)',
      scheduleTitle: 'Horaris d’Atenció',
      scheduleTueSat: 'Dimarts a Dissabte:',
      scheduleTueSatHours: '08:00h a 23:00h (Cuina ininterrompuda)',
      scheduleSunMon: 'Diumenge i Dilluns:',
      scheduleSunMonHours: '08:00h a 16:00h (Tarda tancat)',
      phoneTitle: 'Telèfon',
      emailTitle: 'Correu Electrònic',
      howToArriveTitle: 'Com arribar a Café Gaudí',
      trainTitle: 'En Tren (Renfe Rodalies R1)',
      trainWalkingTime: '4 min a peu',
      trainDesc:
        'A només 400 metres de l’Estació de Mataró. Surt de l’estació en direcció al centre i accedeix ràpidament per Carrer Germans Thos i Codina.',
      carTitle: 'En Cotxe & Aparcaments',
      carDesc:
        '• Pàrquing Plaça de les Tereses: a 350m.\n• Pàrquing Estació / Port de Mataró: a 400m.\nZona blava i pàrquings coberts 24h a peu de carrer.',
      busTitle: 'Mataró Bus Urbà & Interurbà',
      busDesc:
        'Parades a 2 minuts al Camí Ral i Muralla dels Genovesos (Línies 1, 2, 3, 4 i bus exprés a Barcelona).',
      viewSatellite: 'Google Satèl·lit',
      viewMap: 'Google Carrerer',
      viewStylized: 'Mapa Estilitzat',
      openGoogleMaps: 'Obrir Navegació a Google Maps',
      copyAddress: 'Copiar Adreça',
      copied: 'Adreça Copiada!',
      scheduleCardBadge: 'Horaris d’Atenció',
      scheduleCardType: 'Cafè Bar & Restaurant',
      scheduleCardTitle: 'Horaris & Reserves',
      scheduleTueSatDays: 'Dimarts a Dissabte',
      scheduleTueSatTime: '08:00 - 23:00 h',
      scheduleTueSatNote: 'Esmorzars, dinars, tardeo i sopars',
      scheduleTueSatClose: 'Tancament a les 23:00h',
      scheduleSunMonDays: 'Diumenge i Dilluns',
      scheduleSunMonTime: '08:00 - 16:00 h',
      scheduleSunMonNote: 'Esmorzars, brunch i dinars',
      scheduleSunMonClose: 'Tancament a les 16:00h',
      whatsappDirect: 'WhatsApp Directe',
    },
    footer: {
      brandSubtitle: 'Cafeteria • Tapes • Mataró',
      description:
        'Gastronomia mediterrània amb ànima marinera, focaccies artesanals, combos a la planxa, cafè de finca i tapes al centre de Mataró.',
      navTitle: 'Navegació',
      navigation: 'Navegació',
      contactTitle: 'Contacte & Adreça',
      hoursTitle: 'Horari',
      schedule: 'Horari',
      scheduleWeek: 'Dimarts a Dissabte: 08:00 - 23:00 h',
      scheduleWeekend: 'Diumenge i Dilluns: 08:00 - 16:00 h',
      qualityTitle: 'Qualitat & Compromís',
      qualityDesc:
        'Cuina de mercat amb ingredients frescos seleccionats diàriament. Passió per la gastronomia ben feta.',
      qualityBadge: 'Garantia de frescor & elaboració diària',
      rights: 'Tots els drets reservats.',
      craftedWith: 'Café Gaudí • Passió pel bon menjar a Mataró',
      adminPanel: 'Panell d’Administració',
    },
    allergens: {
      gluten: { name: 'Gluten / Cereals', desc: 'Blat, sègol, ordi, civada i pans' },
      crustaceos: { name: 'Crustacis', desc: 'Gambes, llagostins, crancs i derivats' },
      huevos: { name: 'Ous', desc: 'Truites, maioneses casolanes i arrebossats' },
      pescado: { name: 'Peix', desc: 'Tonyina, anxoves, bacallà i derivats' },
      cacahuetes: { name: 'Cacauets', desc: 'Cacauets i traces en aperitius' },
      soja: { name: 'Soja', desc: 'Salses de soja i lecitines vegetals' },
      lacteos: { name: 'Lactis / Llet', desc: 'Formatges Gouda, Manxec, Brie, mantega' },
      frutos_cascara: { name: 'Fruits de Casca', desc: 'Nous, ametlles, avellanes' },
      apio: { name: 'Api', desc: 'Brous de verdures i sofregits' },
      mostaza: { name: 'Mostassa', desc: 'Salses especials i amaniments' },
      sesamo: { name: 'Sèsam', desc: 'Pans d’hamburguesa i pans torrats' },
      sulfitos: { name: 'Sulfits', desc: 'Vins de taula, vinagres i adobats' },
      altramuces: { name: 'Llobins', desc: 'Farines vegetals i aperitius' },
      moluscos: { name: 'Mol·luscs', desc: 'Musclos, calamars, sípies i pop' },
    },
  },

  eng: {
    nav: {
      home: 'Home',
      menu: 'Digital Menu',
      reservations: 'Reservations',
      gallery: 'Gallery',
      reviews: 'Reviews',
      location: 'Location & Map',
      bookTable: 'Book a Table',
      callUs: 'Call restaurant',
      openToday: 'Open today',
      orderTray: 'Order',
      admin: 'Admin',
      openMenu: 'Open menu',
      language: 'Language',
    },
    hero: {
      badge: 'Carrer Germans Thos i Codina, 20 • Mataró',
      headlinePart1: 'The taste of Maresme in',
      headlinePart2: 'every detail',
      subtitle:
        'At Café Gaudí we bring together natural roast specialty coffee, artisanal breakfasts, crispy focaccias, combination platters on the griddle, premium meats, and a cozy terrace in Mataró.',
      btnMenu: 'View Digital Menu',
      btnReserve: 'Book a Table',
      btnMap: 'View Location',
      burgersTitle: 'Burgers & Tapas',
      burgersDesc: 'Black Angus burgers and crispy homemade bravas',
      coffeeTitle: 'Coffee & Breakfast',
      coffeeDesc: '100% naturally roasted Arabica and fresh bakery',
      terraceTitle: 'Terrace & Lounge',
      terraceDesc: 'Carrer Germans Thos i Codina, 20 (Mataró)',
      artisanalTitle: 'Artisanal Kitchen',
      artisanalDesc: 'Combo platters, tapas, focaccias & daily specials',
    },
    menu: {
      badge: 'Official Menu 2026',
      title: 'Digital Menu & Food Card',
      subtitle:
        'Explore our complete food menu structured in 8 thematic pages. Select a section to view detailed dishes, ingredients, allergens and updated prices.',
      downloadPdf: 'Download Full Menu (PDF)',
      downloadPdfGenerating: 'Generating PDF...',
      downloadFullPdf: 'Download Menu PDF',
      downloading: 'Generating...',
      downloadSectionPdf: 'Download This Section in PDF',
      downloadSectionPdfShort: 'Section PDF',
      pageSelectorTitle: 'Select a Menu Page:',
      pageIndicator: 'Page {current} of {total}',
      searchPlaceholder: 'Search dish, ingredient or allergen...',
      filterAll: 'All dishes',
      filterSpecial: 'House Specialty',
      filterVegetarian: 'Vegetarian',
      filterVeg: 'Vegetarian',
      filterVegan: 'Vegan',
      filterGlutenFree: 'Gluten Free',
      filterNew: 'New',
      filterBy: 'Filter by:',
      sectionsTitle: 'Menu Sections',
      sectionsCount: '8 pages',
      activeSection: 'Active section',
      pdfSection: 'Menu page',
      prev: 'Previous',
      next: 'Next',
      noDishesFound: 'No dishes found',
      noDishesDesc: 'Try adjusting your search terms or filters to view more dishes.',
      resetFilters: 'Reset filters',
      new: 'New',
      speciality: 'Specialty',
      format: 'Format / Portion:',
      wineNose: 'On the Nose:',
      wineMouth: 'On the Palate:',
      winePairing: 'Recommended Pairing:',
      supplementsTitle: 'Available Supplements & Extra Ingredients:',
      supplementsSubtitle: 'Customize your sandwich, burger, salad or combo platter with our fresh extras.',
      supplementsTable: 'Supplements & Extras Table',
      languageSelectorTitle: 'Select menu language:',
      viewAllSectionsMobile: 'View all sections',
      closeSectionsModal: 'Close',
      orderNow: 'Order',
      addToOrder: 'Add to order',
      itemUnavailable: 'Temporarily unavailable',
      soldOut: 'Sold out today',
      allergensBtn: 'Allergen Information (EU Regulation 1169/2011)',
      allergensGuide: 'Allergens Guide',
      allergensTitle: 'Official Allergen Information',
      allergensSubtitle: 'Mandatory declaration according to EU Regulation 1169/2011 on food allergens.',
      allergensNotice:
        'If you have any food allergy or intolerance, please inform our staff before ordering. We offer gluten-free bread and special dietary adaptations.',
      understood: 'Understood & Close',
      orderDrawerTitle: 'Your Order for the Server',
      orderDrawerEmpty: 'Your order is empty',
      orderDrawerEmptyHelp: 'Select dishes from the menu to add them to your list before calling the server or sending your order.',
      tableNumberLabel: 'Table or Terrace Number (optional):',
      tableNumberPlaceholder: 'E.g. Table 4 / Terrace 2',
      sendWhatsAppBtn: 'Send Order via WhatsApp',
      clearOrderBtn: 'Clear Order',
      totalAmount: 'Estimated Total:',
      glass: 'Glass',
      bottle: 'Bottle',
      pairing: 'Suggested pairing:',
      aroma: 'Nose:',
      taste: 'Palate:',
      pages: {
        p1Tab: '1. Offers & Menus',
        p1Title: 'PAGE 1: OFFERS & DAILY MENUS',
        p1Desc: 'Morning breakfast deals, vermouth packs and lunch menus',
        p2Tab: '2. Breakfasts & Toasts',
        p2Title: 'PAGE 2: BREAKFASTS (BEVERAGES, MINIS, SANDWICHES & TOASTS)',
        p2Desc: 'Coffees, teas, fresh juices, crispy minis and country bread toasts',
        p3Tab: '3. Hot Sandwiches',
        p3Title: 'PAGE 3: SPECIAL & GRILLED HOT SANDWICHES',
        p3Desc: 'House combinations BE-1 to BE-7 and fresh grilled meats',
        p4Tab: '4. Artisanal Focaccias',
        p4Title: 'PAGE 4: ARTISANAL FOCACCIAS',
        p4Desc: 'Our 11 exclusive recipes on Italian dough baked with rosemary',
        p5Tab: '5. Combos & Meats',
        p5Title: 'PAGE 5: GRILLED MEAT & FISH & COMBO PLATTERS',
        p5Desc: 'Full hearty combos COMBI 1 to 8 with homemade fries',
        p6Tab: '6. Tapas & Salads',
        p6Title: 'PAGE 6: TAPAS TO SHARE & FRESH SALADS',
        p6Desc: 'Homemade tapas, market portions and Mediterranean salads',
        p7Tab: '7. Burgers & Desserts',
        p7Title: 'PAGE 7: PREMIUM BURGERS & HOMEMADE DESSERTS',
        p7Desc: '100% Black Angus burgers and sweet homemade desserts to finish',
        p8Tab: '8. Wine List',
        p8Title: 'PAGE 8: WINE LIST (REDS AND VERDEJO / WHITES)',
        p8Desc: 'Selection of D.O. Rioja, Ribera del Duero & Rueda by glass or bottle',
      },
      sections: {
        'OFERTAS MATINALES (LUNES A VIERNES)': {
          title: 'MORNING DEALS (MONDAY TO FRIDAY)',
          subtitle: 'Coffee, water or tea included with all morning offers (8:00 AM - 1:00 PM)',
        },
        'PACK VERMÚT & MENÚ INFANTIL': {
          title: 'VERMOUTH PACK & KIDS MENU',
          subtitle: 'Midday aperitifs and tailored meals for the little ones',
        },
        'MENÚ PLATOS COMBOS DE MEDIODÍA': {
          title: 'MIDDAY COMBO MEAL DEAL',
          subtitle: 'Monday to Friday (1:00 PM - 4:00 PM) Combo Platter + Drink + Dessert or Coffee. Thursday: Paella • Friday: Fideuá.',
        },
        'BEBIDAS DE CAFETERÍA & TÉS': {
          title: 'COFFEE BAR DRINKS & TEAS',
          subtitle: 'Naturally roasted coffee, premium herbal teas and fresh natural juices',
        },
        'MINIS Y BOCADILLOS (DESAYUNOS)': {
          title: 'MINIS & SANDWICHES (BREAKFAST)',
          subtitle: 'Crispy baguette with rubbed tomato and extra virgin olive oil',
        },
        'TORRADAS CON PAN DE PAYÉS': {
          title: 'TRADITIONAL COUNTRY BREAD TOASTS',
          subtitle: 'Generous slices freshly toasted with premium ingredients',
        },
        'BOCADILLOS ESPECIALES (BE-1 AL BE-7)': {
          title: 'HOUSE SPECIAL SANDWICHES (BE-1 TO BE-7)',
          subtitle: 'Master house combinations served on freshly baked bread',
        },
        'BOCADILLOS CALIENTES DE LA PLANCHA': {
          title: 'HOT GRILLED SANDWICHES',
          subtitle: 'Hot grilled meats, artisan sausages and cold cuts prepared to order',
        },
        'FOCACCIAS ARTESANAS': {
          title: 'ARTISANAL FOCACCIAS',
          subtitle: 'Our 11 signature focaccia recipes with crispy aromatic crust',
        },
        'CARNE Y PESCADO A LA PLANCHA': {
          title: 'GRILLED MEAT AND FISH',
          subtitle: 'Prime cuts grilled to perfection with homemade fries and fresh salad',
        },
        'PLATOS COMBOS (COMBI 1 AL 8)': {
          title: 'COMBO PLATTERS (COMBI 1 TO 8)',
          subtitle: 'Full hearty plates with homemade fries, salad or fried eggs',
        },
        'PARA PICAR Y COMPARTIR': {
          title: 'TAPAS & PLATES TO SHARE',
          subtitle: 'Homemade tapas and sharing portions crafted with fresh market ingredients',
        },
        'ENSALADAS FRESCAS': {
          title: 'FRESH SALADS',
          subtitle: 'Crisp greens, fresh vegetables and house dressings',
        },
        'BURGUERS PREMIUM': {
          title: 'PREMIUM BURGERS',
          subtitle: '100% Black Angus beef & crispy chicken breast with brioche bun and fries',
        },
        'POSTRES CASEROS': {
          title: 'HOMEMADE DESSERTS',
          subtitle: 'The perfect sweet touch crafted fresh in our kitchen',
        },
        'VINOS TINTOS': {
          title: 'RED WINES',
          subtitle: 'Available by glass or bottle',
        },
        'VINOS VERDEJO / BLANCOS': {
          title: 'VERDEJO & WHITE WINES',
          subtitle: 'Available by glass or bottle',
        },
      },
    },
    reservation: {
      badge: 'Direct Online Booking',
      title: 'Book your Table at Café Gaudí',
      subtitle:
        'Secure your spot in our air-conditioned lounge or on our outdoor terrace. Instant confirmation by email and WhatsApp.',
      tabNew: 'New Booking',
      tabCheck: 'My Bookings',
      dateLabel: 'Booking Date',
      quickToday: 'Today',
      quickTomorrow: 'Tomorrow',
      quickWeekend: 'Weekend',
      serviceLabel: 'Service / Shift',
      serviceBrunch: 'Breakfast / Brunch (09:30 - 12:15)',
      serviceLunch: 'Lunch (13:00 - 15:00)',
      serviceAfternoon: 'Afternoon / Drinks (17:30 - 19:45)',
      serviceDinner: 'Dinner (20:30 - 22:00)',
      earlyCloseNotice: 'Note: On Sundays and Mondays we close at 4:00 PM (morning and lunch only).',
      scheduleBannerEarly: 'Sunday & Monday: we close at 04:00 PM (kitchen closes at 03:30 PM). Afternoon & dinner slots unavailable.',
      scheduleBannerRegular: 'Tuesday to Saturday: open from 08:00 AM to 11:00 PM (closes at 11:00 PM).',
      timeLabel: 'Desired Time',
      guestsLabel: 'Number of Guests',
      guestSingular: 'guest',
      guestPlural: 'guests',
      zoneLabel: 'Preferred Seating Zone',
      zoneTerrace: 'Outdoor Terrace',
      zoneSalon: 'Indoor Air-Conditioned Lounge',
      zoneTerraceDesc: 'Pleasant open-air dining on a quiet semi-pedestrian street.',
      zoneSalonDesc: 'Cozy indoor space with air conditioning and relaxed background music.',
      nameLabel: 'Full Name',
      namePlaceholder: 'E.g. Laura Martínez',
      phoneLabel: 'Contact Phone (with country code)',
      phonePlaceholder: '+34 600 000 000',
      emailLabel: 'Email address for confirmation',
      emailPlaceholder: 'example@gmail.com',
      notesLabel: 'Special requests, dietary requirements or high chair (optional)',
      notesPlaceholder: 'E.g. High chair needed, or one guest requires gluten-free food...',
      submitBtn: 'Confirm Table Booking',
      submitting: 'Processing your reservation...',
      successTitle: 'Reservation Successfully Confirmed!',
      successSubtitle: 'Your reservation has been recorded and a confirmation has been sent.',
      codeLabel: 'Reservation Code:',
      detailsLabel: 'Booking details:',
      statusConfirmed: 'CONFIRMED',
      shareWhatsApp: 'Send Confirmation to my WhatsApp',
      downloadPass: 'Download Booking Pass',
      previewEmail: 'Preview Confirmation Email',
      newBookingBtn: 'Make another reservation',
      myBookingsTitle: 'Your Saved Reservations on this device',
      myBookingsEmpty: 'You do not have any active reservations yet.',
      myBookingsHelp: 'When you book a table, it will appear here with its code and real-time status.',
    },
    gallery: {
      badge: 'Specialties & Atmosphere in Mataró',
      title: 'Photo Gallery',
      subtitle:
        'Explore photos of our dishes and ambiance at Café Gaudí: Black Angus burgers, tapas, bravas potatoes, specialty coffee, and the atmosphere on Carrer Germans Thos i Codina 20, Mataró.',
      catAll: 'All photos',
      catGoogle: 'Google Maps (4.8 ★)',
      catBurgers: 'Burgers & Tapas',
      catCoffee: 'Coffee & Brunch',
      catAtmosphere: 'Lounge & Terrace',
      btnCarousel: 'Carousel',
      btnGrid: 'Grid',
      btnPause: 'Pause',
      btnAuto: 'Auto',
      openGoogleMaps: 'View photos and reviews on Google Maps',
      photoCounter: 'Photo {current} to {visible} of {total}',
      verifiedGoogle: 'Verified photo on Google Maps',
      source: 'Source:',
    },
    reviews: {
      badge: 'Verified Google Reviews',
      title: 'What Our Guests Say',
      subtitle:
        'Authentic, verified Google Maps reviews for Café Gaudí in Mataró: our specialty barista coffee, Black Angus burgers, homemade tapas, and welcoming service.',
      ratingScore: '4.8',
      ratingOutOf: 'out of 5.0 on Google Maps',
      totalReviewsText: '+700 Real Reviews',
      verifiedGoogle: 'Official verified Google Business rating',
      viewAllOnGoogle: 'View all Google reviews',
      writeReview: 'Write a review',
      filterAll: 'All reviews',
      filterCoffee: 'Coffee & Breakfast',
      filterBurgers: 'Gourmet Burgers',
      filterTapas: 'Focaccias & Tapas',
      filterSweets: 'Waffles & Sweets',
      filterService: 'Service & Terrace',
      localGuide: 'Local Guide',
      reviewsCount: 'reviews',
      responseFromOwner: 'Response from owner',
      dishesRecommended: 'Recommended dishes & specialties mentioned:',
      satisfactionRate: '98% Positive Feedback',
      satisfactionSub: 'Based on over 700 public reviews on Google',
      searchPlaceholder: 'Search by dish, ingredient, or keyword (e.g., coffee, bravas, burger)...',
    },
    location: {
      badge: 'Visit us in Mataró',
      title: 'How to Get Here & Location',
      subtitle:
        'Find us at Cafetería Gaudí (C/ Germans Thos i Codina / C/ Cooperativa, Mataró), just a 4-minute walk from Mataró Rodalies train station.',
      googleBadge: 'Official Google Maps Listing',
      streetView: 'Google Street View',
      streetViewTitle: 'Street View exploration',
      verifiedListing: 'Verified listing',
      startGps: 'Start GPS Navigation',
      openInGoogleMaps: 'Open in Google Maps',
      openInAppleMaps: 'Apple Maps',
      recenterMap: 'Recenter on Café Gaudí',
      addressTitle: 'Our Address',
      addressLine1: 'Carrer Germans Thos i Codina, 20',
      addressLine2: '08301 Mataró (Barcelona, Spain)',
      scheduleTitle: 'Opening Hours',
      scheduleTueSat: 'Tuesday to Saturday:',
      scheduleTueSatHours: '08:00 AM - 11:00 PM (Continuous kitchen)',
      scheduleSunMon: 'Sunday and Monday:',
      scheduleSunMonHours: '08:00 AM - 04:00 PM (Closed in the evening)',
      phoneTitle: 'Phone',
      emailTitle: 'Email',
      howToArriveTitle: 'How to Get to Café Gaudí',
      trainTitle: 'By Train (Renfe Rodalies R1)',
      trainWalkingTime: '4 min walk',
      trainDesc:
        'Only 400 meters from Mataró Train Station. Walk towards the town center and easily reach us on Carrer Germans Thos i Codina.',
      carTitle: 'By Car & Parking',
      carDesc:
        '• Plaça de les Tereses Parking: 350m away.\n• Station / Port de Mataró Parking: 400m away.\nStreet parking (blue zone) and 24h covered garages.',
      busTitle: 'Mataró Urban & Interurban Bus',
      busDesc:
        'Stops 2 minutes away at Camí Ral and Muralla dels Genovesos (Lines 1, 2, 3, 4 and express bus to Barcelona).',
      viewSatellite: 'Google Satellite',
      viewMap: 'Google Street Map',
      viewStylized: 'Stylized Map',
      openGoogleMaps: 'Open Directions in Google Maps',
      copyAddress: 'Copy Address',
      copied: 'Address Copied!',
      scheduleCardBadge: 'Opening Hours',
      scheduleCardType: 'Coffee Bar & Restaurant',
      scheduleCardTitle: 'Hours & Bookings',
      scheduleTueSatDays: 'Tuesday to Saturday',
      scheduleTueSatTime: '08:00 AM - 11:00 PM',
      scheduleTueSatNote: 'Breakfast, lunch, afternoon drinks & dinner',
      scheduleTueSatClose: 'Closes at 11:00 PM',
      scheduleSunMonDays: 'Sunday & Monday',
      scheduleSunMonTime: '08:00 AM - 04:00 PM',
      scheduleSunMonNote: 'Breakfast, brunch & lunch',
      scheduleSunMonClose: 'Closes at 04:00 PM',
      whatsappDirect: 'Direct WhatsApp',
    },
    footer: {
      brandSubtitle: 'Coffee Bar • Tapas • Mataró',
      description:
        'Mediterranean gastronomy with coastal soul, artisanal focaccias, griddle combos, specialty coffee, and delicious tapas in central Mataró.',
      navTitle: 'Navigation',
      navigation: 'Navigation',
      contactTitle: 'Contact & Address',
      hoursTitle: 'Opening Hours',
      schedule: 'Opening Hours',
      scheduleWeek: 'Tuesday to Saturday: 08:00 AM - 11:00 PM',
      scheduleWeekend: 'Sunday & Monday: 08:00 AM - 04:00 PM',
      qualityTitle: 'Quality & Commitment',
      qualityDesc:
        'Market-fresh cuisine with daily selected ingredients. Passion for authentic dining.',
      qualityBadge: 'Freshness guarantee & daily preparation',
      rights: 'All rights reserved.',
      craftedWith: 'Café Gaudí • Passion for great food in Mataró',
      adminPanel: 'Admin Panel',
    },
    allergens: {
      gluten: { name: 'Gluten / Cereals', desc: 'Wheat, rye, barley, oats and breads' },
      crustaceos: { name: 'Crustaceans', desc: 'Prawns, shrimps, crabs and derivatives' },
      huevos: { name: 'Eggs', desc: 'Omelettes, homemade mayonnaise and batters' },
      pescado: { name: 'Fish', desc: 'Tuna, anchovies, cod and fish products' },
      cacahuetes: { name: 'Peanuts', desc: 'Peanuts and traces in snacks' },
      soja: { name: 'Soybeans', desc: 'Soy sauce and vegetable lecithins' },
      lacteos: { name: 'Milk / Dairy', desc: 'Gouda, Manchego, Brie cheeses, butter' },
      frutos_cascara: { name: 'Tree Nuts', desc: 'Walnuts, almonds, hazelnuts' },
      apio: { name: 'Celery', desc: 'Vegetable stocks and stir-fries' },
      mostaza: { name: 'Mustard', desc: 'Special sauces and dressings' },
      sesamo: { name: 'Sesame seeds', desc: 'Burger buns and toasted breads' },
      sulfitos: { name: 'Sulphites', desc: 'Table wines, vinegars and pickles' },
      altramuces: { name: 'Lupin', desc: 'Vegetable flours and savory snacks' },
      moluscos: { name: 'Molluscs', desc: 'Mussels, calamari, cuttlefish and octopus' },
    },
  },
};

export const translations = TRANSLATIONS;
