import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import { DataInspectionScreen } from "@/screens/DataInspectionScreen";
import UploadScreen from "@/screens/UploadScreen";
import { MetadataScreen } from "@/screens/MetadataScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <UploadScreen />,
      },
      {
        path: "validation",
        element: <DataInspectionScreen />,
      },
      {
        path: "metadata",
        element: <MetadataScreen />,
      },
    ],
  },
]);
