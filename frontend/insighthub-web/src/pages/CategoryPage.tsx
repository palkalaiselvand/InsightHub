import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

interface ReaderPost {
  id: string;
  title: string;
  content: string;
  categoryName: string;
  authorName: string;
  createdAt: string;
}

function preview(content: string) {
  const plain = content.replace(/<[^>]+>/g, "").trim();
  return plain.length > 140 ? `${plain.slice(0, 140)}...` : plain;
}

export default function CategoryPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<ReaderPost[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<ReaderPost[]>(`/posts/published?categoryId=${id}`)
      .then(({ data }) => setPosts(data))
      .catch(() => setError("Could not load category posts."));
  }, [id]);

  return (
    <main className="page wide">
      <h1>{posts[0]?.categoryName ?? "Category"}</h1>
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
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
