import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";

const POSTS_API = "https://piramal-loyalty-dev.lockated.com/blog_posts.json";

export default function Blogs() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoadingPosts(true);
    fetch(POSTS_API)
      .then(res => res.json())
      .then(data => {
        const featured = Array.isArray(data.featured) ? data.featured : [];
        const latest = Array.isArray(data.latest) ? data.latest : [];
        const allPosts = [...featured, ...latest];
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      })
      .finally(() => setLoadingPosts(false));
  }, []);

  // Search logic
  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filteredSuggestions = posts.filter(post => {
        const q = term.toLowerCase();
        return [
          post.heading,
          post.tag_type,
          post.author,
          post.status,
          post.summary,
        ]
          .map(v => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some(v => v.includes(q));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (post) => {
    setSearchTerm(post.heading);
    setSuggestions([]);
    setFilteredPosts([post]);
    setPage(1);
  };

  const handleSearch = () => {
    const filtered = posts.filter(post => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return [
        post.heading,
        post.tag_type,
        post.author,
        post.status,
        post.summary,
      ]
        .map(v => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some(v => v.includes(q));
    });
    setFilteredPosts(filtered);
    setPage(1);
    setSuggestions([]);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredPosts(posts);
    setPage(1);
    setSuggestions([]);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

  // Helper for page numbers (max 5 visible)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage, endPage;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (page <= halfVisible) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (page + halfVisible >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = page - halfVisible;
      endPage = page + halfVisible;
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="w-100">
      <div className="module-data-section mt-2 px-3" style={{ color: "#000" }}>
        <p className="pointer">
          <span style={{ fontSize: "16px !important" }}>Blogs</span> &gt; Blog List
        </p>
        <h5 style={{ fontSize: "22px" }}>Blog List</h5>
        <div className="loyalty-header">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/new-blog">
              <button className="purple-btn1 rounded-1" style={{ paddingRight: "50px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-plus mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span>New Blog</span>
              </button>
            </Link>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center position-relative">
                <div className="position-relative me-3" style={{ width: "100%" }}>
                  <input
                    className="form-control"
                    style={{
                      height: "35px",
                      paddingLeft: "30px",
                      textAlign: "left",
                    }}
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                  <div
                    className="position-absolute"
                    style={{ top: "7px", left: "10px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                  </div>
                  {suggestions.length > 0 && (
                    <ul
                      className="suggestions-list position-absolute"
                      style={{
                        listStyle: "none",
                        padding: "0",
                        marginTop: "5px",
                        border: "1px solid #ddd",
                        maxHeight: "200px",
                        overflowY: "auto",
                        width: "100%",
                        zIndex: 1,
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {suggestions.map((post) => (
                        <li
                          key={post.id}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSuggestionClick(post)}
                        >
                          {post.heading}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                className="purple-btn1 rounded-3 px-3"
                onClick={handleSearch}
              >
                Go!
              </button>
              <button
                className="purple-btn2 rounded-3 mt-2"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
          <div
            className="tbl-container mx-3 mt-4"
            style={{
              maxHeight: "600px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(94,39,80,0.07)",
            }}
          >
            <div>
              {loadingPosts ? (
                <div>Loading...</div>
              ) : (
                <>
                  <table
                    className="w-100"
                    style={{
                      color: "#000",
                      fontWeight: "400",
                      fontSize: "13px",
                      borderCollapse: "separate",
                      borderSpacing: "0",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <thead style={{ textAlign: "left", background: "#f8f9fa" }}>
                      <tr>
                        <th style={{ width: "20%" }}>Heading</th>
                        <th style={{ width: "15%" }}>Tag Type</th>
                        <th style={{ width: "15%" }}>Author</th>
                        <th style={{ width: "15%" }}>Status</th>
                        <th style={{ width: "20%" }}>Publish Date</th>
                        <th style={{ width: "15%" }}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPosts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No blogs found.
                          </td>
                        </tr>
                      ) : (
                        paginatedPosts.map(post => (
                          <tr key={post.id} style={{ color: "#334155" }}>
                            <td>{post.heading}</td>
                            <td>{post.tag_type}</td>
                            <td>{post.author}</td>
                            <td>{post.status}</td>
                            <td>{post.publish_date ? new Date(post.publish_date).toLocaleString() : ""}</td>
                            <td>
                              <button
                                className="btn btn-link"
                                style={{ padding: 0 }}
                                onClick={() => window.open(post.url, "_blank")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                >
                                  <path
                                    d="M0.833008 10.0002C0.833008 10.0002 4.16634 3.3335 9.99967 3.3335C15.833 3.3335 19.1663 10.0002 19.1663 10.0002C19.1663 10.0002 15.833 16.6668 9.99967 16.6668C4.16634 16.6668 0.833008 10.0002 0.833008 10.0002Z"
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                                    stroke="black"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <nav className="d-flex justify-content-between align-items-center mt-3">
                    <ul
                      className="pagination justify-content-center align-items-center"
                      style={{ listStyleType: "none", padding: 0, margin: 0 }}
                    >
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          ««
                        </button>
                      </li>
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          ‹
                        </button>
                      </li>
                      {getPageNumbers().map(num => (
                        <li key={num} className={`page-item ${num === page ? "active" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setPage(num)}
                            style={{
                              padding: "8px 12px",
                              color: num === page ? "#fff" : "#5e2750",
                              backgroundColor: num === page ? "#5e2750" : "#fff",
                              border: "2px solid #5e2750",
                              borderRadius: "3px",
                            }}
                          >
                            {num}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages || totalPages === 0}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          ›
                        </button>
                      </li>
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages || totalPages === 0}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          »»
                        </button>
                      </li>
                    </ul>
                    <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
                      Showing {filteredPosts.length === 0 ? 0 : (page - 1) * pageSize + 1}
                      {" - "}
                      {Math.min(page * pageSize, filteredPosts.length)} of {filteredPosts.length} entries
                    </p>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}