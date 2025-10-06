# 🛡️ Shroudly - Unseen. Unstoppable.# Shroudly



[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)![Shroudly Logo](ShroudlyLogo-1x1.png)

[![Electron](https://img.shields.io/badge/Electron-33.3.1-47848F?logo=electron)](https://www.electronjs.org/)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js)](https://nextjs.org/)**Unseen. Unstoppable.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)

> A next-generation DPI (Deep Packet Inspection) bypass tool by Codeshare Technology Ltd

> A powerful DPI (Deep Packet Inspection) bypass application for Windows. Break free from internet censorship and access restricted content with cutting-edge network manipulation techniques.

---

**A Codeshare Technology Ltd Product** | [codeshare.me](https://codeshare.me)

## 🛡️ What is Shroudly?

---

Shroudly is an advanced internet freedom tool designed to bypass Deep Packet Inspection (DPI) based censorship. Unlike basic DNS changing tools, Shroudly uses sophisticated packet manipulation techniques to ensure unrestricted access to the internet.

## ✨ Features

### Why Shroudly?

### 🚀 Core Capabilities

- **GoodbyeDPI Integration** - Industry-standard DPI bypass using WinDivert- **Advanced DPI Bypass**: Uses multiple techniques including packet fragmentation, TTL manipulation, SNI fragmentation, and fake packets

- **Custom PowerShell Fallback** - Built-in alternative methods when GoodbyeDPI unavailable- **Better than GoodbyeDPI**: More user-friendly interface, better statistics, and advanced configuration options

- **Hybrid Architecture** - Combines multiple techniques for maximum success rate- **Full User Control**: Configure every aspect of the DPI bypass engine

- **Real-time Statistics** - Live packet counting and connection monitoring- **50+ Languages**: Truly global support with 50+ language translations

- **Auto Mode** - Automatic startup on application launch- **Modern UI**: Beautiful, intuitive interface built with Next.js and Tailwind CSS

- **Privacy Focused**: No tracking, no data collection, open source

### 🔧 DPI Bypass Techniques- **Professional**: Enterprise-grade tool from Codeshare Technology Ltd

- ✅ HTTP/HTTPS Packet Fragmentation

- ✅ SNI (Server Name Indication) Fragmentation---

- ✅ TTL (Time To Live) Manipulation

- ✅ Fake Packet Injection with Wrong Checksums## 🚀 Features

- ✅ Wrong Sequence Numbers

- ✅ Reverse Fragmentation### Core DPI Bypass Techniques

- ✅ DNS Switching (Cloudflare 1.1.1.1, Google 8.8.8.8)

- ✅ MTU (Maximum Transmission Unit) Modification✅ **HTTP Fragmentation** - Split HTTP packets to evade DPI inspection  

- ✅ Native & Aggressive Modes✅ **HTTPS/SNI Fragmentation** - Fragment Server Name Indication in HTTPS handshake  

✅ **TTL Manipulation** - Modify Time-to-Live values to bypass DPI devices  

### 🎨 User Interface✅ **Fake SNI Packets** - Send decoy packets to confuse DPI systems  

- **Modern Dark Theme** - Beautiful gradient UI with Tailwind CSS✅ **Wrong Checksum** - Use incorrect checksums on fake packets  

- **Multi-language Support** - 15 languages (English, Turkish, Spanish, French, German, etc.)✅ **Native Fragmentation** - OS-level packet fragmentation  

- **Status Indicators** - Green/Red dots on taskbar and system tray✅ **DNS over HTTPS** - Secure DNS resolution  

- **Real-time Logs** - Color-coded system logs with filtering✅ **Custom DNS** - Use your preferred DNS servers  

- **Advanced Settings** - Fine-tune all DPI bypass parameters

### User Features

### 🔔 System Integration

- **System Tray** - Minimize to tray, click to restore- 🎨 **Modern, Beautiful UI** - Clean interface with dark theme

- **Start on Boot** - Auto-launch with Windows (optional)- 📊 **Real-time Statistics** - Monitor packets, data, and connections

- **Admin Rights Management** - Automatic elevation prompts- ⚙️ **Advanced Settings** - Full control over all DPI techniques

- **Notifications** - Desktop notifications for status changes- 🌍 **50+ Languages** - Support for languages worldwide

- 📝 **System Logs** - Track all operations and errors

---- 🔄 **Auto Mode** - Automatically detect and apply best settings

- ⚡ **Aggressive Mode** - Maximum bypass power when needed

## 🌍 Supported Languages- 🚀 **Start on Boot** - Automatic protection from system startup

- 🔔 **System Tray** - Minimize to tray and control from taskbar

🇬🇧 English | 🇹🇷 Turkish | 🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German | 🇮🇹 Italian  

🇵🇹 Portuguese | 🇷🇺 Russian | 🇨🇳 Chinese | 🇯🇵 Japanese | 🇰🇷 Korean  ---

🇸🇦 Arabic | 🇮🇳 Hindi | 🇳🇱 Dutch | 🇵🇱 Polish

## 📥 Installation

---

### Pre-built Binaries

## 📦 Installation

Download the latest release from [Releases](https://github.com/umutxyp/Shroudly/releases)

### Prerequisites

- **Windows 10/11** (64-bit)### Build from Source

- **Node.js 20+** (for development)

- **Administrator Rights** (required for network manipulation)```bash

# Clone the repository

### Quick Startgit clone https://github.com/umutxyp/Shroudly.git

cd Shroudly

1. **Clone the repository**

```bash# Install dependencies

git clone https://github.com/umutxyp/Shroudly.gitnpm install

cd Shroudly

```# Development mode

npm run electron:dev

2. **Install dependencies**

```bash# Build for production

npm installnpm run electron:build

``````

> This automatically downloads GoodbyeDPI via postinstall hook

---

3. **Run in development mode**

```bash## 🎯 How It Works

npm run electron:dev

```Shroudly works by intercepting and manipulating network packets before they reach DPI devices:



4. **Build for production**```

```bashNormal Request (Blocked):

npm run electron:build[Your PC] → [DPI Device: BLOCKED] → [Website]

```

> Output: `dist/Shroudly Setup X.X.X.exe`With Shroudly (Success):

[Your PC] → [Shroudly Engine] → [Fragmented Packets] → [DPI Device: ✓] → [Website]

---```



## 🛠️ Development### Techniques Explained



### Project Structure1. **HTTP Fragmentation**: Splits HTTP requests into tiny fragments that DPI can't reassemble

```2. **SNI Fragmentation**: Breaks the Server Name Indication field in HTTPS handshakes

Shroudly/3. **TTL Manipulation**: Sets packet TTL so they expire at DPI device but are retransmitted

├── app/                    # Next.js pages4. **Fake Packets**: Sends decoy packets with wrong checksums to poison DPI caches

│   ├── page.js            # Main application page5. **DNS Protection**: Uses encrypted DNS to prevent DNS-based blocking

│   ├── layout.js          # Root layout

│   └── globals.css        # Global styles---

├── components/            # React components

│   ├── ControlPanel.js   # DPI control interface## 🔧 Configuration

│   ├── SettingsPanel.js  # Advanced settings

│   ├── StatusDisplay.js  # Real-time status### Quick Start (Recommended)

│   ├── LogsPanel.js      # System logs

│   ├── TitleBar.js       # Custom window title bar1. Open Shroudly

│   └── Toast.js          # Notification toasts2. Click **START** on the Control Panel

├── contexts/             # React contexts3. Auto Mode will detect and apply the best settings

│   └── LanguageContext.js # i18n management

├── electron/             # Electron main process### Advanced Configuration

│   ├── main.js           # Main process entry

│   ├── preload.js        # IPC bridgeNavigate to **Settings** tab to customize:

│   └── dpi-bypass.js     # DPI bypass engine

├── scripts/              # Build scripts- **DPI Bypass Techniques**: Enable/disable individual techniques

│   ├── download-goodbyedpi.js # Auto-download GoodbyeDPI- **DNS Settings**: Choose custom DNS servers

│   └── fix-paths.js      # Fix Next.js paths for Electron- **Advanced Options**: Auto mode, aggressive mode, startup behavior

├── public/               # Static assets- **Language**: Select from 50+ supported languages

├── translations.js       # All language translations

└── package.json          # Project configuration---

```

## 🌍 Supported Languages

### Available Scripts

Shroudly supports 50+ languages including:

```bash

# Development🇬🇧 English • 🇹🇷 Türkçe • 🇪🇸 Español • 🇫🇷 Français • 🇩🇪 Deutsch • 🇮🇹 Italiano • 🇵🇹 Português • 🇷🇺 Русский • 🇨🇳 中文 • 🇯🇵 日本語 • 🇰🇷 한국어 • 🇸🇦 العربية • 🇮🇳 हिन्दी • 🇧🇩 বাংলা • 🇵🇰 اردو • 🇮🇷 فارسی • and many more...

npm run dev              # Start Next.js dev server

npm run electron:dev     # Start Electron with hot reload---



# Production## ⚖️ Legal & Responsible Use

npm run build            # Build Next.js for production

npm run electron:build   # Create Windows installer**Important Notice:**



# UtilitiesShroudly is designed to help users access the free and open internet in regions with unjust censorship. This tool is for:

npm run setup            # Download GoodbyeDPI manually

```✅ **Accessing legitimately blocked services** (Discord, YouTube, social media, etc.)  

✅ **Bypassing restrictive network policies** (schools, workplaces with fair use)  

### Tech Stack✅ **Protecting your internet freedom**  

- **Frontend:** Next.js 14, React 18, Tailwind CSS✅ **Educational and research purposes**  

- **Desktop:** Electron 33

- **DPI Bypass:** GoodbyeDPI, WinDivert, PowerShell**DO NOT use this tool for:**

- **Build:** electron-builder (NSIS installer)

- **Storage:** electron-store❌ Illegal activities  

- **Icons:** Canvas (dynamic generation)❌ Bypassing legitimate security measures  

❌ Violating terms of service  

---❌ Malicious purposes  



## 🎯 Usage**Users are solely responsible for their actions. Use at your own risk and in accordance with local laws.**



### Basic Operation---



1. **Launch Shroudly** (automatically requests admin rights)## 🆚 Shroudly vs GoodbyeDPI

2. **Auto Mode** - DPI bypass starts automatically (default)

3. **Manual Control** - Use START/STOP button in Control Panel| Feature | Shroudly | GoodbyeDPI |

4. **Monitor Stats** - View real-time packet counts and connection status|---------|----------|------------|

5. **Customize** - Adjust settings in Settings Panel| **User Interface** | ✅ Modern GUI | ❌ Command-line only |

| **Real-time Stats** | ✅ Yes | ❌ No |

### Configuration| **Language Support** | ✅ 50+ languages | ❌ English only |

| **Easy Configuration** | ✅ Click-based | ❌ Command arguments |

#### Quick Settings (Control Panel)| **Auto Mode** | ✅ Yes | ❌ No |

- Enable/disable individual techniques with toggle switches| **System Tray** | ✅ Yes | ❌ No |

- Aggressive mode for maximum bypass power| **Logs & Monitoring** | ✅ Built-in | ❌ Console only |

- One-click start/stop| **Professional Support** | ✅ Codeshare Tech | ❌ Community |



#### Advanced Settings (Settings Panel)---

- Fragment Size (1-10)

- TTL Value (1-128)## 🛠️ Technical Stack

- Max Payload (500-1500 bytes)

- Custom DNS Servers- **Frontend**: Next.js 14 + React 18

- DNS Poison Protection- **Styling**: Tailwind CSS

- Auto-start on boot- **Desktop**: Electron 33

- Minimize to tray- **Packet Manipulation**: WinDivert (Windows)

- **Network**: Native Node.js modules

### Status Indicators- **Storage**: electron-store



**Taskbar Icon:**---

- 🟢 Green dot = DPI bypass active

- 🔴 Red dot = DPI bypass inactive## 🤝 Contributing



**System Tray:**We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- Icon with status dot

- Right-click for menu---

- Click to restore window

## 📄 License

---

MIT License - see [LICENSE](LICENSE) for details

## 🔐 Security & Privacy

---

- **No Data Collection** - All operations are local

- **Open Source** - Full transparency, audit the code## 🏢 About Codeshare Technology Ltd

- **Admin Rights** - Required only for network modifications

- **DNS Security** - Optional custom DNS with poison protectionShroudly is proudly developed by **Codeshare Technology Ltd**, a company dedicated to internet freedom, privacy, and innovation.

- **Local Storage** - Settings stored locally with electron-store

- **Website**: [codeshare.me](https://codeshare.me)

---- **Email**: support@codeshare.me



## ⚙️ How It Works---



### GoodbyeDPI Method (Primary)## 🙏 Acknowledgments

1. Spawns `goodbyedpi.exe` as child process

2. Applies command-line flags based on settings- Inspired by GoodbyeDPI and similar DPI bypass tools

3. Uses WinDivert for kernel-level packet manipulation- Thanks to the internet freedom community

4. Fragments HTTP/HTTPS packets to bypass DPI- Special thanks to all contributors



### Custom PowerShell Method (Fallback)---

1. Modifies network adapter MTU via `netsh`

2. Changes TTL values in Windows Registry## 📞 Support

3. Switches DNS servers with `Set-DnsClientServerAddress`

4. Tests connection with HTTPS requests- **GitHub Issues**: [GitHub Issues](https://github.com/umutxyp/Shroudly/issues)

- **Codeshare**: [codeshare.me](https://codeshare.me)

### DNS Management- **Email**: support@codeshare.me

- Saves original DNS settings before changes

- Restores DNS on application exit---

- Supports multiple DNS providers

<div align="center">

---

**Shroudly - Unseen. Unstoppable.**

## 🐛 Troubleshooting

*A Codeshare Technology Ltd Product*

### "Administrator privileges required"

- Right-click Shroudly → Run as AdministratorMade with ❤️ for a free and open internet

- Or use the auto-elevation prompt

</div>

### GoodbyeDPI not found
```bash
npm run setup
```

### Build errors
```bash
# Clean and rebuild
rm -rf node_modules .next out dist
npm install
npm run build
```

### Connection test fails
- Check Windows Firewall settings
- Verify admin rights
- Try different DNS servers
- Enable aggressive mode

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Codeshare Technology Ltd**  
Website: [codeshare.me](https://codeshare.me)  
GitHub: [@umutxyp](https://github.com/umutxyp)

---

## 🙏 Acknowledgments

- [GoodbyeDPI](https://github.com/ValdikSS/GoodbyeDPI) - DPI bypass engine
- [WinDivert](https://github.com/basil00/Divert) - Kernel-level packet manipulation
- [Electron](https://www.electronjs.org/) - Desktop framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## ⚠️ Disclaimer

This tool is for educational and research purposes. Users are responsible for complying with local laws and regulations. The authors are not responsible for misuse or any legal consequences.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=umutxyp/Shroudly&type=Date)](https://star-history.com/#umutxyp/Shroudly&Date)

---

<p align="center">
  Made with ❤️ by Codeshare Technology Ltd
</p>
