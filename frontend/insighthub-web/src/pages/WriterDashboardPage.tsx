import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function WriterDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="page wide">
      <h1>Writer Dashboard</h1>
      <p>Welcome {user?.name}. Manage your articles below.</p>
      <div className="actions">
        <Link to="/writer/create">Create Post</Link>
        <Link to="/writer/edit">Edit Existing Posts</Link>
      </div>
    </main>
  );
}
