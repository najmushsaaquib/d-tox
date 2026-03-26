import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const conceptsDir = path.join(__dirname, '../public/concepts');
const outDir = path.join(__dirname, '../dist/chrome-mv3/concepts');

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.svg') && f.startsWith('pill-'));

async function main() {
  for (const file of files) {
    const name = file.replace('.svg', '');
    const svgPath = path.join(conceptsDir, file);
    const pngPath = path.join(outDir, `${name}.png`);

    await sharp(svgPath).resize(128, 128).png().toFile(pngPath);
    console.log(`✓ ${name}.png`);
  }
  console.log('\nDone!');
}

main();
