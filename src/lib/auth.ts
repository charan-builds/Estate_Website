import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length > 0 && user.email && allowedEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  if (allowedEmails.length === 0) {
    return true;
  }

  const token = await user.getIdTokenResult();
  return token.claims.admin === true;
}

export async function loginAdmin(email: string, password: string) {
  if (!auth) {
    throw new Error("Authentication is unavailable.");
  }

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

export async function logoutAdmin() {
  if (!auth) {
    return;
  }

  await auth.signOut();
}
