# WhatsApp Bot dengan Firebase & OpenRouter AI 🤖

Bot WhatsApp multi-fitur dengan integrasi Firebase Firestore dan AI via OpenRouter.

## ✨ Fitur

- **📋 Menu & Info** — `!menu`, `!ping`, `!info`, `!status`, `!owner`
- **🤖 AI (OpenRouter)** — `!ask`, `!ai` (dengan riwayat percakapan), `!resetai`
- **👥 Manajemen Grup** — `!kick`, `!promote`, `!demote`, `!tagall`, `!groupinfo`
- **📝 Catatan** — `!note`, `!notes`, `!notedelete`
- **⏰ Reminder** — `!remind`, `!listreminders`
- **🖼️ Media** — `!sticker`
- **🔒 Security** — Rate limiting, anti-spam, anti-link
- **👋 Auto-Response** — Welcome/goodbye, keyword replies

## 🚀 Instalasi

### 1. Clone & Install
```bash
git clone <repo-url>
cd whatsapp-bot-firebase
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan credential kamu
```

### 3. Setup Firebase
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. Aktifkan **Firestore Database**
4. Download **Service Account Key** (Project Settings → Service Accounts → Generate New Private Key)
5. Simpan file JSON sebagai `serviceAccountKey.json` di root project

### 4. Setup OpenRouter
1. Buka [OpenRouter](https://openrouter.ai/keys)
2. Buat API key
3. Isi `OPENROUTER_API_KEY` di file `.env`

### 5. Jalankan Bot
```bash
npm start        # production
npm run dev      # development (auto-reload)
```

6. Scan **QR Code** yang muncul di terminal dengan WhatsApp di HP

## ⚙️ Environment Variables

| Variable | Deskripsi | Wajib |
|----------|-----------|-------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path ke service account JSON | ✅ |
| `OPENROUTER_API_KEY` | API key dari OpenRouter | Untuk AI |
| `OPENROUTER_MODEL` | Model AI (default: `google/gemini-2.0-flash-001`) | ❌ |
| `BOT_PREFIX` | Prefix command (default: `!`) | ❌ |
| `ADMIN_NUMBER` | Nomor admin (format: `628xxx`) | ❌ |

## 📁 Struktur Project

```
src/
├── commands/          # Semua command bot
│   ├── general/       # help, ping, info, status, owner
│   ├── group/         # kick, promote, demote, tagall, groupinfo
│   ├── ai/            # ask, ai, resetai
│   ├── notes/         # note, notes, deletenote
│   ├── reminder/      # remind, listreminders
│   ├── media/         # sticker
│   └── index.js       # Command registry
├── config/            # Konfigurasi
├── handlers/          # Message & event handlers
├── middleware/        # Rate limiter, anti-spam, auth
├── services/          # Firestore, AI, reminder, cache
├── utils/             # Logger, formatter, validator
└── index.js           # Entry point
```

## 🤖 Daftar Commands

| Command | Deskripsi | Kategori |
|---------|-----------|----------|
| `!menu` / `!help` | Daftar command | General |
| `!ping` | Cek latency | General |
| `!info` | Info bot | General |
| `!status` | Status & uptime | General |
| `!owner` | Kontak admin | General |
| `!ask <pertanyaan>` | Tanya AI (single) | AI |
| `!ai <pesan>` | Chat dengan AI | AI |
| `!resetai` | Reset history AI | AI |
| `!kick @user` | Kick member | Group |
| `!promote @user` | Jadikan admin | Group |
| `!demote @user` | Hapus admin | Group |
| `!tagall [pesan]` | Tag semua member | Group |
| `!groupinfo` | Info grup | Group |
| `!note <teks>` | Simpan catatan | Notes |
| `!notes` | Lihat catatan | Notes |
| `!notedelete <id>` | Hapus catatan | Notes |
| `!remind <waktu> <pesan>` | Set reminder | Reminder |
| `!listreminders` | Lihat reminders | Reminder |
| `!sticker` | Buat sticker | Media |

## 🔧 Troubleshooting

- **QR code tidak muncul** → Pastikan Node.js v18+ dan Chrome/Chromium terinstall
- **Firebase error** → Cek `serviceAccountKey.json` dan `FIREBASE_PROJECT_ID`
- **AI tidak respons** → Cek `OPENROUTER_API_KEY` dan saldo OpenRouter
- **Bot lambat** → Cek koneksi internet dan memory usage (`!status`)

## 📄 License

MIT
