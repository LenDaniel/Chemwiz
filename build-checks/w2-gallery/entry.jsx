import React from 'react';
import {createRoot} from 'react-dom/client';
import {Block} from '../../web/student/src/components/Primitives.jsx';
import {THEMES} from '../../web/student/src/config/theme.js';
import '../../web/student/src/styles/responsive.css';
import diagrams from './diagrams.json';
const t=THEMES.dark;
createRoot(document.getElementById('root')).render(<main className="cw-app-root" style={{height:'100dvh',overflowY:'auto',background:t.bg,color:t.text,'--cw-bg':t.bg,'--cw-panel':t.panel,'--cw-text':t.text,'--cw-muted':t.textMuted,'--cw-border':t.border,'--cw-accent':t.accent}}>
{diagrams.map(item=><article key={item.id} data-diagram-id={item.id} style={{width:'100%',maxWidth:900,margin:'0 auto',padding:12}}><Block block={item.block} color={item.color} t={t}/></article>)}</main>);