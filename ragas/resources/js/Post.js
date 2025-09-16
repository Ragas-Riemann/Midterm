import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/Post.scss"; // import SCSS

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return alert("Fill all fields");

    try {
      if (editingId) {
        await axios.put(`/api/posts/${editingId}`, { title, body });
      } else {
        await axios.post("/api/posts", { title, body });
      }
      setTitle("");
      setBody("");
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return React.createElement(
    "div",
    { className: "dashboard" },

    // Sidebar
    React.createElement(
      "aside",
      { className: "sidebar" },
      React.createElement("h2", null, "FSUU Admin"),
      React.createElement(
        "nav",
        null,
        ["Dashboard", "Students", "Faculty", "Courses", "Attendance", "Departments", "Settings"].map((item) =>
          React.createElement("a", { key: item, href: "#" }, item)
        )
      )
    ),

    // Main section
    React.createElement(
      "div",
      { className: "main" },

      // Topbar
      React.createElement(
        "header",
        { className: "topbar" },
        React.createElement("h1", null, "Student and Faculty Profile Management System"),
        React.createElement("div", { className: "profile" },
          React.createElement("img", { src: "/profile.png", alt: "profile" })
        )
      ),

      // Content
      React.createElement(
        "section",
        { className: "content" },
        React.createElement(
          "div",
          { className: "card" },

          // Card header
          React.createElement(
            "div",
            { className: "card-header" },
            React.createElement("h2", null, "Students"),
            
          ),

          // Form
          React.createElement(
            "form",
            { className: "post-form", onSubmit: handleSubmit },
            React.createElement("input", {
              type: "text",
              placeholder: "First Name",
              value: title,
              onChange: (e) => setTitle(e.target.value),
            }),
            React.createElement("textarea", {
              placeholder: "Last Name",
              value: body,
              onChange: (e) => setBody(e.target.value),
            }),
            React.createElement(
              "div",
              { className: "form-actions" },
              React.createElement("button", { type: "submit" }, editingId ? "Update" : "Add Student"),
              editingId &&
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "cancel-btn",
                    onClick: () => {
                      setTitle("");
                      setBody("");
                      setEditingId(null);
                    },
                  },
                  "Cancel"
                )
            )
          ),

          // Table
          loading
            ? React.createElement("p", null, "Loading…")
            : React.createElement(
                "table",
                null,
                React.createElement(
                  "thead",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    ["ID", "First Name", "Last Name", "Created At", "Actions"].map((h) =>
                      React.createElement("th", { key: h }, h)
                    )
                  )
                ),
                React.createElement(
                  "tbody",
                  null,
                  posts.length > 0
                    ? posts.map((p) =>
                        React.createElement(
                          "tr",
                          { key: p.id },
                          React.createElement("td", null, p.id),
                          React.createElement("td", null, p.title),
                          React.createElement("td", null, p.body),
                          React.createElement("td", null, new Date(p.created_at).toLocaleString()),
                          React.createElement(
                            "td",
                            null,
                            React.createElement(
                              "button",
                              {
                                onClick: () => {
                                  setEditingId(p.id);
                                  setTitle(p.title);
                                  setBody(p.body);
                                },
                              },
                              "Edit"
                            ),
                            React.createElement(
                              "button",
                              {
                                className: "delete-btn",
                                onClick: () => handleDelete(p.id),
                              },
                              "Delete"
                            )
                          )
                        )
                      )
                    : React.createElement(
                        "tr",
                        null,
                        React.createElement("td", { colSpan: 5 }, "No posts found.")
                      )
                )
              )
        )
      )
    )
  );
}
