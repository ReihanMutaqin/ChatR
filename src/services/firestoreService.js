const { getDb } = require('../config/firebase');
const Logger = require('../utils/logger');

/**
 * Firestore Service - CRUD operations untuk users, messages, logs
 */
class FirestoreService {
    /**
     * Simpan/update data user
     */
    static async saveUser(userId, data) {
        const db = getDb();
        if (!db) return null;

        try {
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();

            if (doc.exists) {
                await userRef.update({
                    ...data,
                    lastSeen: new Date(),
                    messageCount: (doc.data().messageCount || 0) + 1,
                });
            } else {
                await userRef.set({
                    userId,
                    ...data,
                    firstSeen: new Date(),
                    lastSeen: new Date(),
                    messageCount: 1,
                });
            }
            return true;
        } catch (error) {
            Logger.error('Firestore saveUser error:', error.message);
            return null;
        }
    }

    /**
     * Ambil data user
     */
    static async getUser(userId) {
        const db = getDb();
        if (!db) return null;

        try {
            const doc = await db.collection('users').doc(userId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            Logger.error('Firestore getUser error:', error.message);
            return null;
        }
    }

    /**
     * Simpan pesan ke collection messages
     */
    static async saveMessage(messageId, data) {
        const db = getDb();
        if (!db) return null;

        try {
            await db.collection('messages').doc(messageId).set({
                ...data,
                timestamp: new Date(),
            });
            return true;
        } catch (error) {
            Logger.error('Firestore saveMessage error:', error.message);
            return null;
        }
    }

    /**
     * Ambil riwayat pesan user
     */
    static async getUserHistory(userId, limit = 10) {
        const db = getDb();
        if (!db) return [];

        try {
            const snapshot = await db.collection('messages')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            Logger.error('Firestore getUserHistory error:', error.message);
            return [];
        }
    }

    /**
     * Log aktivitas
     */
    static async logActivity(type, data) {
        const db = getDb();
        if (!db) return null;

        try {
            await db.collection('logs').add({
                type,
                ...data,
                timestamp: new Date(),
            });
            return true;
        } catch (error) {
            Logger.error('Firestore logActivity error:', error.message);
            return null;
        }
    }

    /**
     * Simpan catatan user
     */
    static async saveNote(userId, noteText) {
        const db = getDb();
        if (!db) return null;

        try {
            const ref = await db.collection('users').doc(userId)
                .collection('notes').add({
                    text: noteText,
                    createdAt: new Date(),
                });
            return ref.id;
        } catch (error) {
            Logger.error('Firestore saveNote error:', error.message);
            return null;
        }
    }

    /**
     * Ambil semua catatan user
     */
    static async getNotes(userId) {
        const db = getDb();
        if (!db) return [];

        try {
            const snapshot = await db.collection('users').doc(userId)
                .collection('notes')
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            Logger.error('Firestore getNotes error:', error.message);
            return [];
        }
    }

    /**
     * Hapus catatan user
     */
    static async deleteNote(userId, noteId) {
        const db = getDb();
        if (!db) return false;

        try {
            await db.collection('users').doc(userId)
                .collection('notes').doc(noteId).delete();
            return true;
        } catch (error) {
            Logger.error('Firestore deleteNote error:', error.message);
            return false;
        }
    }

    /**
     * Simpan reminder
     */
    static async saveReminder(userId, chatId, message, triggerAt) {
        const db = getDb();
        if (!db) return null;

        try {
            const ref = await db.collection('reminders').add({
                userId,
                chatId,
                message,
                triggerAt,
                sent: false,
                createdAt: new Date(),
            });
            return ref.id;
        } catch (error) {
            Logger.error('Firestore saveReminder error:', error.message);
            return null;
        }
    }

    /**
     * Ambil reminder yang sudah waktunya
     */
    static async getDueReminders() {
        const db = getDb();
        if (!db) return [];

        try {
            const snapshot = await db.collection('reminders')
                .where('sent', '==', false)
                .where('triggerAt', '<=', new Date())
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            Logger.error('Firestore getDueReminders error:', error.message);
            return [];
        }
    }

    /**
     * Tandai reminder sebagai sudah dikirim
     */
    static async markReminderSent(reminderId) {
        const db = getDb();
        if (!db) return false;

        try {
            await db.collection('reminders').doc(reminderId).update({ sent: true });
            return true;
        } catch (error) {
            Logger.error('Firestore markReminderSent error:', error.message);
            return false;
        }
    }

    /**
     * Ambil active reminders user
     */
    static async getUserReminders(userId) {
        const db = getDb();
        if (!db) return [];

        try {
            const snapshot = await db.collection('reminders')
                .where('userId', '==', userId)
                .where('sent', '==', false)
                .orderBy('triggerAt', 'asc')
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            Logger.error('Firestore getUserReminders error:', error.message);
            return [];
        }
    }

    /**
     * Simpan conversation history untuk AI
     */
    static async saveAiHistory(userId, messages) {
        const db = getDb();
        if (!db) return null;

        try {
            await db.collection('ai_history').doc(userId).set({
                messages,
                updatedAt: new Date(),
            });
            return true;
        } catch (error) {
            Logger.error('Firestore saveAiHistory error:', error.message);
            return null;
        }
    }

    /**
     * Ambil AI conversation history
     */
    static async getAiHistory(userId) {
        const db = getDb();
        if (!db) return [];

        try {
            const doc = await db.collection('ai_history').doc(userId).get();
            return doc.exists ? doc.data().messages || [] : [];
        } catch (error) {
            Logger.error('Firestore getAiHistory error:', error.message);
            return [];
        }
    }
}

module.exports = FirestoreService;
