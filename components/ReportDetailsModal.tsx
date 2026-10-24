'use client';

import React, { useState } from 'react';
import { CivicReport, ReportStatus, ResolutionProof } from '@/types';
import ResolveProofModal from './ResolveProofModal';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  ThumbsUp,
  Share2,
  Volume2,
  Cpu,
  ShieldCheck,
  Users,
  CheckCircle2,
  Camera,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';

interface ReportDetailsModalProps {
  report: CivicReport | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: ReportStatus) => void;
  onUpvote: (id: string) => void;
  onConfirmResolveWithProof: (id: string, proof: ResolutionProof) => void;
}

export default function ReportDetailsModal({
  report,
  onClose,
  onStatusChange,
  onUpvote,
  onConfirmResolveWithProof,
}: ReportDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  if (!report) return null;

  // Web Speech Synthesis Audio Readback
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `Rabat Community Issue: ${report.title}. Category: ${report.category}. Severity: ${report.severity}, urgency score ${report.urgency_score} out of 10. Located at ${report.location.address}. Status: ${report.status}.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = () => {
    const text = `📢 Rabat Community Issue #${report.id}
📍 ${report.location.address}
⚠️ ${report.title} [${report.severity.toUpperCase()} Priority]
🤝 Plan: ${report.community_action.action_plan}
🤖 Analyzed by Gemma 4 (Open-Source Civic AI)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const severityColor =
    report.severity === 'Critical'
      ? 'bg-red-500 text-white'
      : report.severity === 'High'
      ? 'bg-amber-500 text-white'
      : report.severity === 'Medium'
      ? 'bg-yellow-400 text-slate-900'
      : 'bg-blue-500 text-white';

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
          {/* Header with image */}
          <div className="relative h-56 w-full bg-slate-900 shrink-0">
            <img
              src={report.image_url}
              alt={report.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${severityColor}`}>
                  {report.status === 'Resolved' ? '✓ SOLVED WITH PHOTO PROOF' : `${report.severity.toUpperCase()} PRIORITY • Score ${report.urgency_score}/10`}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="text-white/80 text-xs font-mono font-medium flex items-center gap-2">
                  <span>#{report.id}</span>
                  <span>•</span>
                  <span>{report.category}</span>
                  <span>•</span>
                  <span className="text-sky-300 font-semibold">{report.location.neighborhood}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-0.5 leading-snug">
                  {report.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-5 flex-1">
            {/* Community Actions Row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => onUpvote(report.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold text-xs transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{report.upvotes} Confirmed by Citizens</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Audible Report Readout"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Reading...' : 'Audio'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Before & After Photo Comparison if Resolved with Proof */}
            {report.resolution_proof && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Resolution with Photo Proof</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    📸 Photo Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Before (Reported)
                    </span>
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img
                        src={report.image_url}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      After (Photo Proof)
                    </span>
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border-2 border-emerald-500">
                      <img
                        src={report.resolution_proof.image_url}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {report.resolution_proof.note && (
                  <p className="text-xs text-emerald-950 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60 italic">
                    "{report.resolution_proof.note}"
                  </p>
                )}
              </div>
            )}

            {/* Location info */}
            <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800">{report.location.address}</span>
              </div>
              <div className="flex items-center justify-between pl-6 text-[11px] text-slate-400">
                <span>GPS: {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)} ({report.location.source.toUpperCase()})</span>
                <span>{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Voice Recording / Memo if available */}
            {(report.voice_transcript || report.voice_audio_url) && (
              <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between text-amber-800 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>Citizen Voice Memo & Audio Clip</span>
                  </div>
                  {report.voice_audio_url && (
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      🎙️ Audio Recorded
                    </span>
                  )}
                </div>

                {report.voice_audio_url && (
                  <audio
                    src={report.voice_audio_url}
                    controls
                    className="w-full h-8 mt-1"
                  />
                )}

                {report.voice_transcript && (
                  <p className="text-amber-950 italic pt-1 border-t border-amber-200/60">
                    "{report.voice_transcript}"
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Analysis (Gemma 4)</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {report.description}
              </p>
            </div>

            {/* Community Action Plan Box */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-700" />
                  <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                    Community Action Plan
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  🤝 {report.community_verifications} Verified
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-sky-100 leading-relaxed font-medium">
                {report.community_action.action_plan}
              </p>

              <div className="bg-white p-2.5 rounded-xl border border-sky-100 text-xs">
                <span className="text-slate-400 text-[10px] block uppercase font-medium mb-1">
                  Suggested Community Tools & Materials:
                </span>
                <div className="flex flex-wrap gap-1">
                  {report.community_action.required_tools.map((mat, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-100/70 border border-amber-200/80 p-2.5 rounded-xl text-xs text-amber-900">
                <strong className="block text-[11px] uppercase tracking-wider mb-0.5">⚠️ Community Safety Note:</strong>
                {report.community_action.safety_warning}
              </div>
            </div>

            {/* Model & Agent Skill Badges */}
            <div className="bg-slate-100/70 rounded-2xl p-3 text-xs space-y-2 border border-slate-200/60">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-600" />
                  <span>{report.model_used}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Privacy Vetted
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Agent Skills Executed:</span>
                {report.skills_executed.map((sk, i) => (
                  <span key={i} className="bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-mono">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Mark as Fixed with Photo Proof Button */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Community Resolution Proof
              </label>

              {report.status !== 'Resolved' ? (
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Mark as Fixed (Provide Photo Proof)</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Fixed with Community Photo Proof!
                  </span>
                  <button
                    type="button"
                    onClick={() => onStatusChange(report.id, 'Open')}
                    className="text-[11px] underline text-slate-500 hover:text-slate-800"
                  >
                    Reopen Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Proof Modal */}
      <ResolveProofModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        reportTitle={report.title}
        reportId={report.id}
        onConfirmResolve={(proof) => {
          onConfirmResolveWithProof(report.id, proof);
        }}
      />
    </>
  );
}
