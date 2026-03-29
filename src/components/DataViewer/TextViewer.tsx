import { ArrowRight, Eye } from "lucide-react";

import { cn } from "@/lib/utils";

type DataViewerTone = "success" | "danger";

type DataPanel = {
  title: string;
  description: string;
  content: string;
  tone: DataViewerTone;
};

type DataViewerProps = {
  originalPanel?: Partial<DataPanel>;
  processedPanel?: Partial<DataPanel>;
  className?: string;
};

const toneStyles: Record<
  DataViewerTone,
  {
    badge: string;
    icon: string;
    border: string;
    glow: string;
  }
> = {
  danger: {
    badge: "bg-red-500/12 text-red-300 ring-1 ring-red-500/20",
    icon: "text-red-400",
    border: "border-red-500/15",
    glow: "hover:border-red-400/30",
  },
  success: {
    badge: "bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-500/20",
    icon: "text-emerald-400",
    border: "border-emerald-500/15",
    glow: "hover:border-emerald-400/30",
  },
};

function DataViewerPanel({
  title,
  description,
  content,
  tone,
}: DataPanel) {
  const styles = toneStyles[tone];
  const Icon = tone === "danger" ? Eye : ArrowRight;

  return (
    <section
      className={cn(
        "bg-card/70 border-border/60 flex min-h-[360px] flex-col overflow-hidden rounded-[28px] border backdrop-blur transition-colors",
        styles.border,
        styles.glow,
      )}
    >
      <div className="border-border/50 flex items-start gap-4 border-b px-6 py-6">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            styles.badge,
          )}
        >
          <Icon className={cn("size-5", styles.icon)} />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-base">{description}</p>
        </div>
      </div>

      <div className="flex flex-1 p-6">
        <div className="bg-background/70 border-border/70 w-full overflow-x-auto rounded-2xl border px-6 py-7">
          <pre className="text-foreground/90 text-lg leading-8 whitespace-pre font-mono">
            {content}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default function DataViewer({
  originalPanel,
  processedPanel,
  className,
}: DataViewerProps) {
  const originalData: DataPanel = {
    title: "Dane oryginalne",
    description: "Surowe dane przed przetworzeniem",
    content: "Brak danych oryginalnych.",
    tone: "danger",
    ...originalPanel,
  };

  const processedData: DataPanel = {
    title: "Dane przetworzone",
    description: "Oczyszczone i bezpieczne dane",
    content: "Brak danych przetworzonych.",
    tone: "success",
    ...processedPanel,
  };

  return (
    <div
      className={cn(
        "grid gap-6 xl:grid-cols-2",
        className,
      )}
    >
      <DataViewerPanel {...originalData} />
      <DataViewerPanel {...processedData} />
    </div>
  );
}
