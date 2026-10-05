import React, { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';

const FuelScene = lazy(() => import('./FuelScene'));

export function canRenderScene() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (navigator.connection?.saveData || navigator.deviceMemory <= 2 || navigator.hardwareConcurrency <= 2) return false;
  try {
    const context = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function FuelHero() {
  const container = useRef(null);
  const motion = useRef({ x: 0, y: 0, spin: 0, velocity: 0, drag: false, lastX: 0, scroll: 0, shine: 0 });
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const update = () => setEnabled(canRenderScene());
    update();
    media.addEventListener('change', update);
    connection?.addEventListener('change', update);
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(container.current);
    document.addEventListener('visibilitychange', sync);
    const scroll = () => {
      const rect = container.current.getBoundingClientRect();
      motion.current.scroll = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight));
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
      window.removeEventListener('scroll', scroll);
    };
  }, []);
  const live = enabled && !failed;
  const move = event => {
    if (paused || event.target.closest('button')) return;
    const rect = container.current.getBoundingClientRect();
    const state = motion.current;
    state.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    state.y = (event.clientY - rect.top) / rect.height * 2 - 1;
    state.shine = 1;
    if (state.drag) {
      state.velocity = Math.max(-.07, Math.min(.07, (event.clientX - state.lastX) * .007));
      state.spin += state.velocity;
      state.lastX = event.clientX;
    }
  };
  const release = () => { motion.current.drag = false; };
  return <div ref={container} className="fuel-stage" data-scene-state={live ? (ready ? 'ready' : 'loading') : 'poster'}
    onPointerMove={move} onPointerDown={event => {
      if (!live || paused || event.target.closest('button')) return;
      motion.current.drag = true; motion.current.lastX = event.clientX; motion.current.velocity = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
    }} onPointerUp={release} onPointerCancel={release}
    onPointerLeave={() => { motion.current.x = 0; motion.current.y = 0; motion.current.shine = 0; release(); }}>
    <div className={`fuel-poster ${live && ready ? 'fuel-poster--hidden' : ''}`} aria-hidden="true">
      <div className="fuel-poster__bottle"><div className="fuel-poster__lid" /><span>GYM<br />FUEL<span className="fuel-poster__line" /></span></div>
    </div>
    {live && <SceneBoundary onFailure={onFailure}><Suspense fallback={null}>
      <FuelScene active={active && !paused} motion={motion} onReady={onReady} onFailure={onFailure} />
    </Suspense></SceneBoundary>}
    {live && ready && <div className="fuel-scene-controls" role="group" aria-label="Shaker view controls">
      <button type="button" disabled={paused} aria-label="Rotate shaker left" onClick={() => { motion.current.spin -= .5; }}>↶</button>
      <button type="button" disabled={paused} aria-label="Rotate shaker right" onClick={() => { motion.current.spin += .5; }}>↷</button>
      <button type="button" aria-label={paused ? 'Resume shaker animation' : 'Pause shaker animation'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>
    </div>}
    <div className="fuel-stage__caption"><span className="fuel-status-dot" />{live ? (ready ? 'BUILT FOR YOUR DAILY MOMENTUM' : 'PREPARING YOUR FUEL…') : 'SMALL HABITS. STRONGER EVERY DAY.'}</div>
  </div>;
}
