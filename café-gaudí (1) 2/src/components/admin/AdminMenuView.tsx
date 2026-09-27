import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Edit2,
  Check,
  X,
  RotateCcw,
  DollarSign,
  Tag,
  HelpCircle
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../../data/menuData';
import {
  getStoredMenuAvailability,
  toggleMenuItemAvailability,
  getStoredMenuPriceOverrides,
  saveMenuItemPrice,
  resetMenuItemPrice,
  resetAllMenuPrices
} from '../../data/adminStore';

export const AdminMenuView: React.FC = () => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>(getStoredMenuAvailability);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(getStoredMenuPriceOverrides);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Quick Inline Price Editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempPriceInput, setTempPriceInput] = useState<string>('');
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPercentInput, setBulkPercentInput] = useState<string>('');
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<string>('todos');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggle = (itemId: string, itemName: string) => {
    const newStatus = toggleMenuItemAvailability(itemId);
    setAvailabilityMap((prev) => ({ ...prev, [itemId]: newStatus }));
    showToast(`${itemName}: marcado como ${newStatus ? 'Disponible' : 'Agotado'}`);
  };

  const startEditingPrice = (itemId: string, currentPrice: number) => {
    setEditingItemId(itemId);
    setTempPriceInput(currentPrice.toFixed(2));
  };

  const cancelEditingPrice = () => {
    setEditingItemId(null);
    setTempPriceInput('');
  };

  const savePrice = (itemId: string, itemName: string) => {
    const parsed = parseFloat(tempPriceInput.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0) {
      showToast('⚠️ Introduce un precio numérico válido (ej. 4.50)');
      return;
    }

    saveMenuItemPrice(itemId, parsed);
    setPriceOverrides((prev) => ({ ...prev, [itemId]: parsed }));
    setEditingItemId(null);
    setTempPriceInput('');
    showToast(`Precio actualizado: ${itemName} ahora cuesta ${parsed.toFixed(2)} €`);
  };

  const handleResetSinglePrice = (itemId: string, itemName: string, originalPrice: number) => {
    resetMenuItemPrice(itemId);
    setPriceOverrides((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
    showToast(`Restablecido a precio original: ${itemName} (${originalPrice.toFixed(2)} €)`);
  };

  const handleResetAllPrices = () => {
    if (window.confirm('¿Estás seguro de restablecer TODOS los precios modificados a sus valores originales de la carta?')) {
      resetAllMenuPrices();
      setPriceOverrides({});
      showToast('Todos los precios se han restablecido a los valores originales');
    }
  };

  const handleApplyBulkPercentage = () => {
    const pct = parseFloat(bulkPercentInput.replace(',', '.'));
    if (isNaN(pct) || pct === 0) {
      showToast('Introduce un porcentaje válido distinto de 0 (ej: 5 para +5% o -10 para -10%)');
      return;
    }

    const itemsToUpdate = MENU_ITEMS.filter((item) => {
      if (bulkCategoryTarget === 'todos') return true;
      return item.category === bulkCategoryTarget;
    });

    const newOverrides = { ...priceOverrides };
    itemsToUpdate.forEach((item) => {
      const basePrice = priceOverrides[item.id] !== undefined ? priceOverrides[item.id] : item.price;
      const updatedPrice = Math.max(0.1, Math.round((basePrice * (1 + pct / 100)) * 20) / 20); // Round to nearest 0.05
      newOverrides[item.id] = updatedPrice;
      saveMenuItemPrice(item.id, updatedPrice);
    });

    setPriceOverrides(newOverrides);
    setIsBulkPriceModalOpen(false);
    setBulkPercentInput('');
    showToast(`Ajuste del ${pct > 0 ? '+' : ''}${pct}% aplicado a ${itemsToUpdate.length} platos`);
  };

  const modifiedPricesCount = Object.keys(priceOverrides).length;

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeCategory !== 'todos' && item.category !== activeCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-sans animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-300" />
            <span>Gestión de Carta, Precios & Disponibilidad</span>
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Modifica precios en directo, actualiza disponibilidad y sincroniza automáticamente con la carta digital y los PDFs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {modifiedPricesCount > 0 && (
            <button
              onClick={handleResetAllPrices}
              className="text-xs text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-sans"
              title="Restablecer todos los precios modificados a sus valores originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Precios ({modifiedPricesCount})</span>
            </button>
          )}

          <button
            onClick={() => setIsBulkPriceModalOpen(true)}
            className="text-xs text-neutral-200 hover:text-white bg-[#2a2b22] hover:bg-[#34362b] border border-[#5a5a40]/40 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-sans"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-300" />
            <span>Ajuste Porcentual</span>
          </button>

          <div className="text-xs text-neutral-400 font-sans bg-[#24251e] border border-[#5a5a40]/30 px-3.5 py-2 rounded-xl">
            Total platos: <strong className="text-white">{MENU_ITEMS.length}</strong>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar plato, ingrediente o especialidad..."
            className="w-full pl-10 pr-4 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-amber-300/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-neutral-400 font-sans whitespace-nowrap mr-1">Sección:</span>
          <button
            onClick={() => setActiveCategory('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'todos'
                ? 'bg-amber-300/20 text-amber-300 border border-amber-300/40 font-medium'
                : 'bg-[#1e1f1a] text-neutral-400 hover:text-neutral-200 border border-[#5a5a40]/20'
            }`}
          >
            Todas ({MENU_ITEMS.length})
          </button>
          {MENU_CATEGORIES.map((cat) => {
            const count = MENU_ITEMS.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-300/20 text-amber-300 border border-amber-300/40 font-medium'
                    : 'bg-[#1e1f1a] text-neutral-400 hover:text-neutral-200 border border-[#5a5a40]/20'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isAvailable = availabilityMap[item.id] !== false; // default true
          const hasCustomPrice = priceOverrides[item.id] !== undefined;
          const currentPrice = hasCustomPrice ? priceOverrides[item.id] : item.price;
          const isEditing = editingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-[#24251e] border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                isAvailable
                  ? 'border-[#5a5a40]/30 hover:border-amber-300/30'
                  : 'border-red-900/30 bg-red-950/10 opacity-80'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-base font-medium text-white line-clamp-1 flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      {item.popular && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-neutral-900 font-bold rounded-full font-sans uppercase shrink-0">
                          Estrella
                        </span>
                      )}
                    </h4>
                    {item.portionNote && (
                      <p className="text-xs text-[#8a8a7a] italic truncate mt-0.5">
                        {item.portionNote}
                      </p>
                    )}
                  </div>

                  {/* Availability toggle button */}
                  <button
                    onClick={() => handleToggle(item.id, item.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isAvailable
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Disponible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Agotado</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-neutral-400 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                  {item.description}
                </p>

                {item.allergens && item.allergens.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-neutral-500 font-sans">Alérgenos:</span>
                    {item.allergens.map((alg) => (
                      <span
                        key={alg}
                        className="text-[10px] px-1.5 py-0.5 bg-[#1e1f1a] text-neutral-400 rounded-md border border-[#5a5a40]/20 font-sans"
                      >
                        {alg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Row & Edit Toolbar */}
              <div className="mt-4 pt-3 border-t border-[#5a5a40]/20 flex items-center justify-between gap-3 flex-wrap">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 animate-fade-in">
                    <span className="text-xs text-amber-300 font-medium font-sans">Precio (€):</span>
                    <div className="relative flex-1 max-w-[120px]">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={tempPriceInput}
                        onChange={(e) => setTempPriceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') savePrice(item.id, item.name);
                          if (e.key === 'Escape') cancelEditingPrice();
                        }}
                        autoFocus
                        className="w-full px-2.5 py-1.5 bg-[#171813] border border-amber-300/60 rounded-lg text-white font-mono text-sm font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-300"
                      />
                    </div>
                    <button
                      onClick={() => savePrice(item.id, item.name)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-sans font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      title="Guardar nuevo precio"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                    <button
                      onClick={cancelEditingPrice}
                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                      title="Cancelar edición"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-serif font-bold text-amber-300 tabular-nums">
                          {currentPrice.toFixed(2)} €
                        </span>
                        {hasCustomPrice && (
                          <span className="text-[11px] text-neutral-400 line-through font-mono">
                            {item.price.toFixed(2)} €
                          </span>
                        )}
                      </div>

                      {hasCustomPrice && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-sans font-medium">
                          Modificado
                        </span>
                      )}

                      {item.priceSecondary && (
                        <span className="text-[10px] text-neutral-400 font-sans hidden sm:inline-block">
                          ({item.priceSecondary})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasCustomPrice && (
                        <button
                          onClick={() => handleResetSinglePrice(item.id, item.name, item.price)}
                          className="px-2 py-1 text-[11px] text-neutral-400 hover:text-amber-200 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-[#5a5a40]/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Volver al precio original de carta"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span className="hidden sm:inline">Restablecer</span>
                        </button>
                      )}

                      <button
                        onClick={() => startEditingPrice(item.id, currentPrice)}
                        className="px-3 py-1 text-xs font-medium text-amber-300 hover:text-neutral-900 bg-amber-400/15 hover:bg-amber-300 border border-amber-400/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modificar precio</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Percentage Adjustment Modal */}
      {isBulkPriceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#24251e] border border-[#5a5a40]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/30">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-300" />
                <h3 className="font-serif text-lg font-medium">Ajuste Porcentual de Precios</h3>
              </div>
              <button
                onClick={() => setIsBulkPriceModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Aplica un incremento o descuento porcentual rápido sobre los precios de los platos de una sección o de toda la carta.
            </p>

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Sección a aplicar:</label>
                <select
                  value={bulkCategoryTarget}
                  onChange={(e) => setBulkCategoryTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1b15] border border-[#5a5a40]/40 rounded-xl text-white focus:outline-hidden focus:border-amber-300/50"
                >
                  <option value="todos">Toda la carta ({MENU_ITEMS.length} platos)</option>
                  {MENU_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({MENU_ITEMS.filter((i) => i.category === cat.id).length} platos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Porcentaje de variación (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={bulkPercentInput}
                    onChange={(e) => setBulkPercentInput(e.target.value)}
                    placeholder="Ejemplo: 5 para subir 5%, -10 para bajar 10%"
                    className="flex-1 px-3 py-2 bg-[#1a1b15] border border-[#5a5a40]/40 rounded-xl text-white focus:outline-hidden focus:border-amber-300/50 font-mono"
                  />
                  <span className="text-amber-300 font-bold text-sm">%</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Los nuevos precios se redondean automáticamente a múltiplos de 0.05 €.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#5a5a40]/30">
              <button
                onClick={() => setIsBulkPriceModalOpen(false)}
                className="px-4 py-2 text-xs text-neutral-300 hover:text-white bg-[#1a1b15] hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyBulkPercentage}
                className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer transition-all shadow-md"
              >
                Aplicar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
