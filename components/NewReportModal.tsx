'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CivicReport, LocationSource, IssueCategory, IssueSeverity } from '@/types';
import { reverseGeocode, findNearbyDuplicates } from '@/lib/geoUtils';
import exifr from 'exifr';
import {
  X,
  MapPin,
  Sparkles,
  AlertCircle,
  Navigation,
  CheckCircle2,
  Camera,
  Loader2,
  Image as ImageIcon,
  Sliders,
  Edit3,
  RefreshCw,
} from 'lucide-react';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newReport: CivicReport) => void;
  existingReports: CivicReport[];
  defaultCoords?: { lat: number; lng: number };
}

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Sanitation',
  'Lighting',
  'Water & Drainage',
  'Road Hazard',
  'Vandalism',
];

const detectRabatNeighborhood = (addr: string, lat: number, lng: number) => {
  const low = (addr || '').toLowerCase();
  if (low.includes('agdal')) return 'Agdal';
  if (low.includes('hassan')) return 'Hassan';
  if (low.includes('médina') || low.includes('medina') || low.includes('souk')) return 'Médina';
  if (low.includes('riad') || low.includes('ryad')) return 'Hay Riad';
  if (low.includes('technopolis') || low.includes('um6p') || low.includes('sala')) return 'Technopolis (UM6P)';
  if (lat < 34.00) return 'Technopolis (UM6P)';
  return 'Rabat Center';
};

