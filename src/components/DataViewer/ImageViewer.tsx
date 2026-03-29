import { ArrowRight, Eye, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

type DataViewerTone = "success" | "danger";
type ImageMimeType = "image/jpeg" | "image/png" | "image/svg+xml";

type ImagePanel = {
  title: string;
  description: string;
  content: string;
  tone: DataViewerTone;
  mimeType?: ImageMimeType;
};

type ImageViewerProps = {
  originalPanel?: Partial<ImagePanel>;
  processedPanel?: Partial<ImagePanel>;
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
    badge: "bg-sky-500/12 text-sky-300 ring-1 ring-sky-500/20",
    icon: "text-sky-400",
    border: "border-sky-500/15",
    glow: "hover:border-sky-400/30",
  },
};

function buildImageSource(content: string, mimeType: ImageMimeType) {
  if (!content) {
    return "";
  }

  if (
    content.startsWith("data:image/") ||
    content.startsWith("http://") ||
    content.startsWith("https://") ||
    content.startsWith("/")
  ) {
    return content;
  }

  return `data:${mimeType};base64,${content}`;
}

function ImageViewerPanel({
  title,
  description,
  content,
  tone,
  mimeType = "image/png",
}: ImagePanel) {
  const styles = toneStyles[tone];
  const Icon = tone === "danger" ? Eye : ArrowRight;
  const imageSource = buildImageSource(content, mimeType);

  return (
    <section
      className={cn(
        "bg-card/70 border-border/60 flex min-h-[420px] flex-col overflow-hidden rounded-[28px] border backdrop-blur transition-colors",
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
        <div className="bg-background/70 border-border/70 flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border p-4">
          {imageSource ? (
            <img
              src={imageSource}
              alt={title}
              className="max-h-[420px] w-full max-w-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-center">
              <div className="bg-muted/60 rounded-2xl p-4">
                <ImageOff className="size-6" />
              </div>
              <p className="text-sm">No image available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ImageViewer({
  originalPanel,
  processedPanel,
  className,
}: ImageViewerProps) {
  const originalData: ImagePanel = {
    title: "Dane oryginalne",
    description: "Surowy obraz przed przetworzeniem",
    content: "",
    tone: "danger",
    mimeType: "image/png",
    ...originalPanel,
  };

  const processedData: ImagePanel = {
    title: "Dane przetworzone",
    description: "Obraz po oczyszczeniu i przetworzeniu",
    content: "",
    tone: "success",
    mimeType: "image/png",
    ...processedPanel,
  };

  return (
    <div className={cn("grid gap-6 xl:grid-cols-2", className)}>
      <ImageViewerPanel {...originalData} />
      <ImageViewerPanel {...processedData} />
    </div>
  );
}
