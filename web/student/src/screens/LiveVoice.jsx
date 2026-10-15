import { WizEmblem } from '../components/ChemWizBrand.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { createLiveVoiceSession } from '../config/api.js';

const MAX_SECONDS = 300;

export function LiveVoice({ token, topic, context, t, onClose }) {
  const [status, setStatus] = useState('Ready to connect');
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [seconds, setSeconds] = useState(MAX_SECONDS);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const startingRef = useRef(false);
  const cancelledRef = useRef(false);

  const end = (label = 'Call ended') => {
    cancelledRef.current = true;
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.srcObject = null; }
    streamRef.current = null;
    peerRef.current = null;
    startingRef.current = false;
    setActive(false);
    setMuted(false);
    setAudioBlocked(false);
    setStatus(label);
  };
  const endRef = useRef(end);
  endRef.current = end;
  useEffect(() => () => endRef.current(), []);

  const begin = async () => {
    if (startingRef.current || active) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
      setStatus('Live voice needs HTTPS (or localhost) and a browser with WebRTC.');
      return;
    }
    cancelledRef.current = false;
    startingRef.current = true;
    setStatus('Connecting microphone…');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (cancelledRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      const peer = new RTCPeerConnection();
      peerRef.current = peer;
      const audio = document.createElement('audio');
      audio.autoplay = true;
      audio.playsInline = true;
      audioRef.current = audio;
      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0];
        audio.play().catch(() => {
          setAudioBlocked(true);
          setStatus('Connected. Tap Enable audio to hear Wiz.');
        });
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === 'failed' || peer.connectionState === 'closed') endRef.current('Voice connection ended.');
        if (peer.connectionState === 'connected') setStatus('Connected · speak naturally to Wiz');
      };
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      const channel = peer.createDataChannel('oai-events');
      channel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'input_audio_buffer.speech_started') setStatus('Listening to you…');
          if (data.type === 'response.created') setStatus('Wiz is answering…');
          if (data.type === 'response.done') setStatus('Connected · ask your next chemistry question');
          if (data.type === 'error') setStatus('Wiz had trouble with that turn. Try again or end the call.');
        } catch { /* Ignore unknown provider events. */ }
      };
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      setStatus('Opening secure voice session…');
      const answer = await createLiveVoiceSession(token, offer.sdp, {
        topicId: context.topicId || topic.id,
        topicTitle: context.topicTitle || topic.title,
        featureKey: context.featureKey,
        featureLabel: context.featureLabel,
        featureTitle: context.featureTitle || '',
      });
      if (cancelledRef.current) return;
      await peer.setRemoteDescription({ type: 'answer', sdp: answer });
      if (cancelledRef.current) return;
      setActive(true);
      setSeconds(MAX_SECONDS);
      const started = Date.now();
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, MAX_SECONDS - Math.floor((Date.now() - started) / 1000));
        setSeconds(remaining);
        if (!remaining) endRef.current('Five-minute pilot session ended.');
      }, 1000);
      setStatus('Connecting to Wiz…');
    } catch (error) {
      endRef.current(error.message || 'Live voice could not connect. Check microphone permission.');
    } finally { startingRef.current = false; }
  };

  const toggleMute = () => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
    setMuted(next);
    setStatus(next ? 'Microphone muted' : 'Microphone on · speak to Wiz');
  };

  const button = { padding: '10px 14px', border: `1px solid ${t.border}`, borderRadius: 6, background: t.panel, color: t.text, cursor: 'pointer' };
  return <div style={{ padding: 20, color: t.text, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 540 }}>
    <button type="button" onClick={() => { end(); onClose(); }} style={{ ...button, alignSelf: 'flex-start' }}>← Text chat</button>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><WizEmblem size={72} /><h2 id="cw-wiz-live-heading" tabIndex={-1} style={{ margin: 0 }}>Live voice with Wiz</h2></div>
    <p style={{ margin: 0, color: t.textMuted }}>{topic.title} · {context.featureLabel}</p>
    <p style={{ margin: 0, color: t.textMuted, lineHeight: 1.5 }}>Wiz is an AI tutor, and its voice is AI-generated. This pilot call ends after five minutes. Ask chemistry questions aloud and speak again to interrupt a reply.</p>
    <div role="status" aria-live="polite" style={{ padding: 18, border: `1px solid ${t.border}`, borderRadius: 10, background: t.panel }}>{status}{active ? ` · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} left` : ''}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {!active && <button type="button" onClick={begin} disabled={startingRef.current} style={button}>🎙 Start live voice</button>}
      {active && <button type="button" onClick={toggleMute} style={button}>{muted ? 'Unmute microphone' : 'Mute microphone'}</button>}
      {active && audioBlocked && <button type="button" onClick={() => audioRef.current?.play().then(() => setAudioBlocked(false)).catch(() => setStatus('Check your device sound permission and volume.'))} style={button}>Enable audio</button>}
      {(active || startingRef.current) && <button type="button" onClick={() => end()} style={button}>End call</button>}
    </div>
  </div>;
}
