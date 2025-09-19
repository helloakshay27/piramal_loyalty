import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Confi/baseurl"; 

const Eventlist = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("event_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `${BASE_URL}events.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (Array.isArray(data.events)) {
          setEvents(data.events);

          setPagination({
            current_page: getPageFromStorage(),
            total_count: data.events.length,
            total_pages: Math.ceil(data.events.length / pageSize),
          });
        } else {
          console.error("API response does not contain events array", data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchEvents();
  }, []); // Empty dependency array to run only once on mount

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
    if (term) {
      const filteredSuggestions = events.filter((event) => {
        const q = term.toLowerCase();
        return [
          event.event_name,
          event.event_at,
          event.from_time,
          event.to_time,
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

  const handleSuggestionClick = (event) => {
    setSearchQuery(event.event_name);
    setSuggestions([]);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const filteredEvents = events
    .filter((event) => event.event_name)
    .filter((event) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return [
        event.event_name,
        event.event_at,
        event.from_time,
        event.to_time,
      ]
        .map((v) =>
          v !== null && v !== undefined ? String(v).toLowerCase() : ""
        )
        .some((v) => v.includes(q));
    });

  // Pagination helpers
  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const safeCurrentPage = Math.min(pagination.current_page, totalPages);
  const displayedEvents = filteredEvents.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage, endPage;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (safeCurrentPage <= halfVisible) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (safeCurrentPage + halfVisible >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = safeCurrentPage - halfVisible;
      endPage = safeCurrentPage + halfVisible;
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("event_list_currentPage", pageNumber);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  const handleToggleEvent = async (eventId, currentStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}events/${eventId}.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event: { active: !currentStatus } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event status");
      }

      // Update the local state after API success
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, active: !currentStatus } : event
        )
      );
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  return (
    <div className="w-100">
      <div className="module-data-section mt-2 px-3" style={{ color: "#000" }}>
        <p className="pointer">
          <span style={{ fontSize: "16px !important" }}>Events</span> &gt; Event List
        </p>
        <h5 style={{ fontSize: "22px" }}>Event List</h5>
        <div className="loyalty-header">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="purple-btn1 rounded-1"
              style={{ paddingRight: "50px" }}
              onClick={() => navigate("/event-create")}
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
                    placeholder="Search by Event Name"
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
                      {suggestions.map((event) => (
                        <li
                          key={event.id}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSuggestionClick(event)}
                        >
                          {event.event_name}
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
                        <th>Sr No</th>
                        <th>Event Name</th>
                        <th>Event At</th>
                        <th>From Time</th>
                        <th>To Time</th>
                        <th>Status</th>
                        <th>Event Image</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedEvents.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">No events found.</td>
                        </tr>
                      ) : (
                        displayedEvents.map((event, index) => (
                          <tr key={event.id} style={{ color: "#334155" }}>
                            <td>
                              {(safeCurrentPage - 1) * pageSize + index + 1}
                            </td>
                            <td>{event.event_name}</td>
                            <td>{event.event_at}</td>
                            <td>{event.from_time}</td>
                            <td>{event.to_time}</td>
                            <td>
                              <button
                                onClick={() =>
                                  handleToggleEvent(event.id, event.active)
                                }
                                className="toggle-button"
                                style={{
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "70px",
                                }}
                              >
                                {event.active ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="25"
                                    fill="#de7008"
                                    className="bi bi-toggle-on"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="25"
                                    fill="#667085"
                                    className="bi bi-toggle-off"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                  </svg>
                                )}
                              </button>
                            </td>
                            <td
                              className="text-center"
                              style={{
                                border: "1px solid #ddd",
                                padding: "5px",
                                verticalAlign: "middle",
                              }}
                            >
                              {event.attachfile &&
                              event.attachfile.document_url ? (
                                <img
                                  src={event.attachfile.document_url}
                                  alt="event"
                                  className="img-fluid rounded"
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                    display: "block",
                                  }}
                                />
                              ) : (
                                <span>No image</span>
                              )}
                            </td>
                            <td>
                              <a
                                href=""
                                onClick={() =>
                                  navigate(`/event-edit/${event.id}`)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M13.93 6.46611L8.7982 11.5979C8.68827 11.7078 8.62708 11.862 8.62708 12.0183L8.67694 14.9367C8.68261 15.2495 8.93534 15.5023 9.24815 15.5079L12.1697 15.5578H12.1788C12.3329 15.5578 12.4803 15.4966 12.5879 15.3867L19.2757 8.69895C19.9341 8.0405 19.9341 6.96723 19.2757 6.30879L17.8806 4.91368C17.561 4.59407 17.1349 4.4173 16.6849 4.4173C16.2327 4.4173 15.8089 4.5941 15.4893 4.91368L13.93 6.46611C13.9334 6.46271 13.93 6.46271 13.93 6.46611ZM11.9399 14.3912L9.8274 14.3561L9.79227 12.2436L14.3415 7.69443L16.488 9.84091L11.9399 14.3912ZM16.3066 5.73151C16.5072 5.53091 16.8574 5.53091 17.058 5.73151L18.4531 7.12662C18.6593 7.33288 18.6593 7.66948 18.4531 7.87799L17.3096 9.0215L15.1631 6.87502L16.3066 5.73151Z"
                                    fill="#667085"
                                  />
                                  <path
                                    d="M7.42035 20H16.5797C18.4655 20 20 18.4655 20 16.5797V12.0012C20 11.6816 19.7393 11.4209 19.4197 11.4209C19.1001 11.4209 18.8395 11.6816 18.8395 12.0012V16.582C18.8395 17.8264 17.8274 18.8418 16.5797 18.8418H7.42032C6.17593 18.8418 5.16048 17.8298 5.16048 16.582V7.42035C5.16048 6.17596 6.17254 5.16051 7.42032 5.16051H12.2858C12.6054 5.16051 12.866 4.89985 12.866 4.58026C12.866 4.26066 12.6054 4 12.2858 4H7.42032C5.53449 4 4 5.53452 4 7.42032V16.5797C4.00227 18.4677 5.53454 20 7.42035 20Z"
                                    fill="#667085"
                                  />
                                </svg>
                              </a>
                              <a
                                href=""
                                onClick={() =>
                                  navigate(`/event-details/${event.id}`)
                                }
                              >
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
                              </a>
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
                      <li className={`page-item ${safeCurrentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(safeCurrentPage + 1)}
                          disabled={safeCurrentPage === totalPages || totalPages === 0}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          ›
                        </button>
                      </li>
                      <li className={`page-item ${safeCurrentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={safeCurrentPage === totalPages || totalPages === 0}
                          style={{ padding: "8px 12px", color: "#5e2750", borderRadius: "3px" }}
                        >
                          »»
                        </button>
                      </li>
                    </ul>
                    <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
                      Showing {filteredEvents.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
                      {" - "}
                      {Math.min(safeCurrentPage * pageSize, filteredEvents.length)} of {filteredEvents.length} entries
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
};

export default Eventlist;
