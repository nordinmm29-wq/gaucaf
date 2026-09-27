import { GalleryPhoto } from '../types';

export const GALLERY_CATEGORIES = [
  { id: 'todos', label: 'Todas las fotos' },
  { id: 'google', label: '★ Fotos de Google Maps' },
  { id: 'hamburguesas', label: 'Hamburguesas & Tapas' },
  { id: 'cafe', label: 'Café & Brunch' },
  { id: 'ambiente', label: 'Local & Terraza' },
  { id: 'cocteles', label: 'Vermut & Cócteles' },
] as const;

// La galería inicial está completamente vacía por defecto.
// Solo aparecerán las fotografías subidas y guardadas por el administrador.
export const GALLERY_PHOTOS: GalleryPhoto[] = [];

