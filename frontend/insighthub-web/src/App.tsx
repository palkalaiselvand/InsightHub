import { Navigate, Route, Routes } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function HomePage() {
  return <DashboardPage title="Reader Home" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin"
        element={
          <RouteGuard role="Admin">
            <DashboardPage title="Admin Dashboard" />
          </RouteGuard>
        }
      />
      <Route
        path="/writer"
        element={
          <RouteGuard role="Writer">
            <DashboardPage title="Writer Dashboard" />
          </RouteGuard>
        }
      />
      <Route
        path="/home"
        element={
          <RouteGuard>
            <HomePage />
          </RouteGuard>
        }
      />
    </Routes>
  );
}
