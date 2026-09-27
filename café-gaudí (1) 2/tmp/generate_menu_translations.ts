import * as fs from 'fs';

const translationsData: Record<string, { name_cat: string; desc_cat: string; name_eng: string; desc_eng: string }> = {
  // --- PAGE 1: OFERTAS & MENÚS ---
  'oferta-1': {
    name_cat: 'OFERTA 1: Cafè, Aigua o Te + Brioxeria o Torrada',
    desc_cat: 'Cafè, aigua o te + A triar: Croissant, Dònut de sucre, Dònut de xocolata o Magdalena.',
    name_eng: 'DEAL 1: Coffee, Water or Tea + Pastry or Toast',
    desc_eng: 'Coffee, water or tea + Choice of: Croissant, Sugar donut, Chocolate donut or Muffin.',
  },
  'oferta-2': {
    name_cat: 'OFERTA 2: Cafè, Aigua o Te + Mini',
    desc_cat: 'Cafè, aigua o te + A triar: Mini fred o Mini de truita (francesa o patata).',
    name_eng: 'DEAL 2: Coffee, Water or Tea + Mini Sandwich',
    desc_eng: 'Coffee, water or tea + Choice of: Cold mini sandwich or Omelette mini (French or Spanish potato).',
  },
  'oferta-3-mini': {
    name_cat: 'OFERTA 3A: Suc Especial o Te Especial + Mini Fred',
    desc_cat: 'Suc de taronja natural o Granini, Te Matcha o Chai Latte + A triar: Mini fred.',
    name_eng: 'DEAL 3A: Specialty Juice or Tea + Cold Mini Sandwich',
    desc_eng: 'Fresh squeezed orange juice or Granini, Matcha Tea or Chai Latte + Choice of: Cold mini sandwich.',
  },
  'oferta-3-tostadas': {
    name_cat: 'OFERTA 3B: Suc Especial o Te Especial + Torrades Saludables',
    desc_cat: 'Suc de taronja natural o Granini, Te Matcha o Chai Latte + Torrades amb ou picat, alvocat i brots frescos.',
    name_eng: 'DEAL 3B: Specialty Juice or Tea + Healthy Toasts',
    desc_eng: 'Fresh squeezed orange juice or Granini, Matcha Tea or Chai Latte + Toasts with chopped egg, avocado and fresh sprouts.',
  },
  'pack-vermut': {
    name_cat: 'Pack Vermut Especial Gaudí',
    desc_cat: 'Tots els dies: Musclos en escabetx, escopinyes, olives farcides, patates braves Gaudí + 2 Vermuts Izaguirre (Negre o Blanc).',
    name_eng: 'Special Gaudí Vermouth Aperitif Pack',
    desc_eng: 'Every day: Pickled mussels, cockles, stuffed olives, Gaudí patatas bravas + 2 Izaguirre Vermouths (Red or White).',
  },
  'menu-infantil': {
    name_cat: 'Menú Infantil (Menors de 10 anys)',
    desc_cat: 'A triar: Pitrera de pollastre, Frankfurt, Llom, Bikini, Truita francesa, Fingers de pollastre o Hamburguesa maxi + Patatetes fregides casolanes + Aigua + Llaminadures o Ou Kinder.',
    name_eng: 'Kids Menu (Under 10 years old)',
    desc_eng: 'Choice of: Chicken breast, Frankfurt, Pork loin, Grilled Bikini, French omelette, Chicken fingers or Maxi burger + Homemade fries + Water + Sweets or Kinder Surprise.',
  },
  'platos-combos-menu-mediodia': {
    name_cat: 'Menú Plats Combos de Migdia',
    desc_cat: 'De dilluns a divendres de 13:00 a 16:00: Plat combinat a triar + Beguda + Postres, Te o Cafè. (Dijous: Paella • Divendres: Fideuà).',
    name_eng: 'Lunch Combo Platter Menu',
    desc_eng: 'Monday to Friday 1:00 PM - 4:00 PM: Choice of combo platter + Beverage + Dessert, Tea or Coffee. (Thursday: Paella • Friday: Fideuá).',
  },

  // --- PAGE 2: BEBIDAS DE CAFETERÍA, MINIS Y TORRADAS ---
  'cafe-solo': {
    name_cat: 'Cafè Sol',
    desc_cat: 'Cafè de torrat natural amb cos i crema daurada.',
    name_eng: 'Espresso (Café Solo)',
    desc_eng: 'Naturally roasted coffee with rich body and golden crema.',
  },
  'cafe-cortado': {
    name_cat: 'Cafè Tallat',
    desc_cat: 'Espresso amb un toc de llet vaporitzada.',
    name_eng: 'Cortado (Espresso with a splash of milk)',
    desc_eng: 'Espresso with a dash of warm steamed milk.',
  },
  'cafe-con-leche': {
    name_cat: 'Cafè amb Llet',
    desc_cat: 'Clàssic cafè amb llet equilibrat amb escuma suau.',
    name_eng: 'Coffee with Milk (Café con Leche)',
    desc_eng: 'Balanced espresso and steamed milk with a silky froth.',
  },
  'cafe-con-leche-xl': {
    name_cat: 'Cafè amb Llet XL',
    desc_cat: 'Tassa gran per als amants del bon cafè amb llet.',
    name_eng: 'Large Coffee with Milk XL',
    desc_eng: 'Large mug for true coffee lovers.',
  },
  'cafe-americano': {
    name_cat: 'Cafè Americà',
    desc_cat: 'Espresso llarg amb aigua calenta, suau i aromàtic.',
    name_eng: 'Americano Coffee',
    desc_eng: 'Long espresso with hot water, smooth and aromatic.',
  },
  'carajillo-ron-anis-conac': {
    name_cat: 'Cigalló / Carajillo (Ron, Anís o Coinyac)',
    desc_cat: 'Tradicional cigalló aromatitzat amb el licor a triar.',
    name_eng: 'Spiked Coffee (Rum, Anisette or Cognac)',
    desc_eng: 'Traditional Spanish spiked espresso with your choice of liquor.',
  },
  'carajillo-whisky-baileys': {
    name_cat: 'Cigalló / Carajillo (Whisky o Baileys)',
    desc_cat: 'Cigalló premium amb whisky o crema Baileys.',
    name_eng: 'Premium Spiked Coffee (Whisky or Baileys)',
    desc_eng: 'Premium spiked espresso with Scotch whisky or Irish Baileys.',
  },
  'trifasico': {
    name_cat: 'Trifàsic',
    desc_cat: 'Cafè, llet i toc del licor de la teva preferència.',
    name_eng: 'Trifásico Coffee',
    desc_eng: 'Espresso, steamed milk and a drop of your preferred spirit.',
  },
  'cafe-bombom': {
    name_cat: 'Cafè Bombó',
    desc_cat: 'Espresso intens sobre llit de llet condensada.',
    name_eng: 'Café Bombón',
    desc_eng: 'Rich espresso over a sweet base of condensed milk.',
  },
  'colacao': {
    name_cat: 'Cola Cao Calent o Fred',
    desc_cat: 'Cacau soluble tradicional amb llet calenta o freda.',
    name_eng: 'Cola Cao Hot or Cold Chocolate',
    desc_eng: 'Traditional Spanish malted cocoa drink served hot or chilled.',
  },
  'cacaolat': {
    name_cat: 'Batut de Xocolata Cacaolat',
    desc_cat: 'L’icònic batut català de cacau servit fred o calent.',
    name_eng: 'Cacaolat Chocolate Milkshake',
    desc_eng: 'Iconic Catalan cocoa milkshake served chilled or warm.',
  },
  'vaso-de-leche': {
    name_cat: 'Got de Llet Fresca',
    desc_cat: 'Llet sencera, semidesnatada, desnatada o beguda vegetal.',
    name_eng: 'Glass of Fresh Milk',
    desc_eng: 'Choice of whole, semi-skimmed, skimmed or plant-based milk.',
  },
  'capuchino': {
    name_cat: 'Caputxino amb Cacau',
    desc_cat: 'Espresso amb cremosa escuma de llet i cacau en pols.',
    name_eng: 'Cappuccino with Dusted Cocoa',
    desc_eng: 'Espresso with rich velvety steamed milk froth and dusted cocoa.',
  },
  'te-de-carta': {
    name_cat: 'Tes i Infusions Selectes de Carta',
    desc_cat: 'Selecció d’infusions naturals: verd, negre, camamilla, menta poleo o fruites vermelles.',
    name_eng: 'Selected Teas & Herbal Infusions',
    desc_eng: 'Selection of natural infusions: green, black, chamomile, pennyroyal mint or berries.',
  },
  'agua-pequena': {
    name_cat: 'Aigua Mineral 33cl',
    desc_cat: 'Aigua mineral natural freda o a temperatura ambient.',
    name_eng: 'Mineral Water 33cl',
    desc_eng: 'Natural still mineral water served chilled or room temperature.',
  },
  'chai-latte': {
    name_cat: 'Chai Latte Espèciat',
    desc_cat: 'Te negre amb espècies orientals i llet vaporitzada suau.',
    name_eng: 'Spiced Chai Latte',
    desc_eng: 'Black tea infused with aromatic warm spices and creamy steamed milk.',
  },
  'zumo-naranja-natural': {
    name_cat: 'Suc de Taronja Natural acabat d’esprémer',
    desc_cat: 'Taronges fresques espremudes al moment, 100% natural.',
    name_eng: 'Fresh Squeezed Orange Juice',
    desc_eng: '100% pure fresh-squeezed orange juice, packed with vitamins.',
  },
  'zumo-granini': {
    name_cat: 'Suc Granini d’Ampolla',
    desc_cat: 'Sabors variats: préssec, pinya, poma o taronja.',
    name_eng: 'Granini Bottled Fruit Juice',
    desc_eng: 'Assorted bottled fruit juice: peach, pineapple, apple or orange.',
  },

  // Minis de Desayuno
  'mini-fuet': {
    name_cat: 'Mini de Fuet Artesà',
    desc_cat: 'Fuet de Vic artesà a rodanxes sobre pa cruixent amb tomàquet.',
    name_eng: 'Catalan Fuet Artisan Mini',
    desc_eng: 'Traditional sliced Catalan fuet cured sausage on tomato bread.',
  },
  'mini-jamon': {
    name_cat: 'Mini de Pernil de Celler',
    desc_cat: 'Pernil curat de celler seleccionat amb pa amb tomàquet.',
    name_eng: 'Bodega Cured Ham Mini',
    desc_eng: 'Selected Spanish cured bodega ham on crusty tomato bread.',
  },
  'mini-jamon-iberico': {
    name_cat: 'Mini de Pernil Ibèric',
    desc_cat: 'Pernil ibèric de gla de primera qualitat sobre pa de coca amb tomàquet.',
    name_eng: 'Iberian Ham Premium Mini',
    desc_eng: 'Top quality Iberian cured ham on crusty crystal bread rubbed with tomato.',
  },
  'mini-jamon-dulce': {
    name_cat: 'Mini de Pernil Dolç',
    desc_cat: 'Pernil cuit extra tendre en pa artesà.',
    name_eng: 'Cooked York Ham Mini',
    desc_eng: 'Extra tender cooked York ham on freshly baked bread.',
  },
  'mini-pavo': {
    name_cat: 'Mini de Pitrera de Gall Dindi',
    desc_cat: 'Pit de gall dindi baix en greix sobre pa cruixent.',
    name_eng: 'Smoked Turkey Breast Mini',
    desc_eng: 'Low-fat sliced roasted turkey breast on crispy bread.',
  },
  'mini-bull-blanc': {
    name_cat: 'Mini de Bull Blanc Tradicional',
    desc_cat: 'Embotit artesà típic català de màxima qualitat.',
    name_eng: 'White Bull Traditional Sausage Mini',
    desc_eng: 'Traditional Catalan artisan white bull sausage.',
  },
  'mini-queso-semi': {
    name_cat: 'Mini de Formatge Semicurat',
    desc_cat: 'Formatge semicurat de gust equilibrat i textura cremosa.',
    name_eng: 'Semi-Cured Cheese Mini',
    desc_eng: 'Semi-cured farm cheese with balanced flavor and creamy texture.',
  },
  'mini-queso-manchego': {
    name_cat: 'Mini de Formatge Manxec Curat',
    desc_cat: 'Formatge d’ovella manxec de curació noble amb oli d’oliva verge extra.',
    name_eng: 'Aged Manchego Cheese Mini',
    desc_eng: 'Aged sheep Manchego cheese with a drizzle of extra virgin olive oil.',
  },
  'mini-atun': {
    name_cat: 'Mini de Tonyina en Oli d’Oliva',
    desc_cat: 'Tonyina clara seleccionada amb pa amb tomàquet suau.',
    name_eng: 'Tuna in Olive Oil Mini',
    desc_eng: 'Selected light tuna in olive oil on rubbed tomato bread.',
  },
  'mini-vegetal-atun': {
    name_cat: 'Mini Vegetal de Tonyina',
    desc_cat: 'Tonyina, enciam fresc, tomàquet a rodanxes i suau maionesa.',
    name_eng: 'Tuna & Fresh Salad Mini',
    desc_eng: 'Tuna, crisp lettuce, sliced ripe tomato and light mayonnaise.',
  },
  'mini-bacon-desayuno': {
    name_cat: 'Mini de Bacó a la Planxa',
    desc_cat: 'Tires de bacó daurades i cruixents a la planxa.',
    name_eng: 'Crispy Grilled Bacon Mini',
    desc_eng: 'Golden griddled crispy bacon strips in warm crusty bread.',
  },
  'mini-lomo-desayuno': {
    name_cat: 'Mini de Llom a la Planxa',
    desc_cat: 'Llom tendre de porc acabat de fer a la planxa.',
    name_eng: 'Griddled Pork Loin Mini',
    desc_eng: 'Tender pork loin griddled fresh to order on crusty bread.',
  },
  'mini-pollo-desayuno': {
    name_cat: 'Mini de Pitrera de Pollastre a la Planxa',
    desc_cat: 'Pitrera de pollastre suculenta a la planxa amb pa amb tomàquet.',
    name_eng: 'Grilled Chicken Breast Mini',
    desc_eng: 'Juicy griddled chicken breast on crusty bread with tomato.',
  },
  'mini-vegetal-pollo-desayuno': {
    name_cat: 'Mini Vegetal de Pollastre a la Planxa',
    desc_cat: 'Pollastre a la planxa, brots verds, tomàquet i maionesa.',
    name_eng: 'Grilled Chicken & Salad Mini',
    desc_eng: 'Grilled chicken breast with mixed greens, tomato and light mayo.',
  },
  'mini-tortilla-francesa': {
    name_cat: 'Mini de Truita Francesa acabada de fer',
    desc_cat: 'Truita d’ous frescos suau i suculenta al moment.',
    name_eng: 'Fresh French Omelette Mini',
    desc_eng: 'Fluffy fresh-egg French omelette made to order in warm bread.',
  },
  'mini-tortilla-patata': {
    name_cat: 'Mini de Truita de Patates Casolana',
    desc_cat: 'La nostra clàssica truita de patates i ceba sobre pa amb tomàquet.',
    name_eng: 'Spanish Potato Omelette Mini',
    desc_eng: 'Our signature homemade Spanish potato and onion omelette.',
  },
  'bikini-clasico': {
    name_cat: 'Bikini Clàssic (Pernil Dolç i Formatge)',
    desc_cat: 'Sandvitx torrat amb mantega, pernil dolç i formatge fos cremós.',
    name_eng: 'Classic Bikini (Grilled Ham & Cheese)',
    desc_eng: 'Toasted buttered sandwich with cooked ham and melted creamy cheese.',
  },

  // Torradas
  'torrada-embutidos-frios': {
    name_cat: 'Torrada d’Embotits Freds Variats',
    desc_cat: 'Rebanada gran de pa de pagès torrat amb tomàquet, oli d’oliva verge extra i assortiment d’embotits catalans.',
    name_eng: 'Assorted Cold Cured Meats Country Toast',
    desc_eng: 'Generous rustic country bread toasted with tomato, EVOO and traditional cold cured meats.',
  },
  'torrada-mantequilla-mermelada': {
    name_cat: 'Torrada amb Mantega i Melmelada',
    desc_cat: 'Dues rebanades de pa de pagès torrat amb mantega artesana i melmelada de maduixa o préssec.',
    name_eng: 'Country Toast with Butter & Fruit Jam',
    desc_eng: 'Toasted rustic country bread with artisan butter and strawberry or peach jam.',
  },
  'torrada-huevo-aguacate': {
    name_cat: 'Torrada Saludable d’Ou Picat i Alvocat Fresc',
    desc_cat: 'Pa de pagès torrat amb alvocat fresc laminat, ou cuit picat, llavors i oli d’oliva verge extra.',
    name_eng: 'Healthy Chopped Egg & Fresh Avocado Toast',
    desc_eng: 'Toasted country bread with ripe sliced avocado, chopped egg, mixed seeds and EVOO.',
  },
  'torrada-salmon-philadelphia': {
    name_cat: 'Torrada de Salmó Fumat amb Formatge Philadelphia',
    desc_cat: 'Salmó fumat noruec de qualitat sobre base generosa de formatge crema Philadelphia i pa de pagès torrat.',
    name_eng: 'Smoked Salmon & Cream Cheese Toast',
    desc_eng: 'Premium Norwegian smoked salmon over rich Philadelphia cream cheese on rustic bread.',
  },
  'torrada-salmon-huevo-completa': {
    name_cat: 'Torrada Completa de Salmó Fumat, Ou Picat i Brots',
    desc_cat: 'Torrada gurmet amb salmó fumat noruec, ou dur picat, brots frescos i vinagreta suau.',
    name_eng: 'Smoked Salmon, Chopped Egg & Sprouts Deluxe Toast',
    desc_eng: 'Deluxe country toast with Norwegian smoked salmon, chopped egg, fresh greens and light dressing.',
  },
  'pincho-tortilla-pan-tomate': {
    name_cat: 'Pintxo de Truita de Patates amb Pa amb Tomàquet',
    desc_cat: 'Generosa porció de truita de patates casolana acompanyada de pa de pagès torrat amb tomàquet.',
    name_eng: 'Spanish Potato Omelette Pincho with Tomato Bread',
    desc_eng: 'Generous wedge of homemade Spanish potato omelette served with rustic tomato bread.',
  },
  'plato-tortilla-francesa-tomate-aguacate': {
    name_cat: 'Plat de Truita Francesa amb Tomàquet i Alvocat',
    desc_cat: 'Truita francesa de 2 ous frescos acompanyada d’amanida de tomàquet i alvocat laminat.',
    name_eng: 'French Omelette Plate with Sliced Tomato & Avocado',
    desc_eng: 'Two-egg fluffy French omelette served with fresh sliced tomato and avocado salad.',
  },

  // --- PAGE 3: BOCADILLOS ESPECIALES & CALIENTES ---
  'be-1-lomo-gouda': {
    name_cat: 'BE-1: Llom, Bacó, Formatge Gouda i Ceba Confitada',
    desc_cat: 'Filets de llom a la planxa, bacó cruixent, formatge gouda fos i ceba caramel·litzada en pa rústic.',
    name_eng: 'BE-1: Pork Loin, Bacon, Gouda Cheese & Sweet Onion',
    desc_eng: 'Griddled tender pork loin, crispy bacon, melted Gouda cheese and caramelized onion on crusty bread.',
  },
  'be-2-ternera-pimiento': {
    name_cat: 'BE-2: Vedella, Pebrot Verd i Salsa de Carn Gaudí',
    desc_cat: 'Vedella a la planxa, pebrot verd rostit i la nostra reducció de salsa de carn de la casa.',
    name_eng: 'BE-2: Beef Steak, Green Pepper & Meat Jus',
    desc_eng: 'Griddled beef steak, roasted green pepper and house slow-simmered meat sauce reduction.',
  },
  'be-3-butifarra-queso': {
    name_cat: 'BE-3: Botifarra amb Formatge, Ceba Vermella i Salsa de Carn',
    desc_cat: 'Botifarra artesana a la planxa, formatge fos, ceba vermella fresca i salsa de carn.',
    name_eng: 'BE-3: Catalan Butcher Sausage with Cheese, Red Onion & Meat Gravy',
    desc_eng: 'Artisan Catalan sausage on the griddle, melted cheese, crisp red onion and savory meat gravy.',
  },
  'be-4-pulled-pork-bbq': {
    name_cat: 'BE-4: Pulled Pork, Bacó, Gouda, Mèzclum, Jalapeños i Salsa BBQ',
    desc_cat: 'Pulled pork cuinat a baixa temperatura, bacó cruixent, formatge gouda, fulles verdes, jalapeños i salsa barbacoa fumada.',
    name_eng: 'BE-4: Pulled Pork, Bacon, Gouda, Mixed Greens, Jalapeños & BBQ Sauce',
    desc_eng: 'Slow-cooked pulled pork, crispy bacon, gouda cheese, mixed greens, spicy jalapeños and smoky BBQ sauce.',
  },
  'bocadillo-golosa': {
    name_cat: 'Entrepà La Golosa',
    desc_cat: 'Frankfurt de 150g amb bacó cruixent, formatge gouda fos i ceba sofregida.',
    name_eng: 'La Golosa Gourmet Hot Dog',
    desc_eng: '150g German frankfurter sausage with crispy bacon, melted gouda and poached sweet onion.',
  },
  'bocadillo-frankfurt-especial': {
    name_cat: 'Frankfurt Especial de la Casa',
    desc_cat: 'Formatge gouda, bacó cruixent, ceba crispy i cogombrets agredolços laminats.',
    name_eng: 'House Special Frankfurt',
    desc_eng: 'Gouda cheese, crispy bacon, fried crispy onions and sliced sweet pickles.',
  },
  'bocadillo-vegetal-gaudi': {
    name_cat: 'Entrepà Vegetal Gaudí de Pollastre',
    desc_cat: 'Pitrera de pollastre a la planxa, tomàquet natural, alvocat fresc, mèzclum verd i maionesa suau.',
    name_eng: 'Gaudí Chicken & Fresh Market Veggie Sandwich',
    desc_eng: 'Griddled chicken breast, fresh tomato, ripe avocado, baby greens and mild mayonnaise.',
  },
  'bocadillo-bacon-caliente': {
    name_cat: 'Entrepà de Bacó a la Planxa',
    desc_cat: 'Bacó a la planxa molt cruixent servit en pa calent.',
    name_eng: 'Crispy Bacon Hot Sandwich',
    desc_eng: 'Extra-crispy griddled bacon served in warm toasted bread.',
  },
  'bocadillo-lomo-caliente': {
    name_cat: 'Entrepà de Llom a la Planxa',
    desc_cat: 'Filets de llom tendre a la planxa amb pa amb tomàquet.',
    name_eng: 'Griddled Pork Loin Hot Sandwich',
    desc_eng: 'Tender pork loin cutlets on the griddle with rubbed tomato bread.',
  },
  'bocadillo-pollo-caliente': {
    name_cat: 'Entrepà de Pitrera de Pollastre',
    desc_cat: 'Pitrera de pollastre suculenta acabada de fer a la planxa.',
    name_eng: 'Hot Grilled Chicken Breast Sandwich',
    desc_eng: 'Juicy griddled chicken breast cutlet served warm on crusty bread.',
  },
  'bocadillo-ternera-caliente': {
    name_cat: 'Entrepà de Filet de Vedella',
    desc_cat: 'Bistec de vedella a la planxa al seu punt amb pa amb tomàquet.',
    name_eng: 'Hot Beef Steak Sandwich',
    desc_eng: 'Tender beef minute steak cooked to order with rubbed tomato bread.',
  },
  'bocadillo-butifarra-pages': {
    name_cat: 'Entrepà de Botifarra de Pagès',
    desc_cat: 'Autèntica botifarra de pagès catalana cuinada a la planxa.',
    name_eng: 'Catalan Butcher Sausage Sandwich',
    desc_eng: 'Authentic Catalan country butcher sausage cooked on the griddle.',
  },
  'bocadillo-frankfurt-90gr': {
    name_cat: 'Entrepà de Frankfurt Clàssic (90g)',
    desc_cat: 'Salxitxa tipus Frankfurt clàssica de 90 grams en pa torrat.',
    name_eng: 'Classic Frankfurt Sandwich (90g)',
    desc_eng: 'Classic 90g Frankfurt sausage in warm toasted crusty bread.',
  },
  'bocadillo-mega-cervela-190gr': {
    name_cat: 'Entrepà Mega Cervela (190g)',
    desc_cat: 'Gran salxitxa Cervela de 190g daurada a la planxa.',
    name_eng: 'Mega Cervela Sausage Sandwich (190g)',
    desc_eng: 'Large 190g Cervela sausage grilled golden brown.',
  },
  'bocadillo-mega-pikansburg-190gr': {
    name_cat: 'Entrepà Mega Pikansburg Espèciada (190g)',
    desc_cat: 'Salxitxa especial especiada Pikansburg de 190 grams.',
    name_eng: 'Mega Pikansburg Spiced Sausage Sandwich (190g)',
    desc_eng: 'Savory 190g spiced Pikansburg sausage with bold seasonings.',
  },
  'bocadillo-bratwurst-blanca-150gr': {
    name_cat: 'Entrepà Bratwurst Blanca Alemanya (150g)',
    desc_cat: 'Salxitxa blanca alemanya Bratwurst tradicional de 150g.',
    name_eng: 'White German Bratwurst Sandwich (150g)',
    desc_eng: 'Traditional white German 150g Bratwurst sausage.',
  },
  'bocadillo-hamburguesa-maxi-100gr': {
    name_cat: 'Entrepà d’Hamburguesa Maxi (100g)',
    desc_cat: 'Hamburguesa de carn de boví de 100g a la planxa.',
    name_eng: 'Maxi Burger Sandwich (100g)',
    desc_eng: '100g beef burger patty griddled in warm bread.',
  },
  'bocadillo-hamburguesa-angus-200gr': {
    name_cat: 'Entrepà d’Hamburguesa Black Angus (200g)',
    desc_cat: '200 grams de carn Black Angus d’alta qualitat a la planxa.',
    name_eng: 'Black Angus Burger Sandwich (200g)',
    desc_eng: '200g prime Black Angus beef patty griddled in crusty bread.',
  },
  'bocadillo-hamburguesa-legumbres-100gr': {
    name_cat: 'Entrepà d’Hamburguesa Vegana de Llegums (100g)',
    desc_cat: 'Hamburguesa 100% vegetal a base de llegums i verdures fresques.',
    name_eng: 'Vegan Legume Burger Sandwich (100g)',
    desc_eng: '100% plant-based burger made from hearty legumes and vegetables.',
  },
  'bocadillo-salchichas-pinchos': {
    name_cat: 'Entrepà de Salxitxes de Pintxo Morú Espèciades',
    desc_cat: 'Salxitxes adobades amb espècies morunes tradicionals a la planxa.',
    name_eng: 'Spiced Moorish Sausage Sandwich',
    desc_eng: 'Savory griddled sausages seasoned with traditional Moorish spices.',
  },
  'bocadillo-salchichas-pais': {
    name_cat: 'Entrepà de Salxitxes del País Artesanes',
    desc_cat: 'Salxitxes de porc artesanes tradicionals fetes a la planxa.',
    name_eng: 'Traditional Country Pork Sausages Sandwich',
    desc_eng: 'Artisan country pork sausages grilled fresh on warm bread.',
  },

  // --- PAGE 4: FOCACCIAS ARTESANAS ---
  'focaccia-tuna': {
    name_cat: 'Focaccia Tuna (Tonyina, Gouda, Tomàquet, Ceba Crispy i Maionesa)',
    desc_cat: 'Tonyina en oli, formatge gouda fos, tomàquet a rodanxes, ceba cruixent i maionesa.',
    name_eng: 'Tuna Focaccia (Tuna, Melted Gouda, Tomato, Crispy Onion & Mayo)',
    desc_eng: 'Light tuna, melted gouda, sliced tomato, crispy onions and creamy mayonnaise.',
  },
  'focaccia-olot': {
    name_cat: 'Focaccia Olot (Pernil d’Olot, Brie, Ceba Caramel·litzada i Tomàquet)',
    desc_cat: 'Pernil de la comarca d’Olot, formatge brie cremós fos, ceba dolça i tomàquet fresc.',
    name_eng: 'Olot Focaccia (Olot Cured Ham, Melted Brie, Sweet Onion & Tomato)',
    desc_eng: 'Cured Olot ham, warm melted brie, caramelized sweet onions and sliced tomato.',
  },
  'focaccia-la-pepa': {
    name_cat: 'Focaccia La Pepa (Pollastre Arrebossat, Gouda, Ceba i Mostassa-Mel)',
    desc_cat: 'Pitrera de pollastre cruixent, formatge gouda, ceba i la nostra salsa casolana de mostassa i mel.',
    name_eng: 'La Pepa Focaccia (Crisp Breaded Chicken, Gouda, Onion & Honey Mustard)',
    desc_eng: 'Golden breaded chicken, melted gouda, sweet onion and our house honey mustard sauce.',
  },
  'focaccia-pepa-2-0': {
    name_cat: 'Focaccia La Pepa 2.0 (Vedella Arrebossada, Formatge de Cabra i Pinyons)',
    desc_cat: 'Vedella tendra arrebossada súper cruixent, formatge de cabra fos, pinyons torrats i salsa.',
    name_eng: 'La Pepa 2.0 Focaccia (Breaded Beef, Goat Cheese & Pine Nuts)',
    desc_eng: 'Crispy breaded beef cutlet, melted goat cheese, toasted pine nuts and house dressing.',
  },
  'focaccia-vegetal': {
    name_cat: 'Focaccia Vegetal (Verdures Rostides, Alvocat, Tomàquet Sec i Mèzclum)',
    desc_cat: 'Verdures a la planxa, alvocat madur, tomàquets secs confitats i fulles verdes variades.',
    name_eng: 'Mediterranean Veggie Focaccia (Roasted Veggies, Avocado & Dried Tomato)',
    desc_eng: 'Roasted garden vegetables, ripe avocado, sun-dried tomatoes and mixed baby greens.',
  },
  'focaccia-milanesa': {
    name_cat: 'Focaccia Milanesa (Escalopa Cruixent, Mozzarella i Orenga)',
    desc_cat: 'Escalopa arrebossada daurada, mozzarella fosa, tomàquet a rodanxes i pessic d’orenga.',
    name_eng: 'Milanese Focaccia (Crispy Escalope, Mozzarella & Oregano)',
    desc_eng: 'Golden breaded escalope, melted mozzarella, sliced tomato and aromatic oregano.',
  },
  'focaccia-gastro': {
    name_cat: 'Focaccia Gastro (Salmó Fumat, Alvocat, Formatge Cremós i Rúcula)',
    desc_cat: 'Salmó fumat noruec, alvocat fresc laminat, formatge crema fi i fulles de rúcula salvatge.',
    name_eng: 'Gastro Focaccia (Smoked Salmon, Avocado, Cream Cheese & Arugula)',
    desc_eng: 'Norwegian smoked salmon, sliced avocado, fine cream cheese and fresh wild arugula.',
  },
  'focaccia-gaudi': {
    name_cat: 'Focaccia Gaudí (Pulled Pork Fumat, Cheddar, Bacó i Jalapeños)',
    desc_cat: 'La nostra focaccia insígnia amb carn desfilada barbacoa, formatge cheddar fos, bacó i jalapeños.',
    name_eng: 'Signature Gaudí Focaccia (Smoked Pulled Pork, Cheddar, Bacon & Jalapeños)',
    desc_eng: 'Our flagship focaccia loaded with tender BBQ pulled pork, melted cheddar, crispy bacon and jalapeños.',
  },
  'focaccia-pincho-moruno': {
    name_cat: 'Focaccia Pintxo Morú (Carn Adobada amb Espècies i Pebrots)',
    desc_cat: 'Trossos de carn marinats amb espècies morunes tradicionals i pebrots verds rostits.',
    name_eng: 'Moorish Skewer Focaccia (Spiced Marinated Pork & Roasted Peppers)',
    desc_eng: 'Pork tenderloin chunks marinated in traditional Moorish spices with roasted peppers.',
  },
  'focaccia-salmon-ahumado': {
    name_cat: 'Focaccia de Salmó Fumat i Formatge de Cabra',
    desc_cat: 'Salmó fumat d’alta qualitat, formatge de cabra fos i reducció balsàmica.',
    name_eng: 'Smoked Salmon & Warm Goat Cheese Focaccia',
    desc_eng: 'Premium smoked salmon, warm goat cheese medallion and balsamic glaze on rosemary focaccia.',
  },
  'focaccia-jamon-dulce-queso': {
    name_cat: 'Focaccia de Pernil Dolç i Formatge Gouda Fos',
    desc_cat: 'Pernil cuit extra i abundant formatge gouda gratinat al forn sobre focaccia artesana.',
    name_eng: 'Cooked York Ham & Melted Gouda Focaccia',
    desc_eng: 'Premium cooked York ham and abundant melted gouda cheese baked on artisanal focaccia.',
  },

  // --- PAGE 5: CARNES, PESCADOS & COMBOS ---
  'plato-entrana-vacuno': {
    name_cat: 'Entrenya de Boví a la Planxa amb Patates i Pebrots',
    desc_cat: 'Entrenya a la planxa acompanyada de patates fregides casolanes, pebrots del padró, salsa chimichurri i la nostra salsa brava Gaudí.',
    name_eng: 'Griddled Beef Skirt Steak with Fries & Padrón Peppers',
    desc_eng: 'Tender skirt steak cooked to perfection with homemade fries, blistered Padrón peppers, chimichurri and Gaudí brava sauce.',
  },
  'plato-entrecot-ternera-300gr': {
    name_cat: 'Entrecot de Vedella 300gr a la Planxa (Novetat)',
    desc_cat: 'Tall noble de 300g a la planxa al seu punt, acompanyat de patates fregides i pebrots del padró.',
    name_eng: 'Prime Beef Entrecôte Steak 300g (New)',
    desc_eng: '300g prime beef ribeye steak grilled to your liking, served with homemade fries and Padrón peppers.',
  },
  'plato-sepia-plancha': {
    name_cat: 'Sèpia Grossa a la Planxa amb All i Julivert',
    desc_cat: 'Sèpia fresca a la planxa amb amaniment tradicional d’all, julivert fresc, oli d’oliva i patates casolanes.',
    name_eng: 'Griddled Fresh Cuttlefish with Garlic & Parsley',
    desc_eng: 'Fresh tender cuttlefish on the griddle with garlic-parsley dressing, extra virgin olive oil and fries.',
  },
  'plato-salmon-noruego': {
    name_cat: 'Llom de Salmó Noruec a la Planxa amb Verdures',
    desc_cat: 'Llom fresc de salmó a la planxa acompanyat de verdures saltejades i patates.',
    name_eng: 'Norwegian Salmon Fillet with Sauteed Vegetables',
    desc_eng: 'Fresh Norwegian salmon fillet cooked on the griddle served with sautéed vegetables and potatoes.',
  },
  'plato-calamares-plancha-vieira': {
    name_cat: 'Calamars a la Planxa amb Petxina de Pelegrí i Verdures',
    desc_cat: 'Calamars frescos a la planxa servits amb vieira daurada i guarnició de verdures.',
    name_eng: 'Griddled Calamari & Scallop with Garden Vegetables',
    desc_eng: 'Tender fresh calamari on the griddle served with a seared sea scallop and garden vegetables.',
  },
  'combi-1': {
    name_cat: 'Combi 1: Pitrera de Pollastre, Patates Casolanes, Amanida i Ou',
    desc_cat: 'Pitrera de pollastre a la planxa, patates casolanes acabades de fregir, amanida fresca i ou ferrat.',
    name_eng: 'Combi 1: Grilled Chicken Breast, Homemade Fries, Salad & Fried Egg',
    desc_eng: 'Grilled chicken breast cutlet, freshly fried homemade potatoes, garden salad and sunny fried egg.',
  },
  'combi-2': {
    name_cat: 'Combi 2: Llom a la Planxa amb Formatge Fos, Patates i Pebrots',
    desc_cat: 'Filets de llom amb formatge fos, patates casolanes i pebrots verds fregits.',
    name_eng: 'Combi 2: Pork Loin with Melted Cheese, Fries & Sweet Peppers',
    desc_eng: 'Tender pork loin with melted cheese, homemade fries and sautéed green peppers.',
  },
  'combi-3': {
    name_cat: 'Combi 3: Bistec de Vedella a la Planxa, Patates i Ous Ferrats',
    desc_cat: 'Bistec de vedella al seu punt acompanyat de dues racions d’ous ferrats i patates casolanes.',
    name_eng: 'Combi 3: Griddled Beef Steak, Homemade Fries & Fried Eggs',
    desc_eng: 'Tender griddled beef minute steak paired with sunny-side up eggs and homemade fries.',
  },
  'combi-4-brasa': {
    name_cat: 'Combi 4 (Planxa): Botifarra de Pagès amb Patatetes, Ou, Pebrot & All-i-oli',
    desc_cat: 'Botifarra de pagès a la planxa amb patatetes fregides casolanes, ou ferrat, pebrot verd i all-i-oli artesà.',
    name_eng: 'Combi 4 (Griddle): Country Sausage with Fries, Egg, Pepper & Garlic Aioli',
    desc_eng: 'Artisan butcher sausage grilled with homemade fries, fried egg, green pepper and homemade garlic aioli.',
  },
  'combi-5-brasa': {
    name_cat: 'Combi 5 (Planxa): Tira de Xurrasco amb Arròs, Chimichurri & Pebrot',
    desc_cat: 'Tira de xurrasco a la planxa amb arròs basmati blanc, salsa chimichurri i pebrot verd.',
    name_eng: 'Combi 5 (Griddle): Beef Churrasco with Basmati Rice, Chimichurri & Pepper',
    desc_eng: 'Griddled beef churrasco flank ribs with fragrant white basmati rice, chimichurri sauce and roasted pepper.',
  },
  'combi-6-brasa': {
    name_cat: 'Combi 6 (Planxa): Hamburguesa Black Angus 200g al Plat',
    desc_cat: 'Hamburguesa Black Angus 100% (200gr) al plat amb formatge de cabra caramel·litzat, ceba confitada, verdures i patatetes.',
    name_eng: 'Combi 6 (Griddle): Black Angus 200g Burger Platter with Goat Cheese',
    desc_eng: '100% Black Angus burger patty (200g) on a plate with caramelized goat cheese, sweet onion, veggies and fries.',
  },
  'combi-7': {
    name_cat: 'Combi 7: Sèpia Fresca a la Planxa amb Patates i Amanida Verda',
    desc_cat: 'Sèpia fresca sencera amb all i julivert, acompanyada de patates casolanes i amanida mediterrània.',
    name_eng: 'Combi 7: Griddled Fresh Cuttlefish with Fries & Garden Salad',
    desc_eng: 'Whole fresh cuttlefish grilled with garlic and parsley, served with homemade fries and crisp salad.',
  },
  'combi-8-novedad': {
    name_cat: 'Combi 8 (Novetat): Calamarsons a la Planxa amb Gambetes i Arròs',
    desc_cat: 'Calamarsons frescos a la planxa amb gambetes saltejades, arròs blanc i patates casolanes.',
    name_eng: 'Combi 8 (New): Baby Squid on the Griddle with Shrimps & Seasoned Rice',
    desc_eng: 'Tender baby squid griddled with sautéed shrimps, white rice and crisp homemade fries.',
  },

  // --- PAGE 6: TAPAS & ENSALADAS ---
  'patatas-fritas': {
    name_cat: 'Ració de Patates Fregides Casolanes',
    desc_cat: 'Tallades a mà cada dia i fregides en oli d’oliva ben calent.',
    name_eng: 'Hand-Cut Homemade French Fries',
    desc_eng: 'Fresh potatoes hand-cut daily and fried golden in clean olive oil.',
  },
  'bravas-alioli-salsa-gaudi': {
    name_cat: 'Patates Braves Gaudí amb All-i-oli i Salsa Casolana',
    desc_cat: 'Tallades a mà, daurades al punt i banyades amb la nostra doble salsa d’all-i-oli suau i brava picant Gaudí.',
    name_eng: 'Gaudí Signature Patatas Bravas with Aioli & Spicy Sauce',
    desc_eng: 'Hand-cut golden fried potato chunks topped with our signature duo of creamy garlic aioli and spicy brava sauce.',
  },
  'patatas-gaudi-especial': {
    name_cat: 'Patates Gaudí Especial amb Bacó i Formatge Gratinat',
    desc_cat: 'Patates casolanes cobertes de formatge gouda fos, bacó cruixent i ceba fregida.',
    name_eng: 'Special Gaudí Loaded Fries with Bacon & Melted Cheese',
    desc_eng: 'Homemade fries smothered with melted gouda cheese, crispy chopped bacon and crispy fried onions.',
  },
  'croquetas-pollo': {
    name_cat: 'Croqueta de Pollastre Rostit Casolana (Uts)',
    desc_cat: 'Beixamel cremosa i farcit de pollastre rostit tradicional a foc lent.',
    name_eng: 'Homemade Roasted Chicken Croquette (Unit)',
    desc_eng: 'Velvety bechamel filled with slow-roasted shredded chicken in a crisp golden breadcrumb shell.',
  },
  'croquetas-iberico': {
    name_cat: 'Croqueta de Pernil Ibèric de Gla (Uts)',
    desc_cat: 'Elaborada amb pernil ibèric de gla autèntic i arrebossat extra cruixent.',
    name_eng: 'Iberian Acorn-Fed Ham Croquette (Unit)',
    desc_eng: 'Made with authentic acorn-fed Iberian ham flakes and an ultra-crisp golden crust.',
  },
  'croquetas-setas': {
    name_cat: 'Croqueta de Bolets i Ceps (Uts)',
    desc_cat: 'Farcit cremós de barreja de bolets silvestres i ceps aromàtics.',
    name_eng: 'Wild Forest Mushroom & Porcini Croquette (Unit)',
    desc_eng: 'Creamy bechamel blended with aromatic wild forest mushrooms and savory porcini.',
  },
  'croquetas-rabo-toro': {
    name_cat: 'Croqueta de Cua de Bou Estofada (Novetat - Uts)',
    desc_cat: 'Farcit melós de cua de bou estofada al vi negre, ultra saborosa.',
    name_eng: 'Braised Oxtail Gourmet Croquette (New - Unit)',
    desc_eng: 'Melt-in-your-mouth slow-braised oxtail in red wine, encased in an extra crisp coating.',
  },
  'alitas-pollo-sazon-gaudi': {
    name_cat: 'Aletes de Pollastre Fregides amb Assaonament Gaudí',
    desc_cat: 'Aletes molt cruixents macerades en la nostra barreja especial d’espècies Gaudí.',
    name_eng: 'Crispy Fried Chicken Wings with Gaudí Seasoning',
    desc_eng: 'Extra-crispy chicken wings marinated in our secret blend of Mediterranean herbs and spices.',
  },
  'fingers-pollo-receta-propia': {
    name_cat: 'Fingers de Pitrera de Pollastre Cruixents (Recepta Pròpia)',
    desc_cat: 'Tires de pitrera de pollastre marinades amb arrebossat cruixent artesanal.',
    name_eng: 'Crispy Chicken Breast Tenders (House Recipe)',
    desc_eng: 'Tender marinated chicken breast strips with a crunchy hand-breaded coating.',
  },
  'calamares-andaluza-langostino-panko': {
    name_cat: 'Calamars a l’Andalusa amb Llagostí Tigre en Panko & Salsa Cítrica',
    desc_cat: 'Calamars frescos arrebossats a la farina fina amb llagostí tigre en panko cruixent i salsa cítrica.',
    name_eng: 'Andalusian Calamari with Crispy Panko Tiger Prawn & Citrus Dip',
    desc_eng: 'Fresh calamari rings lightly dusted and fried, served with a crunchy panko tiger prawn and citrus dipping sauce.',
  },
  'pimientos-del-padron': {
    name_cat: 'Pebrots del Padró Fregits amb Sal Maldon',
    desc_cat: 'Fregits en oli d’oliva verge extra i amanits amb escates de sal marina. Uns piquen i altres no!',
    name_eng: 'Blistered Padrón Peppers with Flaky Salt',
    desc_eng: 'Pan-blistered in olive oil and tossed with flaky sea salt. Some are hot, some are not!',
  },
  'calamares-enteros-plancha-langostinos': {
    name_cat: 'Calamars Sencers a la Planxa amb 2 Llagostins i Pebrots del Padró',
    desc_cat: 'Calamars frescos sencers cuinats a la planxa amb all i julivert, dos llagostins i pebrots.',
    name_eng: 'Whole Griddled Calamari with 2 King Prawns & Padrón Peppers',
    desc_eng: 'Fresh whole calamari seared on the griddle with garlic and parsley, accompanied by 2 king prawns and peppers.',
  },
  'ensaladilla-rusa-novedad': {
    name_cat: 'Ensaladilla Russa Casolana (Novetat)',
    desc_cat: 'Recepta tradicional amb patata, tonyina clara, verduretes fines, ou dur i maionesa casolana.',
    name_eng: 'Traditional Spanish Potato Salad with Tuna & Mayo (New)',
    desc_eng: 'Classic Spanish potato salad tossed with white tuna, peas, carrots, hard-boiled egg and homemade mayo.',
  },
  'tartar-gastro-novedad': {
    name_cat: 'Tàrtar Gastro de Salmó i Mànec (Novetat)',
    desc_cat: 'Salmó fumat, daus de mànec fresc madur, tomàquet i alvocat amanits amb delicadesa.',
    name_eng: 'Gastro Smoked Salmon & Mango Tartare (New)',
    desc_eng: 'Smoked salmon, diced fresh ripe mango, tomato and creamy avocado delicately seasoned with citrus vinaigrette.',
  },
  'ensalada-tomate-aguacate': {
    name_cat: 'Amanida Fresca de Tomàquet, Alvocat i Ceba de Figueres',
    desc_cat: 'Rúcula, tomàquet a rodanxes amb alvocat fresc, ceba vermella de Figueres (dolça, no pica), AOVE i crema balsàmica.',
    name_eng: 'Fresh Sliced Tomato, Avocado & Sweet Figueres Onion Salad',
    desc_eng: 'Wild arugula, fresh sliced tomato, creamy avocado, sweet non-spicy red Figueres onion, EVOO and balsamic glaze.',
  },
  'ensalada-cabrona': {
    name_cat: 'Amanida La Cabrona amb Rulo de Formatge de Cabra',
    desc_cat: 'Mèzclum d’enciams frescos, nous, panses, ceba vermella dolça de Figueres, rulo de formatge de cabra caramel·litzat i crema balsàmica.',
    name_eng: 'La Cabrona Salad with Warm Goat Cheese Medallion',
    desc_eng: 'Crisp mixed salad greens, toasted walnuts, raisins, sweet Figueres onion, caramelized goat cheese medallion and balsamic.',
  },
  'ensalada-tropical-gaudi': {
    name_cat: 'Amanida Tropical Gaudí amb Mànec, Alvocat i Llagostins',
    desc_cat: 'Mèzclum, mànec fresc, alvocat madur, tomàquet natural, vinagreta de mostassa i sèsam, ceba vermella i 2 llagostins grossos.',
    name_eng: 'Tropical Gaudí Salad with Fresh Mango, Avocado & King Prawns',
    desc_eng: 'Mixed salad greens, diced sweet mango, creamy avocado, tomato, mustard-sesame vinaigrette and 2 plump king prawns.',
  },

  // --- PAGE 7: BURGUERS PREMIUM & POSTRES ---
  'burger-completa-gaudi': {
    name_cat: 'Hamburguesa Completa Gaudí',
    desc_cat: 'Hamburguesa maxi, formatge gouda fos, enciam, tomàquet, bacó cruixent, ceba caramel·litzada i maionesa. Acompanyada de patatetes casolanes.',
    name_eng: 'Complete Gaudí House Burger',
    desc_eng: 'Maxi beef patty, melted gouda cheese, crisp lettuce, tomato, crispy bacon, sweet caramelized onion and mayo. Served with fresh homemade fries.',
  },
  'burger-olot': {
    name_cat: 'Hamburguesa Olot amb Formatge Brie i Pernil d’Olot',
    desc_cat: 'Hamburguesa maxi, formatge brie suau, pernil d’Olot, ceba caramel·litzada, enciam i tomàquet amb patatetes fregides casolanes.',
    name_eng: 'Olot Burger with Warm Brie & Olot Cured Ham',
    desc_eng: 'Maxi beef burger, creamy melted brie cheese, artisan cured Olot ham, caramelized onion, lettuce, tomato and homemade fries.',
  },
  'burger-barbacoa': {
    name_cat: 'Hamburguesa Barbacoa 100% Black Angus',
    desc_cat: 'Hamburguesa 100% Black Angus, bacó cruixent, salsa barbacoa fumada, formatge cheddar fos i ceba vermella amb patatetes fregides casolanes.',
    name_eng: 'Smoky BBQ 100% Black Angus Burger',
    desc_eng: '100% Black Angus prime beef, crispy bacon, rich smoky BBQ sauce, melted cheddar and red onion with homemade fries.',
  },
  'burger-mejicana': {
    name_cat: 'Hamburguesa Mexicana Black Angus amb Jalapeños',
    desc_cat: 'Hamburguesa Black Angus 100%, jalapeños picants, alvocat fresc, ceba vermella i formatge cheddar fos amb patatetes fregides casolanes.',
    name_eng: 'Mexican Black Angus Burger with Spicy Jalapeños',
    desc_eng: '100% Black Angus beef patty, spicy jalapeños, fresh sliced avocado, red onion and melted cheddar with homemade fries.',
  },
  'burger-la-carnica': {
    name_cat: 'Hamburguesa La Càrnica amb Doble Carn',
    desc_cat: 'Hamburguesa per als més carnívors amb doble ració de carn Black Angus, formatge gouda i ceba caramel·litzada amb patatetes casolanes.',
    name_eng: 'The Meat Lovers Double Patty Burger',
    desc_eng: 'Double stack of prime Black Angus beef patties, melted gouda and caramelized onions, served with homemade fries.',
  },
  'burger-crujiente-pollo': {
    name_cat: 'Hamburguesa Crispy Chicken Crunch amb Pitrera Marinada',
    desc_cat: 'Pitrera de pollastre marinada amb arrebossat súper cruixent, formatge cheddar, enciam, tomàquet i salsa amb patatetes casolanes.',
    name_eng: 'Crispy Chicken Crunch Burger with Marinated Breast',
    desc_eng: 'Marinated chicken breast fillet with an ultra-crisp coating, melted cheddar, lettuce, tomato and house sauce with fries.',
  },
  'tarta-de-queso-casera': {
    name_cat: 'Pastís de Formatge Forneijat Casolà',
    desc_cat: 'Cremós pastís de formatge elaborat cada dia al nostre forn amb cor suau i base cruixent.',
    name_eng: 'Homemade Baked Creamy Cheesecake',
    desc_eng: 'Rich cream cheese cake baked fresh daily with a caramelized top and velvety soft center.',
  },
  'coulant-chocolate-helado-nata': {
    name_cat: 'Coulant de Xocolata Calent amb Gelat de Vainilla i Nata',
    desc_cat: 'Pa de pessic de xocolata amb cor fluid calent, acompanyat d’una bola de gelat de vainilla i nata muntada.',
    name_eng: 'Warm Molten Chocolate Lava Cake with Vanilla Ice Cream',
    desc_eng: 'Warm rich chocolate sponge cake with a molten liquid center, paired with a scoop of vanilla ice cream and whipped cream.',
  },
  'puding-casero-nata-sirope': {
    name_cat: 'Púding Casolà Tradicional amb Nata i Xarop',
    desc_cat: 'Recepta dolça tradicional de llet, brioix i caramel daurat servit amb un toc de nata.',
    name_eng: 'Traditional Homemade Bread Pudding with Whipped Cream & Caramel',
    desc_eng: 'Classic sweet custard bread pudding infused with vanilla and caramel, served with whipped cream.',
  },
  'flan-de-huevo-con-nata': {
    name_cat: 'Flam d’Ou Casolà amb Nata Muntada',
    desc_cat: 'Flam d’ous frescos elaborat a foc lent amb caramel líquid artesà.',
    name_eng: 'Homemade Egg Custard Flan with Whipped Cream',
    desc_eng: 'Traditional silky egg custard flan bathed in rich golden caramel syrup, topped with fresh whipped cream.',
  },
  'bolas-helados-artesanales': {
    name_cat: 'Boles de Gelat Artesà (Vainilla, Xocolata o Maduixa)',
    desc_cat: 'Dues boles de gelat de màxima cremositat a escollir entre diversos sabors.',
    name_eng: 'Scoops of Artisan Ice Cream (Vanilla, Chocolate or Strawberry)',
    desc_eng: 'Two generous scoops of creamy artisan Italian gelato in your choice of flavors.',
  },
  'melocoton-en-almibar': {
    name_cat: 'Préssec en Almívar Suau',
    desc_cat: 'Meitats suculentes de préssec en almívar lleuger.',
    name_eng: 'Sweet Peaches in Light Syrup',
    desc_eng: 'Tender sweet peach halves served chilled in light natural syrup.',
  },
  'yogurt-natural': {
    name_cat: 'Iogurt Natural Artesà',
    desc_cat: 'Iogurt natural cremós de llet sencera, sol o amb mel.',
    name_eng: 'Artisan Natural Yogurt',
    desc_eng: 'Creamy natural whole-milk yogurt, served plain or with pure honey.',
  },

  // --- PAGE 8: CARTA DE VINOS ---
  'vino-pierola-rioja-crianza': {
    name_cat: 'Vi Negre Fernández de Piérola D.O.Ca Rioja Criança',
    desc_cat: '100% Ull de llebre amb 18 mesos en bóta de roure americà i francès. Notes de fruits vermells madurs i fusta noble.',
    name_eng: 'Fernández de Piérola D.O.Ca Rioja Red Crianza',
    desc_eng: '100% Tempranillo aged 18 months in American and French oak. Notes of ripe red fruits, vanilla and toasted cedar.',
  },
  'vino-faustino-rivero-ulecia-rioja': {
    name_cat: 'Vi Negre Faustino Rivero Ulecia D.O.Ca Rioja',
    desc_cat: 'Ull de llebre i Garnatxa amb equilibri, frescor i un pas de boca sedós i agradable.',
    name_eng: 'Faustino Rivero Ulecia D.O.Ca Rioja Red Wine',
    desc_eng: 'Tempranillo and Garnacha blend with balanced acidity, pleasant fruit aromas and smooth finish.',
  },
  'vino-ramon-bilbao-rioja-crianza-2021': {
    name_cat: 'Vi Negre Ramón Bilbao D.O.Ca Rioja Criança 2021',
    desc_cat: 'Ull de llebre madurat en roure americà. Aromes de fruits negres, regalèssia i vainilla.',
    name_eng: 'Ramón Bilbao D.O.Ca Rioja Red Crianza 2021',
    desc_eng: 'Tempranillo aged in American oak casks. Aromas of black fruits, licorice, coconut and fine vanilla.',
  },
  'vino-cruz-de-alba-roble-ribera-2023': {
    name_cat: 'Vi Negre Cruz de Alba Roure D.O. Ribera del Duero 2023',
    desc_cat: '100% Tinta del País conreada de forma biodinàmica. Fruita fresca, tanins polits i subtil toc especiat.',
    name_eng: 'Cruz de Alba Roble D.O. Ribera del Duero 2023',
    desc_eng: '100% Tempranillo from biodynamic vineyards. Fresh dark fruit, polished tannins and subtle sweet spice.',
  },
  'vino-cyatho-verdejo-rueda-2024': {
    name_cat: 'Vi Blanc Cyatho Verdejo D.O. Rueda 2024',
    desc_cat: '100% Verdejo fresc i expressiu amb aromes florals, fruita tropical i el toc amarg final característic.',
    name_eng: 'Cyatho Verdejo D.O. Rueda White Wine 2024',
    desc_eng: '100% fresh expressive Verdejo with floral notes, tropical passionfruit and a crisp citrus finish.',
  },
  'vino-o-godello-ribeira-sacra-2024': {
    name_cat: 'Vi Blanc O Godello D.O. Ribeira Sacra 2024',
    desc_cat: 'Varietat Godello d’alta muntanya amb frescor mineral, fruita blanca madura i gran acidesa.',
    name_eng: 'O Godello D.O. Ribeira Sacra Crisp White 2024',
    desc_eng: 'Highland Godello grape featuring mineral freshness, ripe pear, stone fruit and vibrant crisp acidity.',
  },
  'vino-faustino-rivero-verdejo': {
    name_cat: 'Vi Blanc Faustino Rivero Verdejo D.O. Rueda',
    desc_cat: 'Blanc jove i alegre amb notes d’herba fresca, fonoll i fruita blanca d’os.',
    name_eng: 'Faustino Rivero Verdejo D.O. Rueda White Wine',
    desc_eng: 'Young and lively white wine with fragrant grassy notes, fennel and crisp green apple.',
  },
  'vino-ramon-bilbao-verdejo-2023': {
    name_cat: 'Vi Blanc Ramón Bilbao Verdejo D.O. Rueda 2023',
    desc_cat: 'Verdejo selecte treballat sobre mares fines per aportar cos, estructura i llarga persistència.',
    name_eng: 'Ramón Bilbao Verdejo D.O. Rueda White Wine 2023',
    desc_eng: 'Selected Verdejo aged on fine lees providing creamy texture, rich tropical aromatics and lasting persistence.',
  },
  'vino-anec-mut-blanc-2024': {
    name_cat: 'Vi Blanc Ecològic Ànec Mut D.O. Penedès 2024',
    desc_cat: 'Cupatge ecològic mediterrani d’aroma perfumada, flors blanques i frescor vibrant de proximitat.',
    name_eng: 'Organic White Wine Ànec Mut D.O. Penedès 2024',
    desc_eng: 'Organic Mediterranean blend with fragrant floral perfume, white peach and vibrant refreshing acidity.',
  },
};

