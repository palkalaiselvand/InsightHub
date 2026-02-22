import { Navigate, Route, Routes } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import CategoriesAdminLitePage from "./pages/CategoriesAdminLitePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WriterCreatePage from "./pages/WriterCreatePage";
import WriterDashboardPage from "./pages/WriterDashboardPage";
import WriterEditPage from "./pages/WriterEditPage";

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
        path="/admin/categories"
        element={
          <RouteGuard role="Admin">
            <CategoriesAdminLitePage />
          </RouteGuard>
        }
      />

      <Route path="/writer" element={<Navigate to="/writer/dashboard" replace />} />
      <Route
        path="/writer/dashboard"
        element={
          <RouteGuard role="Writer">
            <WriterDashboardPage />
          </RouteGuard>
        }
      />
      <Route
        path="/writer/create"
        element={
          <RouteGuard role="Writer">
            <WriterCreatePage />
          </RouteGuard>
        }
      />
      <Route
        path="/writer/edit"
        element={
          <RouteGuard role="Writer">
            <WriterEditPage />
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
