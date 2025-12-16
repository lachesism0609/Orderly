const admin = require('firebase-admin');
require('dotenv').config();

let db, auth;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // Check if already initialized
        if (admin.apps.length > 0) {
            console.log('Firebase Admin already initialized');
            return;
        }

        // Option 1: Using service account key file (recommended for local development)
        try {
            const serviceAccount = require('./serviceAccountKey.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
            console.log('✅ Firebase Admin initialized with service account key file');
        } catch (fileError) {
            // Option 2: Using environment variables (JSON string)
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: process.env.FIREBASE_PROJECT_ID
                });
                console.log('✅ Firebase Admin initialized with environment variable');
            }
            // Option 3: Using Google Application Credentials (File path)
            else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    projectId: process.env.FIREBASE_PROJECT_ID
                });
                console.log('✅ Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS');
            }
            // Option 4: Fallback to default (e.g. GCP environment)
            else if (process.env.FIREBASE_PROJECT_ID) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    projectId: process.env.FIREBASE_PROJECT_ID
                });
                console.log('✅ Firebase Admin initialized with application default credentials');
            } else {
                // Fallback: Initialize without credentials (limited functionality)
                console.warn('⚠️  Warning: Firebase initialized without credentials. Some features may not work.');
                admin.initializeApp();
            }
        }

        console.log(`📦 Project ID: ${process.env.FIREBASE_PROJECT_ID || 'Not specified'}`);
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error.message);
        throw error;
    }
};

// Initialize Firebase first
initializeFirebase();

// Get Firestore and Auth instances
try {
    db = admin.firestore();
    auth = admin.auth();

    // Set Firestore settings
    db.settings({
        ignoreUndefinedProperties: true,
    });

    console.log('✅ Firestore and Auth instances created');
} catch (error) {
    console.error('❌ Error creating Firebase services:', error.message);
    throw error;
}

module.exports = {
    initializeFirebase,
    db,
    auth,
    admin
};