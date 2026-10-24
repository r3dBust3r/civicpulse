'use client';

import React, { useState, useRef } from 'react';
import exifr from 'exifr';
import { Camera, UploadCloud, CheckCircle2, Image as ImageIcon, Sparkles, MapPin } from 'lucide-react';

interface ImageCaptureProps {
  imagePreview: string | null;
  onImageSelected: (base64: string, exifCoords: { lat: number; lng: number } | null) => void;
  disabled?: boolean;
}

export default function ImageCapture({
  imagePreview,
  onImageSelected,
  disabled = false,
}: ImageCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exifFound, setExifFound] = useState<{ lat: number; lng: number } | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setExifFound(null);

    try {
      // 1. Extract EXIF GPS Metadata
      let coords: { lat: number; lng: number } | null = null;
      try {
        const exifData = await exifr.gps(file);
        if (exifData && exifData.latitude && exifData.longitude) {
          coords = {
            lat: Number(exifData.latitude.toFixed(6)),
            lng: Number(exifData.longitude.toFixed(6)),
          };
          setExifFound(coords);
        }
      } catch (err) {
        console.warn('No EXIF GPS metadata found in file:', err);
      }

      // 2. Read image as Data URL and resize for optimal LLM processing
      const reader = new FileReader();
      reader.onload = (e) => {
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
            onImageSelected(optimizedBase64, coords);
          }
          setIsProcessing(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing image:', err);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {imagePreview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-400 bg-slate-900 shadow-md group">
          <img
            src={imagePreview}
            alt="Report evidence"
            className="w-full h-56 object-cover object-center"
          />

          {/* Overlay Status */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
              </span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg shadow backdrop-blur transition-all"
              >
                Change Photo
              </button>
            </div>

            {exifFound && (
              <div className="bg-sky-950/80 border border-sky-500/40 rounded-xl p-2 text-xs text-sky-200 backdrop-blur flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  <strong>EXIF GPS Extracted:</strong> {exifFound.lat}, {exifFound.lng}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isProcessing
              ? 'border-sky-400 bg-sky-50'
              : 'border-slate-300 hover:border-sky-500 hover:bg-sky-50/50 bg-white'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
            {isProcessing ? (
              <Sparkles className="w-7 h-7 animate-spin text-sky-600" />
            ) : (
              <Camera className="w-7 h-7" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800">
              {isProcessing ? 'Reading image & EXIF metadata...' : 'Take Photo or Upload Image'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant camera snap or drag & drop photo here
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>• EXIF Auto-GPS</span>
            <span>• Auto-Compression</span>
            <span>• Gemma 4 Vision</span>
          </div>
        </div>
      )}
    </div>
  );
}
