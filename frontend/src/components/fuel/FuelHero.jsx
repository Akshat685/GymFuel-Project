import React, { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

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
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const update = () => setEnabled(canRenderScene());
    update();
    motion.addEventListener('change', update);
    connection?.addEventListener('change', update);
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(container.current);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
    };
  }, []);
  const live = enabled && !failed;
  return <div ref={container} className="fuel-stage" data-scene-state={live ? (ready ? 'ready' : 'loading') : 'poster'}>
    <div className={`fuel-poster ${live && ready ? 'fuel-poster--hidden' : ''}`} aria-hidden="true">
      <div className="fuel-poster__bottle"><div className="fuel-poster__lid" /><span>GYM<br />FUEL<span className="fuel-poster__line" /></span></div>
    </div>
    {live && <SceneBoundary onFailure={() => setFailed(true)}><Suspense fallback={null}>
      <FuelScene active={active} onReady={() => setReady(true)} onFailure={() => setFailed(true)} />
    </Suspense></SceneBoundary>}
    <div className="fuel-stage__caption"><span className="fuel-status-dot" />{live ? (ready ? 'BUILT FOR YOUR DAILY MOMENTUM' : 'PREPARING YOUR FUEL…') : 'SMALL HABITS. STRONGER EVERY DAY.'}</div>
  </div>;
}
