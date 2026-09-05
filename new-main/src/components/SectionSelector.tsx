import React, { useState, useEffect } from 'react';
import { Plus, Check, Tag, X, Sparkles } from 'lucide-react';
import {
  SectionItem,
  getAllSections,
  addCustomSection,
  deleteCustomSection,
} from '../utils/sectionStore';

interface SectionSelectorProps {
  value: string;
  onChange: (sectionId: string) => void;
  className?: string;
  showTitle?: boolean;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  value,
  onChange,
  className = '',
  showTitle = true,
}) => {
  const [sections, setSections] = useState<SectionItem[]>(getAllSections());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reloadSections = () => {
    setSections(getAllSections());
  };

  useEffect(() => {
    window.addEventListener('svs_sections_updated', reloadSections);
    return () => window.removeEventListener('svs_sections_updated', reloadSections);
  }, []);

  const handleAddNewSection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSectionName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a section name.');
      return;
    }

    try {
      const created = addCustomSection(trimmed);
      setNewSectionName('');
      setIsAddingNew(false);
      setErrorMsg(null);
      reloadSections();
      onChange(created.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding section';
      setErrorMsg(msg);
    }
  };

  const handleDeleteSection = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this custom section? Existing products will remain safe.')) {
      deleteCustomSection(secId);
      reloadSections();
      if (value === secId) {
        onChange('home');
      }
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#946e1c]" />
            <span>Target Section / Category *</span>
          </label>
          <span className="text-[11px] text-stone-500 font-normal">
            Choose where this space appears
          </span>
        </div>
      )}

      {/* SECTIONS PILLS GRID */}
      <div className="flex flex-wrap gap-2">
        {sections.map((sec) => {
          const isSelected = value === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onChange(sec.id)}
              className={`group relative px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                isSelected
                  ? 'bg-[#946e1c] text-white shadow-xs ring-2 ring-[#946e1c]/40 font-bold'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
              ) : sec.isCustom ? (
                <Sparkles className="w-3 h-3 text-[#946e1c] shrink-0" />
              ) : null}

              <span>{sec.label}</span>

              {/* Delete button for custom sections */}
              {sec.isCustom && (
                <span
                  onClick={(e) => handleDeleteSection(sec.id, e)}
                  className={`ml-1 p-0.5 rounded-md hover:bg-rose-500 hover:text-white transition-colors ${
                    isSelected ? 'text-white/80' : 'text-stone-400'
                  }`}
                  title="Delete this custom section"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}

        {/* ADD NEW SECTION TOGGLE BUTTON */}
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(true);
              setErrorMsg(null);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#946e1c] bg-[#946e1c]/10 hover:bg-[#946e1c]/20 border border-dashed border-[#946e1c]/40 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Section</span>
          </button>
        )}
      </div>

      {/* INLINE ADD NEW SECTION FORM */}
      {isAddingNew && (
        <div className="p-3 bg-stone-50 rounded-2xl border-2 border-dashed border-[#946e1c]/50 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#946e1c] uppercase tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Portfolio Section</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewSectionName('');
                setErrorMsg(null);
              }}
              className="text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={newSectionName}
              onChange={(e) => {
                setNewSectionName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewSection();
                } else if (e.key === 'Escape') {
                  setIsAddingNew(false);
                }
              }}
              placeholder="e.g. LUXURY TIMEPIECES, FINE ART, PERFUMERY..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]"
            />

            <button
              type="button"
              onClick={() => handleAddNewSection()}
              className="px-3 py-1.5 rounded-xl bg-[#946e1c] hover:bg-[#a87d20] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-xs shrink-0 flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-white" />
              <span>Add</span>
            </button>
          </div>

          {errorMsg && <p className="text-[10px] text-rose-600 font-medium">{errorMsg}</p>}

          <p className="text-[10px] text-stone-500">
            This section will be immediately available in the catalog and storefront filters.
          </p>
        </div>
      )}
    </div>
  );
};
