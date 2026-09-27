import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Unlock,
  Camera,
  Mail,
  ListOrdered,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Star,
  ExternalLink,
  Eye,
  Save,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { GalleryPhoto, ConfirmationEmailConfig, Reservation } from '../types';
import {
  getStoredGalleryPhotos,
  saveGalleryPhotos,
  resetGalleryPhotos,
  getStoredEmailConfig,
  saveEmailConfig,
  resetEmailConfig,
  isAdminAuthenticated,
  setAdminAuthenticated,
  DEFAULT_EMAIL_CONFIG,
  getStoredReservations,
  saveReservations,
} from '../data/adminStore';
import { GALLERY_CATEGORIES } from '../data/galleryData';
import { EmailPreviewCard } from './EmailPreviewCard';
import { SOCIAL_LINKS } from '../data/socialData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tabs: 'galeria' | 'email' | 'preview' | 'reservas'
  const [activeTab, setActiveTab] = useState<'galeria' | 'email' | 'preview' | 'reservas'>('galeria');

  // Gallery state
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [gallerySearch, setGallerySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Add/Edit photo modal state
  const [isPhotoFormOpen, setIsPhotoFormOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<GalleryPhoto['category']>('hamburguesas');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [isGooglePhoto, setIsGooglePhoto] = useState(false);
  const [googleRating, setGoogleRating] = useState<number>(4.9);
  const [authorName, setAuthorName] = useState('Cliente en Google Maps');
  const [photoInputMethod, setPhotoInputMethod] = useState<'url' | 'upload'>('url');
  const [imageUploadPreview, setImageUploadPreview] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Email Config state
  const [emailConfig, setEmailConfig] = useState<ConfirmationEmailConfig>(DEFAULT_EMAIL_CONFIG);
  const [emailSavedSuccess, setEmailSavedSuccess] = useState(false);
  const [testEmailSentSuccess, setTestEmailSentSuccess] = useState(false);

  // Reservations list state
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthenticated(isAdminAuthenticated());
      setPhotos(getStoredGalleryPhotos());
      setEmailConfig(getStoredEmailConfig());
      setReservations(getStoredReservations());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Password required: 'cafegaudi2026'
    const trimmed = passwordInput.trim().toLowerCase();
    if (trimmed === 'cafegaudi2026') {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
    setPasswordInput('');
  };

  // --- Photo Gallery actions ---
  const handleOpenNewPhoto = () => {
    setEditingPhotoId(null);
    setPhotoTitle('');
    setPhotoCategory('hamburguesas');
    setPhotoUrl('');
    setImageUploadPreview('');
    setPhotoDescription('');
    setIsGooglePhoto(true);
    setGoogleRating(4.9);
    setAuthorName('Cliente en Google Maps');
    setPhotoInputMethod('url');
    setIsPhotoFormOpen(true);
  };

  const handleOpenEditPhoto = (p: GalleryPhoto) => {
    setEditingPhotoId(p.id);
    setPhotoTitle(p.title);
    setPhotoCategory(p.category);
    setPhotoUrl(p.imageUrl);
    setImageUploadPreview(p.imageUrl);
    setPhotoDescription(p.description || '');
    setIsGooglePhoto(!!p.isGooglePhoto);
    setGoogleRating(p.googleRating || 4.9);
    setAuthorName(p.authorName || 'Cliente en Google Maps');
    setPhotoInputMethod(p.imageUrl.startsWith('data:') ? 'upload' : 'url');
    setIsPhotoFormOpen(true);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUploadPreview(result);
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = photoInputMethod === 'upload' ? imageUploadPreview : photoUrl;

    if (!finalUrl.trim()) {
      alert('Debes proporcionar una URL de imagen o subir un archivo.');
      return;
    }

    if (!photoTitle.trim()) {
      alert('Por favor indica un título para la imagen.');
      return;
    }

    if (editingPhotoId) {
      // Update existing photo
      const updated = photos.map((p) => {
        if (p.id === editingPhotoId) {
          return {
            ...p,
            title: photoTitle.trim(),
            category: photoCategory,
            imageUrl: finalUrl.trim(),
            description: photoDescription.trim(),
            isGooglePhoto,
            googleRating: isGooglePhoto ? Number(googleRating) : undefined,
            authorName: isGooglePhoto ? authorName.trim() : undefined,
          };
        }
        return p;
      });
      setPhotos(updated);
      saveGalleryPhotos(updated);
    } else {
      // Add new photo
      const newPhoto: GalleryPhoto = {
        id: `custom-photo-${Date.now()}`,
        title: photoTitle.trim(),
        category: photoCategory,
        imageUrl: finalUrl.trim(),
        description: photoDescription.trim(),
        isGooglePhoto,
        googleRating: isGooglePhoto ? Number(googleRating) : undefined,
        authorName: isGooglePhoto ? authorName.trim() : undefined,
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      saveGalleryPhotos(updated);
    }

    setIsPhotoFormOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    saveGalleryPhotos(updated);
    setDeleteConfirmId(null);
  };

  const handleResetGallery = () => {
    if (window.confirm('¿Seguro que deseas restablecer las 12 fotos iniciales de la galería?')) {
      const reset = resetGalleryPhotos();
      setPhotos(reset);
    }
  };

  // Preset sample food photos for fast addition
  const SAMPLE_PRESETS = [
    {
      title: 'Hamburguesa Doble Smash con Cheddar',
      category: 'hamburguesas' as const,
      url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Café Cappuccino con Espuma de Canela',
      category: 'cafe' as const,
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Tapa de Jamón Ibérico y Pan con Tomate',
      category: 'gastronomia' as const,
      url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Cóctel Aperol Spritz con Rodaja de Naranja',
      category: 'cocteles' as const,
      url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // --- Email Config actions ---
  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailConfig(emailConfig);
    setEmailSavedSuccess(true);
    setTimeout(() => setEmailSavedSuccess(false), 3000);
  };

  const handleResetEmailConfig = () => {
    if (window.confirm('¿Deseas restaurar los textos predeterminados del correo de confirmación?')) {
      const reset = resetEmailConfig();
      setEmailConfig(reset);
      setEmailSavedSuccess(true);
      setTimeout(() => setEmailSavedSuccess(false), 3000);
    }
  };

  const handleSendTestEmail = () => {
    setTestEmailSentSuccess(true);
    setTimeout(() => setTestEmailSentSuccess(false), 4000);
  };

  const handleInsertVariable = (field: keyof ConfirmationEmailConfig, variableTag: string) => {
    setEmailConfig((prev) => ({
      ...prev,
      [field]: (prev[field] || '') + ' ' + variableTag,
    }));
  };

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(gallerySearch.toLowerCase()));
    const matchesCat = categoryFilter === 'todos' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#f5f5f0] w-full max-w-5xl rounded-[32px] shadow-2xl border border-[#5a5a40]/20 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-[#3d3d33] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5a5a40] flex items-center justify-center text-white border border-white/20">
              {authenticated ? <Unlock className="w-4 h-4 text-emerald-300" /> : <Lock className="w-4 h-4 text-amber-300" />}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[#a0a090] font-sans font-medium">
                Panel de Control
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-light text-white">
                Administración • Café Gaudí
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-[#dcdcd0] hover:text-white transition-colors"
                title="Cerrar sesión de administrador"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!authenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#5a5a40]/10 border border-[#5a5a40]/20 flex items-center justify-center mx-auto text-[#5a5a40]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#3d3d33] mb-2">
                Acceso de Administración
              </h3>
              <p className="text-xs sm:text-sm text-[#8a8a7a] font-light">
                Gestiona las fotos de la galería y configura el correo de confirmación de reservas.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1.5">
                  Contraseña de Acceso
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Introduce la contraseña..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#5a5a40]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a5a40]"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Contraseña incorrecta. Por favor, verifica la contraseña introducida.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="bg-[#e8e8e0] px-6 py-2.5 flex items-center justify-between border-b border-[#5a5a40]/15 overflow-x-auto gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('galeria')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'galeria'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#5a5a40]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Galería de Imágenes</span>
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {photos.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('email')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'email'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#5a5a40]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Configurar Mail Confirmación</span>
                </button>

                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#5a5a40]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Vista Previa Email</span>
                </button>

                <button
                  onClick={() => setActiveTab('reservas')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'reservas'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#5a5a40]'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Reservas ({reservations.length})</span>
                </button>
              </div>

              <div className="hidden md:flex items-center text-[11px] text-[#737365]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                <span>Cambios sincronizados en vivo</span>
              </div>
            </div>

            {/* TAB CONTENT 1: GALLERY MANAGEMENT */}
            {activeTab === 'galeria' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Actions bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#5a5a40]/15">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-[#8a8a7a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={gallerySearch}
                        onChange={(e) => setGallerySearch(e.target.value)}
                        placeholder="Buscar foto por título..."
                        className="w-full pl-10 pr-4 py-2 bg-[#f5f5f0] border border-[#5a5a40]/15 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                      />
                    </div>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-[#f5f5f0] border border-[#5a5a40]/15 rounded-full text-xs text-[#3d3d33] focus:outline-none"
                    >
                      <option value="todos">Todas las categorías</option>
                      <option value="hamburguesas">Hamburguesas & Tapas</option>
                      <option value="cafe">Café & Brunch</option>
                      <option value="ambiente">Local & Terraza</option>
                      <option value="cocteles">Vermut & Cócteles</option>
                      <option value="gastronomia">Gastronomía General</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetGallery}
                      className="px-3.5 py-2 rounded-full border border-[#5a5a40]/20 text-[#5a5a40] hover:bg-[#f5f5f0] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Restablecer a las 12 fotos iniciales"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restablecer Originales</span>
                    </button>

                    <button
                      onClick={handleOpenNewPhoto}
                      className="px-5 py-2 rounded-full bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir Nueva Foto</span>
                    </button>
                  </div>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-2xl border border-[#5a5a40]/15 overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow"
                    >
                      {/* Photo preview container */}
                      <div className="relative h-44 bg-neutral-100 overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
                          {photo.category}
                        </span>
                        {photo.isGooglePhoto && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            {photo.googleRating ?? 4.9} ★
                          </span>
                        )}
                      </div>

                      {/* Info & Card Actions */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-serif text-base font-normal text-[#2d2d25] line-clamp-1 mb-1">
                            {photo.title}
                          </h4>
                          <p className="text-xs text-[#8a8a7a] line-clamp-2 font-light">
                            {photo.description || 'Sin descripción adicional.'}
                          </p>
                          {photo.authorName && (
                            <p className="text-[11px] text-[#737365] mt-1 font-mono">
                              Autor: {photo.authorName}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-[#5a5a40]/10 flex items-center justify-between">
                          <button
                            onClick={() => handleOpenEditPhoto(photo)}
                            className="px-3 py-1.5 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e0] text-xs font-semibold text-[#5a5a40] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          {deleteConfirmId === photo.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-red-600 font-semibold mr-1">¿Borrar?</span>
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded-full bg-neutral-200 text-neutral-700 text-xs transition-colors cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(photo.id)}
                              className="p-1.5 rounded-full text-[#8a8a7a] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar foto de la galería"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredPhotos.length === 0 && (
                    <div className="col-span-full py-16 text-center text-[#8a8a7a]">
                      <Camera className="w-10 h-10 mx-auto mb-2 text-[#a0a090]" />
                      <p className="text-sm">No se han encontrado fotos con ese criterio.</p>
                      <button
                        onClick={() => {
                          setGallerySearch('');
                          setCategoryFilter('todos');
                        }}
                        className="mt-2 text-xs text-[#5a5a40] font-semibold underline cursor-pointer"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: EMAIL CONFIGURATION */}
            {activeTab === 'email' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#5a5a40]/15 space-y-6">
                  {/* Tab header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5a5a40]/15 pb-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-light text-[#2d2d25]">
                        Configuración de la Plantilla de Email
                      </h3>
                      <p className="text-xs text-[#8a8a7a] font-light">
                        Personaliza los textos, variables y estilo del correo que se envía al cliente tras reservar una mesa.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetEmailConfig}
                        className="px-3.5 py-2 rounded-full border border-[#5a5a40]/20 text-[#5a5a40] hover:bg-[#f5f5f0] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restablecer Plantilla</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className="px-4 py-2 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e0] text-[#5a5a40] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Vista Previa</span>
                      </button>
                    </div>
                  </div>

                  {/* Variables helper banner */}
                  <div className="bg-[#5a5a40]/5 border border-[#5a5a40]/15 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#5a5a40] mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Variables dinámicas disponibles (haz clic para insertar en cualquier campo):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {[
                        { tag: '{nombre}', label: 'Nombre cliente' },
                        { tag: '{codigo}', label: 'Código (#GAUDI-XXXX)' },
                        { tag: '{fecha}', label: 'Fecha' },
                        { tag: '{hora}', label: 'Hora' },
                        { tag: '{personas}', label: 'Comensales' },
                        { tag: '{zona}', label: 'Terraza / Salón' },
                        { tag: '{telefono_local}', label: 'Tel. Gaudí (931 45 90 19)' },
                        { tag: '{direccion_local}', label: 'Dirección' },
                      ].map((v) => (
                        <button
                          key={v.tag}
                          type="button"
                          onClick={() => handleInsertVariable('greetingText', v.tag)}
                          className="px-2.5 py-1 rounded-full bg-white border border-[#5a5a40]/20 text-[#5a5a40] hover:bg-[#5a5a40] hover:text-white transition-colors text-[11px] font-mono cursor-pointer"
                          title={`Insertar ${v.tag} en el saludo`}
                        >
                          <strong>{v.tag}</strong> ({v.label})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveEmailConfig} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                          Nombre del Remitente
                        </label>
                        <input
                          type="text"
                          value={emailConfig.senderName}
                          onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                          Email del Remitente
                        </label>
                        <input
                          type="email"
                          value={emailConfig.senderEmail}
                          onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40]">
                          Asunto del Correo
                        </label>
                        <span className="text-[11px] text-[#8a8a7a]">Soporta variables como {'{codigo}'}</span>
                      </div>
                      <input
                        type="text"
                        value={emailConfig.subject}
                        onChange={(e) => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] font-medium focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                        Encabezado / Título Principal del Email
                      </label>
                      <input
                        type="text"
                        value={emailConfig.headline}
                        onChange={(e) => setEmailConfig({ ...emailConfig, headline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                        Cuerpo del Mensaje / Saludo de Bienvenida
                      </label>
                      <textarea
                        rows={3}
                        value={emailConfig.greetingText}
                        onChange={(e) => setEmailConfig({ ...emailConfig, greetingText: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                        Política de Llegada y Minutos de Cortesía
                      </label>
                      <textarea
                        rows={2}
                        value={emailConfig.policyNotes}
                        onChange={(e) => setEmailConfig({ ...emailConfig, policyNotes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                          Texto del Botón de Acción
                        </label>
                        <input
                          type="text"
                          value={emailConfig.buttonText}
                          onChange={(e) => setEmailConfig({ ...emailConfig, buttonText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                          Nota de Alérgenos / Tronas (Opcional)
                        </label>
                        <input
                          type="text"
                          value={emailConfig.accentNote || ''}
                          onChange={(e) => setEmailConfig({ ...emailConfig, accentNote: e.target.value })}
                          placeholder="Ej: Indícanos cualquier alergia a la llegada..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                        Pie de Página / Ubicación y Contacto
                      </label>
                      <input
                        type="text"
                        value={emailConfig.footerNotes}
                        onChange={(e) => setEmailConfig({ ...emailConfig, footerNotes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                        required
                      />
                    </div>

                    {/* Submit and Test buttons */}
                    <div className="pt-4 border-t border-[#5a5a40]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-full bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar Configuración del Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          className="px-4 py-3 rounded-full border border-[#5a5a40]/30 hover:bg-[#f5f5f0] text-[#5a5a40] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Simular Envío de Prueba</span>
                        </button>
                      </div>

                      {emailSavedSuccess && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>¡Plantilla guardada con éxito!</span>
                        </div>
                      )}

                      {testEmailSentSuccess && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <span>Simulación enviada a tu bandeja. Revisa la pestaña "Vista Previa".</span>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: LIVE EMAIL PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#5a5a40]/15">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#2d2d25]">
                      Previsualización Interactiva del Email
                    </h3>
                    <p className="text-xs text-[#8a8a7a]">
                      Así es exactamente como se mostrará el correo al cliente cuando confirme su mesa.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('email')}
                    className="px-4 py-2 rounded-full bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Modificar Textos</span>
                  </button>
                </div>

                <div className="max-w-2xl mx-auto">
                  <EmailPreviewCard config={emailConfig} />
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: RESERVATIONS LIST */}
            {activeTab === 'reservas' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#5a5a40]/15">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#2d2d25]">
                      Libro de Reservas Registradas
                    </h3>
                    <p className="text-xs text-[#8a8a7a]">
                      Histórico de reservas creadas por clientes a través del sitio web.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#5a5a40] text-white px-3 py-1 rounded-full">
                    {reservations.length} {reservations.length === 1 ? 'reserva' : 'reservas'}
                  </span>
                </div>

                <div className="space-y-3">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-5 rounded-2xl border border-[#5a5a40]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#5a5a40] bg-[#f5f5f0] px-2.5 py-0.5 rounded-md border border-[#5a5a40]/20">
                            #{res.code}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                              res.status === 'confirmada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-medium text-[#2d2d25]">
                          {res.name} • {res.guests} {res.guests === 1 ? 'comensal' : 'comensales'}
                        </h4>

                        <div className="text-xs text-[#737365] flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#5a5a40]" />
                            {res.date} a las {res.time} h
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#5a5a40]" />
                            {res.zone === 'salon' ? 'Salón Principal' : 'Terraza Exterior'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#5a5a40]" />
                            <a href={`tel:${res.phone}`} className="hover:underline text-[#5a5a40]">
                              {res.phone}
                            </a>
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#5a5a40]" />
                            <a href={`mailto:${res.email}`} className="hover:underline text-[#5a5a40]">
                              {res.email}
                            </a>
                          </span>
                        </div>

                        {res.specialRequests && (
                          <p className="text-xs text-[#8a8a7a] italic pt-1">
                            Nota: "{res.specialRequests}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {res.status === 'confirmada' && (
                          <button
                            onClick={() => {
                              const updated = reservations.map((r) =>
                                r.id === res.id ? { ...r, status: 'cancelada' as const } : r
                              );
                              setReservations(updated);
                              localStorage.setItem('gaudi_reservations', JSON.stringify(updated));
                            }}
                            className="px-3 py-1.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${res.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hola ${res.name}, te contactamos de Café Gaudí respecto a tu reserva del ${res.date} a las ${res.time}h.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}

                  {reservations.length === 0 && (
                    <div className="py-14 text-center text-[#8a8a7a]">
                      <Calendar className="w-10 h-10 mx-auto mb-2 text-[#a0a090]" />
                      <p className="text-sm">No hay reservas registradas en este dispositivo todavía.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="bg-[#e8e8e0] px-6 py-3 border-t border-[#5a5a40]/15 flex items-center justify-between text-xs text-[#737365]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3d3d33]">Café Gaudí</span>
            <span>• Mataró (Barcelona)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Soporte: {SOCIAL_LINKS.phone}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#3d3d33] hover:bg-[#22221b] text-white rounded-full transition-colors cursor-pointer font-medium"
            >
              Cerrar Panel
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: Add / Edit Photo */}
      {isPhotoFormOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs">
          <div className="bg-[#f5f5f0] w-full max-w-xl rounded-[28px] shadow-2xl border border-[#5a5a40]/20 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#3d3d33] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-light">
                {editingPhotoId ? 'Editar Fotografía' : 'Añadir Nueva Fotografía'}
              </h3>
              <button
                onClick={() => setIsPhotoFormOpen(false)}
                className="text-[#a0a090] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="p-6 overflow-y-auto space-y-4">
              {/* Photo title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                  Título del Plato o Espacio *
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ej: Hamburguesa Gaudí Black Angus Especial"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                  Categoría en la Galería *
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                >
                  <option value="hamburguesas">Hamburguesas & Tapas</option>
                  <option value="cafe">Café & Brunch</option>
                  <option value="ambiente">Local & Terraza</option>
                  <option value="cocteles">Vermut & Cócteles</option>
                  <option value="gastronomia">Gastronomía General</option>
                </select>
              </div>

              {/* Image Input Method Tabs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1.5">
                  Método de Subida de Imagen *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPhotoInputMethod('url')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      photoInputMethod === 'url'
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                        : 'bg-white text-[#5a5a40] border-[#5a5a40]/20'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Enlace Web (URL)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoInputMethod('upload')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      photoInputMethod === 'upload'
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                        : 'bg-white text-[#5a5a40] border-[#5a5a40]/20'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir desde Dispositivo</span>
                  </button>
                </div>

                {photoInputMethod === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                    />

                    {/* Presets shortcut */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#5a5a40]/10">
                      <span className="text-[10px] uppercase font-semibold text-[#8a8a7a] block mb-1">
                        Sugerencias de fotos gastronómicas de alta calidad (1 clic):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setPhotoUrl(preset.url);
                              if (!photoTitle) setPhotoTitle(preset.title);
                              setPhotoCategory(preset.category);
                            }}
                            className="px-2 py-1 bg-[#f5f5f0] hover:bg-[#e8e8e0] rounded-lg text-[11px] text-[#5a5a40] border border-[#5a5a40]/15 transition-colors cursor-pointer"
                          >
                            {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#5a5a40]/30 hover:border-[#5a5a40] bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-8 h-8 mx-auto text-[#5a5a40] mb-2" />
                      <p className="text-xs font-semibold text-[#3d3d33]">
                        Haz clic aquí para seleccionar una foto de tu galería
                      </p>
                      <p className="text-[11px] text-[#8a8a7a] mt-1 font-light">
                        Formatos soportados: JPG, PNG, WEBP (hasta 5MB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {(photoInputMethod === 'upload' ? imageUploadPreview : photoUrl) && (
                  <div className="mt-3 relative h-36 rounded-xl overflow-hidden bg-neutral-100 border border-[#5a5a40]/20">
                    <img
                      src={photoInputMethod === 'upload' ? imageUploadPreview : photoUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                      onError={() => {
                        // fallback or error
                      }}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                      Vista previa de imagen
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5a5a40] mb-1">
                  Descripción Corta (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="Detalles sobre ingredientes, elaboración o ambiente..."
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#5a5a40]/20 text-xs text-[#2d2d25] focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                />
              </div>

              {/* Google Maps Verified Photo Toggle */}
              <div className="bg-white p-4 rounded-xl border border-[#5a5a40]/15 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGooglePhoto}
                    onChange={(e) => setIsGooglePhoto(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5a5a40] focus:ring-[#5a5a40]"
                  />
                  <span className="text-xs font-semibold text-[#3d3d33]">
                    Marcar como reseña / foto de Google Maps (Badge 4.8 ★)
                  </span>
                </label>

                {isGooglePhoto && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#737365] mb-1">
                        Puntuación (ej. 4.9)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={googleRating}
                        onChange={(e) => setGoogleRating(parseFloat(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#737365] mb-1">
                        Nombre del autor o guía
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#f5f5f0] border border-[#5a5a40]/20 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#5a5a40]/15 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoFormOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-[#5a5a40]/20 text-[#5a5a40] hover:bg-[#e8e8e0] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {editingPhotoId ? 'Guardar Cambios' : 'Publicar Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
