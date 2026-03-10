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

// 4. Setup event handlers
setupEventHandlers(client);

// 5. Setup message handler
client.on('message', (message) => {
    handleMessage(message, client);
});

// 6. Health check HTTP server (untuk Railway)
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
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
