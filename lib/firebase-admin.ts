import admin from "firebase-admin"

function createAdminApp(): admin.app.App {
  // --- LOCAL EMULATOR ---
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "dev"
    console.log(`Connecting to Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST} for project ${projectId}`)
    return admin.initializeApp({ projectId })
  }

  // --- PRODUCTION ---
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.")
  }

  console.log(`Initializing Firebase Admin for project ${FIREBASE_PROJECT_ID}`)
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    projectId: FIREBASE_PROJECT_ID,
  })
}

// Only create app if none exists
export const adminApp = admin.apps.length ? admin.app() : createAdminApp()
export const db = admin.firestore(adminApp)

// --- PATCH: Prevent calling settings() more than once ---
declare global {
  // Ensures the variable is globally scoped, even with HMR in Next.js
  var __FIRESTORE_EMULATOR_SETTINGS_SET__: boolean | undefined
}

if (process.env.FIRESTORE_EMULATOR_HOST && !global.__FIRESTORE_EMULATOR_SETTINGS_SET__) {
  db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false })
  global.__FIRESTORE_EMULATOR_SETTINGS_SET__ = true
}
