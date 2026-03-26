import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 48, 128];
const publicDir = path.join(__dirname, '../public');

async function convertSvgToPng(svgFile, outputBase) {
  for (const size of sizes) {
    const outputFile = path.join(publicDir, `${outputBase}-${size}.png`);

    try {
      await sharp(svgFile)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(outputFile);
      console.log(`✓ Created ${outputBase}-${size}.png`);
    } catch (err) {
      console.error(`✗ Failed to create ${outputBase}-${size}.png:`, err.message);
    }
  }
}

async function main() {
  console.log('Generating icon PNGs from SVGs...\n');

  await convertSvgToPng(path.join(publicDir, 'icon.svg'), 'icon');
  await convertSvgToPng(path.join(publicDir, 'icon-gray.svg'), 'icon-gray');

  console.log('\nDone! PNG icons generated.');
}

main();
