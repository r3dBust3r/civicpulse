'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, Square, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  audioUrl?: string | null;
  onAudioChange?: (base64Audio: string | null) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({
  transcript,
  onTranscriptChange,
  audioUrl,
  onAudioChange,
  disabled = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [language, setLanguage] = useState<'ar-SA' | 'fr-FR' | 'en-US'>('ar-SA');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(audioUrl || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onAudioChangeRef = useRef(onAudioChange);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  useEffect(() => {
    onAudioChangeRef.current = onAudioChange;
  }, [onAudioChange]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startRecording = async () => {
    setStatusMessage(null);
    audioChunksRef.current = [];

    // 1. Request microphone access for actual audio capture
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }
    } catch (err: any) {
      console.warn('Microphone stream access error:', err);
      setStatusMessage('Microphone access blocked. Please allow mic permissions in your browser.');
    }

    if (stream) {
      try {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

        const mediaRecorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });

          // Convert audio blob to base64 data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            setRecordedAudio(base64Audio);
            if (onAudioChangeRef.current) {
              onAudioChangeRef.current(base64Audio);
            }
          };
          reader.readAsDataURL(audioBlob);

          // Stop mic tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(200); // 200ms slice
      } catch (recErr) {
        console.warn('MediaRecorder error:', recErr);
      }
    }

    // 2. Start Speech Recognition for Live Transcription
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
          let accumulated = '';
          for (let i = 0; i < event.results.length; i++) {
            accumulated += event.results[i][0].transcript + ' ';
          }
          if (accumulated.trim()) {
            onTranscriptChangeRef.current(accumulated.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (srErr) {
        console.warn('SpeechRecognition start failed:', srErr);
      }
    }

    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
      }
    }

    // Stop SpeechRecognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping SpeechRecognition:', err);
      }
      recognitionRef.current = null;
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleClearAudio = () => {
    setRecordedAudio(null);
    if (onAudioChangeRef.current) {
      onAudioChangeRef.current(null);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all space-y-3">
      {/* Header & Language Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-sky-100 text-sky-700'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Voice Note & Audio Capture</h4>
            <p className="text-xs text-slate-500">Record voice note in Darija, French, or English</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setLanguage('ar-SA')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'ar-SA' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Moroccan Arabic (Darija / Arabic)"
          >
            🇲🇦 Darija
          </button>
          <button
            type="button"
            onClick={() => setLanguage('fr-FR')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'fr-FR' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="French"
          >
            🇫🇷 FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en-US')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'en-US' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English"
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Record Trigger & Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-md font-medium transition-all shrink-0 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200 shadow-red-500/30'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <>
              <span className="absolute w-full h-full rounded-2xl bg-red-400 opacity-75 pulse-record"></span>
              <Square className="w-5 h-5 relative z-10 fill-current" />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1">
          {isRecording ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-red-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span>Recording audio clip...</span>
              </div>
              <span className="font-mono text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">
                ⏱️ {formatTime(recordingSeconds)}
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {recordedAudio ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Audio Note Captured! Listen below or edit note.
                </span>
              ) : (
                'Tap microphone to record voice note & extract audio'
              )}
            </div>
          )}

          {/* Transcript input field */}
          <input
            type="text"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={
              language === 'ar-SA'
                ? 'Matalan: "Kayna wahed l-hofra kbira hna f Agdal..."'
                : 'Par exemple: "Gros trou sur le trottoir piéton..."'
            }
            className="w-full mt-1.5 px-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Audio Playback Player when recorded */}
      {recordedAudio && (
        <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <audio
              src={recordedAudio}
              controls
              className="h-8 w-full max-w-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleClearAudio}
            className="text-xs text-slate-400 hover:text-red-600 p-1 flex items-center gap-1 transition-all"
            title="Delete & Re-record audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-record</span>
          </button>
        </div>
      )}
    </div>
  );
}
