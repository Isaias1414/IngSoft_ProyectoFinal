// src/App.jsx
import { AppProvider } from "./context/appcontext";
import AppRouter from "./router/approuter";
import Toast from "./components/ui/toast";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toast />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        @keyframes slideIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
    </AppProvider>
  );
}