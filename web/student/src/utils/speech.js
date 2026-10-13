export function chooseEnglishVoice(voices, offline = false) {
  const english = voices.filter((voice) => /^en(?:-|_)/i.test(voice.lang) || voice.lang === 'en');
  return english.find((voice) => voice.localService === true)
    || (offline ? null : english.find((voice) => voice.default) || english[0]) || null;
}

// Short sequential utterances avoid a single long browser speech request.
export function speechChunks(text, limit = 450) {
  let remaining = String(text || '').replace(/\s+/g, ' ').trim();
  const chunks = [];
  while (remaining.length > limit) {
    const sample = remaining.slice(0, limit);
    const sentence = Math.max(sample.lastIndexOf('. '), sample.lastIndexOf('? '), sample.lastIndexOf('! '));
    let cut = sentence > limit / 2 ? sentence + 1 : sample.lastIndexOf(' ');
    if (cut < limit / 2) cut = limit;
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export function blockSpeechText(block) {
  if (['h', 'p'].includes(block.type)) return block.text || '';
  if (['ul', 'takeaway'].includes(block.type)) return (block.items || []).join('\n');
  if (block.type === 'callout') return [block.title, block.body].filter(Boolean).join('\n');
  if (block.type === 'd' && block.caption) return `Diagram caption: ${block.caption}`;
  return '';
}

export function chapterSpeechText(chapter) {
  return [chapter.title, ...(chapter.blocks || []).map(blockSpeechText)].filter(Boolean).join('\n');
}

// Keep original block indexes so search anchors remain stable.
export function chapterSections(chapter) {
  const sections = [];
  for (const [index, block] of (chapter.blocks || []).entries()) {
    if (block.type === 'h' || !sections.length) {
      sections.push({ id: `${chapter.id}:${index}`, title: block.type === 'h' ? block.text : 'Introduction', start: index, blocks: [] });
    }
    sections[sections.length - 1].blocks.push(block);
  }
  return sections;
}

export function sectionSpeechText(section) {
  return [section.blocks[0]?.type === 'h' ? '' : section.title, ...section.blocks.map(blockSpeechText)].filter(Boolean).join('\n');
}

export function selectedSectionsText(sections, selectedIds) {
  const selected = new Set(selectedIds);
  return sections.filter((section) => selected.has(section.id)).map(sectionSpeechText).join('\n\n');
}
