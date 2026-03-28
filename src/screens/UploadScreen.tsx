import { useState } from "react";

import UploadDropzone from "@/components/upload/UploadDropzone";

const UploadScreen = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    </div>
  );
};

export default UploadScreen;
