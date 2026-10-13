import { useEffect, useRef, useState } from 'react';
import { chooseEnglishVoice, speechChunks } from '../utils/speech.js';

export function useReadAloud() {
  const [voices, setVoices] = useState([]);
  const [offline, setOffline] = useState(false);
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState('');
  const [rate, setRate] = useState(0.95);
  const session = useRef(0);
  const utteranceRef = useRef(null);
  const voice = chooseEnglishVoice(voices, offline);

  useEffect(() => {
    const synth = window.speechSynthesis;
    setSupported(Boolean(synth && window.SpeechSynthesisUtterance));
    const refresh = () => { setVoices(synth?.getVoices() || []); setOffline(!navigator.onLine); };
    refresh();
    synth?.addEventListener('voiceschanged', refresh);
    window.addEventListener('online', refresh);
    window.addEventListener('offline', refresh);
    return () => {
      session.current++;
      synth?.cancel();
      synth?.removeEventListener('voiceschanged', refresh);
      window.removeEventListener('online', refresh);
      window.removeEventListener('offline', refresh);
    };
  }, []);

  const stop = () => {
    session.current++;
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setActive(false); setPaused(false);
  };
  const speak = (text) => {
    stop(); setError('');
    const synth = window.speechSynthesis;
    const selected = chooseEnglishVoice(synth?.getVoices() || [], !navigator.onLine);
    if (!synth || !window.SpeechSynthesisUtterance) { setError('Read-aloud is unavailable in this browser.'); return; }
    if (!selected) {
      setError(!navigator.onLine ? 'No offline English voice is available. Install an English device voice or reconnect.' : 'No English voice is available yet. Check your device speech settings and try again.');
      return;
    }
    const chunks = speechChunks(text);
    if (!chunks.length) return;
    const id = session.current;
    setActive(true);
    const next = (index) => {
      if (id !== session.current) return;
      if (index >= chunks.length) { setActive(false); setPaused(false); utteranceRef.current = null; return; }
      const utterance = new window.SpeechSynthesisUtterance(chunks[index]);
      utteranceRef.current = utterance;
      utterance.voice = selected; utterance.lang = selected.lang; utterance.rate = rate;
      utterance.onend = () => next(index + 1);
      utterance.onerror = () => {
        if (id !== session.current) return;
        session.current++; setActive(false); setPaused(false);
        setError('Playback failed. Check your device voice and sound settings, then try again.');
      };
      try { synth.speak(utterance); } catch { utterance.onerror(); }
    };
    next(0);
  };
  const togglePause = () => {
    if (paused) window.speechSynthesis?.resume(); else window.speechSynthesis?.pause();
    setPaused(!paused);
  };
  const voiceLabel = !supported ? 'Read-aloud unavailable in this browser.'
    : voice?.localService === true ? `Offline device voice: ${voice.name}`
    : voice ? `Online voice: ${voice.name}`
    : offline ? 'No offline English voice available.' : 'Waiting for an English device voice.';
  return { speak, stop, togglePause, active, paused, rate, setRate, supported, voiceLabel, error };
}
