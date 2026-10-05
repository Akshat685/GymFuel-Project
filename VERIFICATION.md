# GymFuel live 3D verification

Verified 5 October 2026 on branch `codex/gymfuel-live-3d`.

## Delivered

The sign-in page has one real-time WebGL centerpiece: a procedural GymFuel shaker with a shaped blue body, ribbed lid, metal collar, carry loop, locally generated label, and baked studio illumination. Pointer parallax, horizontal touch drag with inertia, a cursor-following highlight, and damped native-scroll camera movement all affect actual 3D geometry. HTML rotate and pause controls support keyboards. The canvas is decorative and hidden from assistive technology; form content remains HTML.

React 18, React Router 6, Redux, the existing blue palette, system fonts, and CRA/npm were retained. Authentication, backend code, authenticated pages, and route behavior were not changed. Login dispatch and the token/dashboard flow have regression coverage.

The entire renderer is dynamically imported behind Suspense after visibility and idle checks. A CSS shaker poster reserves space during loading and replaces the scene for reduced motion, Save-Data, clearly low-end devices, unsupported WebGL2, loading failures, and context loss. Rendering pauses offscreen, when the document is hidden, and when paused by the user. Rendering density adapts between 1 and 1.25 on mobile, and 1 and 1.5 on desktop. No postprocessing, real-time shadows, scroll library, external fonts, audio, video, or GIFs were added.

## Files

- `frontend/src/Pages/Login.jsx`: integrated split layout, existing authentication, accessible form labels, password visibility, skip link.
- `frontend/src/styles/FuelLogin.css`: scoped visual design, responsive framing, CSS poster, visible focus, reduced-motion styles.
- `frontend/src/components/fuel/FuelHero.jsx`: lazy loading, capability checks, visibility lifecycle, pointer/touch input, HTML controls, error boundary.
- `frontend/src/components/fuel/FuelScene.jsx`: procedural meshes, instanced cap ribs, lighting map, materials, responsive/adaptive renderer, damping, optional GLB animations, context handling and resource disposal.
- `frontend/src/components/fuel/studio-map.json` and `frontend/public/fuel-studio.bin`: generated environment dimensions and lighting data.
- `frontend/public/index.html`: GymFuel title, description, theme color.
- `frontend/src/App.test.js`: replaces the obsolete CRA sample test with five meaningful login/fallback regressions.
- `frontend/package.json`, `frontend/package-lock.json`, `frontend/.npmrc`, `frontend/.gitignore`: dependencies, verification commands, browser-only peer resolution and ignored generated output.
- `frontend/scripts/fiber-timer.cjs`: version-checked, idempotent Fiber 8 compatibility adapter using Three.Timer instead of deprecated Clock; run automatically before start/build/test. Revisit when upgrading Fiber or React.
- `frontend/scripts/bake-studio.cjs`: rebuilds the lighting asset locally with Three.js and Chrome.
- `frontend/scripts/smoke.cjs`, `motion-check.cjs`, `measure-fps.cjs`, `verify-scene.cjs`, `final-checks.cjs`, `bundle-sizes.cjs`, `lighthouse.cjs`, `serve-build.cjs`: reproducible verification and local production preview.
- `ASSETS.md`: asset provenance and GLB replacement instructions.

## Dependencies

Production: `three@0.186.1` (latest stable returned by npm), `@react-three/fiber@8.18.0` (React 18 renderer), and `@react-three/drei@9.122.0` (PerformanceMonitor, GLB loading and animation support). Three.js, Fiber and Drei are MIT-licensed. WebGLRenderer fits this React 18/CRA stack without a renderer or React migration. No custom shaders are needed.

Development: `@playwright/test@1.63.0` for Chrome verification and `lighthouse@13.5.0` for the production audit. `.npmrc` uses legacy peer resolution because Fiber's optional native/Expo peers otherwise cause npm 11 to pull conflicting React Native type dependencies into this browser-only application.

## Run

From `frontend`:

```powershell
npm ci
npm start
```

Development: http://localhost:3000. Production preview:

```powershell
npm run build
npm run preview
```

Preview: http://127.0.0.1:3001. Enable gzip/Brotli for JS, CSS and the binary lighting map on the deployment host; uncompressed scene payload still remains under 3 MB.

With the development server running and local Chrome installed:

```powershell
npm run verify:3d
npm run lint:3d
npm test -- --watchAll=false --runInBand
```

