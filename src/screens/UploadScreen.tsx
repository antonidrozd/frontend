import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadFile } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Toggle } from "@/components/ui/toggle";
import UploadDropzone from "@/components/upload/UploadDropzone";
import { useUploadStore } from "@/store/uploadStore";

const UploadScreen = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [eraseFacesEnabled, setEraseFacesEnabled] = useState(false);
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const setUploadResponse = useUploadStore((state) => state.setResponse);
  const clearUploadResponse = useUploadStore((state) => state.clearResponse);

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    clearUploadResponse();
    setUploadError(null);
    setIsUploading(true);

    try {
      const response = await uploadFile({
        file: selectedFile,
        summarize: aiSummaryEnabled,
        faceBlur: eraseFacesEnabled,
      });

      setUploadResponse(response);
      setDrawerOpen(false);
      console.log("Upload response:", response);
      navigate("/validation");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(
        error instanceof Error ? error.message : "Upload failed. Try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function formatFileSize(size: number) {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 space-y-3">
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">
          Upload
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Upload a file for processing
        </h1>
        <p className="text-muted-foreground text-base">
          Choose a file by clicking or dragging and dropping it here, and the
          app will show the selected file.
        </p>
      </div>

      <UploadDropzone file={selectedFile} onFileSelect={setSelectedFile} />

      <div className="grid gap-4 pt-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex flex-wrap justify-center gap-3 md:justify-self-start">
          <Toggle
            variant="outline"
            size="lg"
            pressed={eraseFacesEnabled}
            onPressedChange={setEraseFacesEnabled}
          >
            Erase faces
          </Toggle>
          <Toggle
            variant="outline"
            size="lg"
            pressed={aiSummaryEnabled}
            onPressedChange={setAiSummaryEnabled}
          >
            AI Summary
          </Toggle>
        </div>

        <div className="flex justify-center">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="shadow-sm hover:border-primary"
                disabled={!selectedFile}
              >
                Upload
                <ArrowRight />
              </Button>
            </DrawerTrigger>

            <DrawerContent className="mx-auto w-full max-w-3xl">
              <DrawerHeader className="px-6 pt-6 text-left">
                <DrawerTitle>Confirm upload</DrawerTitle>
                <DrawerDescription>
                  Review the selected file and options before sending anything
                  to the API.
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-4 px-6 py-4">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {selectedFile?.name ?? "No file selected"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedFile ? formatFileSize(selectedFile.size) : null}
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-card/70 p-3">
                    <p className="text-sm font-medium text-foreground">
                      AI Summary
                    </p>
                    <p
                      className={`mt-1 text-sm ${aiSummaryEnabled ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {aiSummaryEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-card/70 p-3">
                    <p className="text-sm font-medium text-foreground">
                      Face blur
                    </p>
                    <p
                      className={`mt-1 text-sm ${eraseFacesEnabled ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {eraseFacesEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                {uploadError ? (
                  <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {uploadError}
                  </div>
                ) : null}
              </div>

              <DrawerFooter className="px-6 pb-6">
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? "Uploading..." : "Send to API"}
                  <ArrowRight />
                </Button>

                <DrawerClose asChild>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="w-full"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="hidden md:block" />
      </div>
    </div>
  );
};

export default UploadScreen;
