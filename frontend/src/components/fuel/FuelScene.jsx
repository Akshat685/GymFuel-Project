import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { CanvasTexture, CubeUVReflectionMapping, DataTexture, FileLoader, HalfFloatType, LinearFilter, LinearSRGBColorSpace, MathUtils, Object3D, RGBAFormat, SRGBColorSpace, Vector2 } from 'three';
import studioMap from './studio-map.json';
import { useGLTF } from '@react-three/drei/core/Gltf';
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor';
import { useAnimations } from '@react-three/drei/core/useAnimations';

// One-line asset swap: set a centered, ~2.8-unit tall optimized GLB URL here.
const MODEL_URL = null;
const BODY_PROFILE = [[0, -1.27], [.48, -1.27], [.59, -1.23], [.63, -1.13], [.72, .84], [.72, .98], [.67, 1.04], [0, 1.04]].map(([x, y]) => new Vector2(x, y));

function StudioLighting() {
  const { scene } = useThree();
  const buffer = useLoader(FileLoader, `${process.env.PUBLIC_URL}/fuel-studio.bin`, loader => loader.setResponseType('arraybuffer'));
  useEffect(() => {
    const map = new DataTexture(new Uint16Array(buffer), studioMap.width, studioMap.height, RGBAFormat, HalfFloatType);
    map.mapping = CubeUVReflectionMapping;
    map.minFilter = LinearFilter;
    map.magFilter = LinearFilter;
    map.colorSpace = LinearSRGBColorSpace;
    map.needsUpdate = true;
    scene.environment = map;
    scene.environmentIntensity = .65;
    return () => { scene.environment = null; map.dispose(); };
  }, [buffer, scene]);
  return <><hemisphereLight args={['#f5f8ff', '#243b65', 1.3]} /><directionalLight position={[-3, 4, 5]} intensity={3.5} color="#ffffff" /><directionalLight position={[3, 0, -2]} intensity={2} color="#a8c7ff" /></>;
}
function BottleLabel() {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f8ff';
    ctx.textAlign = 'center';
    ctx.font = '800 106px Arial';
    ctx.fillText('GYM', 256, 174); ctx.fillText('FUEL', 256, 270);
    ctx.fillRect(177, 304, 158, 5);
    ctx.font = '22px Arial'; ctx.fillText('DAILY PRACTICE', 256, 363);
    ctx.font = '18px Arial'; ctx.fillText('600 ml  /  MAKE IT COUNT', 256, 402);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    setTexture(map);
    return () => map.dispose();
  }, []);
  if (!texture) return null;
  return <mesh position={[0, -.06, .01]} rotation={[0, -.72, 0]}>
    <cylinderGeometry args={[.727, .676, 1.5, 32, 1, true, 0, 1.44]} />
    <meshStandardMaterial map={texture} transparent roughness={.48} metalness={.08} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
  </mesh>;
}

function Shaker() {
  const ribs = useRef();
  useEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < 48; i++) {
      const angle = i / 48 * Math.PI * 2;
      dummy.position.set(Math.sin(angle) * .75, 1.12, Math.cos(angle) * .75);
      dummy.rotation.y = angle;
      dummy.updateMatrix(); ribs.current.setMatrixAt(i, dummy.matrix);
    }
    ribs.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <>
    <mesh><latheGeometry args={[BODY_PROFILE, 64]} /><meshStandardMaterial color="#1e3a8a" roughness={.3} metalness={.4} /></mesh>
    <BottleLabel />
    <mesh position={[0, 1.035, 0]}><cylinderGeometry args={[.756, .75, .075, 64]} /><meshStandardMaterial color="#cbd5e1" metalness={.92} roughness={.22} /></mesh>
    <mesh position={[0, 1.16, 0]}><cylinderGeometry args={[.735, .76, .22, 64]} /><meshStandardMaterial color="#182438" metalness={.3} roughness={.4} /></mesh>
    <instancedMesh ref={ribs} args={[null, null, 48]}><boxGeometry args={[.024, .18, .025]} /><meshStandardMaterial color="#344056" roughness={.5} metalness={.35} /></instancedMesh>
    <mesh position={[0, 1.285, 0]}><cylinderGeometry args={[.61, .735, .09, 64]} /><meshStandardMaterial color="#202d42" roughness={.35} metalness={.3} /></mesh>
    <mesh position={[0, 1.37, .27]} rotation={[.08, 0, 0]}><cylinderGeometry args={[.23, .27, .15, 40]} /><meshStandardMaterial color="#223456" roughness={.3} metalness={.4} /></mesh>
    <mesh position={[0, 1.46, .27]}><cylinderGeometry args={[.245, .245, .05, 40]} /><meshStandardMaterial color="#aebed8" metalness={.85} roughness={.25} /></mesh>
    <mesh position={[0, 1.43, -.38]} rotation={[0, 0, 0]}><torusGeometry args={[.28, .064, 12, 40, Math.PI]} /><meshStandardMaterial color="#1b2941" roughness={.36} metalness={.4} /></mesh>
    <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.58, .037, 12, 64]} /><meshStandardMaterial color="#1e3a8a" roughness={.4} metalness={.4} /></mesh>
  </>;
}

