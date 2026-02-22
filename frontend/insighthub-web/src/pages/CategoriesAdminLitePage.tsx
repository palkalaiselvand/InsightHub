import { FormEvent, useEffect, useState } from "react";
import api from "../services/api";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesAdminLitePage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await api.get<Category[]>("/categories");
      setCategories(data);
    } catch {
      setError("Could not load categories.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/categories", { name });
      setName("");
      await load();
    } catch {
      setError("Could not create category.");
    }
  }

  return (
    <main className="page wide">
      <h1>Categories</h1>
      <form onSubmit={onSubmit}>
        <label>New category name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit">Create Category</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </main>
  );
}
