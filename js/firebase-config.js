// ── Firebase cloud-sync configuration ──
// Cloud sync is OFF until this is filled in. The app works fully offline
// with local saves in the meantime.
//
// To turn on cloud sync (one-time setup, ~10 minutes):
//   1. Go to https://console.firebase.google.com and sign in with a Google
//      account you control. Click "Add project" → name it (e.g.
//      "homeschool-apps") → Create (Analytics not needed).
//   2. In the project: Build → Authentication → Get started →
//      Sign-in method → enable "Email/Password".
//   3. Build → Firestore Database → Create database → Start in
//      production mode → pick a US location.
//   4. In Firestore → Rules, paste the rules from README.md and Publish.
//   5. Project settings (gear icon) → Your apps → Web app (</>) →
//      register it → copy the firebaseConfig object it shows you.
//   6. Paste that object below, replacing `null`, and redeploy.
//
// This config is safe to publish — it identifies the project, it is not a
// secret. Security comes from the Firestore rules.

const FIREBASE_CONFIG = null;

/* Example of what it looks like when filled in:
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "homeschool-apps.firebaseapp.com",
  projectId: "homeschool-apps",
  storageBucket: "homeschool-apps.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
*/