console.log("Total translated items defined:", Object.keys(translationsData).length);

// Generate the complete menuTranslations.ts content
const fileContent = `import { Language } from './LanguageContext';
import { MenuItem } from '../types';

export interface TranslatedSupplement {
  name: string;
  price: string;
}

export const getTranslatedSupplements = (lang: Language): TranslatedSupplement[] => {
  if (lang === 'cat') {
    return [
      { name: 'Bacó cruixent a la planxa', price: '+1,10 €' },
      { name: 'Pebrot verd a la planxa', price: '+1,00 €' },
      { name: 'Formatge Gouda o Cheddar fos', price: '+1,00 €' },
      { name: 'Formatge de Cabra caramel·litzat', price: '+2,00 €' },
      { name: 'Formatge Brie fos cremós', price: '+1,50 €' },
      { name: 'Formatge Manxec curat noble', price: '+2,50 €' },
      { name: 'Ou ferrat a la planxa', price: '+1,00 €' },
      { name: 'Ceba (crua, crispy o caramel·litzada)', price: '+0,80 €' },
      { name: 'Alvocat fresc madur laminat', price: '+1,50 €' },
      { name: 'Mèzclum de brots verds frescos', price: '+0,80 €' },
      { name: 'Jalapeños picants o Cogombrets agredolços', price: '+1,00 €' },
      { name: 'Olives farcides d’anxova', price: '+0,90 €' },
      { name: 'Tomàquet fresc a rodanxes amb oli', price: '+1,00 €' },
      { name: 'All-i-oli casolà o Salsa Brava Gaudí', price: '+0,95 €' },
      { name: 'Supl. Ració de Patates Casolanes', price: '+2,00 €' },
      { name: 'Supl. Patates Gaudí de la casa', price: '+1,50 €' },
      { name: 'Supl. Pa especial sense gluten', price: '+2,00 €' },
    ];
  }

  if (lang === 'eng') {
    return [
      { name: 'Crispy Grilled Bacon', price: '+1.10 €' },
      { name: 'Pan-Roasted Green Pepper', price: '+1.00 €' },
      { name: 'Melted Gouda or Cheddar Cheese', price: '+1.00 €' },
      { name: 'Caramelized Goat Cheese Medallion', price: '+2.00 €' },
      { name: 'Warm Creamy Melted Brie', price: '+1.50 €' },
      { name: 'Aged Spanish Manchego Cheese', price: '+2.50 €' },
      { name: 'Fried Sunny-Side Up Egg', price: '+1.00 €' },
      { name: 'Onion (raw, crispy or sweet caramelized)', price: '+0.80 €' },
      { name: 'Fresh Sliced Ripe Avocado', price: '+1.50 €' },
      { name: 'Mixed Fresh Baby Greens', price: '+0.80 €' },
      { name: 'Spicy Pickled Jalapeños or Dill Pickles', price: '+1.00 €' },
      { name: 'Anchovy-Stuffed Spanish Olives', price: '+0.90 €' },
      { name: 'Ripe Sliced Fresh Tomatoes', price: '+1.00 €' },
      { name: 'Homemade Garlic Aioli or Spicy Gaudí Brava Sauce', price: '+0.95 €' },
      { name: 'Extra Side of Homemade Fries', price: '+2.00 €' },
      { name: 'Extra House Gaudí Loaded Potatoes', price: '+1.50 €' },
      { name: 'Gluten-Free Bread Supplement', price: '+2.00 €' },
    ];
  }

  // Default Spanish
  return [
    { name: 'Bacon crujiente a la plancha', price: '+1,10 €' },
    { name: 'Pimiento verde a la plancha', price: '+1,00 €' },
    { name: 'Queso Gouda o Cheddar fundido', price: '+1,00 €' },
    { name: 'Queso de Cabra caramelizado', price: '+2,00 €' },
    { name: 'Queso Brie fundido cremoso', price: '+1,50 €' },
    { name: 'Queso Manchego curado noble', price: '+2,50 €' },
    { name: 'Huevo a la plancha', price: '+1,00 €' },
    { name: 'Cebolla (cruda, crispy o caramelizada)', price: '+0,80 €' },
    { name: 'Aguacate fresco maduro en rodajas', price: '+1,50 €' },
    { name: 'Mézclum de brotes verdes frescos', price: '+0,80 €' },
    { name: 'Jalapeños picantes o Pepinillos', price: '+1,00 €' },
    { name: 'Olivas rellenas de anchoa', price: '+0,90 €' },
    { name: 'Tomate fresco en rodajas con AOVE', price: '+1,00 €' },
    { name: 'Alioli casero o Salsa Brava Gaudí', price: '+0,95 €' },
    { name: 'Supl. Ración de Patatas Caseras', price: '+2,00 €' },
    { name: 'Supl. Patatas Gaudí de la casa', price: '+1,50 €' },
    { name: 'Supl. Pan especial sin gluten', price: '+2,00 €' },
  ];
};

// Item translations dictionary covering all 133 menu dishes, tapas, drinks, burgers and wines
export const ITEM_TRANSLATIONS: Record<
  string,
  {
    name_cat?: string;
    desc_cat?: string;
    name_eng?: string;
    desc_eng?: string;
  }
> = ${JSON.stringify(translationsData, null, 2)};

export const getTranslatedMenuItem = (item: MenuItem, lang: Language): { name: string; description: string } => {
  if (lang === 'es') {
    return {
      name: item.name,
      description: item.description,
    };
  }

  const override = ITEM_TRANSLATIONS[item.id];
  if (override) {
    if (lang === 'cat') {
      return {
        name: override.name_cat || item.name,
        description: override.desc_cat || item.description,
      };
    }
    if (lang === 'eng') {
      return {
        name: override.name_eng || item.name,
        description: override.desc_eng || item.description,
      };
    }
  }

  // Fallback to base item name and description
  return {
    name: item.name,
    description: item.description,
  };
};

export const getPageScheduleNote = (pageNum: number, lang: Language): string | undefined => {
  const notes: Record<number, Record<Language, string>> = {
    1: {
      es: 'Ofertas matinales de lunes a viernes de 8:00h a 13:00h. Fin de semana y festivos no se hacen ofertas.',
      cat: 'Ofertes matinals de dilluns a divendres de 8:00h a 13:00h. Caps de setmana i festius no es fan ofertes.',
      eng: 'Morning breakfast deals Monday to Friday from 8:00 AM to 1:00 PM. No deals on weekends or public holidays.',
    },
    2: {
      es: 'De lunes a viernes de 8:00h a 13:00h.',
      cat: 'De dilluns a divendres de 8:00h a 13:00h.',
      eng: 'Monday to Friday from 8:00 AM to 1:00 PM.',
    },
    3: {
      es: '* No se harán minis calientes por la noche.',
      cat: '* No es faran minis calents a la nit.',
      eng: '* Hot mini sandwiches are not served at night.',
    },
    4: {
      es: 'Masa de focaccia artesana horneada al punto, crujiente y aromática con romero y aceite de oliva virgen extra.',
      cat: 'Massa de focaccia artesana enfornada al punt, cruixent i aromàtica amb romaní i oli d’oliva verge extra.',
      eng: 'Freshly baked artisan focaccia crust, crispy and aromatic with rosemary and extra virgin olive oil.',
    },
    5: {
      es: 'De lunes a viernes (13:00h a 16:00h) Platos Combos + Bebida + Postre o Café (14,90€ - 17,50€). Jueves: Paella • Viernes: Fideuá.',
      cat: 'De dilluns a divendres (13:00h a 16:00h) Plats Combos + Beguda + Postres o Cafè (14,90€ - 17,50€). Dijous: Paella • Divendres: Fideuà.',
      eng: 'Monday to Friday (1:00 PM to 4:00 PM) Combo Platter + Drink + Dessert or Coffee (14.90€ - 17.50€). Thursday: Paella • Friday: Fideuá.',
    },
    6: {
      es: 'Tapas tradicionales recién fritas y a la plancha, raciones para compartir y ensaladas frescas.',
      cat: 'Tapes tradicionals acabades de fregir i a la planxa, racions per compartir i amanides fresques.',
      eng: 'Traditional freshly cooked tapas, sharing plates and fresh market salads.',
    },
    7: {
      es: 'Todas nuestras hamburguesas van acompañadas de papitas caseras.',
      cat: 'Totes les nostres hamburgueses van acompanyades de patates casolanes.',
      eng: 'All our burgers are served with homemade fresh french fries.',
    },
    8: {
      es: 'Vinos con Denominación de Origen seleccionados para acompañar nuestras carnes y tapas.',
      cat: 'Vins amb Denominació d’Origen seleccionats per acompanyar les nostres carns i tapes.',
      eng: 'Designation of Origin wines selected to pair with our meats and tapas.',
    },
  };

  return notes[pageNum]?.[lang] || notes[pageNum]?.['es'];
};

export const getPageFooterNote = (pageNum: number, lang: Language): string | undefined => {
  if (pageNum === 2) {
    if (lang === 'cat') return '* No es faran minis calents a la nit.';
    if (lang === 'eng') return '* Hot mini sandwiches are not served at night.';
    return '* No se harán minis calientes por la noche.';
  }
  return undefined;
};
`;

fs.writeFileSync('src/i18n/menuTranslations.ts', fileContent, 'utf8');
console.log('Successfully wrote src/i18n/menuTranslations.ts');
