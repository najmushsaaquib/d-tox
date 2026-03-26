import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const sizes = [16, 48, 128];

async function generateIcons() {
  const activeSvg = readFileSync(resolve(root, 'assets/icon-active.svg'));
  const pausedSvg = readFileSync(resolve(root, 'assets/icon-paused.svg'));

  for (const size of sizes) {
    // Active icons → public/ (used when extension is ON)
    await sharp(activeSvg)
      .resize(size, size)
      .png()
      .toFile(resolve(root, `public/icon-${size}.png`));
    console.log(`✓ icon-${size}.png (active)`);

    // Paused icons → public/paused/ (used when extension is OFF)
    await sharp(pausedSvg)
      .resize(size, size)
      .png()
      .toFile(resolve(root, `public/icon-paused-${size}.png`));
    console.log(`✓ icon-paused-${size}.png`);
  }

  console.log('\nAll icons generated.');
}

generateIcons().catch(console.error);
