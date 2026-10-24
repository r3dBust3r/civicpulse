'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Upload,
  Sparkles,
  FileAudio,
} from 'lucide-react';

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
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const fileAudioInputRef = useRef<HTMLInputElement>(null);
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

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // SYNCHRONOUS RECORDING TRIGGER
  const startRecording = () => {
    setStatusMessage(null);
    audioChunksRef.current = [];

    // 1. MUST START SPEECH RECOGNITION SYNCHRONOUSLY IN CLICK HANDLER
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
          setStatusMessage('🎙️ Active: Speak into your microphone now...');
        };

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
          if (event.error === 'not-allowed') {
            setStatusMessage('⚠️ Microphone access was denied. Please allow microphone in your browser settings.');
            setHasMicPermission(false);
          } else if (event.error === 'no-speech') {
            setStatusMessage('No speech heard yet. Try speaking closer to the mic.');
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err: any) {
        console.warn('SpeechRecognition init error:', err);
      }
    }

    // 2. START MEDIA RECORDER IN PARALLEL
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          setHasMicPermission(true);

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

            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Audio = reader.result as string;
              setRecordedAudio(base64Audio);
              if (onAudioChangeRef.current) {
                onAudioChangeRef.current(base64Audio);
              }
            };
            reader.readAsDataURL(audioBlob);

            if (streamRef.current) {
              streamRef.current.getTracks().forEach((t) => t.stop());
              streamRef.current = null;
            }
          };

          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start(200);
        })
        .catch((err) => {
          console.warn('Microphone stream error:', err);
          setStatusMessage('Microphone permission blocked. Click the lock icon in the address bar to allow mic access.');
          setHasMicPermission(false);
        });
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

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping SpeechRecognition:', err);
      }
      recognitionRef.current = null;
    }

    setIsRecording(false);
    setStatusMessage('Voice capture complete! Audio attached.');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        setRecordedAudio(base64Audio);
        if (onAudioChangeRef.current) {
          onAudioChangeRef.current(base64Audio);
        }
        setStatusMessage(`Audio file attached: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPreset = (presetText: string) => {
    onTranscriptChange(presetText);
    setStatusMessage('Moroccan voice note loaded!');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all space-y-3">
      {/* Hidden Audio File Input */}
      <input
        ref={fileAudioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioFileUpload}
        className="hidden"
      />

      {/* Header & Language Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Voice Note & Speech-to-Text</h4>
            <p className="text-[11px] text-slate-500">Record live or attach audio note</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setLanguage('ar-SA')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'ar-SA'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Moroccan Arabic (Darija / Arabic)"
          >
            🇲🇦 Darija
          </button>
          <button
            type="button"
            onClick={() => setLanguage('fr-FR')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'fr-FR'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="French"
          >
            🇫🇷 FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en-US')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'en-US'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English"
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {/* Status or Permission Warning */}
      {statusMessage && (
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
            hasMicPermission === false
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
          }`}
        >
          {hasMicPermission === false ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 shrink-0 text-sky-600" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Record Controls & Input */}
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
          title={isRecording ? 'Click to Stop Recording' : 'Click to Record Voice'}
        >
          {isRecording ? (
            <>
              <span className="absolute w-full h-full rounded-2xl bg-red-400 opacity-75 pulse-record"></span>
              <MicOff className="w-5 h-5 relative z-10" />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>
              {isRecording ? (
                <strong className="text-red-600 animate-pulse">● Recording Voice...</strong>
              ) : (
                'Spoken Description / Transcript:'
              )}
            </span>
            {isRecording && (
              <span className="font-mono text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                ⏱️ {formatTime(recordingSeconds)}
              </span>
            )}
          </div>

          <input
            type="text"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder='Speak or type: "Kayna wahed l-hofra kbira hna f Agdal..."'
            className="w-full px-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Audio File Upload Button */}
        <button
          type="button"
          onClick={() => fileAudioInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm shrink-0 flex flex-col items-center gap-0.5"
          title="Upload existing audio/voice file (WhatsApp voice note, MP3, WAV, M4A)"
        >
          <FileAudio className="w-4 h-4 text-sky-600" />
          <span className="text-[9px] font-bold">Audio File</span>
        </button>
      </div>

      {/* Recorded Audio Playback */}
      {recordedAudio && (
        <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <audio src={recordedAudio} controls className="h-8 w-full max-w-xs" />
          </div>

          <button
            type="button"
            onClick={() => {
              setRecordedAudio(null);
              if (onAudioChangeRef.current) onAudioChangeRef.current(null);
            }}
            className="text-xs text-slate-400 hover:text-red-600 p-1 flex items-center gap-1 transition-all shrink-0"
            title="Delete & Re-record"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* 1-Tap Quick Moroccan Voice Presets */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-400 font-semibold uppercase">
          Quick Darija Voice Presets:
        </span>
        <button
          type="button"
          onClick={() =>
            handleQuickPreset('Kayna wahed l-hofra kbira hna f triq qdam la gare Agdal f Rabat')
          }
          className="text-[10px] font-medium bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2 py-1 rounded-lg border border-slate-200 transition-all"
        >
          🕳️ "Hofra f Agdal"
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickPreset('Zbel mcheteh w poubelle pleine f Avenue Mohammed V Hassan')
          }
          className="text-[10px] font-medium bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2 py-1 rounded-lg border border-slate-200 transition-all"
        >
          🗑️ "Zbel f Hassan"
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickPreset('Fils électriques à nu très dangereux sur le poteau d’éclairage')
          }
          className="text-[10px] font-medium bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2 py-1 rounded-lg border border-slate-200 transition-all"
        >
          💡 "Fils électriques"
        </button>
      </div>
    </div>
  );
}
