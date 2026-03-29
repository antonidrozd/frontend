import { Outlet } from "react-router-dom";

import TopBar from "./components/TopBar";

function App() {
  return (
    <div className="bg-background min-h-screen">
      <TopBar />
      <Outlet />
    </div>
  );
}

export default App