export default function NewReportModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  existingReports,
  defaultCoords = { lat: 34.015, lng: -6.835 },
}: NewReportModalProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form fields (pre-filled by AI, editable by user)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('High');
  const [urgencyScore, setUrgencyScore] = useState(7);
  const [communityAction, setCommunityAction] = useState<any>(null);

  // Location state & 3 location options
  const [locationMode, setLocationMode] = useState<'gps' | 'manual' | 'exif'>('gps');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(defaultCoords);
  const [address, setAddress] = useState('Avenue Mohammed V, Rabat');
  const [locationSource, setLocationSource] = useState<LocationSource>('gps');
  const [exifCoords, setExifCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'acquiring' | 'locked' | 'failed'>('idle');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setImageBase64(null);
    setTitle('');
    setCategory('Pothole');
    setDescription('');
    setSeverity('High');
    setUrgencyScore(7);
    setCommunityAction(null);
    setLocationMode('gps');
    setCoords(defaultCoords);
    setAddress('Avenue Mohammed V, Rabat');
    setLocationSource('gps');
    setExifCoords(null);
    setGpsStatus('idle');
    setGpsAccuracy(null);
    setErrorMessage(null);
  };

  // Proximity duplicate check
  const nearbyDuplicate = findNearbyDuplicates(coords.lat, coords.lng, existingReports, 60);

  // 1. Photo selection & immediate AI analysis
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;

      setErrorMessage(null);

      // Extract EXIF GPS metadata if present
      let extractedCoords: { lat: number; lng: number } | null = null;
      try {
        const exifData = await exifr.gps(file);
        if (exifData && exifData.latitude && exifData.longitude) {
          extractedCoords = {
            lat: Number(exifData.latitude.toFixed(6)),
            lng: Number(exifData.longitude.toFixed(6)),
          };
          setExifCoords(extractedCoords);
          // If EXIF exists, automatically apply it as location
          setCoords(extractedCoords);
          setLocationMode('exif');
          setLocationSource('exif');
          reverseGeocode(extractedCoords.lat, extractedCoords.lng).then((addr) => setAddress(addr));
        } else {
          setExifCoords(null);
        }
      } catch (err) {
        setExifCoords(null);
      }

      // Read image as base64 and resize
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
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
            setImageBase64(optimizedBase64);

            // Trigger AI processing immediately to fill form
            runAiTriage(optimizedBase64, extractedCoords || coords);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Triage API Call to pre-fill the form
  const runAiTriage = async (base64: string, targetCoords: { lat: number; lng: number }) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          location: {
            lat: targetCoords.lat,
            lng: targetCoords.lng,
            address,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title) setTitle(data.title);
        if (data.category && CATEGORIES.includes(data.category)) {
          setCategory(data.category);
        }
        if (data.description) setDescription(data.description);
        if (data.severity) setSeverity(data.severity);
        if (data.urgency_score) setUrgencyScore(data.urgency_score);
        if (data.community_action) setCommunityAction(data.community_action);
      }
    } catch (err) {
      console.warn('AI Triage error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Option 1: Device GPS with Dual-Tier Fallback (High-accuracy -> Standard accuracy)
  const acquireDeviceGps = () => {
    setLocationMode('gps');
    setErrorMessage(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('failed');
      setErrorMessage('Device geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('acquiring');
    setIsLocating(true);

    const onGpsSuccess = async (pos: GeolocationPosition) => {
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      const acc = Math.round(pos.coords.accuracy);

      setCoords({ lat, lng });
      setGpsAccuracy(acc);
      setGpsStatus('locked');
      setLocationSource('gps');
      setIsLocating(false);

      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    };

    // Stage 1: High accuracy for devices with hardware GPS
    navigator.geolocation.getCurrentPosition(
      onGpsSuccess,
      (err1) => {
        console.warn('High-accuracy GPS fix failed or timed out, retrying with standard network accuracy...', err1.message);
        // Stage 2: Standard accuracy (WiFi / network cell triangulation for laptops and indoors)
        navigator.geolocation.getCurrentPosition(
          onGpsSuccess,
          (err2) => {
            console.warn('Standard accuracy GPS failed:', err2.message);
            setIsLocating(false);
            setGpsStatus('failed');
            if (err2.code === 1) {
              setErrorMessage('Location permission was denied. Please allow location in your browser, or tap Option 2 (Map Point) or a Rabat preset.');
            } else {
              setErrorMessage('GPS sensor timed out (indoor/laptop). Tap Option 2 to pin manually or tap a quick Rabat preset below.');
            }
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 }
    );
  };

  // Automatically acquire device GPS on modal mount
  useEffect(() => {
    acquireDeviceGps();
  }, []);

  // Option 2: Manual Map Pin
  const handleSelectManual = () => {
    setLocationMode('manual');
    setLocationSource('manual');
  };

  const handleManualMapChange = async (newLat: number, newLng: number) => {
    setCoords({ lat: newLat, lng: newLng });
    setLocationSource('manual');
    const addr = await reverseGeocode(newLat, newLng);
    setAddress(addr);
  };

  // Option 3: EXIF from Photo
  const handleSelectExif = () => {
    setLocationMode('exif');
    if (exifCoords) {
      setCoords(exifCoords);
      setLocationSource('exif');
      reverseGeocode(exifCoords.lat, exifCoords.lng).then((addr) => setAddress(addr));
    }
  };

  // Submit Final Problem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMessage('Please take or upload a photo of the problem first.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide a title for the issue.');
      return;
    }

    setIsSubmitting(true);

    const neighborhood = detectRabatNeighborhood(address, coords.lat, coords.lng);

    const newReport: CivicReport = {
      id: `RBT-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category,
      severity,
      urgency_score: urgencyScore,
      description: description.trim() || 'Community issue reported in Rabat.',
      location: {
        lat: coords.lat,
        lng: coords.lng,
        address,
        neighborhood,
        source: locationSource,
      },
      image_url: imageBase64,
      community_action: communityAction || {
        action_plan: 'Community attention requested. Flag and verify on site.',
        required_tools: ['Work gloves', 'Safety marker'],
        safety_warning: 'Caution advised.',
        suggested_resolution: 'Volunteer neighborhood repair.',
      },
      status: 'Open',
      upvotes: 1,
      community_verifications: 1,
      created_at: new Date().toISOString(),
      model_used: 'Google Gemma 4 (26B MoE via Gemini API)',
      skills_executed: ['visual-hazard-inspection', 'community-action-synthesis'],
      privacy_vetted: true,
    };

    onSubmitSuccess(newReport);
    resetForm();
    onClose();
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Submit New Problem</h3>
              <p className="text-[11px] text-slate-500">Photo ➔ AI Auto-Fill ➔ Review & Submit</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Take or Upload Picture */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Take or Upload Picture
            </label>

            {imageBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500 bg-slate-900 shadow-md">
                <img
                  src={imageBase64}
                  alt="Incident evidence"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-600 text-white flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                  </span>

                  <label className="px-3 py-1 bg-white/95 text-slate-800 text-xs font-semibold rounded-lg shadow cursor-pointer">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Take Photo or Upload Image
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    AI will automatically analyze the photo & fill the details
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* AI Processing Status */}
          {isAnalyzing && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-800 flex items-center gap-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              <span>Gemma 4 is analyzing image & generating details...</span>
            </div>
          )}

          {/* 2. Auto-Filled Form (Editable by User) */}
          <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>2. Problem Details (AI Generated • Editable)</span>
              </span>
              {title && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole on Avenue Mohammed V"
                className="w-full px-3 py-2 bg-white text-xs text-slate-900 font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full px-3 py-2 bg-white text-xs text-slate-900 font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, dimensions, or hazard context..."
                className="w-full px-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* 3. Location: 3 Options */}
          <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Set Location (Choose 1 of 3 Options)
            </label>

            {/* 3 Options Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-[11px] font-bold">
              <button
                type="button"
                onClick={acquireDeviceGps}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${
                  locationMode === 'gps'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>1. Device GPS</span>
              </button>

              <button
                type="button"
                onClick={handleSelectManual}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${
                  locationMode === 'manual'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Map Point</span>
              </button>

              <button
                type="button"
                onClick={acquireDeviceGps}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${
                  locationMode === 'gps'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>1. Device GPS</span>
              </button>

              <button
                type="button"
                onClick={handleSelectManual}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${
                  locationMode === 'manual'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Map Point</span>
              </button>

              <button
                type="button"
                onClick={handleSelectExif}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${
                  locationMode === 'exif'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>3. From Photo</span>
              </button>
            </div>

            {/* Option Details / Status */}
            {locationMode === 'gps' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600 shrink-0" />
                    ) : gpsStatus === 'locked' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Navigation className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {isLocating
                          ? 'Acquiring Device GPS...'
                          : gpsStatus === 'locked'
                          ? `GPS Locked: ${coords.lat}, ${coords.lng}`
                          : 'Auto Device GPS'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isLocating
                          ? 'Reading hardware satellite / network fix...'
                          : gpsStatus === 'locked'
                          ? `Live sensor fix (±${gpsAccuracy || 10}m accuracy)`
                          : 'Click Refresh to lock device coordinates'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={acquireDeviceGps}
                    disabled={isLocating}
                    className="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold rounded-lg text-[11px] flex items-center gap-1 active:scale-95 transition-all shrink-0"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
                  </button>
                </div>

                {/* Instant 1-tap Rabat Presets for convenience */}
                <div className="bg-slate-100/80 p-2.5 rounded-xl text-[11px] space-y-1.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                    Quick Rabat Location Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { name: 'Agdal', lat: 34.0085, lng: -6.8495, addr: 'Avenue Fal Ould Oumeir, Agdal, Rabat' },
                      { name: 'Hassan', lat: 34.0215, lng: -6.8295, addr: 'Avenue Tour Hassan, Hassan, Rabat' },
                      { name: 'Médina', lat: 34.0285, lng: -6.8375, addr: 'Bab El Had, Médina, Rabat' },
                      { name: 'Hay Riad', lat: 33.9685, lng: -6.8725, addr: 'Avenue Annakhil, Hay Riad, Rabat' },
                      { name: 'Technopolis (UM6P)', lat: 33.9895, lng: -6.7295, addr: 'Technopolis, UM6P Campus' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setCoords({ lat: preset.lat, lng: preset.lng });
                          setAddress(preset.addr);
                          setGpsStatus('locked');
                          setGpsAccuracy(5);
                          setLocationSource('gps');
                          setErrorMessage(null);
                        }}
                        className="px-2 py-1 bg-white hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-xs transition-all active:scale-95"
                      >
                        📍 {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {locationMode === 'manual' && (
              <div className="space-y-2">
                <LocationPickerMap
                  lat={coords.lat}
                  lng={coords.lng}
                  onChange={handleManualMapChange}
                />
              </div>
            )}

            {locationMode === 'exif' && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                {exifCoords ? (
                  <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coordinates extracted from photo: {exifCoords.lat}, {exifCoords.lng}</span>
                  </div>
                ) : (
                  <div className="text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No GPS metadata in this photo. Please use Option 1 (GPS) or Option 2 (Map Point).</span>
                  </div>
                )}
              </div>
            )}

            {/* Address Summary */}
            <div className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="truncate">{address}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 ml-2">
                {locationSource}
              </span>
            </div>
          </div>

          {/* Duplicate Alert */}
          {nearbyDuplicate && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-1 text-xs text-amber-900">
              <span className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Notice: Similar issue #{nearbyDuplicate.report.id} already reported {nearbyDuplicate.distance}m away.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !imageBase64}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                isSubmitting || !imageBase64
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-sky-500/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Problem to Map ({coords.lat}, {coords.lng})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
