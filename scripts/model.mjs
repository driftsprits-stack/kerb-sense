// Compresses the booth GLB with meshopt and quantisation.
// Node names are kept so the viewer can explode and label each part.
// UVs are removed because the model is unlit and has no textures.
// Run: npm run assets
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize, reorder, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { mkdir, stat } from 'node:fs/promises';

const input = new URL('../website-handoff/assets/models/booth-flat.glb', import.meta.url).pathname;
const outDir = new URL('../public/models/', import.meta.url).pathname;
const output = outDir + 'booth-flat.glb';

await mkdir(outDir, { recursive: true });
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(input);

// Strip texture coordinates: no textures, no lighting.
for (const mesh of document.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const uv = prim.getAttribute('TEXCOORD_0');
    if (uv) {
      prim.setAttribute('TEXCOORD_0', null);
      uv.dispose();
    }
  }
}

await document.transform(
  dedup(),
  prune(),
  reorder({ encoder: MeshoptEncoder }),
  quantize({ quantizePosition: 14, quantizeNormal: 8 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);

await io.write(output, document);
const before = (await stat(input)).size;
const after = (await stat(output)).size;
console.log(`booth-flat.glb ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
if (after > 1024 * 1024) {
  console.error('The GLB is over 1 MB.');
  process.exit(1);
}
const names = document
  .getRoot()
  .listNodes()
  .map((n) => n.getName())
  .sort();
console.log('nodes:', names.join(', '));
