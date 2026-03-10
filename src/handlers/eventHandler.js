const qrcode = require('qrcode-terminal');
const Logger = require('../utils/logger');
const { handleGroupParticipant } = require('./autoResponse');
const ReminderService = require('../services/reminderService');

/**
 * Event Handler - setup semua event listener untuk WhatsApp client
 */
function setupEventHandlers(client) {
    // QR Code - tampilkan di terminal
    client.on('qr', (qr) => {
        Logger.info('📱 Scan QR Code berikut untuk login:');
        qrcode.generate(qr, { small: true });
    });

    // Ready - bot siap digunakan
    client.on('ready', () => {
        Logger.success('🤖 Bot WhatsApp siap digunakan!');
        Logger.info(`📛 Nama: ${client.info.pushname}`);
        Logger.info(`📱 Nomor: ${client.info.wid.user}`);

        // Start reminder service
        ReminderService.start(client);
    });

    // Authenticated
    client.on('authenticated', () => {
        Logger.success('🔐 WhatsApp berhasil ter-autentikasi');
    });

    // Auth failure
    client.on('auth_failure', (error) => {
        Logger.error('🔐 Autentikasi gagal:', error);
    });

    // Disconnected
    client.on('disconnected', (reason) => {
        Logger.warn('📴 Bot terputus:', reason);
        ReminderService.stop();
    });

    // Group join/leave
    client.on('group_join', (notification) => {
        handleGroupParticipant(notification, client);
    });

    client.on('group_leave', (notification) => {
        handleGroupParticipant(notification, client);
    });

    // State change
    client.on('change_state', (state) => {
        Logger.debug('State berubah:', state);
    });

    Logger.info('📡 Event handlers terpasang');
}

module.exports = setupEventHandlers;
