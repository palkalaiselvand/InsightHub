import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { Helmet } from "react-helmet";
import DOMPurify from "dompurify";

interface ReaderPost {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  authorName: string;
  createdAt: string;
}

  const { id } = useParams();
  const [post, setPost] = useState<ReaderPost | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ReaderPost>(`/posts/published/${id}`)
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load this article.");
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="page wide">
      {post && (
        <Helmet>
          <title>{post.title} | InsightHub</title>
          <meta name="description" content={post.content.replace(/<[^>]+>/g, "").slice(0, 160)} />
        </Helmet>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {post && (
        <article>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>By {post.authorName}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <Link to={`/category/${post.categoryId}`}>{post.categoryName}</Link>
          </div>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        </article>
      )}
      {!loading && !post && !error && <p>No article found.</p>}
    </main>
  );
}
