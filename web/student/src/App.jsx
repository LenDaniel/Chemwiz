import React, { useState, useEffect } from 'react';
import { TOPIC_META, topicById } from './config/topics.js';
import { THEMES } from './config/theme.js';
import { getItem, setItem } from './utils/storage.js';
import { Auth } from './screens/Auth.jsx';
import { getCurrentUser, loginUser, registerUser } from './config/api.js';
import { getContent } from './content/index.js';
import { useTopicContent } from './hooks/useTopicContent.js';
import { getWizContext, makeWizContext } from './config/wizContext.js';
import { LockedFeature } from "./screens/LockedFeature.jsx";

import { Home } from './screens/Home.jsx';
import { TopicView } from './screens/TopicView.jsx';
import { Chapters, Reader } from './screens/Chapters.jsx';
import { Quiz } from './screens/Quiz.jsx';
import { Structured, Worked } from './screens/Structured.jsx';
import { TutorChat } from './screens/TutorChat.jsx';
import { Progress } from './screens/Progress.jsx';
import { Profile } from './screens/Profile.jsx';

import { ToolsMenu } from './tools/ToolsMenu.jsx';
import { PeriodicTable } from './tools/PeriodicTable.jsx';
import { ElementDetail } from './tools/ElementDetail.jsx';
import { Balancer } from './tools/Balancer.jsx';
import { QATable } from './tools/QATable.jsx';
import { MoleCalc } from './tools/MoleCalc.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { useLearningState } from './hooks/useLearningState.js';
import { LearningSaveStatus } from './components/LearningSaveStatus.jsx';


