const config = require('../config/index');
const Logger = require('../utils/logger');
const FirestoreService = require('./firestoreService');
const { aiHistoryCache } = require('./cacheService');

const MAX_HISTORY = 10; // Max conversation history messages

/**
 * AI Service - integrasi dengan OpenRouter API
 */
class AiService {
    /**
     * Kirim single prompt ke OpenRouter (tanpa history)
     */
    static async ask(prompt) {
        if (!config.ai.apiKey) {
            return '❌ OpenRouter API key belum diset. Hubungi admin.';
        }

        try {
            const response = await fetch(config.ai.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.ai.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': config.ai.siteUrl,
                    'X-OpenRouter-Title': config.ai.siteName,
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Kamu adalah asisten AI yang membantu di WhatsApp. Jawab dengan singkat, jelas, dan dalam bahasa Indonesia kecuali diminta sebaliknya. Gunakan emoji untuk membuat jawaban lebih menarik.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                Logger.error('OpenRouter API error:', response.status, error);
                return `❌ Gagal menghubungi AI (${response.status}). Coba lagi nanti.`;
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;

            if (!reply) {
                return '❌ AI tidak memberikan respons. Coba lagi.';
            }

            return reply;
        } catch (error) {
            Logger.error('AI Service ask error:', error.message);
            return '❌ Terjadi kesalahan saat menghubungi AI. Coba lagi nanti.';
        }
    }

    /**
     * Chat dengan AI (with conversation history)
     */
    static async chat(userId, prompt) {
        if (!config.ai.apiKey) {
            return '❌ OpenRouter API key belum diset. Hubungi admin.';
        }

        try {
            // Ambil history dari cache atau Firestore
            let history = aiHistoryCache.get(`ai_${userId}`);
            if (!history) {
                history = await FirestoreService.getAiHistory(userId);
            }

            if (!Array.isArray(history)) history = [];

            // Tambahkan pesan baru
            history.push({ role: 'user', content: prompt });

            // Batasi history
            if (history.length > MAX_HISTORY) {
                history = history.slice(-MAX_HISTORY);
            }

            // Kirim ke OpenRouter
            const messages = [
                {
                    role: 'system',
                    content: 'Kamu adalah asisten AI yang membantu di WhatsApp. Jawab dengan jelas dan dalam bahasa Indonesia kecuali diminta sebaliknya. Ingat konteks percakapan sebelumnya.',
                },
                ...history,
            ];

            const response = await fetch(config.ai.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.ai.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': config.ai.siteUrl,
                    'X-OpenRouter-Title': config.ai.siteName,
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages,
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                Logger.error('OpenRouter API error:', response.status, error);
                return `❌ Gagal menghubungi AI (${response.status}). Coba lagi nanti.`;
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;

            if (!reply) {
                return '❌ AI tidak memberikan respons. Coba lagi.';
            }

            // Simpan response ke history
            history.push({ role: 'assistant', content: reply });

            // Simpan ke cache dan Firestore
            aiHistoryCache.set(`ai_${userId}`, history);
            FirestoreService.saveAiHistory(userId, history).catch(() => { });

            return reply;
        } catch (error) {
            Logger.error('AI Service chat error:', error.message);
            return '❌ Terjadi kesalahan saat menghubungi AI. Coba lagi nanti.';
        }
    }

    /**
     * Reset conversation history
     */
    static async resetHistory(userId) {
        aiHistoryCache.del(`ai_${userId}`);
        await FirestoreService.saveAiHistory(userId, []);
    }
}

module.exports = AiService;
