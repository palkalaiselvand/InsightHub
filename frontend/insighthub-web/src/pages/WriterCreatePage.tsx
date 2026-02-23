import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Category {
  id: string;
  name: string;
}

export default function WriterCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("Draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then(({ data }) => {
        setCategories(data);
        if (data[0]) setCategoryId(data[0].id);
      })
      .catch(() => setError("Could not load categories."));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/posts", {
        title,
        content,
        categoryId,
        authorId: user?.id,
        status
      });
      navigate("/writer/edit");
    } catch {
      setError("Could not create post.");
    }
  }

  return (
    <main className="page wide">
      <h1>Create Post</h1>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />

        <label>Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>

        {error && <p className="error">{error}</p>}
        <button type="submit">Save Post</button>
      </form>
    </main>
  );
}
