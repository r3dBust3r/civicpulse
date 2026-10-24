'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({
  transcript,
  onTranscriptChange,
  disabled = false,
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'ar-MA' | 'fr-FR' | 'en-US'>('ar-MA');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const isStartedRef = useRef<boolean>(false);
  const onTranscriptChangeRef = useRef(onTranscriptChange);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  useEffect(() => {
    // Check SpeechRecognition support in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let currentText = '';
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript + ' ';
      }
      onTranscriptChangeRef.current(currentText.trim());
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      isStartedRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      isStartedRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current && isStartedRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors on unmount
        }
        isStartedRef.current = false;
      }
    };
  }, []);

  const changeLanguage = (newLang: 'ar-MA' | 'fr-FR' | 'en-US') => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      isStartedRef.current = false;
    }
    setLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening || isStartedRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      setIsListening(false);
      isStartedRef.current = false;
    } else {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
        isStartedRef.current = true;
      } catch (err: any) {
        console.warn('SpeechRecognition start safe caught:', err);
        // If already started in background, mark state
        if (err.name === 'InvalidStateError') {
          setIsListening(true);
          isStartedRef.current = true;
        } else {
          setIsListening(false);
          isStartedRef.current = false;
        }
      }
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-sky-100 text-sky-700'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Voice Description (Rabat Community)</h4>
            <p className="text-xs text-slate-500">Speak in Darija, French, or English</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => changeLanguage('ar-MA')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'ar-MA' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Moroccan Arabic (Darija)"
          >
            🇲🇦 Darija
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('fr-FR')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'fr-FR' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="French"
          >
            🇫🇷 FR
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('en-US')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              language === 'en-US' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English"
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {/* Record Trigger & Live Wave */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleListening}
          disabled={disabled || !isSupported}
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-md font-medium transition-all shrink-0 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200 shadow-red-500/30'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <span className="absolute w-full h-full rounded-2xl bg-red-400 opacity-75 pulse-record"></span>
              <MicOff className="w-5 h-5 relative z-10" />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1">
          {isListening ? (
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Listening... Speak clearly (Darija / FR / EN)</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {transcript ? 'Spoken transcript captured:' : 'Tap the microphone to describe the issue by voice'}
            </div>
          )}

          <input
            type="text"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={
              language === 'ar-MA'
                ? 'Matalan: "Kayna wahed l-hofra f Agdal qdam la gare..."'
                : 'Par exemple: "Trou dangereux sur le trottoir..."'
            }
            className="w-full mt-1.5 px-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {!isSupported && (
        <div className="mt-2 text-[11px] text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Browser speech recognition not detected; you can type your note directly above.</span>
        </div>
      )}
    </div>
  );
}
