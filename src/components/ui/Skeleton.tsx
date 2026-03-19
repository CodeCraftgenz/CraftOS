/// Skeleton loader para estados de carregamento

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const radiusMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({ width, height = "20px", className = "", rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${radiusMap[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

/** Skeleton para um metric card completo */
export function MetricCardSkeleton() {
  return (
    <div className="card-static p-5 space-y-3">
      <div className="flex items-center gap-2.5">
        <Skeleton width="32px" height="32px" rounded="lg" />
        <Skeleton width="80px" height="12px" />
      </div>
      <Skeleton width="120px" height="28px" />
      <Skeleton width="60px" height="12px" />
      <Skeleton height="5px" rounded="full" />
    </div>
  );
}

/** Skeleton para um chart */
export function ChartSkeleton() {
  return (
    <div className="card-static p-5">
      <Skeleton width="140px" height="12px" className="mb-4" />
      <Skeleton height="220px" rounded="lg" />
    </div>
  );
}
