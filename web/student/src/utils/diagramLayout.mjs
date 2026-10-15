// Wrap explanatory labels at spaces. Never split a chemical formula/token.
export function wrapDiagramText(value, width, size = 9) {
  const text = String(value ?? '');
  const capacity = Math.max(1, Math.floor(width / (size * 0.65)));
  if ([...text].length <= capacity) return [text];
  const lines = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const previous = lines[lines.length - 1];
    if (previous && [...previous, ' ', ...word].length <= capacity) lines[lines.length - 1] += ' ' + word;
    else lines.push(word);
  }
  return lines.length ? lines : [''];
}

export function fitDiagramBounds(box, width, height, padding = 6) {
  const x = Math.min(0, box.x - padding), y = Math.min(0, box.y - padding);
  return { x, y, width: Math.max(width, box.x + box.width + padding) - x,
    height: Math.max(height, box.y + box.height + padding) - y };
}

export function diagramText(spec) {
  const display = new Set(['title', 'subtitle', 'body', 'text', 'headers', 'rows', 'label', 'sublabel', 'note', 'hint', 'valueLabel', 'number']);
  const text = [];
  function scan(value, include = false) {
    if (typeof value === 'string' || typeof value === 'number') { if (include) text.push(String(value)); return; }
    if (Array.isArray(value)) { for (const child of value) scan(child, include); return; }
    if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) scan(child, display.has(key));
  }
  scan(spec);
  return text.filter(Boolean);
}
