import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not fetch posts (check backend).");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      alert("Please fill title and body.");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`/api/posts/${editingId}`, { title, body });
      } else {
        await axios.post("/api/posts", { title, body });
      }
      resetForm();
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Request failed.");
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const renderPosts = () => {
    if (loading) return React.createElement("div", null, "Loading…");
    if (posts.length === 0) return React.createElement("div", null, "No posts yet.");

    return React.createElement(
      "ul",
      null,
      posts.map((p) =>
        React.createElement(
          "li",
          { key: p.id, style: { marginBottom: 12 } },
          React.createElement("strong", null, p.title),
          React.createElement("p", { style: { margin: "4px 0" } }, p.body),
          React.createElement(
            "small",
            null,
            "id: " + p.id + " — created: " + new Date(p.created_at).toLocaleString()
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "button",
              { onClick: () => startEdit(p), style: { marginRight: 8 } },
              "Edit"
            ),
            React.createElement(
              "button",
              { onClick: () => handleDelete(p.id) },
              "Delete"
            )
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    { style: { maxWidth: 800, margin: "0 auto", padding: 20 } },
    React.createElement("h1", null, "Posts CRUD"),

    // Form
    React.createElement(
      "form",
      { onSubmit: handleSubmit, style: { marginBottom: 20 } },
      React.createElement("h3", null, editingId ? "Edit post" : "Create post"),
      React.createElement(
        "div",
        null,
        React.createElement("input", {
          placeholder: "Title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          style: { width: "100%", padding: 8, marginBottom: 8 },
        })
      ),
      React.createElement(
        "div",
        null,
        React.createElement("textarea", {
          placeholder: "Body",
          value: body,
          onChange: (e) => setBody(e.target.value),
          rows: 4,
          style: { width: "100%", padding: 8 },
        })
      ),
      React.createElement(
        "div",
        { style: { marginTop: 8 } },
        React.createElement("button", { type: "submit" }, editingId ? "Update" : "Create"),
        editingId &&
          React.createElement(
            "button",
            { type: "button", onClick: resetForm, style: { marginLeft: 8 } },
            "Cancel"
          )
      )
    ),

    React.createElement("hr"),
    React.createElement("h3", null, "All posts"),
    renderPosts()
  );
}
