import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { rules } from './config/rules';
import { media } from './config/media';
import './style.css';
import { Player, Reels, type PlaybackStore } from './Player';
function App() {
 const playback = useRef<PlaybackStore>(new Map());
 const [expanded, setExpanded] = useState(false);
 const [index, setIndex] = useState(0); const start = useRef<number | null>(null);
 const [slides] = useState(() => {
  const items = [...media];
  for (let i = items.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
 });
 const slide = (n:number) => { if (slides.length) setIndex(i => (i+n+slides.length)%slides.length); };
 const current = slides[index];
 return <div className="page">
  <main><h1 className="main-phrase">Иногда достаточно<br/><em>одного напоминания.</em></h1>
  <div className="grid"><section className="rules"><div className="section-label"><h2>DAILY RULES</h2><span>01 — {String(rules.length).padStart(2,'0')}</span></div><div className="rule-list">{rules.map((r,i)=><article key={r.title}><span className="number">{String(i+1).padStart(2,'0')}</span><div><h3>{r.title}</h3><p>{r.text}</p></div><span className="rule-dot"/></article>)}</div></section>
  <section className="motivation"><div className="section-label"><h2>MOTIVATION</h2><button className="expand-player" disabled={!slides.length} onClick={()=>setExpanded(true)} aria-label="Открыть вертикальную медиаленту" title="Открыть на весь экран"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button></div><div className="stage media-stage" onTouchStart={e=>start.current=e.touches[0].clientX} onTouchEnd={e=>{if(start.current!==null){const d=start.current-e.changedTouches[0].clientX;if(Math.abs(d)>45)slide(d>0?1:-1);start.current=null;}}}>
  {current ? (!expanded && <Player key={current.src} item={current} playback={playback.current}/>) : <p className="empty-media">Добавьте фото или видео в media/ и запустите npm run media:sync</p>}

  </div><div className="slider-bottom"><div className="arrows"><button onClick={()=>slide(-1)} disabled={slides.length<2} aria-label="Предыдущий слайд">←</button><button onClick={()=>slide(1)} disabled={slides.length<2} aria-label="Следующий слайд">→</button></div></div></section></div>
  </main>{expanded && <Reels playback={playback.current} items={slides} initial={index} onClose={i=>{setIndex(i);setExpanded(false);}}/>}</div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
if ('serviceWorker' in navigator && location.hostname !== 'localhost') navigator.serviceWorker.register('./sw.js').catch(console.error);
