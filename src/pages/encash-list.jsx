import React, { useState, useEffect } from "react";
import "../styles/style.css";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BASE_URL from "../Confi/baseurl";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EncashList = () => {
  const [encashRequests, setEncashRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [transactionMode, setTransactionMode] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");

  const fetchEncashRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}encash_requests.json?is_admin=true`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Reverse the data so newest is last
      const reversedData = [...response.data].reverse();
      setEncashRequests(reversedData);
      setFilteredItems(reversedData);
      console.log("Encash Requests", reversedData);
    } catch (err) {
      setError("Failed to fetch encash requests.");
      console.error("Error fetching encash requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncashRequests();
  }, [token]);

  const handleStatusChange = (id, status) => {
    if (status === "completed") {
      const request = encashRequests.find(req => req.id === id);
      setSelectedRequest(request);
      setShowModal(true);
    } else if (status === "rejected") {
      const request = encashRequests.find(req => req.id === id);
      if (!request) return;
      // Use toast.dismiss() with no arguments to dismiss all toasts (avoids undefined error)
      toast((t) => {
        let confirmed = false;
        const handleConfirm = async () => {
          if (confirmed) return;
          confirmed = true;
          toast.dismiss(); // Dismiss all, avoids t.id error
          try {
            await axios.put(
              `${BASE_URL}encash_requests/${request.id}.json?access_token=${token}`,
              { encash_request: { status: "rejected" } },
              { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            setLoading(true);
            await fetchEncashRequests();
            toast.success(`Request for ${request.person_name || "this user"} rejected successfully!`, {
              style: { background: "#fff", color: "#000", border: "2px solid #2c001e" }
            });
          } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Failed to reject request. Please try again.", {
              style: { background: "#fff", color: "#000", border: "2px solid #2c001e" }
            });
          }
        };
        const handleCancel = () => {
          toast.dismiss(); // Dismiss all, avoids t.id error
        };
        return (
          <div style={{ padding: 8, maxWidth: 320 }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              Reject encash request for <strong>{request.person_name || "this user"}</strong>?
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={handleConfirm}
                style={{
                  background: "#2c001e",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: "#fff",
                  color: "#2c001e",
                  border: "2px solid #2c001e",
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }, { id: `reject-${id}` });
    }
    // For "requested" status, no action needed as per requirements
  };

  const handleCompleteRequest = async () => {
    if (!selectedRequest || !transactionMode || !transactionNumber) {
      toast.error("Please fill in all required fields", {
        style: {
          background: "#fff",
          color: "#000",
          border: "2px solid #2c001e"
        }
      });
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}encash_requests/${selectedRequest.id}.json?access_token=${token}`,
        {
          encash_request: {
            status: "completed",
            transaction_mode: transactionMode,
            transaction_number: transactionNumber
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setShowModal(false);
      setTransactionMode("");
      setTransactionNumber("");
      setSelectedRequest(null);

      setLoading(true);
      await fetchEncashRequests();

      toast.success("Request completed successfully!", {
        style: {
          background: "#fff",
          color: "#000",
          border: "2px solid #2c001e"
        }
      });
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request. Please try again.", {
        style: {
          background: "#fff",
          color: "#000",
          border: "2px solid #2c001e"
        }
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    const filtered = encashRequests.filter((request) =>
      `${request.person_name} ${request.account_number} ${request.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
    setSuggestions([]);
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredSuggestions = encashRequests.filter((request) =>
        `${request.person_name} ${request.account_number} ${request.status}`
          .toLowerCase()
          .includes(term.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedItem = suggestions[selectedIndex];
      setSearchTerm(selectedItem.person_name);
      setFilteredItems([selectedItem]);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (request) => {
    setSearchTerm(request.person_name);
    setSuggestions([]);
    setFilteredItems([request]);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(encashRequests);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Pagination = ({ currentPage, totalPages, totalEntries, onPageChange }) => {
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);

      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (currentPage <= halfVisible) {
          startPage = 1;
          endPage = maxVisiblePages;
        } else if (currentPage + halfVisible >= totalPages) {
          startPage = totalPages - maxVisiblePages + 1;
          endPage = totalPages;
        } else {
          startPage = currentPage - halfVisible;
          endPage = currentPage + halfVisible;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <nav className="d-flex justify-content-between align-items-center">
        <ul
          className="pagination justify-content-center align-items-center"
          style={{ listStyleType: "none", padding: "0" }}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ««
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ‹
            </button>
          </li>

          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
                style={{
                  padding: "8px 12px",
                  color: page === currentPage ? "#fff" : "#5e2750",
                  backgroundColor: page === currentPage ? "#5e2750" : "#fff",
                  border: "2px solid #5e2750",
                  borderRadius: "3px",
                }}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ›
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              »»
            </button>
          </li>
        </ul>
        <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
      </nav>
    );
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="w-100">
        <div className="module-data-section mt-2">
          <p className="pointer">
            <span>Encash</span> &gt; Encash List
          </p>
          <h5>Encash Requests</h5>

          <div className="d-flex justify-content-end align-items-center">
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
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
                      placeholder="Search by name, account, status..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleKeyDown}
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
                        {suggestions.map((request, index) => (
                          <li
                            key={request.id}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                            }}
                            className={selectedIndex === index ? "highlight" : ""}
                            onClick={() => handleSuggestionClick(request)}
                          >
                            {request.person_name} - {request.account_number}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <button className="purple-btn1 rounded-3 px-3" onClick={handleSearch}>
                Go!
              </button>
              <button className="purple-btn2 rounded-3 mt-2" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div
            className="tbl-container mt-4"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : currentItems.length > 0 ? (
              <>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <table
                    className="w-100"
                    style={{
                      color: "#000",
                      fontWeight: "400",
                      fontSize: "13px",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "80px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "180px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "180px" }} /> {/* Referral Name */}
                      <col style={{ width: "150px" }} /> {/* Application Value */}
                      <col style={{ width: "120px" }} /> {/* Brokerage % */}
                      <col style={{ width: "120px" }} /> {/* Booking Unit */}
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>ID</th>
                        <th style={{ textAlign: "center" }}>Person Name</th>
                        <th style={{ textAlign: "center" }}>Points</th>
                        <th style={{ textAlign: "center" }}>Fee</th>
                        <th style={{ textAlign: "center" }}>Amount</th>
                        <th style={{ textAlign: "center" }}>Account Number</th>
                        <th style={{ textAlign: "center" }}>IFSC Code</th>
                        <th style={{ textAlign: "center" }}>Branch</th>
                        <th style={{ textAlign: "center" }}>Created At</th>
                        <th style={{ textAlign: "center" }}>Status</th>
                        <th style={{ textAlign: "center" }}>Transaction</th>
                        <th style={{ textAlign: "center" }}>Referral Name</th>
                        <th style={{ textAlign: "center" }}>Application Value</th>
                        <th style={{ textAlign: "center" }}>Brokerage %</th>
                        <th style={{ textAlign: "center" }}>Booking Unit</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        color: "#000",
                        fontWeight: "400",
                        fontSize: "13px",
                      }}
                    >
                      {currentItems.map((request) => (
                        <tr key={request.id}>
                          <td style={{ textAlign: "center", cursor: "pointer", color: "#5e2750", textDecoration: "underline" }}
                              onClick={() => navigate(`/encash-details/${request.id}`)}
                          >
                            {request.id}
                          </td>
                          <td>{request.person_name}</td>
                          <td style={{ textAlign: "right" }}>{request.points_to_encash.toLocaleString()}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(request.facilitation_fee)}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(request.amount_payable)}</td>
                          <td>{request.account_number}</td>
                          <td>{request.ifsc_code}</td>
                          <td>{request.branch_name}</td>
                          <td>{formatDate(request.created_at)}</td>
                          <td style={{ textAlign: "center" }}>
                            {/* {request.status === "completed" ? (
                              <div>
                                <span className="badge bg-success mb-1">Completed</span>
                                <div>
                                  <small className="d-block">{request.transaction_mode}</small>
                                  <small className="text-muted">{request.transaction_number}</small>
                                </div>
                              </div>
                            ) : ( */}
                            <select
                              className="form-select form-select-sm"
                              value={request.status}
                              onChange={(e) => handleStatusChange(request.id, e.target.value)}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                backgroundColor: request.status === "completed" ? "#d4edda"
                                  : request.status === "rejected" ? "#f8d7da"
                                  : "#fff3cd",
                                border: request.status === "completed" ? "1px solid #c3e6cb"
                                  : request.status === "rejected" ? "1px solid #f5c6cb"
                                  : "1px solid #ffeaa7",
                              }}
                            >
                              <option value="requested">Requested</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {request.transaction_mode && request.transaction_number ? (
                              <div>
                                <small className="d-block">{request.transaction_mode}</small>
                                <small className="text-muted">{request.transaction_number}</small>
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>{request.referral_name || "-"}</td>
                          <td>{request.application_value !== undefined ? Number(request.application_value).toLocaleString() : "-"}</td>
                          <td>
                            {request.brokerage_percentages !== undefined && request.brokerage_percentages !== null
                              ? `${request.brokerage_percentages} %`
                              : "-"}
                          </td>                     
                          <td>{request.booking_unit || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalEntries={filteredItems.length}
                />
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  color: "#555",
                  fontWeight: "500",
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                No encash requests found. Adjust your search to see results.
              </div>
            )}
          </div>

          {/* Complete Request Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Complete Encash Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRequest && (
                <div>
                  <div className="mb-3">
                    <h6>Request Details:</h6>
                    <p><strong>Person:</strong> {selectedRequest.person_name}</p>
                    <p><strong>Points:</strong> {selectedRequest.points_to_encash.toLocaleString()}</p>
                    <p><strong>Amount Payable:</strong> {formatCurrency(selectedRequest.amount_payable)}</p>
                    <p><strong>Account:</strong> {selectedRequest.account_number}</p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Transaction Mode <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={transactionMode}
                        onChange={(e) => setTransactionMode(e.target.value)}
                        required
                      >
                        <option value="">Select Mode</option>
                        <option value="UPI">UPI</option>
                        <option value="NEFT">NEFT</option>
                        <option value="RTGS">RTGS</option>
                        <option value="IMPS">IMPS</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Transaction Number <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                        placeholder="Enter transaction number"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button className="purple-btn2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="purple-btn1" onClick={handleCompleteRequest}>
                Complete Request
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default EncashList;
