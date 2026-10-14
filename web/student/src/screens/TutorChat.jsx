import { useReadAloud } from '../hooks/useReadAloud.js';
import { ReadAloudControls } from '../components/ReadAloudControls.jsx';
import { WizEmblem } from '../components/ChemWizBrand.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { askTutor, transcribeTutorNote } from '../config/api.js';
import { LiveVoice } from './LiveVoice.jsx';

const DEFAULT_CONTEXT = {
  featureKey: 'topic-overview',
  featureLabel: 'Topic overview',
  featureTitle: '',
};

export function TutorChat({ topic, content, t, token, context = DEFAULT_CONTEXT, onExit }) {
  const scope = context.featureTitle
    ? `${context.featureLabel}: ${context.featureTitle}`
    : context.featureLabel;

  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi, I'm Wiz. I’m focused on ${topic.title}${scope ? ` · ${scope}` : ''}. Ask me about the chemistry you are viewing, an equation, a mechanism, or exam technique.` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [liveOpen, setLiveOpen] = useState(false);
  const endRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingTimer = useRef(null);
  const mounted = useRef(true);
  const speech = useReadAloud();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(recordingTimer.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      recorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopRecording = () => {
    clearTimeout(recordingTimer.current);
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setRecording(false);
  };

  const startRecording = async () => {
    setVoiceError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setVoiceError('Microphone recording is unavailable. Use HTTPS (or localhost) and a supported browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg']
        .find((type) => MediaRecorder.isTypeSupported(type));
      if (!mimeType) {
        stream.getTracks().forEach((track) => track.stop());
        setVoiceError('This browser cannot record a supported audio format. Please type your question.');
        return;
      }
      const chunks = [];
      let recorderFailed = false;
      const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 64000 });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { recorderFailed = true; setVoiceError('Recording failed. Please try again.'); stopRecording(); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (!mounted.current || recorderFailed) return;
        const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
        if (blob.size < 100) { setVoiceError('No audio was recorded. Please try again.'); return; }
        setTranscribing(true);
        try {
          const transcript = await transcribeTutorNote(token, blob);
          if (mounted.current) setInput((previous) => [previous.trim(), transcript].filter(Boolean).join(' '));
        } catch (error) {
          if (mounted.current) setVoiceError(error.message || 'Transcription failed. Please try again.');
        } finally { if (mounted.current) setTranscribing(false); }
      };
      recorder.start();
      setRecording(true);
      recordingTimer.current = setTimeout(stopRecording, 45000);
    } catch {
      setVoiceError('Microphone permission was denied or unavailable. Check your browser settings.');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestions = content?.tutorPrompts || (context.featureKey === 'chemistry-research' ? [
    'Help me research an A-Level chemistry question',
    'Explain a chemistry concept step by step',
    'Give me a challenging chemistry exam question',
  ] : [
    `Explain ${scope || 'this chemistry feature'} in one paragraph`,
    'Give me a challenging exam question from this context',
    "What is the most common exam mistake here?",
  ]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading || recording || transcribing) return;

    setInput('');
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setLoading(true);

    try {
      const data = await askTutor(token, {
        topicId: context.topicId || topic.id,
        topicTitle: context.topicTitle || topic.title,
        message: q,
        history: messages.slice(1).slice(-8).map(({ role, content }) => ({ role, content })),
        context: {
          featureKey: context.featureKey,
          featureLabel: context.featureLabel,
          featureTitle: context.featureTitle || '',
          contextSummary: context.contextSummary || '',
        },
      });

      if (data.quota) setQuota(data.quota);
      setMessages([...next, { role: 'assistant', content: data.reply || 'Tutor response unavailable.' }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: err.message || 'Tutor service is unavailable. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (liveOpen) return <LiveVoice topic={topic} context={context} t={t} token={token} onClose={() => setLiveOpen(false)} />;

  return (
    <div className="cw-tutor-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="cw-tutor-header" style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, letterSpacing: '0.3em', color: topic.color, fontFamily: 'monospace', fontWeight: 700 }}>
          <WizEmblem size={40} />
          WIZ · AI TUTOR · {topic.code}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginTop: 2 }}>{topic.title}</div>
        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 5 }}>{scope}</div>
        <button type="button" onClick={() => { speech.stop(); setLiveOpen(true); }} disabled={recording || transcribing || loading} style={{ marginTop: 8, padding: '7px 10px', border: `1px solid ${t.border}`, borderRadius: 6, background: t.panel, color: t.text, cursor: 'pointer' }}>☎ Live voice</button>
        <ReadAloudControls speech={speech} t={t} />
        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 5 }}>
          Wiz is an AI tutor. Check important answers against your notes or teacher.
          {quota ? ` ${quota.remaining} of ${quota.limit} questions left today (UTC).` : ''}
        </div>
      </div>

      <div className="cw-tutor-messages" role="log" aria-label="Wiz conversation" aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, display: 'flex', gap: 8, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && <WizEmblem size={28} label="Wiz" />}
            <div style={{ maxWidth: '85%', padding: '10px 12px', background: m.role === 'user' ? topic.color : t.panel, color: m.role === 'user' ? '#000' : t.text, borderRadius: 10, fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
              {m.content}
              {m.role === 'assistant' && (
                <button type="button" onClick={() => speech.speak(m.content)} disabled={!speech.supported} aria-label="Read Wiz reply aloud" style={{ display: 'block', marginTop: 8, padding: '4px 6px', color: t.textMuted, background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 4, cursor: 'pointer' }}>▶ Listen</button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ padding: '10px 12px', background: t.panel, borderRadius: 10, fontSize: 13, color: t.textMuted, maxWidth: '85%' }}>
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="cw-tutor-suggestions" style={{ padding: '0 16px 8px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: t.textDim, marginBottom: 6, fontFamily: 'monospace' }}>TRY ASKING</div>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 4, background: 'transparent', border: `1px dashed ${t.border}`, color: t.textMuted, fontSize: 11, cursor: 'pointer', borderRadius: 4 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {(voiceError || recording || transcribing) && <div role="status" style={{ padding: '4px 12px', color: voiceError ? '#e87979' : t.textMuted, fontSize: 12 }}>
        {voiceError || (recording ? 'Recording… tap Stop to review your transcript (45 seconds max).' : 'Transcribing your voice note…')}
      </div>}
      <div className="cw-tutor-composer" style={{ padding: 12, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 6 }}>
        <button type="button" onClick={recording ? stopRecording : startRecording} disabled={transcribing || loading} aria-label={recording ? 'Stop recording' : 'Record a voice note'} style={{ padding: '8px 10px', background: recording ? '#bc4848' : t.panel, border: `1px solid ${t.border}`, color: t.text, cursor: 'pointer', borderRadius: 6, minWidth: 62 }}>
          {recording ? '■ Stop' : '🎙 Voice'}
        </button>
        <input
          id="cw-wiz-input"
          aria-label="Chemistry question for Wiz"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a chemistry question…"
          style={{ flex: 1, minWidth: 0, padding: '10px 12px', background: t.panel, border: `1px solid ${t.border}`, color: t.text, fontSize: 13, outline: 'none', fontFamily: 'inherit', borderRadius: 6 }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading || recording || transcribing}
          style={{ padding: '10px 14px', background: input.trim() && !loading ? topic.color : t.border, border: 'none', color: input.trim() && !loading ? '#000' : t.textDim, fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace', cursor: input.trim() && !loading ? 'pointer' : 'default', borderRadius: 6 }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
