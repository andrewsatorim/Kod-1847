"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MiniAppPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/miniapp/menu");
  }, [router]);

  return null;
}