With both servers running: `node scripts/final-checks.cjs`. With production preview running: `node scripts/lighthouse.cjs`. `node scripts/bundle-sizes.cjs` measures the build. `node scripts/bake-studio.cjs` rebuilds lighting. Optional software-renderer testing: set `$env:SOFTWARE='1'` before `npm run verify:3d`.

## Measured results

Chrome with actual Intel UHD Graphics through ANGLE/D3D11, headless with WebGL enabled. These are local lab measurements, not field data or measurements from a physical phone.

- Desktop 1440 x 900: 59–60 FPS after warm-up (initial sample 54.6), 10 draw calls, 5,120 triangles.
- Mobile viewport 390 x 844: 59.9–60.1 FPS after warm-up (initial sample 58.4), 10 draw calls, 5,120 triangles.
- Mobile viewport with 4x CPU slowdown and 1.6 Mbps / 150 ms network: about 60 FPS after warm-up, initial sample 28.6 FPS. The scene remained usable.
- Final comprehensive browser run: zero console errors and zero warnings, including zero Three.js deprecation warnings.
- Pixel comparisons verify that animation changes actual canvas pixels, pause freezes the rendering, and keyboard rotation changes the object. Production tests additionally exercise real touch events and the skip link. Visibility-change simulation verifies pause/resume, and scrolling the scene outside the viewport stops frame counting.
- Reduced motion, Save-Data, low-end device simulation, actual `--disable-webgl`, and forced WebGL context loss all show the poster. Inputs remain usable.
- Screenshots at the exact requested CSS viewport sizes show no horizontal overflow, clipped model, or copy/CTA overlap. Full-page and form screenshots were also inspected. Measured CLS is below 0.00002; Lighthouse reports 0.
- `npm run build`: passes. Existing Material Dashboard CSS calculation warnings and existing source warnings remain.
- `npm run lint:3d`: passes with zero errors/warnings in changed source/test files.
- Jest: all 5 tests pass. The existing Testing Library 13 emits a React act deprecation; CRA's Babel preset emits a dependency warning/timer diagnostic. These are test/toolchain messages, not browser scene errors.
- Full `npm run lint`: three pre-existing missing-hook-import errors in unused `src/routes/AppRouter.jsx`, plus six pre-existing warnings in Dashboard, Navbar, and SideBar. No unrelated pages were rewritten to conceal these.
- Typecheck: not configured; this is a JavaScript/JSX project, with no TypeScript configuration or typecheck script.

Production payload (gzip): Three/Fiber/Drei lazy vendor chunk 257,995 bytes; scene chunk 2,527 bytes; studio map 112,370 bytes. Total new scene payload: 372,892 bytes, about 364 KiB compressed / 1.69 MB raw. Procedural geometry and the label require no separate model or image download. Existing initial application JS is 213,526 bytes gzip; combined CSS is about 99 kB gzip.

Final Lighthouse mobile audit of the production preview: **Performance 64, Accessibility 100, Best Practices 100, SEO 100**. FCP 1.2 s, LCP 4.6 s, TBT 800 ms, CLS 0, Speed Index 2.4 s, total transferred approximately 677 KiB. Baking the environment reduced TBT from the earlier 3,950 ms to 800 ms. Mobile startup still needs improvement: the existing main bundle eagerly includes authenticated screens and the large Material Dashboard stylesheet. Smooth scene animation does not imply a perfect loading-performance score.

Raw results, screenshots, sizes, and Lighthouse HTML/JSON reports are generated under `frontend/verification/` and intentionally ignored by Git. FPS instrumentation is opt-in at `/?sceneDebug=1` in development only and is stripped from the production build; no Stats overlay ships.

## Asset replacement and limitations

There is no supplied GLB. All shaker geometry, label, and CSS poster were authored for this project. The lighting map is generated from Three.js's MIT-licensed RoomEnvironment, with no external asset download. See `ASSETS.md`.

To replace the model, change `MODEL_URL` in FuelScene.jsx to a public, centered Y-up GLB around 2.8 units tall. Embedded animation clips play only while active. Optimize a replacement to at most 1.5 MB and configure any Draco/KTX2 decoder it requires. The placeholder uses no Draco/KTX2 decoder because no compressed GLB currently exists.

Real mid-range Android/iOS device testing remains necessary before claiming physical mobile performance. Authentication success/error behavior was tested with mocked API responses; live backend account access was not exercised. The Three/Fiber adapter is explicitly pinned and fails fast if Fiber changes.

Optional next upgrades: route-split the authenticated application and consolidate legacy CSS; replace the procedural shaker with a licensed custom GLB; profile memory/thermal behavior on representative physical Android and iOS devices.
