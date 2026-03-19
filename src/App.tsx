/// CraftOS — Central de Controle Tracbel Agro

import { HashRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AppToaster } from "./components/ui/Toast";
import { Dashboard } from "./pages/Dashboard";
import { DiskAnalysis } from "./pages/DiskAnalysis";
import { TreemapView } from "./pages/TreemapView";
import { LargestFiles } from "./pages/LargestFiles";
import { ResourceMonitor } from "./pages/ResourceMonitor";
import { SmartCleanup } from "./pages/SmartCleanup";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disk-analysis" element={<DiskAnalysis />} />
          <Route path="/treemap" element={<TreemapView />} />
          <Route path="/largest-files" element={<LargestFiles />} />
          <Route path="/resources" element={<ResourceMonitor />} />
          <Route path="/cleanup" element={<SmartCleanup />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
      <AppToaster />
    </HashRouter>
  );
}

export default App;
