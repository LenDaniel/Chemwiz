import React, { useEffect, useState } from 'react';

// Browser connectivity is a hint, not proof that the server can be reached.
export function ConnectionStatus() {
  const [offline, setOffline] = useState(() => !navigator.onLine);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return <div className="cw-connection-status" role="status" aria-live="polite">
    {offline && 'You appear to be offline. New lessons, sign-in and Wiz need a connection. Changes waiting to save will retry when you reconnect.'}
  </div>;
}
