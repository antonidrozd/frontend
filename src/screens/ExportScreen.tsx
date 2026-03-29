import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileJson2,
  FolderTree,
} from "lucide-react";
import {
  JsonView,
  darkStyles as jsonDarkStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUploadStore } from "@/store/uploadStore";

const expandToSecondLevel = (level: number) => level < 2;

export function ExportScreen() {
  const uploadResponse = useUploadStore((state) => state.response);
  const [activeView, setActiveView] = useState<"tree" | "code">("tree");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log("Export screen response:", uploadResponse);
  }, [uploadResponse]);

  const exportData = uploadResponse ?? {
    status: "empty",
    message: "No export data available yet.",
  };

  const jsonString = useMemo(
    () => JSON.stringify(exportData, null, 2),
    [exportData],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function handleDownload() {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "refined-data.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 space-y-3">
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">
          Export
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Export your refined data
        </h1>
        <p className="text-muted-foreground text-base">
          Review the final JSON structure and export it when you are ready.
        </p>
      </div>

      <Card className="border-primary/35 bg-primary/8 mb-8 overflow-hidden rounded-[28px] border shadow-sm backdrop-blur">
        <CardContent className="flex items-start gap-4 px-6 py-6">
          <div className="bg-primary/18 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <CheckCircle2 className="size-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Processing complete
            </h2>
            <p className="text-muted-foreground text-lg leading-8">
              Your data has been validated, refined, and enriched. The JSON is
              ready for export.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 overflow-hidden rounded-[28px] border shadow-sm backdrop-blur">
        <CardHeader className="border-border/50 flex flex-col gap-5 border-b px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary/12 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <FileJson2 className="size-5" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-3xl font-semibold tracking-tight">
                Final result
              </CardTitle>
              <CardDescription className="text-base">
                Inspect the resulting JSON before copying or downloading it.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-background/60 flex rounded-xl border border-border p-1">
              <Button
                type="button"
                size="sm"
                variant={activeView === "tree" ? "default" : "ghost"}
                className={cn(
                  "rounded-lg",
                  activeView === "tree" && "shadow-sm",
                )}
                onClick={() => setActiveView("tree")}
              >
                <FolderTree className="size-4" />
                Tree
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeView === "code" ? "default" : "ghost"}
                className={cn(
                  "rounded-lg",
                  activeView === "code" && "shadow-sm",
                )}
                onClick={() => setActiveView("code")}
              >
                <FileJson2 className="size-4" />
                Code
              </Button>
            </div>

            <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>

            <Button type="button" size="sm" onClick={handleDownload}>
              <Download className="size-4" />
              Export JSON
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="bg-background/70 border-border/70 min-h-[560px] overflow-auto rounded-2xl border p-4">
            {activeView === "tree" ? (
              <div className="font-mono text-base">
                <JsonView
                  data={exportData}
                  shouldExpandNode={expandToSecondLevel}
                  clickToExpandNode
                  style={jsonDarkStyles}
                />
              </div>
            ) : (
              <pre className="text-foreground/90 text-base leading-7 whitespace-pre-wrap break-words font-mono">
                {jsonString}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
