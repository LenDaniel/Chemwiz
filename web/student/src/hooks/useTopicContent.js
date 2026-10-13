import { useEffect, useState } from 'react';
import { getContent, loadContent } from '../content/index.js';

export function useTopicContent(topicId) {
  const [result, setResult] = useState({ id: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!topicId) return undefined;
    let active = true;
    setResult({ id: topicId, error: null });
    loadContent(topicId).then((content) => {
      if (active) setResult({ id: topicId, error: content ? null : 'This topic is unavailable.' });
    }).catch(() => {
      if (active) setResult({ id: topicId, error: 'Could not load this topic. Check your connection and try again.' });
    });
    return () => { active = false; };
  }, [topicId, attempt]);
  return {
    content: topicId ? getContent(topicId) : null,
    error: result.id === topicId ? result.error : null,
    retry: () => setAttempt((value) => value + 1),
  };
}
