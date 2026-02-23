import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Writer" | "Reader";
  };
  message: string;
}

const roleRoute: Record<string, string> = {
  Admin: "/admin",
  Writer: "/writer",
  Reader: "/home"
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@insighthub.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
      login(data.user);
      navigate(roleRoute[data.user.role] ?? "/home");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
