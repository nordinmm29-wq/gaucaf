import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  Save,
  Upload,
  Link as LinkIcon,
  Star,
  Search,
  X,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { GALLERY_CATEGORIES } from '../../data/galleryData';

interface AdminGalleryViewProps {
  photos: GalleryPhoto[];
  onSavePhotos: (photos: GalleryPhoto[]) => void;
  onResetPhotos?: () => void;
}

export const AdminGalleryView: React.FC<AdminGalleryViewProps> = ({
  photos,
  onSavePhotos,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Modal / Form state
  const [isPhotoFormOpen, setIsPhotoFormOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<GalleryPhoto['category']>('hamburguesas');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [isGooglePhoto, setIsGooglePhoto] = useState(false);
  const [googleRating, setGoogleRating] = useState<number>(4.9);
  const [authorName, setAuthorName] = useState('Cliente en Google Maps');
  const [photoInputMethod, setPhotoInputMethod] = useState<'url' | 'upload'>('upload');
  const [imageUploadPreview, setImageUploadPreview] = useState<string>('');
  const [deleteConfirmPhoto, setDeleteConfirmPhoto] = useState<GalleryPhoto | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    if (categoryFilter !== 'todos' && p.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchAuthor = (p.authorName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingPhotoId(null);
    setPhotoTitle('');
    setPhotoCategory('hamburguesas');
    setPhotoUrl('');
    setPhotoDescription('');
    setIsGooglePhoto(false);
    setGoogleRating(4.9);
    setAuthorName('Cliente en Google Maps');
    setPhotoInputMethod('upload');
    setImageUploadPreview('');
    setIsPhotoFormOpen(true);
  };

  const handleOpenEditModal = (photo: GalleryPhoto) => {
    setEditingPhotoId(photo.id);
    setPhotoTitle(photo.title);
    setPhotoCategory(photo.category);
    setPhotoUrl(photo.imageUrl);
    setPhotoDescription(photo.description || '');
    setIsGooglePhoto(!!photo.isGooglePhoto);
    setGoogleRating(photo.googleRating || 4.9);
    setAuthorName(photo.authorName || 'Cliente en Google Maps');
    setPhotoInputMethod(photo.imageUrl.startsWith('data:') ? 'upload' : 'url');
    setImageUploadPreview(photo.imageUrl);
    setIsPhotoFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUploadPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = photoInputMethod === 'upload' && imageUploadPreview ? imageUploadPreview : photoUrl.trim();

    if (!finalUrl) {
      showNotification('Por favor añade una imagen (sube un archivo o escribe una URL válida).');
      return;
    }
    if (!photoTitle.trim()) {
      showNotification('Por favor especifica un título para la imagen.');
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
            imageUrl: finalUrl,
            description: photoDescription.trim() || undefined,
            isGooglePhoto,
            googleRating: isGooglePhoto ? googleRating : undefined,
            authorName: isGooglePhoto ? authorName.trim() : undefined,
          };
        }
        return p;
      });
      onSavePhotos(updated);
      showNotification('✓ Imagen guardada permanentemente en la galería');
    } else {
      // Add new photo
      const newPhoto: GalleryPhoto = {
        id: `custom-photo-${Date.now()}`,
        title: photoTitle.trim(),
        category: photoCategory,
        imageUrl: finalUrl,
        description: photoDescription.trim() || undefined,
        isGooglePhoto,
        googleRating: isGooglePhoto ? googleRating : undefined,
        authorName: isGooglePhoto ? authorName.trim() : undefined,
      };
      const updated = [newPhoto, ...photos];
      onSavePhotos(updated);
      showNotification('✓ Nueva imagen subida y guardada permanentemente en la galería');
    }

    setIsPhotoFormOpen(false);
  };

  // Functional delete for individual photo
  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    onSavePhotos(updated);
    setDeleteConfirmPhoto(null);
    showNotification('Fotografía eliminada definitivamente de la galería');
  };

  // Functional clear all photos
  const handleClearAllPhotos = () => {
    onSavePhotos([]);
    setShowClearAllModal(false);
    showNotification('Galería vaciada completamente. Ahora no contiene ninguna imagen.');
  };

  // Functional explicit save button
  const handleExplicitSave = () => {
    onSavePhotos([...photos]);
    showNotification('✓ Galería guardada permanentemente con éxito en el sistema.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-sans animate-fade-in border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-300" />
            <span>Gestor de Galería de Fotos</span>
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            La galería solo muestra las fotos que subas como administrador. Todas las imágenes guardadas son permanentes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón de Guardado Funcional Permanente */}
          <button
            onClick={handleExplicitSave}
            className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-sans text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer border border-emerald-500/40"
            title="Asegurar y guardar el estado actual de la galería de fotos permanentemente"
          >
            <Save className="w-4 h-4 text-emerald-200" />
            <span>Guardar Galería</span>
          </button>

          {/* Botón de Borrado Masivo (si hay fotos) */}
          {photos.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="px-3.5 py-2.5 bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-700/50 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Borrar todas las fotos y dejar la galería vacía"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Galería</span>
            </button>
          )}

          {/* Botón de Subir / Añadir */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Subir Imagen</span>
          </button>
        </div>
      </div>

      {/* Info Status Bar */}
      <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-sans text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>
            Total de imágenes en la galería pública: <strong>{photos.length}</strong>
          </span>
          {photos.length === 0 && (
            <span className="text-amber-300/90 ml-1 font-medium">(Galería actualmente vacía)</span>
          )}
        </div>

        {photos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar imagen..."
                className="w-full sm:w-48 pl-10 pr-7 py-1.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-amber-300/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-sans whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-amber-300/20 text-amber-300 border border-amber-300/40 font-medium'
                      : 'bg-[#1e1f1a] text-neutral-400 hover:text-neutral-200 border border-[#5a5a40]/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Area: Photos Grid or Empty State */}
      {photos.length === 0 ? (
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#5a5a40]/20 border border-[#5a5a40]/40 flex items-center justify-center mx-auto mb-4 text-amber-300">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-white font-medium">La galería de fotos está vacía</h3>
          <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
            Solo aparecerán en la web pública las imágenes que tú subas o agregues como administrador.
            Puedes subir archivos desde tu ordenador o móvil (formatos PNG, JPG, WebP) o ingresar direcciones web de imágenes.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white rounded-xl text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Subir Mi Primera Imagen</span>
            </button>
          </div>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-12 text-center">
          <Camera className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-white font-medium">No hay fotos que coincidan con los filtros</h3>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Prueba a seleccionar «Todas las fotos» o borrar el texto de búsqueda.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('todos');
            }}
            className="mt-4 px-4 py-2 bg-[#5a5a40]/50 hover:bg-[#5a5a40] text-white rounded-xl text-xs font-sans transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#24251e] border border-[#5a5a40]/30 hover:border-amber-300/40 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Image display */}
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Category badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider bg-black/75 text-amber-300 backdrop-blur-xs border border-white/10">
                    {photo.category}
                  </span>

                  {/* Google Maps indicator */}
                  {photo.isGooglePhoto && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-400 text-neutral-900 flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-neutral-900" />
                      <span>{photo.googleRating || 5.0}</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-serif text-sm font-medium text-white line-clamp-1">
                    {photo.title}
                  </h4>
                  {photo.description && (
                    <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  {photo.authorName && (
                    <p className="text-[11px] text-amber-300/80 font-sans mt-1.5 flex items-center gap-1">
                      <span>Autor:</span>
                      <strong className="text-neutral-300">{photo.authorName}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Functional Edit & Functional Delete */}
              <div className="p-3 bg-[#1e1f1a] border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditModal(photo)}
                  className="text-xs font-sans text-neutral-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmPhoto(photo)}
                  className="text-xs font-sans text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-950/40"
                  title="Eliminar esta fotografía definitivamente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Delete Individual Photo Confirmation */}
      {deleteConfirmPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#24251e] border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-white font-medium">¿Eliminar esta fotografía?</h3>
            <p className="text-xs text-neutral-300 font-medium font-sans mt-1 line-clamp-1">
              «{deleteConfirmPhoto.title}»
            </p>
            <p className="text-xs text-neutral-400 font-sans mt-1 leading-relaxed">
              Esta imagen se eliminará permanentemente tanto del almacenamiento como de la web pública de Café Gaudí.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmPhoto(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeletePhoto(deleteConfirmPhoto.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-sans font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Clear All Photos Confirmation */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#24251e] border border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-white font-medium">¿Vaciar toda la galería de fotos?</h3>
            <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
              Se eliminarán permanentemente todas las <strong>{photos.length}</strong> imágenes actualmente almacenadas.
              La galería quedará completamente vacía hasta que subas nuevas fotos. Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAllPhotos}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-sans font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, vaciar galería</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Photo */}
      {isPhotoFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#24251e] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[#5a5a40]/40 my-auto text-left">
            <div className="bg-[#2d2e26] text-white px-6 py-4 flex items-center justify-between border-b border-[#5a5a40]/30">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-300" />
                <span className="font-serif text-base font-medium">
                  {editingPhotoId ? 'Editar Fotografía de la Galería' : 'Subir y Guardar Fotografía'}
                </span>
              </div>
              <button
                onClick={() => setIsPhotoFormOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhotoSubmit} className="p-6 space-y-4">
              {/* Image Input Method Selector */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-2 font-medium">
                  Origen de la Imagen
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPhotoInputMethod('upload')}
                    className={`py-2 px-3 rounded-xl text-xs font-sans flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      photoInputMethod === 'upload'
                        ? 'bg-amber-300/10 text-amber-300 border-amber-300/40 font-medium'
                        : 'bg-[#1e1f1a] text-neutral-400 border-neutral-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir desde dispositivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoInputMethod('url')}
                    className={`py-2 px-3 rounded-xl text-xs font-sans flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      photoInputMethod === 'url'
                        ? 'bg-amber-300/10 text-amber-300 border-amber-300/40 font-medium'
                        : 'bg-[#1e1f1a] text-neutral-400 border-neutral-800'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Enlace / URL de Internet</span>
                  </button>
                </div>
              </div>

              {/* Upload file or URL input */}
              {photoInputMethod === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#5a5a40]/50 hover:border-amber-300/60 rounded-2xl p-6 text-center bg-[#1e1f1a] cursor-pointer transition-colors group"
                  >
                    {imageUploadPreview ? (
                      <div className="space-y-3">
                        <img
                          src={imageUploadPreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-xl object-cover shadow-md"
                        />
                        <p className="text-xs text-amber-300 group-hover:underline">
                          Haz clic para cambiar la imagen seleccionada
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-amber-300 mx-auto transition-colors" />
                        <p className="text-xs text-white font-medium">
                          Haz clic para seleccionar una foto desde tu dispositivo
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Formatos aceptados: JPG, PNG, WebP (Máximo 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-sans text-neutral-300 mb-1">
                    URL directa de la imagen
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => {
                      setPhotoUrl(e.target.value);
                      setImageUploadPreview(e.target.value);
                    }}
                    placeholder="https://ejemplo.com/foto-plato.jpg"
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                  {imageUploadPreview && (
                    <div className="mt-2 text-center">
                      <img
                        src={imageUploadPreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-xl object-cover border border-neutral-800"
                        onError={() => setImageUploadPreview('')}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-sans text-neutral-300 mb-1">
                  Título o nombre de la foto <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ej. Tapa de Bravas Especiales Gaudí"
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-sans text-neutral-300 mb-1">
                  Categoría
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as GalleryPhoto['category'])}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                >
                  <option value="hamburguesas">Hamburguesas & Tapas</option>
                  <option value="cafe">Café & Brunch</option>
                  <option value="ambiente">Local & Terraza</option>
                  <option value="cocteles">Vermut & Cócteles</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-sans text-neutral-300 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="Detalle sobre el plato, elaboración o rincón del local..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              {/* Google Maps Verified Photo Toggle */}
              <div className="bg-[#1e1f1a] p-4 rounded-2xl border border-[#5a5a40]/30 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGooglePhoto}
                    onChange={(e) => setIsGooglePhoto(e.target.checked)}
                    className="rounded-sm text-amber-500 focus:ring-0 w-4 h-4 bg-neutral-900 border-neutral-700 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-200 font-sans font-medium">
                    Destacar como «Foto de Reseña en Google Maps»
                  </span>
                </label>

                {isGooglePhoto && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Nombre del autor
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Ej. David R. (Guía Local)"
                        className="w-full px-2.5 py-1.5 bg-[#282922] border border-neutral-700 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Puntuación (1.0 a 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={googleRating}
                        onChange={(e) => setGoogleRating(parseFloat(e.target.value) || 5)}
                        className="w-full px-2.5 py-1.5 bg-[#282922] border border-neutral-700 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons: Functional Save button */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPhotoFormOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-semibold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPhotoId ? 'Guardar Cambios Permanentemente' : 'Guardar Imagen Permanentemente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