export default function App() {
  // nav[n] = current view at stack depth n
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([{ view: 'home' }]);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const learning = useLearningState(user, authToken);
  const { settings, progress, streak, mistakes } = learning.state;

  // Restore the session first, then load this account's saved learner records.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getItem('cw.authToken');
      if (token) {
        try {
          const data = await getCurrentUser(token);
          if (!cancelled) { setAuthToken(token); setUser(data.user); }
        } catch {
          if (!cancelled) await setItem('cw.authToken', '');
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const t = THEMES[settings.theme] || THEMES.dark;
  const current = stack[stack.length - 1];
  const needsTopicContent = ['topic', 'chapters', 'reader', 'quiz', 'structured', 'worked', 'tutor'].includes(current.view);
  const { content: activeContent, error: contentError, retry: retryContent } = useTopicContent(
    loaded && user && needsTopicContent ? current.topicId : null
  );

  const push = (v) => setStack([...stack, v]);
  const pop = () => { if (stack.length > 1) setStack(stack.slice(0, -1)); };
  const resetTo = (view) => setStack([{ view }]);

  const saveSettings = (ns) => learning.change({ settings: ns });
  const saveProgress = (np) => learning.change({ progress: np });
  const saveMistakes = (nm) => learning.change({ mistakes: nm.slice(-1000) });

  const markChapterRead = (topicId, chapterId, totalChapters) => {
    const cur = progress[topicId] || { chaptersRead: [], quizzesTaken: 0, percent: 0 };
    if (cur.chaptersRead.includes(chapterId)) return;
    const chaptersRead = [...cur.chaptersRead, chapterId];
    const percent = Math.min(100, Math.round((chaptersRead.length / totalChapters) * 0.6 * 100 + (cur.quizzesTaken > 0 ? 40 : 0)));
    saveProgress({ ...progress, [topicId]: { ...cur, chaptersRead, percent } });
  };

  const recordQuizComplete = (topicId, score, outOf, newMistakes, totalChapters) => {
    const cur = progress[topicId] || { chaptersRead: [], quizzesTaken: 0, percent: 0 };
    const pct = Math.round((score / outOf) * 100);
    const quizzesTaken = cur.quizzesTaken + 1;
    const readFraction = cur.chaptersRead.length / totalChapters;
    const percent = Math.min(100, Math.round(readFraction * 60 + pct * 0.4));
    saveProgress({ ...progress, [topicId]: { ...cur, quizzesTaken, lastScore: pct, percent } });
    if (newMistakes.length) saveMistakes([...mistakes, ...newMistakes.map(m => ({ ...m, topicId, t: Date.now() }))]);
  };

  const resetAll = async () => {
    if (!window.confirm('Reset the saved progress, streak, mistakes and settings for this account?')) return;
    learning.reset();
    await learning.flush();
  };

  const handleAuthSuccess = async (data) => {
    setAuthToken(data.token);
    await setItem('cw.authToken', data.token);

    try {
      const freshData = await getCurrentUser(data.token);
      setUser(freshData.user);
    } catch (err) {
      setUser(data.user);
    }
  };

  const handleLogin = async (payload) => {
    const data = await loginUser(payload);
    await handleAuthSuccess(data);
  };

  const handleRegister = async (payload) => {
    const data = await registerUser(payload);
    await handleAuthSuccess(data);
  };

  const handleLogout = async () => {
    await learning.flush();
    await setItem('cw.authToken', '');
    setAuthToken(null);
    setUser(null);
    setTab('home');
    setStack([{ view: 'home' }]);
  };

const hasPremiumAccess = () => {
  if (!user) return false;

  if (user.role === "teacher" || user.role === "admin") return true;

  if (!user.access?.isPremium) return false;

  if (user.subscriptionExpiresAt) {
    return new Date(user.subscriptionExpiresAt).getTime() >= Date.now();
  }

  return true;
};

const openPremiumFeature = (featureView, topicId, featureName, extra = {}) => {
  if (hasPremiumAccess()) {
    push({ view: featureView, topicId, ...extra });
    return;
  }

  push({
    view: "locked",
    topicId,
    featureName,
    ...extra,
  });
};

  const wizContext = getWizContext(current, tab);
  const openWiz = () => {
    if (current.view === 'tutor') {
      (document.getElementById('cw-wiz-input') || document.getElementById('cw-wiz-live-heading'))?.focus();
      return;
    }
    if (current.view === 'locked' && current.featureName === 'Wiz AI Tutor') return;
    openPremiumFeature('tutor', wizContext.topicId, 'Wiz AI Tutor', { wizContext });
  };

  const openSearchResult = (result) => {
    if (!result) return;

    if (result.kind === 'tool') {
      setTab('tools');
      if (result.toolKey === 'qa') {
        setStack([
          { view: 'tools-home' },
          { view: 'tool-qa', initialTab: result.qaTab || 'cations', initialOpen: result.qaOpen || null },
        ]);
      } else {
        setStack([{ view: 'tools-home' }, { view: `tool-${result.toolKey}` }]);
      }
      return;
    }

    if (!result.topicId) return;
    setTab('home');

    if (result.chapterId) {
      setStack([
        { view: 'home' },
        { view: 'topic', topicId: result.topicId },
        { view: 'chapters', topicId: result.topicId },
        {
          view: 'reader',
          topicId: result.topicId,
          chapterId: result.chapterId,
          targetBlockIndex: Number.isInteger(result.blockIndex) ? result.blockIndex : null,
        },
      ]);
      return;
    }

    setStack([{ view: 'home' }, { view: 'topic', topicId: result.topicId }]);
  };

  // Derive current screen
  const renderScreen = () => {
    if (user && !learning.ready) return (
      <div style={{ padding: 32, color: t.text, textAlign: 'center' }}>
        <p>{learning.status === 'load-error' ? 'Your saved learning data could not be loaded.' : 'Loading your saved learning data…'}</p>
        {learning.status === 'load-error' && <button type="button" onClick={learning.retry}>Try again</button>}
      </div>
    );
    if (!loaded) return <div style={{ padding: 40, color: t.textDim, textAlign: 'center' }}>Loading…</div>;

    if (current.view === 'locked') {
      return (
        <LockedFeature
          t={t}
          user={user}
          featureName={current.featureName}
          onBack={pop}
          onProfile={() => switchTab('profile')}
        />
      );
    }

    if (needsTopicContent && current.topicId && !activeContent) {
      return <div className="cw-page" style={{ padding: 24, color: t.text }} role="status" aria-live="polite">
        <p>{contentError || 'Loading topic…'}</p>
        {contentError && <button type="button" onClick={retryContent}>Try again</button>}
        <button type="button" onClick={pop} style={{ marginLeft: 12 }}>Back</button>
      </div>;
    }

    if (current.view === 'tutor') {
      const topic = current.topicId
        ? topicById(current.topicId)
        : {
            id: 'chemistry-tools',
            code: 'TOOLS',
            title: current.wizContext?.topicTitle || 'Chemistry research',
            color: current.wizContext?.topicColor || t.accent,
          };
      const content = current.topicId ? getContent(topic.id) : null;
      const context = current.wizContext || makeWizContext(topic, 'topic-overview', 'Topic overview', topic.title);
      return <TutorChat key={`${context.topicId || 'tools'}:${context.featureKey}:${context.featureTitle}`} topic={topic} content={content} context={context} t={t} token={authToken} onExit={pop} />;
    }

    if (tab === 'home') {
      if (current.view === 'home') {
        return <Home t={t} progress={progress} streak={streak} mistakesCount={mistakes.length} settings={settings}
          onTopicTap={(tp) => push({ view: 'topic', topicId: tp.id })} />;
      }

      if (current.view === 'topic') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        return <TopicView topic={topic} content={content} progress={progress} t={t}
          onAction={(action) => {
            if (action === 'chapters') push({ view: 'chapters', topicId: topic.id });
            if (action === 'quiz') push({ view: 'quiz', topicId: topic.id });
            if (action === 'structured') {
  openPremiumFeature('structured', topic.id, 'Structured Questions');
}

if (action === 'worked') {
  openPremiumFeature('worked', topic.id, 'Worked Examples');
}

if (action === 'tutor') {
  openPremiumFeature('tutor', topic.id, 'Wiz AI Tutor', {
    wizContext: makeWizContext(topic, 'topic-overview', 'Topic overview', topic.title, `Topic overview for ${topic.title}.`),
  });
}
          }} />;
      }
      if (current.view === 'chapters') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        return <Chapters topic={topic} content={content} progress={progress} t={t}
          onOpenChapter={(ch) => push({ view: 'reader', topicId: topic.id, chapterId: ch.id })} />;
      }
      if (current.view === 'reader') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        const chapter = content.chapters.find(c => c.id === current.chapterId);
        return <Reader topic={topic} content={content} chapter={chapter} t={t} settings={settings}
          onMarkRead={() => markChapterRead(topic.id, chapter.id, content.chapters.length)}
          onBack={pop}
          onNext={(next) => setStack([...stack.slice(0, -1), { view: 'reader', topicId: topic.id, chapterId: next.id }])}
          onPrev={(prev) => setStack([...stack.slice(0, -1), { view: 'reader', topicId: topic.id, chapterId: prev.id }])}
          targetBlockIndex={current.targetBlockIndex} />;
      }
      if (current.view === 'quiz') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        return <Quiz topic={topic} bank={content.quizzes} t={t} onExit={pop}
          onComplete={(score, outOf, mist) => recordQuizComplete(topic.id, score, outOf, mist, content.chapters.length)} />;
      }
      if (current.view === 'structured') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        return <Structured topic={topic} bank={content.structured} t={t} onExit={pop} />;
      }
      if (current.view === 'worked') {
        const topic = topicById(current.topicId);
        const content = getContent(topic.id);
        return <Worked topic={topic} bank={content.worked} t={t} onExit={pop} />;
      }
    }

    if (tab === 'tools') {
      if (current.view === 'tools-home') return <ToolsMenu t={t} onOpen={(k) => push({ view: `tool-${k}` })} />;
      if (current.view === 'tool-periodic') return <PeriodicTable t={t} onElementTap={(el) => push({ view: 'element', el })} />;
      if (current.view === 'element') return <ElementDetail element={current.el} t={t} onExit={pop} />;
      if (current.view === 'tool-balancer') return <Balancer t={t} />;
      if (current.view === 'tool-qa') return <QATable t={t} initialTab={current.initialTab} initialOpen={current.initialOpen} />;
      if (current.view === 'tool-mole') return <MoleCalc t={t} />;
    }

    if (tab === 'progress') return <Progress t={t} progress={progress} streak={streak} mistakes={mistakes} />;
    if (tab === 'profile') return (
      <Profile
        t={t}
        settings={settings}
        onSettingsChange={saveSettings}
        onReset={resetAll}
        user={user}
        onLogout={handleLogout}
        learning={learning}
        authToken={authToken}
      />
    );

    return null;
  };

  const switchTab = (k) => {
    setTab(k);
    if (k === 'home') setStack([{ view: 'home' }]);
    if (k === 'tools') setStack([{ view: 'tools-home' }]);
    if (k === 'progress') setStack([{ view: 'progress' }]);
    if (k === 'profile') setStack([{ view: 'profile' }]);
  };

  const canGoBack = stack.length > 1;

  if (loaded && !user) {
    return <Auth t={t} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const contentMode = ['reader', 'quiz', 'structured', 'worked', 'tutor'].includes(current?.view)
    ? current.view
    : tab === 'tools'
      ? 'tools'
      : 'default';

  return (
    <AppShell
      t={t}
      tab={tab}
      onSwitchTab={switchTab}
      onBack={pop}
      canGoBack={canGoBack}
      contentMode={contentMode}
      user={user}
      onSearchSelect={openSearchResult}
      wizContext={user ? wizContext : null}
      onOpenWiz={openWiz}
      onLogout={handleLogout}
    >
      {user && learning.ready && <LearningSaveStatus learning={learning} />}
      {renderScreen()}
    </AppShell>
  );
}
