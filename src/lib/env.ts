const read = (key: string) => process.env[key] ?? "";

export const firebaseConfig = {
  apiKey: read("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: read("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: read("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: read("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: read("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: read("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

export function hasRequiredFirebaseEnv() {
  return Object.values(firebaseConfig).every((value) => value.trim().length > 0);
}
