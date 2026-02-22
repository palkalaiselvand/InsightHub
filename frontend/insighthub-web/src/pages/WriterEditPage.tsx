import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

interface Post {
  id: string;
  title: string;
  status: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export default function WriterEditPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  async function load() {
    try {
      const [postResponse, categoryResponse] = await Promise.all([
        api.get<Post[]>("/posts"),
        api.get<Category[]>("/categories")
      ]);
      setPosts(postResponse.data);
      setCategories(categoryResponse.data);
    } catch {
      setError("Could not load posts.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removePost(id: string) {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch {
      setError("Delete failed.");
    }
  }

  return (
    <main className="page wide">
      <h1>Edit Posts</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{categoryMap[post.categoryId] ?? "Unknown"}</td>
              <td>{post.status}</td>
              <td>
                <button type="button" onClick={() => removePost(post.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
