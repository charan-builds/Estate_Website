"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdminUser, subscribeToAdminAuth } from "@/lib/auth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth(async (user) => {
      const authorized = await isAdminUser(user);
      setIsAuthorized(authorized);
      setAuthChecked(true);

      if (!authorized && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }

      if (authorized && pathname === "/admin/login") {
        router.replace("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // ⏳ Prevent flicker / unauthorized flash
  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking admin access...</p>
      </div>
    );
  }

  if (!isAuthorized && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
