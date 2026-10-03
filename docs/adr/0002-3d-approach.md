# ADR 0002: A flat, unlit 3D booth with a static fallback

Date: 2026-10-02. Revised 2026-10-03. Status: accepted.

## Context

The booth is the hero object and the signature interaction. It must look like the flat renders: orthographic, unlit, four colours, a black outline, no lighting, no environment maps and no shadows. The catalogue and the model must select the same part (A7). The scroll scene must drive it (ADR 0008).

## Decision

- react-three-fiber with drei. An orthographic Canvas camera, `MeshBasicMaterial` per palette colour mapped from the GLB material names (`kerb_white`, `kerb_black`, `kerb_green`), and drei `<Outlines>` (an inverted hull) in black. With an orthographic camera the outline thickness is in pixels: 2 px, or 4 px in green for the selected part.
- The zoom follows the stage height (`0.92 m` visible), set in the frame loop, so the booth fills the stage at every size and nothing resets the camera on a resize.
- The GLB hierarchy is rebuilt as JSX so every named part is a group that the explode logic can move. An unnamed mesh belongs to its nearest named ancestor, so the joystick body selects the joystick. Explode offsets, part names, purposes and view angles are pure functions in `src/lib/` with unit tests.
- The GLB is compressed with meshopt (460 KB to 104 KB). UVs are removed because the model is untextured.
- Selection is one state in `src/sections/Booth.tsx`. The catalogue buttons (`aria-pressed`), the model's click and hover, the scene labels and the readout all read and write it.
- The viewer is a lazy chunk. It loads only when a stage is near the viewport, and only when WebGL exists and motion is not reduced. The GLB fetch has a 15 s timeout, 3 retries with backoff and a session circuit breaker.
- The hero shows the product render as a poster and swaps in a second live viewer when it has loaded.
- The fallback is the static light renders as SVG. The view buttons still work in the fallback, and the part names and purposes are listed for screen readers.

## Consequences

- The three.js chunk is about 270 KB gzipped. It never loads on the first paint and never on reduced-motion devices.
- The CSP needs `'wasm-unsafe-eval'` for the meshopt decoder. It does not need `'unsafe-eval'`.
- The stage ground is paper, so the white cabinet reads against it with its outline.
