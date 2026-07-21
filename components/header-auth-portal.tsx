"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthAccountAction } from "@/components/auth-account-action";

export function HeaderAuthPortal() {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    const locate = () => {
      setTarget(document.querySelector(".site-header-actions"));
    };

    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return target ? createPortal(<AuthAccountAction />, target) : null;
}
