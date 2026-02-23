import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  authorName: string;
  status: string;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Post[]>("/posts")
      .then(({ data }) => setPosts(data))
      .catch(() => setError("Could not load posts."));
  }, []);

  return (
    <main className="page wide">
      <h1>Manage Posts</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td><Link to={`/post/${post.id}`}>{post.title}</Link></td>
              <td>{post.authorName}</td>
              <td>{post.status}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                {/* Actions: edit, delete, etc. */}
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
