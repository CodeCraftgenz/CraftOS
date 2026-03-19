/// Layout principal — sidebar + conteúdo com transição animada

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { PageTransition } from "../ui/PageTransition";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useTheme } from "../../hooks/useTheme";

export function MainLayout() {
  const location = useLocation();
  useKeyboardShortcuts();
  useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-app">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
