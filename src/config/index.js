const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    serviceAccountPath: path.resolve(__dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'),
  },

  // OpenRouter AI
  ai: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    siteUrl: process.env.OPENROUTER_SITE_URL || 'http://localhost',
    siteName: process.env.OPENROUTER_SITE_NAME || 'WhatsApp Bot',
  },

  // Bot
  bot: {
    prefix: process.env.BOT_PREFIX || '!',
    name: process.env.BOT_NAME || 'WhatsApp Bot',
    adminNumber: process.env.ADMIN_NUMBER || '',
    ownerName: process.env.OWNER_NAME || 'Admin',
  },

  // Rate Limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
    windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60,
    aiMax: parseInt(process.env.AI_RATE_LIMIT_MAX) || 5,
    aiWindowSeconds: parseInt(process.env.AI_RATE_LIMIT_WINDOW_SECONDS) || 120,
  },
};

// Validasi environment variables wajib
function validateConfig() {
  const required = [
    { key: 'FIREBASE_PROJECT_ID', value: config.firebase.projectId },
  ];

  const missing = required.filter(r => !r.value);
  if (missing.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missing.map(m => m.key).join(', ')}`);
    console.warn('   Bot akan berjalan tapi beberapa fitur mungkin tidak bekerja.');
    console.warn('   Copy .env.example ke .env dan isi semua variabel.\n');
  }

  if (!config.ai.apiKey) {
    console.warn('⚠️  Warning: OPENROUTER_API_KEY belum diset. Fitur AI tidak akan bekerja.');
  }
}

validateConfig();

module.exports = config;
