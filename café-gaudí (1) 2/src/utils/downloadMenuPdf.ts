import jsPDF from 'jspdf';
import { PDF_MENU_PAGES, MENU_SUPPLEMENTS, PdfMenuPage } from '../data/pdfMenuData';
import { ALLERGENS_LIST } from '../data/menuData';
import { getStoredMenuPriceOverrides } from '../data/adminStore';
import { Language } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';
import {
  getTranslatedMenuItem,
  getTranslatedSupplements,
  getPageScheduleNote,
  getPageFooterNote,
} from '../i18n/menuTranslations';

const ALLERGEN_NAME_MAP: Record<string, string> = {
  gluten: 'Gluten',
  lacteos: 'Lácteos',
  'frutos-secos': 'Frutos secos',
  huevos: 'Huevos',
  pescado: 'Pescado',
  crustaceos: 'Crustáceos',
  moluscos: 'Moluscos',
  soja: 'Soja',
};

const getAllergenLabel = (id: string): string => {
  if (ALLERGEN_NAME_MAP[id]) return ALLERGEN_NAME_MAP[id];
  const found = ALLERGENS_LIST.find((a) => a.id === id);
  return found ? found.label : id;
};

export const generateAndDownloadFullMenuPdf = (lang: Language = 'es'): void => {
  const dict = translations[lang] || translations.es;
  const priceOverrides = getStoredMenuPriceOverrides();
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 22;

  let y = 18;

  const drawPageHeader = (pageNumber: number) => {
    // Top Brand Bar
    doc.setFillColor(74, 74, 53); // #4a4a35
    doc.rect(marginX, y, contentWidth, 1.2, 'F');
    y += 7;

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(74, 74, 53);
    doc.text('CAFÉ GAUDÍ', marginX, y);

    // Subtitle & City
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 95);
    const subtitleHeader = lang === 'cat' ? 'CARTA OFICIAL • MATARÓ' : lang === 'eng' ? 'OFFICIAL MENU • MATARÓ' : 'CARTA OFICIAL • MATARÓ';
    doc.text(subtitleHeader, pageWidth - marginX, y - 1, { align: 'right' });
    doc.text('Carrer Germans Thos i Codina 20, Mataró | Tel. +34 937 90 45 12', pageWidth - marginX, y + 3.5, { align: 'right' });

    y += 9;
    doc.setDrawColor(215, 215, 200);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;
  };

  const drawPageFooter = (currentPage: number) => {
    const footerY = pageHeight - 12;
    doc.setDrawColor(215, 215, 200);
    doc.setLineWidth(0.2);
    doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 115);
    const footerDisclaimer = lang === 'cat' ? 'Cafè Gaudí Mataró • Preus amb IVA inclòs' : lang === 'eng' ? 'Café Gaudí Mataró • All prices include VAT' : 'Café Gaudí Mataró • Precios con IVA incluido';
    const pageWord = lang === 'cat' ? 'Pàgina' : lang === 'eng' ? 'Page' : 'Página';
    doc.text(footerDisclaimer, marginX, footerY);
    doc.text(
      `${pageWord} ${currentPage}`,
      pageWidth - marginX,
      footerY,
      { align: 'right' }
    );
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > bottomLimit) {
      drawPageFooter(doc.getNumberOfPages());
      doc.addPage();
      y = 18;
      drawPageHeader(doc.getNumberOfPages());
    }
  };

  // Start Page 1 Header
  drawPageHeader(1);

  // Helper to get translated page labels
  const getPageInfo = (pageNum: number) => {
    const p = dict.menu.pages;
    const map: Record<number, { tabTitle: string; title: string }> = {
      1: { tabTitle: p.p1Tab, title: p.p1Title },
      2: { tabTitle: p.p2Tab, title: p.p2Title },
      3: { tabTitle: p.p3Tab, title: p.p3Title },
      4: { tabTitle: p.p4Tab, title: p.p4Title },
      5: { tabTitle: p.p5Tab, title: p.p5Title },
      6: { tabTitle: p.p6Tab, title: p.p6Title },
      7: { tabTitle: p.p7Tab, title: p.p7Title },
      8: { tabTitle: p.p8Tab, title: p.p8Title },
    };
    return map[pageNum] || { tabTitle: `Sección ${pageNum}`, title: '' };
  };

  // Iterate over each of the 8 menu pages/sections
  PDF_MENU_PAGES.forEach((page, pageIndex) => {
    const pageLabels = getPageInfo(page.pageNumber);
    const tabTitle = pageLabels.tabTitle || page.tabTitle;
    const scheduleNote = getPageScheduleNote(page.pageNumber, lang) || page.scheduleNote;
    const footerNote = getPageFooterNote(page.pageNumber, lang) || page.footerNote;

    // If not first section, give proper separation or section break
    if (pageIndex > 0) {
      checkPageBreak(30);
      y += 4;
    }

    // Section Category Banner
    checkPageBreak(18);
    doc.setFillColor(242, 242, 235);
    doc.roundedRect(marginX, y, contentWidth, 9, 1.5, 1.5, 'F');
    doc.setDrawColor(180, 180, 160);
    doc.roundedRect(marginX, y, contentWidth, 9, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 45);
    doc.text(`${tabTitle.toUpperCase()}`, marginX + 3.5, y + 6);

    if (scheduleNote) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 85);
      doc.text(scheduleNote, pageWidth - marginX - 3.5, y + 6, { align: 'right' });
    }

    y += 13;

    // Iterate through sections inside this page
    page.sections.forEach((section) => {
      const transSection = dict.menu.sections?.[section.title];
      const sectionTitle = transSection?.title || section.title;
      const sectionSubtitle = transSection?.subtitle || section.subtitle;

      checkPageBreak(16);

      // Sub-section Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(90, 90, 65);
      doc.text(sectionTitle.toUpperCase(), marginX, y);
      y += 4;

      if (sectionSubtitle) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 105);
        doc.text(sectionSubtitle, marginX, y);
        y += 4;
      }

      // Thin divider
      doc.setDrawColor(225, 225, 215);
      doc.setLineWidth(0.2);
      doc.line(marginX, y, marginX + contentWidth, y);
      y += 4;

      // Render items
      section.items.forEach((item) => {
        const dish = getTranslatedMenuItem(item, lang);
        const itemDescLines = dish.description
          ? doc.splitTextToSize(dish.description, contentWidth - 30)
          : [];
        const approxHeight = 8 + (itemDescLines.length * 3.5) + (item.allergens && item.allergens.length ? 4 : 0);

        checkPageBreak(approxHeight + 3);

        // Item Name & Price
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 30);
        doc.text(dish.name, marginX, y);

        // Price
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(74, 74, 53);
        const effectivePrice = priceOverrides[item.id] !== undefined ? priceOverrides[item.id] : item.price;
        const priceStr = `${effectivePrice.toFixed(2)} €`;
        doc.text(priceStr, pageWidth - marginX, y, { align: 'right' });

        // Secondary price or portion note if present
        if (item.priceSecondary) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 100, 80);
          doc.text(`(${item.priceSecondary})`, marginX + doc.getTextWidth(dish.name) + 2.5, y);
        }

        y += 4;

        // Description
        if (dish.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(95, 95, 80);
          itemDescLines.forEach((line: string) => {
            doc.text(line, marginX, y);
            y += 3.4;
          });
        }

        // Allergens list
        if (item.allergens && item.allergens.length > 0) {
          const allergenNames = item.allergens.map(getAllergenLabel).join(', ');
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.2);
          doc.setTextColor(130, 115, 90);
          const allergensLabel = lang === 'cat' ? 'Al·lèrgens' : lang === 'eng' ? 'Allergens' : 'Alérgenos';
          doc.text(`${allergensLabel}: ${allergenNames}`, marginX, y);
          y += 3.8;
        }

        // Space after item
        y += 2.2;
      });

      y += 2;
    });

    // Supplements if page has them
    if (page.hasSupplements) {
      const currentSupplements = getTranslatedSupplements(lang);
      if (currentSupplements.length > 0) {
        checkPageBreak(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(90, 90, 65);
        const suppTitle = lang === 'cat' ? 'SUPLEMENTS DISPONIBLES' : lang === 'eng' ? 'AVAILABLE EXTRAS & SUPPLEMENTS' : 'SUPLEMENTOS DISPONIBLES';
        doc.text(suppTitle, marginX, y);
        y += 3.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 95);

        const half = Math.ceil(currentSupplements.length / 2);
        const col1 = currentSupplements.slice(0, half);
        const col2 = currentSupplements.slice(half);

        const suplStartY = y;
        let maxSuplY = y;

        let suplY = suplStartY;
        col1.forEach((supl) => {
          checkPageBreak(5);
          doc.text(`• ${supl.name}: ${supl.price}`, marginX, suplY);
          suplY += 3.4;
        });
        maxSuplY = Math.max(maxSuplY, suplY);

        suplY = suplStartY;
        col2.forEach((supl) => {
          checkPageBreak(5);
          doc.text(`• ${supl.name}: ${supl.price}`, marginX + (contentWidth / 2), suplY);
          suplY += 3.4;
        });
        maxSuplY = Math.max(maxSuplY, suplY);

        y = maxSuplY + 4;
      }
    }

    if (footerNote) {
      checkPageBreak(8);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 105);
      doc.text(footerNote, marginX, y);
      y += 5;
    }
  });

  // Stamp total pages on all pages
  const totalPages = doc.getNumberOfPages();
  const pageWord = lang === 'cat' ? 'Pàgina' : lang === 'eng' ? 'Page' : 'Página';
  const ofWord = lang === 'cat' ? 'de' : lang === 'eng' ? 'of' : 'de';
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 115);
    doc.text(
      `${pageWord} ${i} ${ofWord} ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 12,
      { align: 'right' }
    );
  }

  // Trigger download in browser
  doc.save(`Carta_Cafe_Gaudi_Mataro_${lang.toUpperCase()}.pdf`);
};

export const generateAndDownloadCurrentSectionPdf = (page: PdfMenuPage, lang: Language = 'es'): void => {
  const dict = translations[lang] || translations.es;
  const priceOverrides = getStoredMenuPriceOverrides();
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 20;

  const p = dict.menu.pages;
  const map: Record<number, { tabTitle: string; title: string }> = {
    1: { tabTitle: p.p1Tab, title: p.p1Title },
    2: { tabTitle: p.p2Tab, title: p.p2Title },
    3: { tabTitle: p.p3Tab, title: p.p3Title },
    4: { tabTitle: p.p4Tab, title: p.p4Title },
    5: { tabTitle: p.p5Tab, title: p.p5Title },
    6: { tabTitle: p.p6Tab, title: p.p6Title },
    7: { tabTitle: p.p7Tab, title: p.p7Title },
    8: { tabTitle: p.p8Tab, title: p.p8Title },
  };
  const pageLabels = map[page.pageNumber] || { tabTitle: page.tabTitle, title: page.title };
  const tabTitle = pageLabels.tabTitle || page.tabTitle;
  const pageTitle = pageLabels.title || page.title;
  const scheduleNote = getPageScheduleNote(page.pageNumber, lang) || page.scheduleNote;
  const footerNote = getPageFooterNote(page.pageNumber, lang) || page.footerNote;

  let y = 18;

  const drawHeader = () => {
    doc.setFillColor(74, 74, 53);
    doc.rect(marginX, y, contentWidth, 1.2, 'F');
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(74, 74, 53);
    doc.text('CAFÉ GAUDÍ', marginX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 95);
    doc.text(`${tabTitle.toUpperCase()} • MATARÓ`, pageWidth - marginX, y - 1, { align: 'right' });
    doc.text('Carrer Germans Thos i Codina 20, Mataró | Tel. +34 937 90 45 12', pageWidth - marginX, y + 3.5, { align: 'right' });

    y += 9;
    doc.setDrawColor(215, 215, 200);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 7;
  };

  const drawFooter = () => {
    const footerY = pageHeight - 12;
    doc.setDrawColor(215, 215, 200);
    doc.setLineWidth(0.2);
    doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 115);
    const footerDisclaimer = lang === 'cat' ? 'Cafè Gaudí Mataró • Preus amb IVA inclòs' : lang === 'eng' ? 'Café Gaudí Mataró • All prices include VAT' : 'Café Gaudí Mataró • Precios con IVA incluido';
    const pageWord = lang === 'cat' ? 'Pàgina' : lang === 'eng' ? 'Page' : 'Página';
    doc.text(footerDisclaimer, marginX, footerY);
    doc.text(
      `${pageWord} ${doc.getNumberOfPages()}`,
      pageWidth - marginX,
      footerY,
      { align: 'right' }
    );
  };

  const checkBreak = (height: number) => {
    if (y + height > bottomLimit) {
      drawFooter();
      doc.addPage();
      y = 18;
      drawHeader();
    }
  };

  drawHeader();

  // Page Title Banner
  doc.setFillColor(242, 242, 235);
  doc.roundedRect(marginX, y, contentWidth, 9, 1.5, 1.5, 'F');
  doc.setDrawColor(180, 180, 160);
  doc.roundedRect(marginX, y, contentWidth, 9, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 45);
  doc.text(pageTitle, marginX + 3.5, y + 6);
  y += 14;

  if (scheduleNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 85);
    doc.text(scheduleNote, marginX, y);
    y += 6;
  }

  page.sections.forEach((section) => {
    const transSection = dict.menu.sections?.[section.title];
    const sectionTitle = transSection?.title || section.title;
    const sectionSubtitle = transSection?.subtitle || section.subtitle;

    checkBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 90, 65);
    doc.text(sectionTitle.toUpperCase(), marginX, y);
    y += 4;

    if (sectionSubtitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 105);
      doc.text(sectionSubtitle, marginX, y);
      y += 4;
    }

    doc.setDrawColor(225, 225, 215);
    doc.setLineWidth(0.2);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 4;

    section.items.forEach((item) => {
      const dish = getTranslatedMenuItem(item, lang);
      const itemDescLines = dish.description
        ? doc.splitTextToSize(dish.description, contentWidth - 30)
        : [];
      const approxHeight = 8 + (itemDescLines.length * 3.5) + (item.allergens && item.allergens.length ? 4 : 0);

      checkBreak(approxHeight + 3);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 30);
      doc.text(dish.name, marginX, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(74, 74, 53);
      const effectivePrice = priceOverrides[item.id] !== undefined ? priceOverrides[item.id] : item.price;
      doc.text(`${effectivePrice.toFixed(2)} €`, pageWidth - marginX, y, { align: 'right' });

      if (item.priceSecondary) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 80);
        doc.text(`(${item.priceSecondary})`, marginX + doc.getTextWidth(dish.name) + 2.5, y);
      }

      y += 4;

      if (dish.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(95, 95, 80);
        itemDescLines.forEach((line: string) => {
          doc.text(line, marginX, y);
          y += 3.4;
        });
      }

      if (item.allergens && item.allergens.length > 0) {
        const allergenNames = item.allergens.map(getAllergenLabel).join(', ');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.2);
        doc.setTextColor(130, 115, 90);
        const allergensLabel = lang === 'cat' ? 'Al·lèrgens' : lang === 'eng' ? 'Allergens' : 'Alérgenos';
        doc.text(`${allergensLabel}: ${allergenNames}`, marginX, y);
        y += 3.8;
      }

      y += 2.2;
    });

    y += 2;
  });

  if (footerNote) {
    checkBreak(8);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 105);
    doc.text(footerNote, marginX, y);
    y += 5;
  }

  drawFooter();

  const safeFileName = tabTitle
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_')
    .toLowerCase();
  doc.save(`Carta_Cafe_Gaudi_${safeFileName}_${lang.toUpperCase()}.pdf`);
};
