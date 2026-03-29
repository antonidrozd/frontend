import { useEffect, useRef, useState } from "react";
import { ArrowRight, Eye, FileX2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type DataViewerTone = "success" | "danger";

type PdfPanel = {
  title: string;
  description: string;
  content: string;
  tone: DataViewerTone;
};

type PdfViewerProps = {
  originalPanel?: Partial<PdfPanel>;
  processedPanel?: Partial<PdfPanel>;
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

function decodeBase64ToBytes(content: string) {
  if (!content) {
    return null;
  }

  try {
    const normalizedContent = content
      .trim()
      .replace(/^data:application\/pdf;base64,/, "")
      .replace(/^['"]|['"]$/g, "")
      .replace(/^b['"]|['"]$/g, "")
      .replace(/\s+/g, "");

    if (!normalizedContent) {
      return null;
    }

    const decoded = atob(normalizedContent);
    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function PdfViewerPanel({
  title,
  description,
  content,
  tone,
}: PdfPanel) {
  const styles = toneStyles[tone];
  const Icon = tone === "danger" ? Eye : ArrowRight;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(640);
  const [pages, setPages] = useState(0);
  const [pageAspectRatio, setPageAspectRatio] = useState(1.414);
  const fileData = decodeBase64ToBytes(content);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setPageWidth(Math.max(element.clientWidth - 32, 280));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn(
        "bg-card/70 border-border/60 flex flex-col overflow-hidden rounded-[28px] border backdrop-blur transition-colors",
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
        <div
          ref={containerRef}
          className="bg-background/70 border-border/70 flex h-full w-full items-start justify-center overflow-hidden rounded-2xl border p-4"
          style={{ height: `${pageWidth * pageAspectRatio + 32}px` }}
        >
          {fileData ? (
            <Document
              file={{ data: fileData }}
              loading={
                <div className="text-muted-foreground py-12 text-center text-sm">
                  Loading PDF preview...
                </div>
              }
              error={
                <div className="text-destructive py-12 text-center text-sm">
                  Unable to load this PDF preview.
                </div>
              }
              onLoadSuccess={async (pdf) => {
                setPages(pdf.numPages);

                const firstPage = await pdf.getPage(1);
                const viewport = firstPage.getViewport({ scale: 1 });

                if (viewport.width > 0 && viewport.height > 0) {
                  setPageAspectRatio(viewport.height / viewport.width);
                }
              }}
            >
              {pages > 0 ? (
                <Page
                  key={`${title}-1`}
                  pageNumber={1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
                />
              ) : null}
            </Document>
          ) : (
            <div className="text-muted-foreground flex h-full min-h-[288px] flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted/60 rounded-2xl p-4">
                <FileX2 className="size-6" />
              </div>
              <p className="text-sm">No PDF available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PdfViewer({
  originalPanel,
  processedPanel,
  className,
}: PdfViewerProps) {
  const originalData: PdfPanel = {
    title: "Dane oryginalne",
    description: "Surowy plik PDF przed przetworzeniem",
    content: "",
    tone: "danger",
    ...originalPanel,
  };

  const processedData: PdfPanel = {
    title: "Dane przetworzone",
    description: "PDF po oczyszczeniu i przetworzeniu",
    content: "",
    tone: "success",
    ...processedPanel,
  };

  return (
    <div className={cn("grid gap-6 xl:grid-cols-2", className)}>
      <PdfViewerPanel {...originalData} />
      <PdfViewerPanel {...processedData} />
    </div>
  );
}
