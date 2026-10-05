# GymFuel 3D assets

- Shaker model: original procedural geometry created for this project. No external model or texture downloads and no third-party asset attribution required. Uses the repository's licensing terms.
- Label: generated locally with the system Arial font, using GymFuel brand text. No font files are distributed.
- Static fallback: original CSS illustration; no image download.
- Studio lighting: generated with Three.js RoomEnvironment (Three.js MIT license). The environment is generated at runtime, not downloaded.
- Three.js, React Three Fiber and Drei: MIT-licensed dependencies; dependency notices remain in the production bundle.

To replace the shaker, set MODEL_URL in frontend/src/components/fuel/FuelScene.jsx to a local public GLB URL. Center the asset at the origin, use Y-up, and size it to roughly 2.8 units tall. Embedded animation clips play while the scene is active. Keep the GLB at or below 1.5 MB; optimize using glTF Transform and validate any required decoder configuration. Record the replacement asset's author, URL, and license here before shipping it.
