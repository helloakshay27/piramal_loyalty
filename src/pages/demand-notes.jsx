import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function DemandNotes() {
  const [demandNotes, setDemandNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("demand_notes_currentPage")) || 1;
  };
  const [currentPage, setCurrentPage] = useState(getPageFromStorage());
  const pageSize = 10;

  useEffect(() => {
    const fetchDemandNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://piramal-loyalty-dev.lockated.com/demand_notes"
        );
        setDemandNotes(response.data.demand_notes || []);
      } catch (error) {
        setError("Failed to fetch demand notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandNotes();

    // Parse search query from URL if any
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handlePageChange = (pageNumber) => {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
    localStorage.setItem("demand_notes_currentPage", validPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    localStorage.setItem("demand_notes_currentPage", 1);
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Filter by booking_number, customer_code, or demand_number
  const filteredData = demandNotes.filter((note) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (note.booking_number && note.booking_number.toLowerCase().includes(q)) ||
      (note.customer_code && note.customer_code.toLowerCase().includes(q)) ||
      (note.demand_number && note.demand_number.toLowerCase().includes(q))
    );
  });

  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("demand_notes_currentPage", 1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedNotes = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2">
        <p className="pointer">
          <span>Demand Notes</span> &gt; Manage Demand Notes
        </p>
        <h5>Manage Demand Notes</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div />
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
                  value={searchQuery}
                  onChange={handleSearchChange}
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
              </div>
            </div>
            <button
              className="purple-btn1 rounded-3 px-3"
              onClick={handleSearchSubmit}
            >
              Go!
            </button>
            <button
              className="purple-btn2 rounded-3 mt-2"
              onClick={() => {
                setSearchQuery("");
                localStorage.setItem("demand_notes_currentPage", 1);
                navigate(location.pathname, { replace: true });
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div
          className="tbl-container mx-3 mt-4"
          style={{
            height: "100%",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Project ID</th>
                    <th>Booking Number</th>
                    <th>Customer Code</th>
                    <th>Demand Number</th>
                    <th>Percentage</th>
                    <th>Amount</th>
                    <th>Raised Date</th>
                    <th>Expected Date</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Total Tax</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                  {displayedNotes.length > 0 ? (
                    displayedNotes.map((note, idx) => (
                      <tr key={note.id}>
                        <td style={{ width: '7%' }}>{startIndex + idx + 1}</td>
                        <td style={{ width: '7%' }}>{note.project_id ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.booking_number ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.customer_code ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.demand_number ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.percentage ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.amount ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.raised_date ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.expected_date ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.cgst ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.sgst ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.total_tax_amount ?? ""}</td>
                        <td style={{ width: '7%' }}>{note.total_amount ?? ""}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center">
                        No demand notes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {!loading && totalFiltered > 0 && (
                <div className="d-flex align-items-center justify-content-between px-3 pagination-section">
                  <ul className="pagination" role="navigation" aria-label="pager">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => {
                        let pageToShow;
                        if (totalPages <= 5) {
                          pageToShow = i + 1;
                        } else {
                          const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                          pageToShow = startPage + i;
                        }
                        return pageToShow;
                      }
                    ).map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <p>
                    Showing {totalFiltered > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(startIndex + pageSize, totalFiltered)} of{" "}
                    {totalFiltered} entries
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
