import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { Helmet } from "react-helmet";

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

  const { id } = useParams();
  const [posts, setPosts] = useState<ReaderPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get<{ posts: ReaderPost[]; totalPages: number }>(`/posts/published`, {
        params: { categoryId: id, page }
      })
      .then(({ data }) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load category posts.");
        setLoading(false);
      });
  }, [id, page]);

  return (
    <main className="page wide">
      {posts[0] && (
        <Helmet>
          <title>{posts[0].categoryName} | InsightHub</title>
          <meta name="description" content={`Posts in ${posts[0].categoryName}`} />
        </Helmet>
      )}
      <h1>{posts[0]?.categoryName ?? "Category"}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="cards">
        {posts.length === 0 && !loading && <p>No articles found in this category.</p>}
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
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </main>
  );
}
