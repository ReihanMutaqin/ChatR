const admin = require('firebase-admin');
const config = require('./index');
const fs = require('fs');

let db = null;

function initializeFirebase() {
    try {
        if (admin.apps.length > 0) {
            db = admin.firestore();
            return db;
        }

        // Cek apakah credentials tersedia via environment variable (untuk Railway/Docker)
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        if (serviceAccountJson) {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: config.firebase.projectId,
            });
            console.log('✅ Firebase berhasil diinisialisasi (dari env variable)');
        } else if (fs.existsSync(config.firebase.serviceAccountPath)) {
            // Fallback ke file lokal
            const serviceAccount = require(config.firebase.serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: config.firebase.projectId,
            });
            console.log('✅ Firebase berhasil diinisialisasi');
        } else {
            console.warn('⚠️  Firebase service account tidak ditemukan.');
            console.warn('   Set FIREBASE_SERVICE_ACCOUNT_JSON env variable atau sediakan file.');
            console.warn('   Fitur database tidak akan bekerja.\n');
            return null;
        }

        db = admin.firestore();
        return db;
    } catch (error) {
        console.error('❌ Gagal inisialisasi Firebase:', error.message);
        return null;
    }
}

function getDb() {
    return db;
}

module.exports = { initializeFirebase, getDb };
