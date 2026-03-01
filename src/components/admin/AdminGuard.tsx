"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminUser } from "@/lib/auth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth) {
      router.replace("/admin/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const isAdmin = await isAdminUser(user);

      if (!isAdmin) {
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking admin access…
      </div>
    );
  }

  return <>{children}</>;
}