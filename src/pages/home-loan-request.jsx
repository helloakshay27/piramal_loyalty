import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function HomeLoanRequest() {
  const [homeLoans, setHomeLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("home_loan_request_currentPage")) || 1;
  };
  const [currentPage, setCurrentPage] = useState(getPageFromStorage());
  const pageSize = 10;

  useEffect(() => {
    const fetchHomeLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://piramal-loyalty-dev.lockated.com/home_loans_request"
        );
        setHomeLoans(response.data.home_loans || []);
      } catch {
        // ignore error for brevity
      } finally {
        setLoading(false);
      }
    };
    fetchHomeLoans();

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
    localStorage.setItem("home_loan_request_currentPage", validPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    localStorage.setItem("home_loan_request_currentPage", 1);
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Filter by booking_number, customer_code, or bank_name
  const filteredData = homeLoans.filter((loan) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (loan.booking_number && loan.booking_number.toLowerCase().includes(q)) ||
      (loan.customer_code && loan.customer_code.toLowerCase().includes(q)) ||
      (loan.bank_name && loan.bank_name.toLowerCase().includes(q))
    );
  });

  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("home_loan_request_currentPage", 1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedLoans = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2">
        <p className="pointer">
          <span>Home Loan Requests</span> &gt; Manage Home Loan Requests
        </p>
        <h5>Manage Home Loan Requests</h5>
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
                localStorage.setItem("home_loan_request_currentPage", 1);
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
          ) : (
            <>
              <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>Sr No</th>
                    <th style={{ width: '8%' }}>Loan Type</th>
                    <th style={{ width: '8%' }}>Employment Type</th>
                    <th style={{ width: '8%' }}>Monthly Income</th>
                    <th style={{ width: '8%' }}>Birth Date</th>
                    <th style={{ width: '8%' }}>Preferred Time</th>
                    <th style={{ width: '8%' }}>Bank Name</th>
                    <th style={{ width: '8%' }}>Amount</th>
                    <th style={{ width: '8%' }}>Tenure</th>
                    <th style={{ width: '8%' }}>Customer Code</th>
                    <th style={{ width: '8%' }}>Booking Number</th>
                    <th style={{ width: '8%' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                  {displayedLoans.length > 0 ? (
                    displayedLoans.map((loan, idx) => (
                      <tr key={loan.id}>
                        <td>{startIndex + idx + 1}</td>
                        <td>{loan.loan_type ?? ""}</td>
                        <td>{loan.employment_type ?? ""}</td>
                        <td>{loan.monthly_income ?? ""}</td>
                        <td>{loan.birth_date ?? loan.dob ?? ""}</td>
                        <td>{loan.preferred_time ?? loan.preffered_time ?? ""}</td>
                        <td>{loan.bank_name ?? ""}</td>
                        <td>{loan.amount ?? loan.required_loan_amt ?? ""}</td>
                        <td>{loan.tenure ?? ""}</td>
                        <td>{loan.customer_code ?? ""}</td>
                        <td>{loan.booking_number ?? ""}</td>
                        <td>{loan.status ?? ""}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        No home loan requests found.
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