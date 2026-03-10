const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http');
const { initializeFirebase } = require('./config/firebase');
const Logger = require('./utils/logger');
const commandRegistry = require('./commands/index');
const setupEventHandlers = require('./handlers/eventHandler');
const handleMessage = require('./handlers/messageHandler');
const ReminderService = require('./services/reminderService');

// ========================================
// Inisialisasi
// ========================================

Logger.info('🚀 Memulai WhatsApp Bot...');

// 1. Inisialisasi Firebase
initializeFirebase();

// 2. Load semua commands
commandRegistry.loadCommands();

// 3. Buat WhatsApp client
const puppeteerArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--disable-gpu',
];

const puppeteerConfig = {
    headless: true,
    args: puppeteerArgs,
};

// Gunakan Chromium dari system jika tersedia (Docker/Railway)
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: puppeteerConfig,
});

// 4. QR code state (untuk web-based QR display)
let latestQr = null;
let botReady = false;

// 5. Setup event handlers
setupEventHandlers(client);

// Simpan QR data untuk ditampilkan di web
client.on('qr', (qr) => {
    latestQr = qr;
    botReady = false;
    Logger.info('📱 QR Code baru tersedia! Buka /qr di browser untuk scan.');
});

client.on('ready', () => {
    latestQr = null;
    botReady = true;
});

// 6. Setup message handler
client.on('message', (message) => {
    handleMessage(message, client);
});

// 7. Health check & QR code HTTP server (untuk Railway)
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), botReady }));
    } else if (req.url === '/qr') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (botReady) {
            res.end(`
                <html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#1a1a2e;color:#e0e0e0;">
                    <div style="text-align:center;padding:40px;background:#16213e;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
                        <h1>✅ Bot Sudah Terhubung!</h1>
                        <p>WhatsApp Bot sudah online dan siap digunakan.</p>
                    </div>
                </body></html>
            `);
        } else if (latestQr) {
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}`;
            res.end(`
                <html>
                <head><meta http-equiv="refresh" content="30"><title>Scan QR Code</title></head>
                <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#1a1a2e;color:#e0e0e0;">
                    <div style="text-align:center;padding:40px;background:#16213e;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
                        <h1>📱 Scan QR Code</h1>
                        <p>Buka WhatsApp > Linked Devices > Link a Device</p>
                        <img src="${qrImageUrl}" style="margin:20px;border-radius:10px;border:4px solid #fff;" />
                        <p style="color:#888;font-size:14px;">Halaman ini auto-refresh setiap 30 detik</p>
                    </div>
                </body></html>
            `);
        } else {
            res.end(`
                <html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#1a1a2e;color:#e0e0e0;">
                    <div style="text-align:center;padding:40px;background:#16213e;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
                        <h1>⏳ Menunggu QR Code...</h1>
                        <p>QR Code belum tersedia. Tunggu sebentar dan refresh halaman ini.</p>
                    </div>
                </body></html>
            `);
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('WhatsApp Bot is running');
    }
});

server.listen(PORT, () => {
    Logger.info(`🌐 Health check server berjalan di port ${PORT}`);
});

// 7. Mulai client
client.initialize();

// ========================================
// Graceful Shutdown
// ========================================

async function shutdown(signal) {
    Logger.warn(`\n🛑 ${signal} diterima. Mematikan bot...`);

    try {
        ReminderService.stop();
        await client.destroy();
        Logger.info('👋 Bot berhasil dimatikan. Sampai jumpa!');
    } catch (error) {
        Logger.error('Error saat shutdown:', error.message);
    }

    process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
    Logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
});
