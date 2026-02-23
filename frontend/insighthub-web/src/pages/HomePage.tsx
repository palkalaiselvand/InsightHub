import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface ReaderPost {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  authorName: string;
  createdAt: string;
}

function preview(content: string) {
  const plain = content.replace(/<[^>]+>/g, "").trim();
  return plain.length > 160 ? `${plain.slice(0, 160)}...` : plain;
}

export default function HomePage() {
  const [posts, setPosts] = useState<ReaderPost[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<ReaderPost[]>("/posts/published")
      .then(({ data }) => setPosts(data))
      .catch(() => setError("Could not load published posts."));
  }, []);

  return (
    <main className="page wide">
      <h1>Latest Articles</h1>
      {error && <p className="error">{error}</p>}
      <div className="cards">
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
    </main>
  );
}
