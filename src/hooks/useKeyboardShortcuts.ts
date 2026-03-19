/// Hook para atalhos de teclado globais

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const shortcuts: Record<string, string> = {
  "1": "/",
  "2": "/disk-analysis",
  "3": "/treemap",
  "4": "/largest-files",
  "5": "/resources",
  "6": "/cleanup",
  "7": "/history",
  "8": "/settings",
  "9": "/help",
};

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Number para navegação
      if (e.ctrlKey && !e.shiftKey && !e.altKey && shortcuts[e.key]) {
        e.preventDefault();
        navigate(shortcuts[e.key]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}
