import { useEffect } from 'react';

// Native modal dialogs make the background inert, contain keyboard focus and
// support Escape. Keep the trigger so closing returns keyboard users to it.
export function useDialog(ref, open) {
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return undefined;
    const trigger = document.activeElement;
    if (!dialog.open) dialog.showModal();
    const containTab = (event) => {
      if (event.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')]
        .filter(element => element.getClientRects().length && element.tabIndex >= 0);
      const first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', containTab);
    return () => {
      dialog.removeEventListener('keydown', containTab);
      if (dialog.open) dialog.close();
      if (trigger?.isConnected && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [ref, open]);
}

export function clickedBackdrop(event) {
  if (event.target !== event.currentTarget) return false;
  const box = event.currentTarget.getBoundingClientRect();
  return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
}
