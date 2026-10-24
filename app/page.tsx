'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CivicReport, ReportStatus, ResolutionProof } from '@/types';
import { INITIAL_REPORTS } from '@/lib/mockData';
import NewReportModal from '@/components/NewReportModal';
import ReportDetailsModal from '@/components/ReportDetailsModal';
import { Camera, MapPin, Sparkles, Filter } from 'lucide-react';

// Dynamic import for Leaflet map to prevent SSR issues
const CivicMap = dynamic(() => import('@/components/CivicMap'), { ssr: false });

export default function Home() {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Load reports from localStorage or initial Rabat mock data
  useEffect(() => {
    const saved = localStorage.getItem('civicpulse_rabat_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch {
        setReports(INITIAL_REPORTS);
      }
    } else {
      setReports(INITIAL_REPORTS);
    }
  }, []);

  const saveReports = (newReports: CivicReport[]) => {
    setReports(newReports);
    localStorage.setItem('civicpulse_rabat_reports', JSON.stringify(newReports));
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-sm">
            <MapPin className="w-4 h-4" />
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
    </div>
  );
}
