import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <h1>{title}</h1>
      <p>
        Welcome, <strong>{user?.name}</strong> ({user?.role})
      </p>
      <div className="actions">
        <Link to="/home">Home</Link>
        <Link to="/login" onClick={logout}>
          Logout
        </Link>
      </div>
    </main>
  );
}
