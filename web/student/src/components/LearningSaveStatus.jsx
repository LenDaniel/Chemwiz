import React from 'react';
export function LearningSaveStatus({ learning }) {
  const { status, error } = learning;
  return (
    <div className="cw-save-status" role="status" aria-live="polite">
      {status === 'conflict' ? <>
        <span>Your learning data was updated in another session.</span>
        <button type="button" onClick={() => learning.resolve(true)}>Load saved data</button>
        <button type="button" onClick={() => learning.resolve(false)}>Keep this device’s data</button>
      </> : <>
        <span>{status === 'saved' ? '✓ Learning data saved' : error ? 'Changes waiting to save' : 'Saving your learning data…'}</span>
        {status === 'pending' && error && <button type="button" onClick={learning.retry}>Retry</button>}
        {error && status === 'pending' && <span>{error}</span>}
      </>}
    </div>
  );
}
