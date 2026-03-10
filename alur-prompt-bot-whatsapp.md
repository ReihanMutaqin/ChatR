# Alur Prompt Bot WhatsApp dengan Cursor + GitHub + Firebase

Panduan lengkap membuat Bot WhatsApp dari nol menggunakan Cursor AI, GitHub untuk version control, dan Firebase untuk backend.

---

## 📋 Prasyarat

Sebelum memulai, pastikan sudah install:
- **Node.js** (v18+)
- **Cursor** (https://cursor.sh)
- **Git**
- **Akun GitHub**
- **Akun Firebase** (https://firebase.google.com)

---

## 🚀 Fase 1: Setup Project (Prompt 1-5)

### Prompt 1: Inisialisasi Project
```
Buatkan saya struktur project Node.js untuk Bot WhatsApp dengan struktur folder:
- src/
  - config/
  - handlers/
  - services/
  - utils/
  - middleware/
- .env.example
- package.json
- README.md

Gunakan library:
- whatsapp-web.js untuk bot WhatsApp
- qrcode-terminal untuk QR code
- express untuk webhook (opsional)
- dotenv untuk environment variables

Generate package.json dan folder structure lengkap.
```

### Prompt 2: Setup GitHub Repository
```
Bantu saya setup GitHub repository untuk project ini:
1. Buatkan .gitignore untuk Node.js project
2. Buatkan README.md dengan deskripsi project Bot WhatsApp
3. Buatkan initial commit message yang proper
4. Setup branch protection rules (opsional)

Project name: whatsapp-bot-firebase
```

### Prompt 3: Setup Firebase
```
Buatkan konfigurasi Firebase untuk Bot WhatsApp saya:
1. File config/firebase.js untuk inisialisasi Firebase Admin SDK
2. Service untuk Firestore operations (CRUD)
3. Service untuk Firebase Cloud Messaging (opsional)
4. Contoh struktur collection: users, messages, logs

Sertakan juga .env.example dengan variabel Firebase yang diperlukan.
```

### Prompt 4: Environment Configuration
```
Buatkan file konfigurasi environment lengkap:
1. .env.example dengan semua variabel yang dibutuhkan:
   - Firebase config
   - WhatsApp session path
   - Bot settings (prefix, admin number)
   - API keys (jika ada)
2. src/config/index.js untuk mengelola config
3. Validasi environment variables saat startup
```

### Prompt 5: Main Entry Point
```
Buatkan file src/index.js sebagai entry point utama dengan:
1. Inisialisasi WhatsApp client dari whatsapp-web.js
2. Event handler untuk:
   - QR code generation
   - Ready state
   - Authenticated state
   - Disconnected state
   - Message receive
3. Integrasi dengan Firebase untuk logging
4. Graceful shutdown handler
```

---

## 🤖 Fase 2: Core Bot Functionality (Prompt 6-12)

### Prompt 6: Message Handler Structure
```
Buatkan sistem message handler yang modular:
1. src/handlers/messageHandler.js - handler utama
2. Sistem command parser (prefix + command + args)
3. Middleware system untuk:
   - Rate limiting
   - Admin only commands
   - Group only commands
   - Private chat only commands
4. Error handling wrapper

Contoh command format: !help, !info, !menu
```

### Prompt 7: Command Registry
```
Buatkan command registry system:
1. src/commands/index.js - register semua commands
2. Struktur command object:
   {
     name: 'help',
     description: 'Show help menu',
     category: 'general',
     adminOnly: false,
     groupOnly: false,
     execute: async (message, args, client) => {}
   }
3. Auto-discover commands dari folder commands/
4. Help generator otomatis berdasarkan registered commands
```

### Prompt 8: Basic Commands
```
Buatkan basic commands untuk Bot WhatsApp:
1. !menu / !help - tampilkan daftar command
2. !ping - cek latency bot
3. !info - informasi bot
4. !status - cek status bot dan uptime
5. !owner - kontak owner/admin

Simpan setiap command di file terpisah di src/commands/general/
```

### Prompt 9: Database Integration
```
Buatkan service layer untuk Firebase Firestore:
1. src/services/firestoreService.js dengan methods:
   - saveUser(userId, data)
   - getUser(userId)
   - saveMessage(messageId, data)
   - getUserHistory(userId, limit)
   - logActivity(type, data)
2. Integrasi dengan message handler untuk logging
3. User tracking (first seen, last seen, message count)
```

### Prompt 10: Group Management Commands
```
Buatkan commands untuk manajemen grup (admin only):
1. !kick @user - kick member
2. !promote @user - jadikan admin
3. !demote @user - hapus admin
4. !tagall - tag semua member
5. !hidetag [pesan] - kirim pesan tanpa tag
6. !groupinfo - info grup
7. !setsubject [nama] - ubah nama grup
8. !setdesc [deskripsi] - ubah deskripsi grup

Simpan di src/commands/group/
```

### Prompt 11: Auto-Response System
```
Buatkan auto-response system:
1. Keyword-based responses
2. Welcome message untuk member baru
3. Goodbye message untuk member keluar
4. Anti-link detection (hapus pesan dengan link)
5. Anti-spam protection
6. Simpan konfigurasi di Firestore per grup

File: src/handlers/autoResponse.js
```

### Prompt 12: Media Handling
```
Buatkan handler untuk media messages:
1. Download media dari pesan
2. Simpan ke Firebase Storage (opsional)
3. Commands:
   - !sticker - convert image/video ke sticker
   - !toimg - convert sticker ke image
   - !tovideo - convert GIF ke video
   - !quotely - buat sticker quote

Gunakan library: @whiskeysockets/baileys atau whatsapp-web.js native
```

---

## 📊 Fase 3: Advanced Features (Prompt 13-18)

### Prompt 13: AI Integration (Opsional)
```
Integrasikan AI ke bot WhatsApp:
1. Command !ask [pertanyaan] - gunakan OpenAI API
2. Command !ai [prompt] - chat dengan AI
3. Context-aware conversation (simpan history)
4. Rate limiting untuk penggunaan AI

Service: src/services/aiService.js
```

### Prompt 14: Reminder System
```
Buatkan reminder system:
1. !remind [waktu] [pesan] - contoh: !remind 30m meeting dengan client
2. Support format: 10s, 5m, 2h, 1d
3. Simpan reminder di Firestore dengan timestamp
4. Background job untuk cek dan kirim reminder
5. !listreminders - lihat active reminders
6. !cancelremind [id] - cancel reminder
```

### Prompt 15: Notes System
```
Buatkan personal notes system:
1. !note [teks] - simpan catatan
2. !notes - lihat semua catatan
3. !noteget [id] - lihat catatan spesifik
4. !notedelete [id] - hapus catatan
5. !noteclear - hapus semua catatan

Simpan di Firestore: users/{userId}/notes/{noteId}
```

### Prompt 16: Admin Dashboard (Web)
```
Buatkan simple admin dashboard dengan Express:
1. Setup Express server di src/dashboard/server.js
2. Endpoint:
   - GET /api/stats - statistik bot
   - GET /api/users - daftar users
   - GET /api/groups - daftar groups
   - GET /api/logs - activity logs
3. Simple HTML dashboard dengan real-time updates (Firebase)
4. Authentication dengan API key
```

### Prompt 17: Backup & Restore
```
Buatkan backup system:
1. !backup - backup data user (kirim JSON)
2. Auto-backup ke Firebase Storage mingguan
3. Restore data dari backup file
4. Export chat history

Service: src/services/backupService.js
```

### Prompt 18: Error Handling & Logging
```
Perbaiki error handling dan logging:
1. Global error handler
2. Simpan error log ke Firestore
3. Notifikasi error ke admin via WhatsApp
4. Retry mechanism untuk failed operations
5. Health check endpoint
6. Graceful error recovery
```

---

## 🔄 Fase 4: Deployment & CI/CD (Prompt 19-22)

### Prompt 19: Deployment Preparation
```
Persiapkan bot untuk deployment:
1. Buatkan Dockerfile untuk containerization
2. Buatkan docker-compose.yml untuk local development
3. Script untuk session management (jangan commit session!)
4. Environment validation sebelum start
5. PM2 ecosystem file untuk production

File: Dockerfile, docker-compose.yml, ecosystem.config.js
```

### Prompt 20: GitHub Actions CI/CD
```
Buatkan GitHub Actions workflow:
1. .github/workflows/ci.yml - run tests dan linting
2. .github/workflows/deploy.yml - auto deploy ke server (opsional)
3. Automated testing dengan Jest
4. ESLint configuration
5. Pre-commit hooks dengan Husky
```

### Prompt 21: Firebase Deployment
```
Setup Firebase deployment:
1. firebase.json configuration
2. Firestore security rules
3. Firestore indexes
4. Firebase Functions (opsional untuk webhook)
5. Deployment script

File: firebase.json, firestore.rules, firestore.indexes.json
```

### Prompt 22: Documentation
```
Lengkapi dokumentasi:
1. README.md lengkap dengan:
   - Fitur bot
   - Cara install
   - Cara setup Firebase
   - Daftar commands
   - Environment variables
   - Troubleshooting
2. CHANGELOG.md
3. LICENSE file
4. CONTRIBUTING.md (opsional)
```

---

## 🛠️ Fase 5: Testing & Optimization (Prompt 23-25)

### Prompt 23: Unit Testing
```
Buatkan unit tests:
1. Setup Jest untuk testing
2. Test untuk command parser
3. Test untuk Firebase services (mock)
4. Test untuk message handler
5. Coverage report

Folder: tests/
Command: npm test
```

### Prompt 24: Performance Optimization
```
Optimasi performa bot:
1. Implementasi caching dengan node-cache
2. Batch writes ke Firestore
3. Connection pooling
4. Memory usage optimization
5. Response time monitoring

Service: src/services/cacheService.js
```

### Prompt 25: Security Hardening
```
Tingkatkan keamanan bot:
1. Input sanitization
2. Rate limiting per user
3. Command whitelist untuk grup tertentu
4. Anti-flood protection
5. Secure Firebase rules
6. API key rotation
7. Session encryption
```

---

## 📁 Struktur Folder Final

```
whatsapp-bot-firebase/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── src/
│   ├── commands/
│   │   ├── general/
│   │   │   ├── help.js
│   │   │   ├── ping.js
│   │   │   ├── info.js
│   │   │   └── status.js
│   │   ├── group/
│   │   │   ├── kick.js
│   │   │   ├── promote.js
│   │   │   ├── tagall.js
│   │   │   └── groupinfo.js
│   │   ├── media/
│   │   │   ├── sticker.js
│   │   │   └── toimg.js
│   │   ├── notes/
│   │   │   ├── note.js
│   │   │   └── notes.js
│   │   ├── reminder/
│   │   │   └── remind.js
│   │   └── index.js
│   ├── config/
│   │   ├── firebase.js
│   │   └── index.js
│   ├── handlers/
│   │   ├── messageHandler.js
│   │   ├── autoResponse.js
│   │   └── eventHandler.js
│   ├── services/
│   │   ├── firestoreService.js
│   │   ├── aiService.js
│   │   ├── cacheService.js
│   │   └── backupService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── formatter.js
│   │   └── validator.js
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   ├── auth.js
│   │   └── antiSpam.js
│   ├── dashboard/
│   │   └── server.js
│   └── index.js
├── tests/
│   ├── commands.test.js
│   └── services.test.js
├── .env.example
├── .gitignore
├── .eslintrc.js
├── Dockerfile
├── docker-compose.yml
├── ecosystem.config.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── jest.config.js
├── package.json
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## 📝 Tips Menggunakan Cursor

1. **Gunakan Context**: Berikan context yang jelas di setiap prompt
2. **Incremental**: Kerjakan fitur satu per satu, jangan sekaligus
3. **Review Code**: Selalu review kode yang dihasilkan Cursor
4. **Test**: Test setiap fitur sebelum lanjut ke fitur berikutnya
5. **Commit Often**: Commit ke GitHub setiap selesai satu fitur
6. **Error Handling**: Pastikan Cursor selalu include error handling

---

## 🎯 Workflow Harian dengan Cursor

1. **Buka Cursor** → Load project
2. **Chat dengan AI** (Ctrl+L / Cmd+L)
3. **Ketik prompt** sesuai fitur yang mau dibuat
4. **Review kode** yang dihasilkan
5. **Apply changes** ke file
6. **Test** bot dengan run `npm start`
7. **Debug** jika ada error (tanya Cursor)
8. **Commit** ke GitHub
9. **Ulangi** untuk fitur berikutnya

---

## 🔗 Referensi

- [whatsapp-web.js Docs](https://docs.wwebjs.dev/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Cursor Documentation](https://cursor.sh/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

Selamat membuat Bot WhatsApp! 🚀
