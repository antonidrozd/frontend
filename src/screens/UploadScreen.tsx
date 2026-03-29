import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { uploadFile } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import UploadDropzone from "@/components/upload/UploadDropzone";

const UploadScreen = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [eraseFacesEnabled, setEraseFacesEnabled] = useState(false);
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(false);

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    try {
      const response = await uploadFile({
        file: selectedFile,
        summarize: aiSummaryEnabled,
      });

      console.log("Upload response:", response);
      console.log("Erase faces enabled:", eraseFacesEnabled);
    } catch (error) {
      console.error("Upload failed:", error);
    }
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
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="shadow-sm hover:border-primary"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload
            <ArrowRight />
          </Button>
        </div>

        <div className="hidden md:block" />
      </div>
    </div>
  );
};

export default UploadScreen;
