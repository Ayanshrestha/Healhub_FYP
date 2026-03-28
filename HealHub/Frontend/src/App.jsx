import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext";
import AppRoutes from "./routes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1e293b',
              fontWeight: '600',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '12px 24px',
            },
            success: {
              iconTheme: {
                primary: '#0D9488', // HealHub Teal
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444', // Danger Red
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes />
      </SocketProvider>
    </BrowserRouter>
  );
}
