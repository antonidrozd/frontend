import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export type UploadWarningLevel = "info" | "warning" | "critical";

export type UploadWarning = {
  level: UploadWarningLevel;
  message: string;
};

export type UploadFileResponse = {
  warning: UploadWarning[];
  infoAmmount: number;
  warningAmmount: number;
  criticalAmmount: number;
  fileType: string;
  data: {
    original: string;
    refined: string;
  };
  sumary: string;
};

type UploadFileOptions = {
  file: File;
  summarize?: boolean;
  faceBlur?: boolean;
  noOriginal?: boolean;
};

export async function uploadFile({
  file,
  summarize = false,
  faceBlur = false,
  noOriginal = false,
}: UploadFileOptions) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<UploadFileResponse>(
    "/upload/file",
    formData,
    {
      params: {
        sumarize: summarize,
        faceBlur,
        noOriginal,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export default api;
