import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  categoryId: string;
  authorId: string;
}

interface Category {
  id: string;
  name: string;
}

  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editError, setEditError] = useState("");

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

  function startEdit(post: Post) {
    if (user?.id !== post.authorId) {
      setEditError("You can only edit your own posts.");
      return;
    }
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategoryId(post.categoryId);
    setEditStatus(post.status);
    setEditError("");
  }

  function cancelEdit() {
    setEditingPost(null);
    setEditError("");
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPost) return;
    try {
      await api.put(`/posts/${editingPost.id}`, {
        title: editTitle,
        content: editContent,
        categoryId: editCategoryId,
        status: editStatus
      });
      setPosts((current) =>
        current.map((post) =>
          post.id === editingPost.id
            ? { ...post, title: editTitle, content: editContent, categoryId: editCategoryId, status: editStatus }
            : post
        )
      );
      setEditingPost(null);
    } catch {
      setEditError("Update failed.");
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
                <button type="button" onClick={() => startEdit(post)}>
                  Edit
                </button>
                <button type="button" onClick={() => removePost(post.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPost && (
        <div className="modal">
          <form onSubmit={submitEdit} className="edit-form">
            <h2>Edit Post</h2>
            <label>Title</label>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
            <label>Content</label>
            <ReactQuill value={editContent} onChange={setEditContent} theme="snow" />
            <label>Category</label>
            <select value={editCategoryId} onChange={e => setEditCategoryId(e.target.value)} required>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label>Status</label>
            <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            {editError && <p className="error">{editError}</p>}
            <button type="submit">Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
}
