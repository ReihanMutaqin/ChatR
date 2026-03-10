const { getDb } = require('../config/firebase');

/**
 * Logger utility - console logging dengan timestamp
 * + optional logging ke Firestore
 */
class Logger {
    static _formatTime() {
        return new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    }

    static info(message, ...args) {
        console.log(`[${this._formatTime()}] ℹ️  ${message}`, ...args);
    }

    static success(message, ...args) {
        console.log(`[${this._formatTime()}] ✅ ${message}`, ...args);
    }

    static warn(message, ...args) {
        console.warn(`[${this._formatTime()}] ⚠️  ${message}`, ...args);
    }

    static error(message, ...args) {
        console.error(`[${this._formatTime()}] ❌ ${message}`, ...args);
        this._logToFirestore('error', message, args);
    }

    static debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${this._formatTime()}] 🐛 ${message}`, ...args);
        }
    }

    static async _logToFirestore(level, message, args) {
        try {
            const db = getDb();
            if (!db) return;

            await db.collection('logs').add({
                level,
                message,
                details: args.length > 0 ? JSON.stringify(args) : null,
                timestamp: new Date(),
            });
        } catch (err) {
            // Silent fail - jangan infinite loop logging
        }
    }
}

module.exports = Logger;
