import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

type UploadFileOptions = {
  file: File;
  summarize?: boolean;
};

export async function uploadFile({
  file,
  summarize = false,
}: UploadFileOptions) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload/file", formData, {
    params: { sumarize: summarize },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export default api;
