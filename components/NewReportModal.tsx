'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ImageCapture from './ImageCapture';
import VoiceRecorder from './VoiceRecorder';
import { CivicReport, LocationSource } from '@/types';
import { reverseGeocode, findNearbyDuplicates } from '@/lib/geoUtils';
import {
  X,
  MapPin,
  Sparkles,
  AlertCircle,
  Navigation,
  CheckCircle2,
  ThumbsUp,
  Loader2,
} from 'lucide-react';

// Dynamic import for mini map picker
const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newReport: CivicReport) => void;
  existingReports: CivicReport[];
  defaultCoords?: { lat: number; lng: number };
}

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
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(defaultCoords);
  const [address, setAddress] = useState('Avenue Mohammed V, Rabat');
  const [locationSource, setLocationSource] = useState<LocationSource>('gps');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Check for nearby duplicates
  const nearbyDuplicate = findNearbyDuplicates(coords.lat, coords.lng, existingReports, 60);

  // Handle Photo & EXIF
  const handleImageSelected = async (
    base64: string,
    exifCoords: { lat: number; lng: number } | null
  ) => {
    setImageBase64(base64);
    if (exifCoords) {
      setCoords(exifCoords);
      setLocationSource('exif');
      const addr = await reverseGeocode(exifCoords.lat, exifCoords.lng);
      setAddress(addr);
    }
  };

  // Device GPS
  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setCoords(newCoords);
        setLocationSource('gps');
        const addr = await reverseGeocode(newCoords.lat, newCoords.lng);
        setAddress(addr);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setErrorMessage('Unable to retrieve device GPS. You can pin manually on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Manual Map Pin Placement
  const handleManualPinChange = async (newLat: number, newLng: number) => {
    setCoords({ lat: newLat, lng: newLng });
    setLocationSource('manual');
    const addr = await reverseGeocode(newLat, newLng);
    setAddress(addr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMessage('Please capture or upload a photo of the problem first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          voice_transcript: voiceTranscript,
          location: {
            lat: coords.lat,
            lng: coords.lng,
            address,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Triage agent failed to process issue.');
      }

      const aiData = await response.json();
      const neighborhood = detectRabatNeighborhood(address, coords.lat, coords.lng);

      const newReport: CivicReport = {
        id: `RBT-${Math.floor(100 + Math.random() * 900)}`,
        title: aiData.title || 'Street Issue Reported',
        category: aiData.category || 'Road Hazard',
        severity: aiData.severity || 'High',
        urgency_score: aiData.urgency_score || 7,
        description: aiData.description || 'Reported community issue awaiting resolution.',
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address,
          neighborhood,
          source: locationSource,
        },
        image_url: imageBase64,
        voice_transcript: voiceTranscript || undefined,
        voice_audio_url: voiceAudioUrl || undefined,
        community_action: aiData.community_action || {
          action_plan: 'Community attention requested. Flag and verify on site.',
          required_tools: ['Work gloves', 'Safety marker'],
          safety_warning: 'Caution advised.',
          suggested_resolution: 'Volunteer neighborhood repair.',
        },
        status: 'Open',
        upvotes: 1,
        community_verifications: 1,
        created_at: new Date().toISOString(),
        model_used: aiData.model_used || 'Google Gemma 4 (26B MoE via Gemini API)',
        skills_executed: aiData.skills_executed || ['visual-hazard-inspection', 'community-action-synthesis'],
        privacy_vetted: aiData.privacy_vetted ?? true,
      };

      // Voice readout confirmation
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(
          `Thank you! ${newReport.title} has been pinned to the Rabat Community map.`
        );
        speech.rate = 1.0;
        window.speechSynthesis.speak(speech);
      }

      onSubmitSuccess(newReport);
      onClose();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Error communicating with AI Triage Engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Report a Street Issue</h3>
              <p className="text-xs text-slate-500">Gemma 4 Multimodal AI Analysis</p>
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

          {/* 1. Image Upload & EXIF */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Photo Evidence (Required)
            </label>
            <ImageCapture
              imagePreview={imageBase64}
              onImageSelected={handleImageSelected}
              disabled={isSubmitting}
            />
          </div>

          {/* 2. Voice Input (Moroccan ASR) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Spoken Voice Note (Optional)
            </label>
            <VoiceRecorder
              transcript={voiceTranscript}
              onTranscriptChange={setVoiceTranscript}
              audioUrl={voiceAudioUrl}
              onAudioChange={setVoiceAudioUrl}
              disabled={isSubmitting}
            />
          </div>

          {/* 3. Location Bar with Interactive Pinpoint Mini-Map */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>3. Pinpoint Location on Map</span>
              </label>

              <button
                type="button"
                onClick={handleUseDeviceLocation}
                disabled={isLocating || isSubmitting}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
              >
                {isLocating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>{isLocating ? 'Locating...' : 'Use GPS'}</span>
              </button>
            </div>

            {/* Interactive Mini-Map for Manual Pinpoint */}
            <LocationPickerMap
              lat={coords.lat}
              lng={coords.lng}
              onChange={handleManualPinChange}
            />

            <div className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="truncate">{address}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 ml-2">
                {locationSource}
              </span>
            </div>
          </div>

          {/* 4. Semantic Duplicate Detection Alert */}
          {nearbyDuplicate && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Possible Duplicate Detected ({nearbyDuplicate.distance}m away)</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Report <strong>#{nearbyDuplicate.report.id}</strong> ("{nearbyDuplicate.report.title}") is already open nearby. Submitting will merge your report to amplify urgency!
              </p>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemma 4 Multimodal Triage in Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Dispatch Issue (Gemma 4)</span>
                </>
              )}
            </button>

            <div className="mt-2 text-center text-[11px] text-slate-400">
              Auto-generates title, severity, work order & routes to local municipality.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
