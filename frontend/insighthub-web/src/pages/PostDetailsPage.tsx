import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function PostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<ReaderPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<ReaderPost>(`/posts/published/${id}`)
      .then(({ data }) => setPost(data))
      .catch(() => setError("Could not load this article."));
  }, [id]);

  return (
    <main className="page wide">
      {error && <p className="error">{error}</p>}
      {post && (
        <article>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>By {post.authorName}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <Link to={`/category/${post.categoryId}`}>{post.categoryName}</Link>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      )}
    </main>
  );
}
