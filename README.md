<div align="center">
  <img src="public/logo.png" alt="Shroudly Logo" width="200"/>
  
  #  Shroudly
  
  **Unseen. Unstoppable.**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Electron](https://img.shields.io/badge/Electron-33.3.1-47848F?logo=electron)](https://www.electronjs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
  
  > A powerful DPI (Deep Packet Inspection) bypass application for Windows.  
  > Break free from internet censorship with cutting-edge network manipulation techniques.
  
  **A Codeshare Technology Ltd Product** | [codeshare.me](https://codeshare.me)
</div>

---

##  What is Shroudly?

Shroudly is an advanced internet freedom tool designed to bypass Deep Packet Inspection (DPI) based censorship. Unlike basic DNS changing tools, Shroudly uses sophisticated packet manipulation techniques to ensure unrestricted access to the internet.

### Why Shroudly?

- **Advanced DPI Bypass**: Multiple techniques including packet fragmentation, TTL manipulation, SNI fragmentation
- **User-Friendly**: Modern interface with real-time statistics and full control
- **Multi-Language**: Support for 15 languages worldwide
- **Open Source**: Transparent, auditable code you can trust
- **Privacy Focused**: No tracking, no data collection, completely local
- **Professional**: Enterprise-grade tool from Codeshare Technology Ltd

---

##  Features

###  Core DPI Bypass Techniques

 **HTTP/HTTPS Fragmentation** - Split packets to evade DPI inspection  
 **SNI Fragmentation** - Fragment Server Name Indication in HTTPS handshake  
 **TTL Manipulation** - Modify Time-to-Live values to bypass DPI devices  
 **Fake SNI Packets** - Send decoy packets to confuse DPI systems  
 **Wrong Checksum** - Use incorrect checksums on fake packets  
 **Wrong Sequence Numbers** - Manipulate TCP sequence numbers  
 **Reverse Fragmentation** - Advanced fragmentation ordering  
 **Native Fragmentation** - OS-level packet fragmentation  
 **DNS Switching** - Custom DNS servers (Cloudflare, Google, etc.)  
 **MTU Modification** - Adjust Maximum Transmission Unit  
 **Aggressive Mode** - Maximum bypass power when needed

###  User Interface

-  **Modern Dark Theme** - Beautiful gradient UI with Tailwind CSS
-  **Real-time Statistics** - Monitor packets, data, and connections live
-  **Advanced Settings** - Full control over all DPI techniques
-  **System Logs** - Color-coded logs with filtering capabilities
-  **15 Languages** - English, Turkish, Spanish, French, German, and more
-  **Status Indicators** - Green/Red dots on taskbar and system tray
-  **Auto Mode** - Automatic startup on application launch
-  **Start on Boot** - Optional Windows startup integration

###  Security & Privacy

-  **No Data Collection** - All operations are completely local
-  **Open Source** - Full transparency, audit the code yourself
-  **Admin Rights** - Required only for network modifications
-  **DNS Security** - Optional custom DNS with poison protection
-  **Local Storage** - Settings stored locally with electron-store

---

##  Supported Languages

 English   Turkish   Spanish   French   German   Italian  
 Portuguese   Russian   Chinese   Japanese   Korean  
 Arabic   Hindi   Dutch   Polish

---

##  Installation

### Option 1: Pre-built Binaries (Recommended)

Download the latest release from [Releases](https://github.com/umutxyp/Shroudly/releases)

1. Download `Shroudly-Setup-X.X.X.exe`
2. Run the installer
3. Launch Shroudly (admin rights will be requested)
4. Click START and enjoy unrestricted internet!

### Option 2: Build from Source

**Prerequisites:**
- Windows 10/11 (64-bit)
- Node.js 20+
- Git

**Steps:**

```bash
# Clone the repository
git clone https://github.com/umutxyp/Shroudly.git
cd Shroudly

# Install dependencies (automatically downloads GoodbyeDPI)
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run electron:build
```

Output: `dist/Shroudly Setup X.X.X.exe`

---

##  How It Works

Shroudly works by intercepting and manipulating network packets before they reach DPI devices:

```
Normal Request (Blocked):
[Your PC]  [DPI Device:  BLOCKED]  [Website]

With Shroudly (Success):
[Your PC]  [Shroudly Engine]  [Fragmented Packets]  [DPI Device: ]  [Website]
```

### Techniques Explained

1. **HTTP Fragmentation**: Splits HTTP requests into tiny fragments that DPI can't reassemble
2. **SNI Fragmentation**: Breaks the Server Name Indication field in HTTPS handshakes
3. **TTL Manipulation**: Sets packet TTL so they expire at DPI device but are retransmitted
4. **Fake Packets**: Sends decoy packets with wrong checksums to poison DPI caches
5. **DNS Protection**: Uses encrypted/custom DNS to prevent DNS-based blocking

---

##  Usage Guide

### Quick Start

1. **Launch Shroudly** (automatically requests admin rights)
2. **Auto Mode** - DPI bypass starts automatically (default)
3. **Monitor** - View real-time stats on Status Display
4. **Customize** - Adjust settings in Settings Panel if needed

### Status Indicators

**Taskbar Icon:**
-  Green dot = DPI bypass active
-  Red dot = DPI bypass inactive

**System Tray:**
- Icon with status dot
- Right-click for quick menu
- Click to restore window

---

##  Development

### Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Desktop:** Electron 33
- **DPI Bypass:** GoodbyeDPI, WinDivert, PowerShell
- **Build:** electron-builder (NSIS installer)
- **Storage:** electron-store
- **Icons:** Canvas (dynamic generation)

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run electron:dev     # Start Electron with hot reload

# Production
npm run build            # Build Next.js for production
npm run electron:build   # Create Windows installer

# Utilities
npm run setup            # Download GoodbyeDPI manually
```

---

##  Shroudly vs GoodbyeDPI

| Feature | Shroudly | GoodbyeDPI |
|---------|----------|------------|
| **User Interface** |  Modern GUI |  Command-line only |
| **Real-time Stats** |  Yes |  No |
| **Settings GUI** |  Full control |  Complex CLI args |
| **Multi-language** |  15 languages |  English only |
| **Auto Mode** |  Yes |  Manual setup |
| **System Tray** |  Yes |  No |
| **Status Indicators** |  Taskbar + Tray |  No |
| **Logs Panel** |  Color-coded GUI |  Console only |

---

##  Troubleshooting

### "Administrator privileges required"
- Right-click Shroudly  Run as Administrator
- Or use the auto-elevation prompt in the app

### GoodbyeDPI not found
```bash
npm run setup
```

### Build errors
```bash
rm -rf node_modules .next out dist
npm install
npm run build
```

---

##  Legal & Responsible Use

Shroudly is designed to help users access the free and open internet in regions with unjust censorship.

 **Accessing legitimately blocked services** (Discord, YouTube, social media)  
 **Bypassing restrictive network policies** (schools, workplaces with fair use)  
 **Protecting your internet freedom**  
 **Educational and research purposes**

 **DO NOT** use for illegal activities, bypassing legitimate security, or malicious purposes

**Users are solely responsible for their actions. Use at your own risk and in accordance with local laws.**

---

##  License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

##  Author

**Codeshare Technology Ltd**  
Website: [codeshare.me](https://codeshare.me)  
GitHub: [@umutxyp](https://github.com/umutxyp)

---

##  Acknowledgments

- [GoodbyeDPI](https://github.com/ValdikSS/GoodbyeDPI) - DPI bypass engine
- [WinDivert](https://github.com/basil00/Divert) - Kernel-level packet manipulation
- [Electron](https://www.electronjs.org/) - Desktop application framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - UI styling

---

##  Support

- **GitHub Issues**: [Report a bug](https://github.com/umutxyp/Shroudly/issues)
- **Website**: [codeshare.me](https://codeshare.me)
- **Email**: support@codeshare.me

---

##  Disclaimer

This tool is provided for educational and research purposes only. The authors and Codeshare Technology Ltd are not responsible for any misuse or legal consequences arising from the use of this software. Users must comply with all applicable laws and regulations in their jurisdiction.

---

##  Star History

[![Star History Chart](https://api.star-history.com/svg?repos=umutxyp/Shroudly&type=Date)](https://star-history.com/#umutxyp/Shroudly&Date)

---

<div align="center">
  
  **Shroudly - Unseen. Unstoppable.**
  
  *A Codeshare Technology Ltd Product*
  
  Made with  for a free and open internet
  
</div>
