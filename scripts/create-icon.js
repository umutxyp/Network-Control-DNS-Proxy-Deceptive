const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function createIcon() {
  console.log(' Creating Windows icon from logo.png...');
  
  const logoPath = path.join(__dirname, '../public/logo.png');
  const outputPath = path.join(__dirname, '../public/icon.ico');
  
  if (!fs.existsSync(logoPath)) {
    console.error(' logo.png not found!');
    return;
  }

  try {
    const image = await loadImage(logoPath);
    console.log(` Original image: ${image.width}x${image.height}`);

    const sizes = [256, 128, 96, 64, 48, 32, 24, 16];
    const iconData = [];

    for (const size of sizes) {
      console.log(`  Creating ${size}x${size} version...`);
      
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, size, size);
      
      const pngBuffer = canvas.toBuffer('image/png', { compressionLevel: 9 });
      iconData.push({ size, data: pngBuffer });
    }

    console.log(' Building ICO file...');
    const icoBuffer = createIcoBuffer(iconData);
    
    fs.writeFileSync(outputPath, icoBuffer);
    console.log(` Icon created: ${outputPath}`);
    console.log(` Size: ${(icoBuffer.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
}

function createIcoBuffer(iconData) {
  const numImages = iconData.length;
  const headerSize = 6 + (numImages * 16);
  
  let totalSize = headerSize;
  iconData.forEach(icon => { totalSize += icon.data.length; });

  const buffer = Buffer.alloc(totalSize);
  let offset = 0;

  buffer.writeUInt16LE(0, offset); offset += 2;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numImages, offset); offset += 2;

  let imageOffset = headerSize;
  iconData.forEach(icon => {
    const size = icon.size;
    const imageSize = icon.data.length;

    buffer.writeUInt8(size >= 256 ? 0 : size, offset++);
    buffer.writeUInt8(size >= 256 ? 0 : size, offset++);
    buffer.writeUInt8(0, offset++);
    buffer.writeUInt8(0, offset++);
    buffer.writeUInt16LE(1, offset); offset += 2;
    buffer.writeUInt16LE(32, offset); offset += 2;
    buffer.writeUInt32LE(imageSize, offset); offset += 4;
    buffer.writeUInt32LE(imageOffset, offset); offset += 4;

    imageOffset += imageSize;
  });

  iconData.forEach(icon => {
    icon.data.copy(buffer, offset);
    offset += icon.data.length;
  });

  return buffer;
}

createIcon();
