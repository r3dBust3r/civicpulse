'use client';

import React, { useState, useRef } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, Sparkles, UploadCloud } from 'lucide-react';
import { ResolutionProof } from '@/types';

interface ResolveProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  reportId: string;
  onConfirmResolve: (proof: ResolutionProof) => void;
}

export default function ResolveProofModal({
  isOpen,
  onClose,
  reportTitle,
  reportId,
  onConfirmResolve,
}: ResolveProofModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [proofImageBase64, setProofImageBase64] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;

      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            setProofImageBase64(optimizedBase64);
          }
          setIsProcessing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImageBase64) {
      setErrorMessage('Please provide a photo showing the problem has been resolved.');
      return;
    }

    onConfirmResolve({
      image_url: proofImageBase64,
      verified_at: new Date().toISOString(),
      note: note.trim() || 'Verified fixed with community photo proof.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mark as Fixed (Photo Proof)</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                #{reportId}: {reportTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">
            In our community-driven model, issues are confirmed resolved when a citizen provides <strong>photo proof</strong> showing the fixed street space.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {proofImageBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 shadow-md">
              <img
                src={proofImageBase64}
                alt="Resolution proof"
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo Proof Attached
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-white/95 text-slate-800 text-xs font-semibold rounded-lg shadow"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                {isProcessing ? (
                  <Sparkles className="w-6 h-6 animate-spin text-emerald-600" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {isProcessing ? 'Processing photo...' : 'Snap or Upload Photo Proof'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Take a photo of the repaired street or cleared space
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Community Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., 'Asphalt hole filled and smoothed this morning', 'Cleaned up by neighborhood volunteers'"
              className="w-full px-3 py-2 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!proofImageBase64 || isProcessing}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                !proofImageBase64 || isProcessing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Photo Proof & Mark as Fixed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
