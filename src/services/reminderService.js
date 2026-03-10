const FirestoreService = require('../services/firestoreService');
const Logger = require('../utils/logger');

/**
 * Reminder Service - background job untuk cek dan kirim reminders
 */
class ReminderService {
    static intervalId = null;

    /**
     * Mulai background checker
     */
    static start(client) {
        if (this.intervalId) return;

        Logger.info('⏰ Reminder service dimulai');

        // Cek setiap 30 detik
        this.intervalId = setInterval(async () => {
            try {
                const dueReminders = await FirestoreService.getDueReminders();

                for (const reminder of dueReminders) {
                    try {
                        await client.sendMessage(
                            reminder.chatId,
                            `⏰ *REMINDER*\n\n${reminder.message}\n\n_Reminder dibuat sebelumnya_`
                        );
                        await FirestoreService.markReminderSent(reminder.id);
                        Logger.info(`Reminder terkirim: ${reminder.id}`);
                    } catch (err) {
                        Logger.error(`Gagal kirim reminder ${reminder.id}:`, err.message);
                    }
                }
            } catch (error) {
                Logger.error('Reminder check error:', error.message);
            }
        }, 30000);
    }

    /**
     * Stop background checker
     */
    static stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            Logger.info('⏰ Reminder service dihentikan');
        }
    }
}

module.exports = ReminderService;
