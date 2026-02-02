import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext";
import AppRoutes from "./routes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </SocketProvider>
    </BrowserRouter>
  );
}
