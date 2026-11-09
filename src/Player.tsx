import { useEffect, useRef, useState } from 'react';
import type { MediaItem } from './config/media';
export interface PlaybackState { time: number; muted: boolean; playing: boolean }
export type PlaybackStore = Map<string, PlaybackState>;
export function Player({ item, active = true, autoPlay = false, playback }: { item: MediaItem; active?: boolean; autoPlay?: boolean; playback: PlaybackStore }) {
 const video = useRef<HTMLVideoElement>(null);
 const [playing, setPlaying] = useState(false);
 const [muted, setMuted] = useState(playback.get(item.src)?.muted ?? false);
 const suppressPause = useRef(false);
 const [progress, setProgress] = useState(0);
 const [error, setError] = useState('');
 useEffect(() => {
  const element = video.current;
  let cancelled = false;
  if (!element) return;
  const saved = playback.get(item.src);
  suppressPause.current = !active;
  if (active && saved) {
   element.currentTime = saved.time;
   element.muted = saved.muted;
   setMuted(saved.muted);
  }
  if (!active) element.pause();
  else if (saved ? saved.playing : autoPlay) {
   void element.play().catch(async (reason: unknown) => {
    if (cancelled) return;
    if (reason instanceof DOMException && reason.name === 'NotAllowedError') {
     element.muted = true;
     setMuted(true);
     try { await element.play(); }
     catch { /* The visible play button lets the user start playback. */ }
    } else if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
     setError('Не удалось запустить видео. Нажмите ▶, чтобы повторить.');
    }
   });
  }
  return () => {
   cancelled = true;
   if (active) playback.set(item.src, {time: element.currentTime, muted: element.muted, playing: !element.paused});
   suppressPause.current = true;
   element.pause();
  };
 }, [active, autoPlay]);
 if (item.type === 'image') return <img src={item.src} alt="Фото из личной коллекции" className="player-image"/>;
 const remember = (playing: boolean) => {
  const v = video.current;
  if (v) playback.set(item.src, { time: v.currentTime, muted: v.muted, playing });
 };
 const toggle = () => {
  const element = video.current;
  if (!element) return;
  setError('');
  if (element.paused) {
   if (element.error) element.load();
   void element.play().catch(() => setError('Видео не запускается. Проверьте подключение и обновите страницу.'));
  } else element.pause();
 };
 return <div className="custom-player">
  <video ref={video} src={item.src} playsInline muted={muted} loop={autoPlay} preload="metadata" onError={() => setError('Не удалось загрузить видео. Проверьте подключение.')} onLoadedMetadata={e => { const saved = playback.get(item.src); if (saved) e.currentTarget.currentTime = saved.time; }} onVolumeChange={() => { if(active) remember(!video.current?.paused); }} onPlay={() => { suppressPause.current = false; remember(true); setPlaying(true); setError(''); }} onPause={() => { if (!suppressPause.current) remember(false); setPlaying(false); }} onEnded={() => setPlaying(false)} onTimeUpdate={e => {const v=e.currentTarget;if(active && !v.paused) remember(true);setProgress(v.duration ? v.currentTime/v.duration*100 : 0);}}/>
  <button className={'play-surface '+(playing?'is-playing':'')} onClick={toggle} aria-label={playing?'Пауза':'Воспроизвести'}><span>{playing?'Ⅱ':'▶'}</span></button>
  {error && <p className="player-error" role="status">{error}</p>}
  <div className="player-controls"><button onClick={toggle} aria-label={playing?'Пауза':'Воспроизвести'}>{playing?'Ⅱ':'▶'}</button><input aria-label="Позиция воспроизведения" type="range" min="0" max="100" step="0.1" value={progress} onChange={e=>{const v=video.current;if(v && Number.isFinite(v.duration)) {v.currentTime=Number(e.target.value)/100*v.duration;setProgress(Number(e.target.value));}}}/><button onClick={()=>setMuted(v=>!v)} aria-label={muted?'Включить звук':'Выключить звук'}>{muted?'♪̸':'♪'}</button></div>
 </div>;
}
export function Reels({ items, initial, onClose, playback }: {items: MediaItem[]; initial: number; onClose: (index:number)=>void; playback: PlaybackStore}) {
 const feed=useRef<HTMLDivElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const [active,setActive]=useState(initial);
 const activeRef=useRef(initial);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  closeButton.current?.focus();
  const el=feed.current!;
  el.children[initial]?.scrollIntoView({block:'start'});
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const i=Number((entry.target as HTMLElement).dataset.index);setActive(i);activeRef.current=i;}},{root:el,threshold:.65});
  Array.from(el.children).forEach(child=>observer.observe(child));
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();onClose(activeRef.current);}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();el.children[Math.max(0,Math.min(items.length-1,activeRef.current+(e.key==='ArrowDown'?1:-1)))]?.scrollIntoView({behavior:'smooth',block:'start'});}
   if(e.key==='Tab') {const buttons=Array.from(document.querySelectorAll<HTMLElement>('.reels-dialog button, .reels-dialog input'));const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  };
  document.addEventListener('keydown',key);
  return()=>{observer.disconnect();document.removeEventListener('keydown',key);document.body.style.overflow=overflow;previous?.focus();};
 },[]);
 return <div className="reels-dialog" role="dialog" aria-modal="true" aria-label="Полноэкранная медиалента"><button ref={closeButton} className="reels-close" onClick={()=>onClose(active)} aria-label="Закрыть">×</button><div className="reels-feed" ref={feed}>{items.map((item,i)=><section className="reel" key={item.src} data-index={i} inert={i!==active}><div className="reel-media">{i===active && <Player item={item} autoPlay playback={playback}/>}</div></section>)}</div></div>;
}
