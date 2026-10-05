import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function FuelScene({ active, onReady, onFailure }) {
  return <div className="fuel-canvas" aria-hidden="true">
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 36 }}
      onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true }); onReady(); }}>
      <ambientLight intensity={2} />
    </Canvas>
  </div>;
}
