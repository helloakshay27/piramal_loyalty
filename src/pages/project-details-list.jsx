import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";

const ProjectDetailsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageFromStorage = () => {
    return (
      parseInt(localStorage.getItem("project_details_list_currentPage")) || 1
    );
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
  });

  const [expandedConfigs, setExpandedConfigs] = useState({});

  const toggleExpand = (index) => {
    setExpandedConfigs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const url = `${BASE_URL}/get_projects_all.json`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setProjects(response.data?.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Unable to fetch project data");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("s[name_cont]") || "";
    setSearchQuery(queryFromUrl);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    localStorage.setItem("project_details_list_currentPage", "1");
  }, [location.search]);

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
    localStorage.setItem("project_details_list_currentPage", "1");
    if (term) {
      const filteredSuggestions = projects.filter((project) => {
        const q = term.toLowerCase();
        return [
          project.project_name,
          project.property_type,
          project.SFDC_Project_Id,
          project.Project_Construction_Status,
        ]
          .map((v) =>
            v !== null && v !== undefined ? String(v).toLowerCase() : ""
          )
          .some((v) => v.includes(q));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (project) => {
    setSearchQuery(project.project_name);
    setSuggestions([]);
    // Filter to only this project
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    localStorage.setItem("project_details_list_currentPage", "1");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
    localStorage.setItem("project_details_list_currentPage", "1");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Update filteredProjects to use searchQuery
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [
      project.project_name,
      project.property_type,
      project.SFDC_Project_Id,
      project.Project_Construction_Status,
    ]
      .map((v) =>
        v !== null && v !== undefined ? String(v).toLowerCase() : ""
      )
      .some((v) => v.includes(q));
  });

  // Pagination logic for UI
  const totalFilteredPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const safeCurrentPage = Math.min(pagination.current_page, totalFilteredPages);
  const displayedProjects = filteredProjects.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Helper for page numbers (max 5 visible)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage, endPage;
    if (totalFilteredPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalFilteredPages;
    } else if (safeCurrentPage <= halfVisible) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (safeCurrentPage + halfVisible >= totalFilteredPages) {
      startPage = totalFilteredPages - maxVisiblePages + 1;
      endPage = totalFilteredPages;
    } else {
      startPage = safeCurrentPage - halfVisible;
      endPage = safeCurrentPage + halfVisible;
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalFilteredPages) {
      setPagination({
        ...pagination,
        current_page: pageNumber,
      });
      localStorage.setItem("project_details_list_currentPage", pageNumber);
    }
  };

  return (
    <>
      <div className="w-100">
        <div className="module-data-section mt-2 px-3" style={{ color: "#000" }}>
          <p className="pointer">
            <span style={{ fontSize: "16px !important" }}>Projects</span> &gt; Project List
          </p>
          <h5 style={{ fontSize: "22px" }}>Project List</h5>
          <div className="loyalty-header">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="purple-btn1 rounded-1"
                style={{ paddingRight: "50px" }}
                onClick={() => navigate("/project-create")}
              >
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
                <span>Add</span>
              </button>
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
                      placeholder="Search by Project Name"
                      aria-label="Search"
                      value={searchQuery}
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
                        {suggestions.map((project) => (
                          <li
                            key={project.id}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSuggestionClick(project)}
                          >
                            {project.project_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  className="purple-btn1 rounded-3 px-3"
                  onClick={e => {
                    e.preventDefault();
                    // Just trigger the filter, since it's already live
                  }}
                >
                  Go!
                </button>
                <button
                  className="purple-btn2 rounded-3 mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
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
                overflowX: "auto",
              }}
            >
              <div>
                {loading ? (
                  <div className="text-center">
                    <div
                      className="spinner-border"
                      role="status"
                      style={{ color: "var(--red)" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <table
                      className="w-110"
                      style={{
                        color: "#000",
                        fontWeight: "400",
                        fontSize: "13px",
                        borderCollapse: "separate",
                        borderSpacing: "0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        width: "max-content",
                      }}
                    >
                      <thead style={{ textAlign: "left", background: "#f8f9fa" }}>
                        <tr>
                          <th>Sr No</th>
                          <th>Project Name</th>
                          <th>Property Type</th>
                          <th>SFDC Project ID</th>
                          <th>Project Construction Status</th>
                          <th>Configuration Type</th>
                          <th>Price Onward</th>
                          <th>Project Size (Sq. Mtr)</th>
                          <th>Project Size (Sq. Ft)</th>
                          <th>Rera Carpet Area (Sq. M)</th>
                          <th>Rera Carpet Area (Sq. Ft)</th>
                          <th>Number Of Towers</th>
                          <th>Number Of Units</th>
                          <th>Rera Number</th>
                          <th>Amenities</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedProjects.length === 0 ? (
                          <tr>
                            <td colSpan={16} className="text-center">
                              No projects found.
                            </td>
                          </tr>
                        ) : (
                          displayedProjects.map((project, index) => (
                            <tr key={project.id || index} style={{ color: "#334155" }}>
                              <td>
                                {(safeCurrentPage - 1) * pageSize + index + 1}
                              </td>
                              <td>{project?.project_name || "N/A"}</td>
                              <td>{project?.property_type || "N/A"}</td>
                              <td>{project?.SFDC_Project_Id || "N/A"}</td>
                              <td>
                                {project?.Project_Construction_Status || "N/A"}
                              </td>
                              <td style={{ width: "200px" }}>
                                {project?.configurations?.length > 0
                                  ? project.configurations.map(
                                      (config, idx) => (
                                        <div key={idx}>
                                          {config.name}{" "}
                                          <img
                                            src={config.icon_url}
                                            alt={config.name}
                                            style={{
                                              width: "20px",
                                              marginLeft: "5px",
                                            }}
                                          />
                                        </div>
                                      )
                                    )
                                  : "No Configuration Type"}
                              </td>
                              <td>{project?.price || "N/A"}</td>
                              <td>{project?.project_size_sq_mtr || "N/A"}</td>
                              <td>{project?.project_size_sq_ft || "N/A"}</td>
                              <td>
                                {project?.rera_carpet_area_sq_mtr || "N/A"}
                              </td>
                              <td>{project?.rera_carpet_area_sqft || "N/A"}</td>
                              <td>{project?.no_of_towers || "N/A"}</td>
                              <td>{project?.no_of_apartments || "N/A"}</td>
                              <td>
                                {project?.rera_number_multiple?.length > 0
                                  ? project.rera_number_multiple.map(
                                      (rera, idx) => (
                                        <div key={idx}>
                                          <strong>{rera.tower_name}:</strong>{" "}
                                          {rera.rera_number}
                                        </div>
                                      )
                                    )
                                  : "N/A"}
                              </td>
                              <td style={{ width: "200px" }}>
                                {project?.amenities?.length > 0
                                  ? project.amenities.map((amenity, idx) => (
                                      <div key={idx}>
                                        {amenity.name}{" "}
                                        <img
                                          src={amenity.icon_url}
                                          alt={amenity.name}
                                          style={{
                                            width: "20px",
                                            marginLeft: "5px",
                                          }}
                                        />
                                      </div>
                                    ))
                                  : "No amenities"}
                              </td>
                              <td>
                                <Link to={`/project-details/${project?.id}`}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-eye"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                  </svg>
                                </Link>
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
                        <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                            disabled={safeCurrentPage === 1}
                            style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                          >
                            ««
                          </button>
                        </li>
                        <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(safeCurrentPage - 1)}
                            disabled={safeCurrentPage === 1}
                            style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                          >
                            ‹
                          </button>
                        </li>
                        {getPageNumbers().map(num => (
                          <li key={num} className={`page-item ${num === safeCurrentPage ? "active" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(num)}
                              style={{
                                padding: "8px 12px",
                                color: num === safeCurrentPage ? "#fff" : "#5e2750",
                                backgroundColor: num === safeCurrentPage ? "#5e2750" : "#fff",
                                border: "2px solid #5e2750",
                                borderRadius: "3px",
                              }}
                            >
                              {num}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${safeCurrentPage === totalFilteredPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(safeCurrentPage + 1)}
                            disabled={safeCurrentPage === totalFilteredPages || totalFilteredPages === 0}
                            style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                          >
                            ›
                          </button>
                        </li>
                        <li className={`page-item ${safeCurrentPage === totalFilteredPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(totalFilteredPages)}
                            disabled={safeCurrentPage === totalFilteredPages || totalFilteredPages === 0}
                            style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                          >
                            »»
                          </button>
                        </li>
                      </ul>
                      <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
                        Showing {filteredProjects.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
                        {" - "}
                        {Math.min(safeCurrentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} entries
                      </p>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsList;