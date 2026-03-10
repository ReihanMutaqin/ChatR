const { Client, LocalAuth } = require('whatsapp-web.js');
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
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--disable-gpu',
        ],
    },
});

// 4. Setup event handlers
setupEventHandlers(client);

// 5. Setup message handler
client.on('message', (message) => {
    handleMessage(message, client);
});

// 6. Mulai client
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
