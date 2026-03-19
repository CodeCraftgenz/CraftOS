/// Visualização Treemap — mapa visual de disco

import { useState } from "react";
import { useScanResult, useIsScanning, useDiskActions } from "../stores/diskStore";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Treemap } from "../components/charts/Treemap";
import { formatBytes } from "../utils/format";
import type { DirectoryNode } from "../types";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" />
    <line x1="12" y1="3" x2="12" y2="12" /><line x1="8" y1="12" x2="8" y2="21" />
  </svg>
);

const SearchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export function TreemapView() {
  const scanResult = useScanResult();
  const isScanning = useIsScanning();
  const { runFullScan } = useDiskActions();
  const [scanPath, setScanPath] = useState("C:\\");
  const [breadcrumb, setBreadcrumb] = useState<DirectoryNode[]>([]);

  const currentNode = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1] : scanResult?.root;

  const handleNodeClick = (node: DirectoryNode) => {
    if (node.children.length > 0) {
      setBreadcrumb([...breadcrumb, node]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumb(breadcrumb.slice(0, index));
  };

  const handleScan = async () => {
    setBreadcrumb([]);
    await runFullScan(scanPath, 4);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Mapa Visual de Disco"
        subtitle="Visualização treemap — clique para navegar"
        icon={PageIcon}
      />

      <div className="card-static p-5">
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-[11px] text-text-muted font-medium mb-1.5">Caminho</label>
            <input type="text" value={scanPath} onChange={(e) => setScanPath(e.target.value)} />
          </div>
          <Button onClick={handleScan} loading={isScanning} icon={SearchIcon}>
            Gerar Mapa
          </Button>
        </div>
      </div>

      {currentNode && (
        <div className="flex items-center gap-1.5 text-[13px] flex-wrap">
          <button onClick={() => setBreadcrumb([])} className="text-primary-light hover:text-primary font-medium transition-colors">
            Raiz
          </button>
          {breadcrumb.map((node, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-text-muted">/</span>
              <button onClick={() => handleBreadcrumbClick(i + 1)} className="text-primary-light hover:text-primary font-medium transition-colors">
                {node.name}
              </button>
            </span>
          ))}
          <span className="text-text-muted ml-2 text-[12px]">({formatBytes(currentNode.size)})</span>
        </div>
      )}

      {currentNode ? (
        <Treemap data={currentNode} width={1000} height={550} onNodeClick={handleNodeClick} />
      ) : (
        <div className="card-static p-12 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted mx-auto mb-4">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" />
            <line x1="12" y1="3" x2="12" y2="12" /><line x1="8" y1="12" x2="8" y2="21" />
          </svg>
          <p className="text-text-muted text-[14px]">Execute um scan para gerar o mapa visual</p>
        </div>
      )}
    </div>
  );
}
