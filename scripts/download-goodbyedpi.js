const https = require('https');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

const TOOLS_DIR = path.join(__dirname, '..', 'electron', 'tools', 'goodbyedpi');
const TEMP_ZIP = path.join(__dirname, '..', 'temp', 'goodbyedpi.zip');

async function getLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/ValdikSS/GoodbyeDPI/releases/latest',
      headers: { 'User-Agent': 'Shroudly' }
    };

    https.get(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const release = JSON.parse(data);
          // Find any .zip asset
          const asset = release.assets.find(a => a.name.endsWith('.zip'));
          if (asset) {
            resolve({
              version: release.tag_name,
              downloadUrl: asset.browser_download_url,
              name: asset.name
            });
          } else {
            // Fallback to hardcoded URL
            resolve({
              version: 'v0.2.3rc3',
              downloadUrl: 'https://github.com/ValdikSS/GoodbyeDPI/releases/download/0.2.3rc3/goodbyedpi-0.2.3rc3.zip',
              name: 'goodbyedpi-0.2.3rc3.zip'
            });
          }
        } catch (err) {
          // Fallback to hardcoded URL
          resolve({
            version: 'v0.2.3rc3',
            downloadUrl: 'https://github.com/ValdikSS/GoodbyeDPI/releases/download/0.2.3rc3/goodbyedpi-0.2.3rc3.zip',
            name: 'goodbyedpi-0.2.3rc3.zip'
          });
        }
      });
    }).on('error', () => {
      // Fallback to hardcoded URL
      resolve({
        version: 'v0.2.3rc3',
        downloadUrl: 'https://github.com/ValdikSS/GoodbyeDPI/releases/download/0.2.3rc3/goodbyedpi-0.2.3rc3.zip',
        name: 'goodbyedpi-0.2.3rc3.zip'
      });
    });
  });
}

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Shroudly' },
      followAllRedirects: true 
    }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function extractZip(zipPath, destPath) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(destPath, true);
}

async function setup() {
  console.log('🔧 Shroudly - GoodbyeDPI Auto Setup');
  console.log('=====================================\n');

  // Check if already exists
  const exePath = path.join(TOOLS_DIR, 'goodbyedpi.exe');
  if (fs.existsSync(exePath)) {
    console.log('✅ GoodbyeDPI already installed!');
    console.log(`📍 Location: ${TOOLS_DIR}\n`);
    return;
  }

  try {
    // Get latest release info
    console.log('🔍 Fetching latest GoodbyeDPI release...');
    const release = await getLatestRelease();
    console.log(`📦 Found: ${release.version}`);
    console.log(`📁 File: ${release.name}\n`);

    // Create directories
    console.log('📁 Creating directories...');
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    if (!fs.existsSync(TOOLS_DIR)) {
      fs.mkdirSync(TOOLS_DIR, { recursive: true });
    }

    // Download
    console.log(`⬇️  Downloading GoodbyeDPI...`);
    console.log(`📡 URL: ${release.downloadUrl}\n`);
    await downloadFile(release.downloadUrl, TEMP_ZIP);
    console.log('✅ Download complete!\n');

    // Extract
    console.log('📦 Extracting files...');
    const extractPath = path.join(tempDir, 'goodbyedpi_extracted');
    await extractZip(TEMP_ZIP, extractPath);

    // Find and copy files
    console.log('📋 Copying files to tools directory...');
    const extracted = fs.readdirSync(extractPath);
    let sourceDir = extractPath;
    
    // Look for x86_64 folder
    for (const item of extracted) {
      const itemPath = path.join(extractPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const x64Path = path.join(itemPath, 'x86_64');
        if (fs.existsSync(x64Path)) {
          sourceDir = x64Path;
          break;
        }
      }
    }
    
    copyRecursive(sourceDir, TOOLS_DIR);

    // Cleanup
    console.log('🧹 Cleaning up temporary files...');
    fs.unlinkSync(TEMP_ZIP);
    fs.rmSync(extractPath, { recursive: true, force: true });

    console.log('\n=====================================');
    console.log('✅ SUCCESS! GoodbyeDPI installed!');
    console.log('=====================================');
    console.log(`📍 Location: ${TOOLS_DIR}`);
    console.log(`📦 Version: ${release.version}`);
    console.log('\n🚀 You can now run: npm run electron:dev\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n📥 Please manually download from:');
    console.log('https://github.com/ValdikSS/GoodbyeDPI/releases\n');
    process.exit(1);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

setup();
