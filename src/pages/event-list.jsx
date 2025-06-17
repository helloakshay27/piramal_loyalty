import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Confi/baseurl"; 

const Eventlist = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
          `${BASE_URL}/events.json`,
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
  };

  const filteredEvents = events
    .filter((event) => event.event_name) // Remove null values first
    .filter((event) =>
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const displayedEvents = filteredEvents
    //.sort((a, b) => (b.id || 0) - (a.id || 0))

    .slice(
      (pagination.current_page - 1) * pageSize,
      pagination.current_page * pageSize
    );

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
        `${BASE_URL}/events/${eventId}.json`,
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
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="d-flex justify-content-end px-4 pt-2 mt-3 ">
            <div className="col-md-4 pe-2 pt-2">
              <form
                onSubmit={handleSearchSubmit}
                action="/pms/departments"
                acceptCharset="UTF-8"
                method="get"
              >
                <div className="input-group">
                  <input
                    type="text"
                    name="s[name_cont]"
                    id="s_name_cont"
                    className="form-control tbl-search table_search"
                    placeholder="Search"
                    fdprocessedid="u38fp"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />

                  <div className="input-group-append">
                    <button
                      type="submit"
                      className="btn btn-md btn-default"
                      fdprocessedid="2wqzh"
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                          fill="#8B0203"
                        />

                        <path
                          d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="card-tools mt-1">
              <button
                className="purple-btn2 rounded-3"
                fdprocessedid="xn3e6n"
                onClick={() => navigate("/event-create")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={26}
                  height={20}
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>

                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="module-data-section container-fluid">
            <div className="card mt-4 pb-4 mx-3">
              <div className="card-header">
                <h3 className="card-title">Event List</h3>
              </div>

              <div className="card-body mt-4 pb-4 pt-0">
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
                    <div className="tbl-container mt-3">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            {/* <th>Project Name</th> */}
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
                              <td colSpan="8">No events found.</td>
                            </tr>
                          ) : (
                            displayedEvents.map((event, index) => (
                              <tr key={event.id}>
                                <td>
                                  {(pagination.current_page - 1) * pageSize +
                                    index +
                                    1}
                                </td>

                                {/* <td>{event.project_name}</td> */}
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
                                    border: "1px solid #ddd", // Ensures consistent border
                                    padding: "5px", // Standard padding
                                    verticalAlign: "middle", // Prevents row stretching
                                  }}
                                >
                                  {event.attachfile &&
                                  event.attachfile.document_url ? (
                                    <img
                                      src={event.attachfile.document_url}
                                      alt="event"
                                      className="img-fluid rounded"
                                      style={{
                                        maxWidth: "100px", // Adjusted for consistency
                                        maxHeight: "100px",
                                        display: "block", // Prevents extra spacing issues
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
                    </div>
                    <div className="d-flex align-items-center justify-content-between px-3 pagination-section">
                      <ul
                        className="pagination"
                        role="navigation"
                        aria-label="pager"
                      >
                        {/* First Button */}
                        <li
                          className={`page-item ${
                            pagination.current_page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                          >
                            First
                          </button>
                        </li>

                        {/* Previous Button */}
                        <li
                          className={`page-item ${
                            pagination.current_page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(pagination.current_page - 1)
                            }
                            disabled={pagination.current_page === 1}
                          >
                            Prev
                          </button>
                        </li>

                        {/* Dynamic Page Numbers */}
                        {Array.from(
                          { length: pagination.total_pages },
                          (_, index) => index + 1
                        ).map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pagination.current_page === pageNumber
                                ? "active"
                                : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        {/* Next Button */}
                        <li
                          className={`page-item ${
                            pagination.current_page === pagination.total_pages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(pagination.current_page + 1)
                            }
                            disabled={
                              pagination.current_page === pagination.total_pages
                            }
                          >
                            Next
                          </button>
                        </li>

                        {/* Last Button */}
                        <li
                          className={`page-item ${
                            pagination.current_page === pagination.total_pages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(pagination.total_pages)
                            }
                            disabled={
                              pagination.current_page === pagination.total_pages
                            }
                          >
                            Last
                          </button>
                        </li>
                      </ul>

                      {/* Showing entries count */}
                      <div>
                        <p>
                          Showing{" "}
                          {Math.min(
                            (pagination.current_page - 1) * pageSize + 1 || 1,
                            pagination.total_count
                          )}{" "}
                          to{" "}
                          {Math.min(
                            pagination.current_page * pageSize,
                            pagination.total_count
                          )}{" "}
                          of {pagination.total_count} entries
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventlist;