function ExternalModel({ active }) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    const clips = Object.values(actions);
    clips.forEach(action => { action.play(); action.paused = !active; });
    return () => clips.forEach(action => action.stop());
  }, [actions, active]);
  return <primitive object={scene} />;
}

function Lifecycle({ onReady, onFailure }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    let cancelled = false;
    const compile = gl.extensions.has('KHR_parallel_shader_compile')
      ? gl.compileAsync(scene, camera)
      : Promise.resolve().then(() => gl.compile(scene, camera));
    compile.then(() => { if (!cancelled) onReady(); }).catch(() => { if (!cancelled) onFailure(); });
    return () => { cancelled = true; gl.domElement.removeEventListener('webglcontextlost', lost); };
  }, [gl, scene, camera, onReady, onFailure]);
  return null;
}

function PerformanceProbe() {
  const snapshot = useRef({ frames: 0, since: 0 });
  useFrame(({ gl }) => {
    if (!window.location.search.includes('sceneDebug=1')) return;
    const now = performance.now();
    const sample = snapshot.current;
    if (!sample.since) sample.since = now;
    sample.frames++;
    window.__fuelMetrics = window.__fuelMetrics || { samples: [], frames: 0 };
    window.__fuelMetrics.frames++;
    if (now - sample.since >= 1000) {
      window.__fuelMetrics.samples.push(Number((sample.frames * 1000 / (now - sample.since)).toFixed(1)));
      window.__fuelMetrics.samples = window.__fuelMetrics.samples.slice(-60);
      window.__fuelMetrics.drawCalls = gl.info.render.calls;
      window.__fuelMetrics.triangles = gl.info.render.triangles;
      window.__fuelMetrics.dpr = gl.getPixelRatio();
      sample.since = now; sample.frames = 0;
    }
  });
  return null;
}

export default function FuelScene({ active, motion, onReady, onFailure }) {
  const mobile = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  const [dpr, setDpr] = useState(mobile ? 1 : 1.25);
  const [compiled, setCompiled] = useState(false);
  const ready = useCallback(() => { setCompiled(true); onReady(); }, [onReady]);
  return <div className="fuel-canvas" aria-hidden="true">
    <Canvas frameloop={active && compiled ? 'always' : 'never'} dpr={dpr} camera={{ position: [0, .3, 6.4], fov: 36 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
      <PerformanceMonitor bounds={() => [35, 55]} flipflops={2} onDecline={() => setDpr(1)} onIncline={() => setDpr(mobile ? 1.25 : 1.5)} onFallback={() => setDpr(1)} />
      {process.env.NODE_ENV === 'development' && <PerformanceProbe />}
      <StudioLighting />
      <MotionRig motion={motion} active={active} />
      <Lifecycle onReady={ready} onFailure={onFailure} />
    </Canvas>
  </div>;
}


function MotionRig({ motion, active }) {
  const model = useRef();
  const reveal = useRef();
  const elapsed = useRef(0);
  useFrame(({ camera }, rawDelta) => {
    const dt = Math.min(rawDelta, .05);
    elapsed.current += dt;
    const state = motion.current;
    if (!state.drag) { state.spin += state.velocity * dt * 60; state.velocity *= Math.exp(-5 * dt); }
    const damp = (from, to, speed = 4) => MathUtils.damp(from, to, speed, dt);
    model.current.rotation.x = damp(model.current.rotation.x, .1 + state.y * .11);
    model.current.rotation.y = damp(model.current.rotation.y, -.25 + state.x * .2 + state.spin);
    model.current.rotation.z = damp(model.current.rotation.z, -.22 + state.x * .035);
    model.current.position.y = -.08 + Math.sin(elapsed.current * .8) * .055;
    camera.position.z = damp(camera.position.z, 6.4 - state.scroll * .4);
    camera.position.x = damp(camera.position.x, state.x * .1);
    camera.lookAt(0, .15, 0);
    reveal.current.position.set(state.x * 2, 1 - state.y * 2, 3);
    reveal.current.intensity = damp(reveal.current.intensity, state.shine * 6);
  });
  return <><pointLight ref={reveal} intensity={0} distance={7} color="#b9d3ff" />
    <group ref={model} rotation={[.1, -.25, -.22]} position={[0, -.08, 0]}>{MODEL_URL ? <ExternalModel active={active} /> : <Shaker />}</group>
  </>;
}
