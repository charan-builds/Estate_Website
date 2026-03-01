import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/* ---------------- ADMIN CHECK ---------------- */

export async function isAdminUser(user: User | null) {
  if (!user) return false;

  const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  // If admin emails are defined → strictly check
  if (allowedEmails.length > 0) {
    return Boolean(
      user.email && allowedEmails.includes(user.email.toLowerCase())
    );
  }

  // If no env restriction → allow authenticated users
  return true;
}

/* ---------------- LOGIN ---------------- */

export async function loginAdmin(email: string, password: string) {
  if (!auth) {
    throw new Error("Authentication is unavailable.");
  }

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  // 🔐 SESSION-ONLY LOGIN (logout on tab/browser close)
  await setPersistence(auth, browserSessionPersistence);

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/* ---------------- AUTH LISTENER ---------------- */

export function subscribeToAdminAuth(
  callback: (user: User | null) => void
) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

/* ---------------- LOGOUT ---------------- */

export async function logoutAdmin() {
  if (!auth) return;
  await auth.signOut();
}