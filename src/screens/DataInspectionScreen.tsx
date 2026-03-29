import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageViewer from "@/components/DataViewer/ImageViewer";
import PdfViewer from "@/components/DataViewer/PdfViewer";
import TextViewer from "@/components/DataViewer/TextViewer";
import type { UploadWarning, UploadWarningLevel } from "@/api/client";
import { Button } from "@/components/ui/button";
import { useUploadStore } from "@/store/uploadStore";

const supportedTextFileTypes = new Set(["txt", "md", "csv"]);
const supportedImageFileTypes = new Set(["jpg", "jpeg", "png", "svg"]);
const supportedPdfFileTypes = new Set(["pdf"]);

type WarningTileProps = {
  title: string;
  count: number;
  messages: UploadWarning[];
  level: UploadWarningLevel;
};

const warningTileStyles: Record<
  UploadWarningLevel,
  {
    border: string;
    badge: string;
    count: string;
  }
> = {
  critical: {
    border: "border-destructive/40 hover:border-destructive/60",
    badge: "bg-destructive/12 text-destructive",
    count: "text-destructive",
  },
  warning: {
    border: "border-[var(--warning)]/40 hover:border-[var(--warning)]/60",
    badge: "bg-[color:color-mix(in_oklch,var(--warning)_12%,transparent)] text-[var(--warning)]",
    count: "text-[var(--warning)]",
  },
  info: {
    border: "border-info/40 hover:border-info/60",
    badge: "bg-info/12 text-info",
    count: "text-info",
  },
};

function WarningTile({ title, count, messages, level }: WarningTileProps) {
  const styles = warningTileStyles[level];
  const Icon =
    level === "critical"
      ? AlertOctagon
      : level === "warning"
        ? AlertTriangle
        : Info;

  return (
    <section
      className={`bg-card/70 border-border/60 rounded-[24px] border p-5 backdrop-blur transition-colors ${styles.border}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className={`flex size-12 items-center justify-center rounded-2xl text-sm font-semibold ${styles.badge}`}
        >
          <Icon className="size-5" />
        </div>
        <p className={`text-4xl font-semibold tracking-tight ${styles.count}`}>
          {count}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">
            {count === 1 ? "1 entry detected" : `${count} entries detected`}
          </p>
        </div>

        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((warning, index) => (
              <div
                key={`${warning.level}-${warning.message}-${index}`}
                className="bg-background/60 border-border/60 rounded-xl border px-4 py-3"
              >
                <p className="text-foreground/90 text-sm leading-6">
                  {warning.message}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-background/60 border-border/60 rounded-xl border px-4 py-3">
              <p className="text-muted-foreground text-sm leading-6">
                No details available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function decodeBase64Content(value: string) {
  if (!value) {
    return "";
  }

  try {
    const normalizedValue = value.replace(/\s+/g, "");

    if (!normalizedValue || normalizedValue.length % 4 !== 0) {
      return value;
    }

    const decoded = atob(normalizedValue);
    const bytes = Uint8Array.from(decoded, (character) =>
      character.charCodeAt(0),
    );

    return new TextDecoder().decode(bytes);
  } catch {
    return value;
  }
}

export function DataInspectionScreen() {
  const navigate = useNavigate();
  const response = useUploadStore((state) => state.response);
  const fileType = response?.fileType?.toLowerCase() ?? "";
  const isSupportedTextFile = supportedTextFileTypes.has(fileType);
  const isSupportedImageFile = supportedImageFileTypes.has(fileType);
  const isSupportedPdfFile = supportedPdfFileTypes.has(fileType);
  const aiSummary = response?.sumary?.trim() || "No AI summary available.";
  const warnings = response?.warning ?? [];
  const criticalWarnings = warnings.filter((warning) => warning.level === "critical");
  const warningWarnings = warnings.filter((warning) => warning.level === "warning");
  const infoWarnings = warnings.filter((warning) => warning.level === "info");

  const originalContent = response?.data.original
    ? decodeBase64Content(response.data.original)
    : "Brak danych oryginalnych.";
  const processedContent = response?.data.refined
    ? decodeBase64Content(response.data.refined)
    : "Brak danych przetworzonych.";
  const imageMimeType =
    fileType === "jpg" || fileType === "jpeg"
      ? "image/jpeg"
      : fileType === "svg"
        ? "image/svg+xml"
        : "image/png";

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 space-y-3">
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">
          Validation
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Compare original and processed data
        </h1>
        <p className="text-muted-foreground text-base">
          Preview both versions side by side before we connect this view to the
          backend.
        </p>
      </div>

      {isSupportedTextFile ? (
        <TextViewer
          originalPanel={{ content: originalContent }}
          processedPanel={{ content: processedContent }}
        />
      ) : isSupportedImageFile ? (
        <ImageViewer
          originalPanel={{
            content: response?.data.original ?? "",
            mimeType: imageMimeType,
          }}
          processedPanel={{
            content: response?.data.refined ?? "",
            mimeType: imageMimeType,
          }}
        />
      ) : isSupportedPdfFile ? (
        <PdfViewer
          originalPanel={{
            content: response?.data.original ?? "",
          }}
          processedPanel={{
            content: response?.data.refined ?? "",
          }}
        />
      ) : (
        <div className="border-border/60 bg-card/60 text-muted-foreground rounded-[28px] border px-6 py-8 text-base backdrop-blur">
          This preview is currently available for `.txt`, `.md`, `.csv`, `.jpg`,
          `.png`, `.svg`, and `.pdf` files.
        </div>
      )}

      <section className="bg-card/70 border-border/60 mt-6 overflow-hidden rounded-[28px] border backdrop-blur transition-colors">
        <div className="border-border/50 border-b px-6 py-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              AI Summary
            </h2>
            <p className="text-muted-foreground text-base">
              Generated summary of the processed content.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-background/70 border-border/70 rounded-2xl border px-6 py-7">
            <p className="text-foreground/90 text-base leading-8 whitespace-pre-wrap">
              {aiSummary}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <WarningTile
          title="Critical"
          count={response?.criticalAmmount ?? criticalWarnings.length}
          messages={criticalWarnings}
          level="critical"
        />
        <WarningTile
          title="Warning"
          count={response?.warningAmmount ?? warningWarnings.length}
          messages={warningWarnings}
          level="warning"
        />
        <WarningTile
          title="Info"
          count={response?.infoAmmount ?? infoWarnings.length}
          messages={infoWarnings}
          level="info"
        />
      </div>

      <div className="flex justify-center pt-8">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="shadow-sm hover:border-primary"
          onClick={() => navigate("/metadata")}
        >
          Validate
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
