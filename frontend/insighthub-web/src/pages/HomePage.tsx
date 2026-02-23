import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  authorName: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

function preview(content: string) {
  const plain = content.replace(/<[^>]+>/g, "").trim();
  return plain.length > 160 ? `${plain.slice(0, 160)}...` : plain;
}

  const [posts, setPosts] = useState<ReaderPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setError("Could not load categories."));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get<{ posts: ReaderPost[]; totalPages: number }>("/posts/published", {
        params: { categoryId, page }
      })
      .then(({ data }) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load published posts.");
        setLoading(false);
      });
  }, [categoryId, page]);

  return (
    <main className="page wide">
      <h1>Latest Articles</h1>
      <div className="filter-bar">
        <label>Category:</label>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="cards">
        {posts.length === 0 && !loading && <p>No articles found.</p>}
        {posts.map((post) => (
          <article key={post.id} className="card">
            <h2>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <p>{preview(post.content)}</p>
            <div className="meta">
              <span>By {post.authorName}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <Link to={`/category/${post.categoryId}`}>{post.categoryName}</Link>
            </div>
          </article>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </main>
  );
}
