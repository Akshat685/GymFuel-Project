import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CanvasTexture, Object3D, PMREMGenerator, SRGBColorSpace, Vector2 } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useGLTF } from '@react-three/drei/core/Gltf';
import { useAnimations } from '@react-three/drei/core/useAnimations';

// One-line asset swap: set a centered, ~2.8-unit tall optimized GLB URL here.
const MODEL_URL = null;
const BODY_PROFILE = [[0, -1.27], [.48, -1.27], [.59, -1.23], [.63, -1.13], [.72, .84], [.72, .98], [.67, 1.04], [0, 1.04]].map(([x, y]) => new Vector2(x, y));

function StudioLighting() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .06, .1, 20, { size: 128 });
    scene.environment = target.texture;
    scene.environmentIntensity = .65;
    room.dispose();
    generator.dispose();
    return () => { scene.environment = null; target.dispose(); };
  }, [gl, scene]);
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
    <mesh position={[0, -1.2, 0]}><torusGeometry args={[.58, .037, 12, 64]} /><meshStandardMaterial color="#1e3a8a" roughness={.4} metalness={.4} /></mesh>
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
  const { gl } = useThree();
  useEffect(() => {
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    onReady();
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onReady, onFailure]);
  return null;
}

export default function FuelScene({ active, onReady, onFailure }) {
  return <div className="fuel-canvas" aria-hidden="true">
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, .3, 6.4], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}>
      <StudioLighting />
      <group rotation={[.1, -.25, -.22]} position={[0, -.08, 0]}>{MODEL_URL ? <ExternalModel active={active} /> : <Shaker />}</group>
      <Lifecycle onReady={onReady} onFailure={onFailure} />
    </Canvas>
  </div>;
}

