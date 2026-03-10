import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ConnectProfiles from "./pages/ConnectProfiles";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Compare from "./pages/Compare";
import TopicAnalysis from "./pages/TopicAnalysis";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isDashboardPage = ['/dashboard', '/connect', '/analysis', '/goals', '/history', '/compare', '/topics', '/reports', '/settings'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-900 transition-colors duration-300">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        {isDashboardPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main className={`flex-1 transition-all duration-300 ${isDashboardPage ? 'lg:ml-64' : ''}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/connect"
              element={
                <ProtectedRoute>
                  <ConnectProfiles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics"
              element={
                <ProtectedRoute>
                  <TopicAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;