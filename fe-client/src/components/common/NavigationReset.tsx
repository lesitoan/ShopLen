"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavigationReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset body overflow to default on any route navigation
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}
