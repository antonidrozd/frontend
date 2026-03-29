import { create } from "zustand";

import type { UploadFileResponse } from "@/api/client";

type UploadStore = {
  response: UploadFileResponse | null;
  setResponse: (response: UploadFileResponse) => void;
  clearResponse: () => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  response: null,
  setResponse: (response) => set({ response }),
  clearResponse: () => set({ response: null }),
}));
