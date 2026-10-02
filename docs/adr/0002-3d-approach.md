# ADR 0002: A flat, unlit 3D booth with a static fallback

Date: 2026-10-02. Status: accepted.

## Context

The booth is the hero. It must look exactly like the flat renders: orthographic, unlit, seven colours, a black outline, no lighting, no environment maps and no shadows.

## Decision

- react-three-fiber with drei. An `OrthographicCamera`, `MeshBasicMaterial` per palette colour mapped from the GLB material names, and drei `<Outlines>` (an inverted hull) in black.
- The GLB hierarchy is rebuilt as JSX so every named part is a group that the explode logic can move. Explode offsets and view angles are pure functions in `src/lib/` with unit tests.
- The GLB is compressed with meshopt (460 KB to 104 KB). UVs are removed because the model is untextured.
- The viewer is a lazy chunk. It loads only when the booth section is near the viewport, and only when WebGL exists and motion is not reduced. The GLB fetch has a 15 s timeout, 3 retries with backoff and a session circuit breaker.
- The fallback is the static renders. The view buttons still work in the fallback.

## Consequences

- The three.js chunk is about 340 KB gzipped. It never loads on the first paint and never on reduced-motion devices.
- The CSP needs `'wasm-unsafe-eval'` for the meshopt decoder. It does not need `'unsafe-eval'`.
