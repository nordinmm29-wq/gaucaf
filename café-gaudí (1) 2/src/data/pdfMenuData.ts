import { MenuItem } from '../types';
import { MENU_ITEMS } from './menuData';

export interface PdfMenuSection {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export interface PdfMenuPage {
  pageNumber: number;
  pageCode: string;
  title: string;
  tabTitle: string;
  summary?: string;
  scheduleNote?: string;
  footerNote?: string;
  hasSupplements?: boolean;
  sections: PdfMenuSection[];
}

export const MENU_SUPPLEMENTS = [
  { name: 'Bacon', price: '+1,10 €' },
  { name: 'Pimiento verde', price: '+1,00 €' },
  { name: 'Queso Gouda o Cheddar', price: '+1,00 €' },
  { name: 'Queso de Cabra', price: '+2,00 €' },
  { name: 'Queso Brie', price: '+1,50 €' },
  { name: 'Queso Manchego', price: '+2,50 €' },
  { name: 'Huevo a la plancha', price: '+1,00 €' },
  { name: 'Cebolla (cruda, crispy o caramelizada)', price: '+0,80 €' },
  { name: 'Aguacate fresco', price: '+1,50 €' },
  { name: 'Mézclum de brotes', price: '+0,80 €' },
  { name: 'Jalapeños o Pepinillos', price: '+1,00 €' },
  { name: 'Olivas rellenas', price: '+0,90 €' },
  { name: 'Tomate en rodajas', price: '+1,00 €' },
  { name: 'Alioli casero o Salsa Brava Gaudí', price: '+0,95 €' },
  { name: 'Supl. Ración de Patatas', price: '+2,00 €' },
  { name: 'Supl. Patatas Gaudí', price: '+1,50 €' },
  { name: 'Supl. Pan sin gluten', price: '+2,00 €' },
];

const itemMap = new Map<string, MenuItem>(MENU_ITEMS.map((item) => [item.id, item]));

const getItems = (ids: string[]): MenuItem[] => {
  return ids.map((id) => itemMap.get(id)).filter((item): item is MenuItem => Boolean(item));
};

export const PDF_MENU_PAGES: PdfMenuPage[] = [
  {
    pageNumber: 1,
    pageCode: 'pag-1',
    title: 'PÁGINA 1: CARTA DE OFERTAS & MENÚS',
    tabTitle: '1. Ofertas & Menús',
    summary: 'Ofertas matinales, vermút y menús de mediodía',
    scheduleNote: 'Ofertas matinales de lunes a viernes de 8:00h a 13:00h. Fin de semana y festivos no se hacen ofertas.',
    sections: [
      {
        title: 'OFERTAS MATINALES (LUNES A VIERNES)',
        subtitle: 'Café, agua o té incluido en todas las ofertas matinales',
        items: getItems(['oferta-1', 'oferta-2', 'oferta-3-mini', 'oferta-3-tostadas']),
      },
      {
        title: 'PACK VERMÚT & MENÚ INFANTIL',
        items: getItems(['pack-vermut', 'menu-infantil']),
      },
      {
        title: 'MENÚ PLATOS COMBOS DE MEDIODÍA',
        subtitle: 'De lunes a viernes (13:00h a 16:00h) Platos Combos + Bebida + Postre o Café (14,90€ - 17,50€). Jueves: Paella • Viernes: Fideuá.',
        items: getItems(['platos-combos-menu-mediodia']),
      },
    ],
  },
  {
    pageNumber: 2,
    pageCode: 'pag-2',
    title: 'PÁGINA 2: DESAYUNOS (BEBIDAS, MINIS Y BOCADILLOS, TORRADAS)',
    tabTitle: '2. Desayunos & Torradas',
    summary: 'Cafés, tés, minis, bocadillos fríos y torradas',
    scheduleNote: 'De lunes a viernes de 8:00h a 13:00h.',
    footerNote: '* No se harán minis calientes por la noche.',
    sections: [
      {
        title: 'BEBIDAS DE CAFETERÍA & TÉS',
        subtitle: 'Cafés de tueste natural, infusiones selectas y zumos naturales',
        items: getItems([
          'cafe-solo',
          'cafe-cortado',
          'cafe-con-leche',
          'cafe-con-leche-xl',
          'cafe-americano',
          'carajillo-ron-anis-conac',
          'carajillo-whisky-baileys',
          'trifasico',
          'cafe-bombom',
          'colacao',
          'cacaolat',
          'vaso-de-leche',
          'capuchino',
          'te-de-carta',
          'agua-pequena',
          'chai-latte',
          'zumo-naranja-natural',
          'zumo-granini',
        ]),
      },
      {
        title: 'MINIS Y BOCADILLOS (DESAYUNOS)',
        subtitle: 'Pan crujiente con tomate de colgar y aceite de oliva virgen extra',
        items: getItems([
          'mini-fuet',
          'mini-jamon',
          'mini-jamon-iberico',
          'mini-jamon-dulce',
          'mini-pavo',
          'mini-bull-blanc',
          'mini-queso-semi',
          'mini-queso-manchego',
          'mini-atun',
          'mini-vegetal-atun',
          'mini-bacon-desayuno',
          'mini-lomo-desayuno',
          'mini-pollo-desayuno',
          'mini-vegetal-pollo-desayuno',
          'mini-tortilla-francesa',
          'mini-tortilla-patata',
          'bikini-clasico',
        ]),
      },
      {
        title: 'TORRADAS CON PAN DE PAYÉS',
        subtitle: 'Rebanadas generosas tostadas al momento con ingredientes frescos',
        items: getItems([
          'torrada-embutidos-frios',
          'torrada-mantequilla-mermelada',
          'torrada-huevo-aguacate',
          'torrada-salmon-philadelphia',
          'torrada-salmon-huevo-completa',
          'pincho-tortilla-pan-tomate',
          'plato-tortilla-francesa-tomate-aguacate',
        ]),
      },
    ],
  },
  {
    pageNumber: 3,
    pageCode: 'pag-3',
    title: 'PÁGINA 3: BOCADILLOS ESPECIALES & BOCADILLOS CALIENTES',
    tabTitle: '3. Bocadillos Calientes',
    summary: 'Especiales de la casa y carnes a la plancha',
    scheduleNote: '* No se harán minis calientes por la noche.',
    hasSupplements: true,
    sections: [
      {
        title: 'BOCADILLOS ESPECIALES (BE-1 AL BE-7)',
        subtitle: 'Combinaciones maestras de la casa con pan recién horneado',
        items: getItems([
          'be-1-lomo-gouda',
          'be-2-ternera-pimiento',
          'be-3-butifarra-queso',
          'be-4-pulled-pork-bbq',
          'bocadillo-golosa',
          'bocadillo-frankfurt-especial',
          'bocadillo-vegetal-gaudi',
        ]),
      },
      {
        title: 'BOCADILLOS CALIENTES DE LA PLANCHA',
        subtitle: 'Carnes, embutidos artesanos y salchichas preparadas al momento',
        items: getItems([
          'bocadillo-bacon-caliente',
          'bocadillo-lomo-caliente',
          'bocadillo-pollo-caliente',
          'bocadillo-ternera-caliente',
          'bocadillo-butifarra-pages',
          'bocadillo-frankfurt-90gr',
          'bocadillo-mega-cervela-190gr',
          'bocadillo-mega-pikansburg-190gr',
          'bocadillo-bratwurst-blanca-150gr',
          'bocadillo-hamburguesa-maxi-100gr',
          'bocadillo-hamburguesa-angus-200gr',
          'bocadillo-hamburguesa-legumbres-100gr',
          'bocadillo-salchichas-pinchos',
          'bocadillo-salchichas-pais',
        ]),
      },
    ],
  },
  {
    pageNumber: 4,
    pageCode: 'pag-4',
    title: 'PÁGINA 4: FOCACCIAS ARTESANAS',
    tabTitle: '4. Focaccias Artesanas',
    summary: '11 recetas de masa artesanal horneada',
    scheduleNote: 'Masa de focaccia artesana horneada al punto, crujiente y aromática con romero y aceite de oliva virgen extra.',
    sections: [
      {
        title: 'FOCACCIAS ARTESANAS',
        subtitle: 'Nuestras 11 recetas exclusivas de focaccia',
        items: getItems([
          'focaccia-tuna',
          'focaccia-olot',
          'focaccia-la-pepa',
          'focaccia-pepa-2-0',
          'focaccia-vegetal',
          'focaccia-milanesa',
          'focaccia-gastro',
          'focaccia-gaudi',
          'focaccia-pincho-moruno',
          'focaccia-salmon-ahumado',
          'focaccia-jamon-dulce-queso',
        ]),
      },
    ],
  },
  {
    pageNumber: 5,
    pageCode: 'pag-5',
    title: 'PÁGINA 5: PLATO CARNE Y PESCADO & PLATOS COMBOS',
    tabTitle: '5. Combos & Carnes',
    summary: 'Platos combinados (1-8) y carnes a la plancha',
    scheduleNote: 'De lunes a viernes (13:00h a 16:00h) Platos Combos + Bebida + Postre o Café (14,90€ - 17,50€). Jueves: Paella • Viernes: Fideuá.',
    sections: [
      {
        title: 'CARNE Y PESCADO A LA PLANCHA',
        subtitle: 'Piezas nobles cocinadas al punto con patatas caseras y ensalada',
        items: getItems([
          'plato-entrana-vacuno',
          'plato-entrecot-ternera-300gr',
          'plato-sepia-plancha',
          'plato-salmon-noruego',
          'plato-calamares-plancha-vieira',
        ]),
      },
      {
        title: 'PLATOS COMBOS (COMBI 1 AL 8)',
        subtitle: 'Combinaciones completas y sabrosas con patatas caseras, ensalada o huevo',
        items: getItems([
          'combi-1',
          'combi-2',
          'combi-3',
          'combi-4-brasa',
          'combi-5-brasa',
          'combi-6-brasa',
          'combi-7',
          'combi-8-novedad',
        ]),
      },
    ],
  },
  {
    pageNumber: 6,
    pageCode: 'pag-6',
    title: 'PÁGINA 6: PARA PICAR Y COMPARTIR & ENSALADAS',
    tabTitle: '6. Tapas & Ensaladas',
    summary: 'Bravas caseras, croquetas, calamares y raciones',
    scheduleNote: 'Tapas tradicionales recién fritas y a la plancha, raciones para compartir y ensaladas frescas.',
    sections: [
      {
        title: 'PARA PICAR Y COMPARTIR',
        subtitle: 'Tapas caseras y raciones elaboradas con producto fresco',
        items: getItems([
          'patatas-fritas',
          'bravas-alioli-salsa-gaudi',
          'patatas-gaudi-especial',
          'croquetas-pollo',
          'croquetas-iberico',
          'croquetas-setas',
          'croquetas-rabo-toro',
          'alitas-pollo-sazon-gaudi',
          'fingers-pollo-receta-propia',
          'calamares-andaluza-langostino-panko',
          'pimientos-del-padron',
          'calamares-enteros-plancha-langostinos',
          'ensaladilla-rusa-novedad',
        ]),
      },
      {
        title: 'ENSALADAS FRESCAS',
        subtitle: 'Brotes selectos, verduras frescas y aderezos de la casa',
        items: getItems([
          'tartar-gastro-novedad',
          'ensalada-tomate-aguacate',
          'ensalada-cabrona',
          'ensalada-tropical-gaudi',
        ]),
      },
    ],
  },
  {
    pageNumber: 7,
    pageCode: 'pag-7',
    title: 'PÁGINA 7: BURGUERS PREMIUM & POSTRES',
    tabTitle: '7. Burguers & Postres',
    summary: 'Hamburguesas Black Angus y postres caseros',
    scheduleNote: 'Todas nuestras hamburguesas van acompañadas de papitas caseras.',
    sections: [
      {
        title: 'BURGUERS PREMIUM',
        subtitle: 'Carne 100% Black Angus y pechuga crujiente con pan brioche y papitas caseras',
        items: getItems([
          'burger-completa-gaudi',
          'burger-olot',
          'burger-barbacoa',
          'burger-mejicana',
          'burger-la-carnica',
          'burger-crujiente-pollo',
        ]),
      },
      {
        title: 'POSTRES CASEROS',
        subtitle: 'El broche de oro dulce elaborado en nuestra cocina',
        items: getItems([
          'tarta-de-queso-casera',
          'coulant-chocolate-helado-nata',
          'puding-casero-nata-sirope',
          'flan-de-huevo-con-nata',
          'bolas-helados-artesanales',
          'melocoton-en-almibar',
          'yogurt-natural',
        ]),
      },
    ],
  },
  {
    pageNumber: 8,
    pageCode: 'pag-8',
    title: 'PÁGINA 8: CARTA DE VINOS (TINTOS Y VERDEJOS / BLANCOS)',
    tabTitle: '8. Carta de Vinos',
    summary: 'Vinos tintos y verdejos / blancos D.O.',
    scheduleNote: 'Vinos con Denominación de Origen seleccionados para acompañar nuestras carnes y tapas.',
    sections: [
      {
        title: 'VINOS TINTOS',
        subtitle: 'Disponibles por copa o botella',
        items: getItems([
          'vino-pierola-rioja-crianza',
          'vino-faustino-rivero-ulecia-rioja',
          'vino-ramon-bilbao-rioja-crianza-2021',
          'vino-cruz-de-alba-roble-ribera-2023',
        ]),
      },
      {
        title: 'VINOS VERDEJO / BLANCOS',
        subtitle: 'Disponibles por copa o botella',
        items: getItems([
          'vino-cyatho-verdejo-rueda-2024',
          'vino-o-godello-ribeira-sacra-2024',
          'vino-faustino-rivero-verdejo',
          'vino-ramon-bilbao-verdejo-2023',
          'vino-anec-mut-blanc-2024',
        ]),
      },
    ],
  },
];
