import React, { useState } from 'react';
import { Upload, Check, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({ isOpen, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    return localStorage.getItem('svs_custom_logo_url');
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      localStorage.setItem('svs_custom_logo_url', result);
      window.dispatchEvent(new Event('logoUpdated'));
      setSuccessMsg('Original Shantel Variety Shop logo loaded successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    localStorage.removeItem('svs_custom_logo_url');
    setPreviewUrl(null);
    window.dispatchEvent(new Event('logoUpdated'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 bg-[#121216] border border-[#d4af37]/30 rounded-xl text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg tracking-wider text-white">Brand Logo Asset</h3>
            <p className="text-xs text-zinc-400">Shantel Variety Shop • Exact Logo Integration</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
          Per brand guidelines, the exact uploaded Shantel Variety Shop logo is rendered throughout the website without alteration or recreation. You can attach or sync the image file here:
        </p>

        {previewUrl && (
          <div className="mb-4 p-4 rounded-lg bg-black/60 border border-zinc-800 flex flex-col items-center">
            <span className="text-[11px] tracking-widest text-[#d4af37] uppercase mb-2">Active Brand Asset</span>
            <img src={previewUrl} alt="Active Shantel Variety Shop Logo" className="max-h-20 object-contain" />
            <button
              onClick={handleReset}
              className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
            >
              Reset to Default / File Path
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            {successMsg}
          </div>
        )}

        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 hover:border-[#d4af37]/60 rounded-xl cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80 transition-all">
          <Upload className="w-8 h-8 text-[#d4af37] mb-2" />
          <span className="text-sm font-medium text-white mb-1">Select or Drop Original Logo Image</span>
          <span className="text-xs text-zinc-500">Supports PNG, SVG, JPG, WebP (Transparent PNG recommended)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        <div className="mt-4 p-3 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <span>
            <strong>Developer Note:</strong> You can also place the original logo file at <code className="text-zinc-200">/public/shantel-logo.png</code> or <code className="text-zinc-200">/public/logo.png</code> in the workspace.
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#c49f2e] text-black font-medium text-xs tracking-wider uppercase rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
