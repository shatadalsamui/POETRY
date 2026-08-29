"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // When the route/pathname changes, immediately reset scroll to the top
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
      const scrollContainer = document.getElementById("main-scroll-container");
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
      // Fallback in case of layout paint delay
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant" as ScrollBehavior,
        });
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
