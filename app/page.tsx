'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CivicReport, ReportStatus, ResolutionProof } from '@/types';
import { INITIAL_REPORTS } from '@/lib/mockData';
import NewReportModal from '@/components/NewReportModal';
import ReportDetailsModal from '@/components/ReportDetailsModal';
import { Camera, MapPin, Sparkles, Filter, Key, X } from 'lucide-react';

// Dynamic import for Leaflet map to prevent SSR issues
const CivicMap = dynamic(() => import('@/components/CivicMap'), { ssr: false });

export default function Home() {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem('civicpulse_gemini_key');
    if (k) {
      setHasCustomKey(true);
      setGeminiKeyInput(k);
    }
  }, []);

  const handleSaveKey = () => {
    if (geminiKeyInput.trim()) {
      localStorage.setItem('civicpulse_gemini_key', geminiKeyInput.trim());
      setHasCustomKey(true);
    } else {
      localStorage.removeItem('civicpulse_gemini_key');
      setHasCustomKey(false);
    }
    setIsKeyModalOpen(false);
  };

  // Load reports from localStorage or initial Rabat mock data (ensures all 42 demo data load immediately)
  useEffect(() => {
    const saved = localStorage.getItem('civicpulse_rabat_reports_v42');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_REPORTS.length) {
          setReports(parsed);
          return;
        }
      } catch {}
    }
    setReports(INITIAL_REPORTS);
    localStorage.setItem('civicpulse_rabat_reports_v42', JSON.stringify(INITIAL_REPORTS));
  }, []);

  const saveReports = (newReports: CivicReport[]) => {
    setReports(newReports);
    localStorage.setItem('civicpulse_rabat_reports_v42', JSON.stringify(newReports));
  };

  const handleAddNewReport = (newReport: CivicReport) => {
    const updated = [newReport, ...reports];
    saveReports(updated);
    setSelectedReport(newReport);
  };

  const handleStatusChange = (id: string, newStatus: ReportStatus) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    saveReports(updated);
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  const handleConfirmResolveWithProof = (id: string, proof: ResolutionProof) => {
    const updated = reports.map((r) =>
      r.id === id
        ? {
            ...r,
            status: 'Resolved' as ReportStatus,
            resolution_proof: proof,
            community_verifications: r.community_verifications + 1,
          }
        : r
    );
    saveReports(updated);
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({
        ...selectedReport,
        status: 'Resolved',
        resolution_proof: proof,
        community_verifications: selectedReport.community_verifications + 1,
      });
    }
  };

  const handleUpvote = (id: string) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    saveReports(updated);
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, upvotes: selectedReport.upvotes + 1 });
    }
  };

  const filteredReports = reports.filter((r) => {
    if (categoryFilter === 'All') return true;
    return r.category === categoryFilter;
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100">
      {/* 1. Full-Screen Interactive Map with Problem Pinpoints */}
      <div className="w-full h-full">
        <CivicMap
          reports={filteredReports}
          selectedReport={selectedReport}
          onSelectReport={(rep) => setSelectedReport(rep)}
        />
      </div>

      {/* 2. Sleek Minimalist Floating Top Header */}
      <div className="absolute top-4 left-4 z-[450] flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-sm overflow-hidden p-1">
            <img src="/icon.ico" alt="CivicPulse Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 tracking-tight">CivicPulse Rabat</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded-full">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {filteredReports.length} Problems on Map
            </span>
          </div>
        </div>

        {/* Minimal Category Filter Pill */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Pothole">🕳️ Potholes</option>
          <option value="Sanitation">🗑️ Waste & Trash</option>
          <option value="Lighting">💡 Streetlights</option>
          <option value="Water & Drainage">💧 Water & Sewage</option>
          <option value="Road Hazard">⚠️ Road Hazards</option>
        </select>

        {/* AI Key Configuration Pill */}
        <button
          type="button"
          onClick={() => setIsKeyModalOpen(true)}
          className={`px-3 py-2.5 rounded-2xl shadow-lg border backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
            hasCustomKey
              ? 'bg-emerald-50/95 text-emerald-800 border-emerald-300'
              : 'bg-white/95 text-slate-700 border-slate-200/80 hover:bg-sky-50'
          }`}
          title="Configure Free Gemini Vision Key"
        >
          <Key className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">
            {hasCustomKey ? 'Vision AI: Active' : 'Connect Vision Key'}
          </span>
          <span className="sm:hidden">
            {hasCustomKey ? 'AI: On' : 'Key'}
          </span>
        </button>
      </div>

      {/* 3. Floating Camera Button at the Bottom of the Map */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[450] flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all ring-4 ring-white shadow-sky-600/40 group"
          title="Report a Problem"
        >
          <Camera className="w-7 h-7 group-hover:rotate-6 transition-transform" />
        </button>
        <span className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold shadow pointer-events-none">
          Report Problem
        </span>
      </div>

      {/* 4. New Report Submission Modal (Photo -> AI Auto-Fill -> 3-way Location -> Submit) */}
      {isReportModalOpen && (
        <NewReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmitSuccess={handleAddNewReport}
          existingReports={reports}
          defaultCoords={{ lat: 34.015, lng: -6.835 }}
        />
      )}

      {/* 5. Issue Details Modal (Opens when user clicks any pinpoint) */}
      <ReportDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={handleStatusChange}
        onUpvote={handleUpvote}
        onConfirmResolveWithProof={handleConfirmResolveWithProof}
      />

      {/* 6. Gemini Vision Key Configuration Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Live Photo Vision AI Key
                  </h3>
                  <p className="text-[11px] text-slate-500">Google Gemma 4 / Gemini Multimodal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect a free Google AI Studio key to inspect the <strong>actual pixels of your photo</strong> and generate precise descriptions of the visual problem.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Gemini API Key (Free)
              </label>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Get a free key instantly at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">aistudio.google.com</a> (no credit card needed).
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveKey}
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
              >
                Save & Activate Live Vision
              </button>
              {hasCustomKey && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('civicpulse_gemini_key');
                    setGeminiKeyInput('');
                    setHasCustomKey(false);
                    setIsKeyModalOpen(false);
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs rounded-xl transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
