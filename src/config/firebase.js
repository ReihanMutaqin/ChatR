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

        // Cek apakah service account file ada
        if (fs.existsSync(config.firebase.serviceAccountPath)) {
            const serviceAccount = require(config.firebase.serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: config.firebase.projectId,
            });
            console.log('✅ Firebase berhasil diinisialisasi');
        } else {
            console.warn('⚠️  Firebase service account file tidak ditemukan.');
            console.warn(`   Path: ${config.firebase.serviceAccountPath}`);
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
