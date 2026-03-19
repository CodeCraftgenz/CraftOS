/// Layout principal — sidebar fixa + área de conteúdo scrollável

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-app">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
