import { FileText, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadDropzoneProps = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
};

const accept = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt", ".md", ".csv"],
  "image/svg+xml": [".svg"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadDropzone = ({ file, onFileSelect }: UploadDropzoneProps) => {
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      if (!selectedFile) return;

      setError("");
      onFileSelect(selectedFile);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: () => {
      setError("Allowed formats: PDF, TXT, MD, CSV, SVG, JPG, PNG.");
    },
    accept,
    multiple: false,
    noClick: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: cn(
            "border-border bg-card/70 hover:border-primary/70 hover:bg-card flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition-colors",
            error && "border-destructive/70 bg-destructive/6",
            isDragActive && "border-primary bg-primary/10",
          ),
        })}
      >
        <input {...getInputProps()} />

        <div className="bg-primary/12 text-primary mb-5 rounded-full p-4">
          <UploadCloud className="size-8" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          {isDragActive
            ? "Drop the file here"
            : "Drag a file here or click to choose one"}
        </h2>

        <p className="text-muted-foreground mt-3 text-sm">
          Allowed formats: PDF, TXT, MD, CSV, SVG, JPG, PNG.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" className="h-10" onClick={open}>
            Choose file
          </Button>
          <span className="text-muted-foreground text-sm">
            One file at a time
          </span>
        </div>
      </div>

      {error && <p className="text-destructive text-sm font-medium">{error}</p>}

      {file && (
        <div className="border-border bg-card flex items-center justify-between gap-4 rounded-2xl border px-4 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-muted text-foreground rounded-xl p-3">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.name}</p>
              <p className="text-muted-foreground truncate text-sm">
                {file.type || "Unknown type"} • {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Delete the chosen file"
            onClick={() => {
              setError("");
              onFileSelect(null);
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;
