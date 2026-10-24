'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CivicReport, ReportStatus, ResolutionProof } from '@/types';
import { INITIAL_REPORTS } from '@/lib/mockData';
import NewReportModal from '@/components/NewReportModal';
import ReportDetailsModal from '@/components/ReportDetailsModal';
import {
  MapPin,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Cpu,
  List,
  Map as MapIcon,
  ChevronRight,
  CheckCircle2,
  Users,
  X,
} from 'lucide-react';

// Dynamic import for Leaflet map to prevent SSR issues
const CivicMap = dynamic(() => import('@/components/CivicMap'), { ssr: false });

export default function Home() {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'feed' | 'resolved'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All');
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notification, setNotification] = useState<CivicReport | null>(null);

  // Initialize reports from localStorage or mock data
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
    setActiveTab('map');
    setSelectedReport(newReport);
    setNotification(newReport);

    setTimeout(() => {
      setNotification((curr) => (curr?.id === newReport.id ? null : curr));
    }, 9000);
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

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchNeigh = selectedNeighborhood === 'All' || r.location.neighborhood === selectedNeighborhood;
    return matchCat && matchNeigh;
  });

  const criticalCount = reports.filter((r) => r.severity === 'Critical' && r.status !== 'Resolved').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/70 pb-20 sm:pb-0">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-[500] bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">CivicPulse Rabat</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  <Sparkles className="w-3 h-3 text-sky-600" /> Gemma 4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                100% Community-Driven Open-Source Platform for Rabat City
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Users className="w-3.5 h-3.5" /> Community-Powered
            </span>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Report in Rabat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Newly Pinpointed Report Toast Banner */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[600] max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-sky-500/50 backdrop-blur flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shrink-0 pin-glow">
                📍
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-sky-400 font-mono font-bold uppercase block">
                  New Incident Pinned #{notification.id}
                </span>
                <h4 className="text-xs font-bold truncate text-white">{notification.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedReport(notification);
                  setNotification(null);
                }}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow transition-all"
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1 flex flex-col gap-4">
        {/* City Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Critical Hazards</span>
              <span className="text-lg font-black text-slate-800">{criticalCount}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Community Active</span>
              <span className="text-lg font-black text-slate-800">{inProgressCount + reports.filter(r => r.status === 'Open').length}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Solved by Citizens</span>
              <span className="text-lg font-black text-slate-800">{resolvedCount}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">AI Engine</span>
              <span className="text-xs font-bold text-sky-700">Gemma 4 MoE</span>
            </div>
          </div>
        </div>

        {/* View Tabs & Rabat Neighborhood Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'map' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Rabat Map</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'feed' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Community Feed ({filteredReports.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'resolved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved by Community ({resolvedCount})</span>
            </button>
          </div>

          {/* Rabat Neighborhood Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Agdal', 'Hassan', 'Médina', 'Technopolis (UM6P)'].map((neigh) => (
              <button
                key={neigh}
                type="button"
                onClick={() => setSelectedNeighborhood(neigh)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedNeighborhood === neigh
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📍 {neigh === 'All' ? 'All Rabat' : neigh}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Map View */}
        {activeTab === 'map' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[520px]">
            {/* Map Area */}
            <div className="lg:col-span-2 min-h-[440px] h-[58vh] lg:h-auto">
              <CivicMap
                reports={filteredReports}
                selectedReport={selectedReport}
                onSelectReport={(r) => setSelectedReport(r)}
              />
            </div>

            {/* Quick List Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col overflow-hidden max-h-[58vh]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Rabat Community Pins</h3>
                <span className="text-xs text-slate-400 font-medium">Click pin to inspect</span>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto flex-1 pr-1">
                {filteredReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReport(r)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedReport?.id === r.id ? 'bg-sky-50 ring-1 ring-sky-300' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={r.image_url}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              r.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.severity === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : r.severity === 'High'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {r.status === 'Resolved' ? '✓ Solved' : r.severity}
                          </span>
                          <span className="text-slate-400 font-mono">#{r.id}</span>
                          <span className="text-sky-600 font-medium truncate">• {r.location.neighborhood}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {r.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{r.location.address}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Community Feed View */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <img
                    src={r.image_url}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        r.status === 'Resolved'
                          ? 'bg-emerald-600'
                          : r.severity === 'Critical'
                          ? 'bg-red-500'
                          : r.severity === 'High'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {r.status === 'Resolved' ? '✓ Solved' : `${r.severity} • ${r.category}`}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono font-semibold">#{r.id} • {r.location.neighborhood}</span>
                      <span
                        className={`font-semibold ${
                          r.status === 'Resolved'
                            ? 'text-emerald-600'
                            : r.status === 'In Progress'
                            ? 'text-amber-600'
                            : 'text-sky-600'
                        }`}
                      >
                        {r.status === 'Resolved' ? '✓ Solved' : r.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{r.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{r.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[180px]">{r.location.address}</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      🤝 {r.community_verifications} Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Solved by Community View */}
        {activeTab === 'resolved' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  🎉 Issues Solved & Verified by Rabat Citizens
                </h3>
                <p className="text-xs text-slate-500">
                  Collaborative open-source civic impact: anyone can help identify and confirm resolved problems
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports
                .filter((r) => r.status === 'Resolved')
                .map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReport(r)}
                    className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex gap-2 shrink-0">
                      <div className="relative">
                        <img
                          src={r.image_url}
                          alt="Before"
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                          Before
                        </span>
                      </div>
                      {r.resolution_proof && (
                        <div className="relative">
                          <img
                            src={r.resolution_proof.image_url}
                            alt="After"
                            className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500"
                          />
                          <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                            Proof ✓
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 mb-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>FIXED WITH PHOTO PROOF • #{r.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{r.title}</h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{r.location.address}</p>
                      {r.resolution_proof?.note && (
                        <p className="text-[11px] text-emerald-900 italic mt-1 line-clamp-1">
                          "{r.resolution_proof.note}"
                        </p>
                      )}
                      <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                        🤝 Verified by {r.community_verifications} citizens in {r.location.neighborhood}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* New Report Modal */}
      <NewReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={handleAddNewReport}
        existingReports={reports}
        defaultCoords={pinLocation || { lat: 34.015, lng: -6.835 }}
      />

      {/* Report Details Drawer */}
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
