import React, { useEffect, useState } from "react";
import "../styles/style.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    campaign_tag: "",
    target_audiance: "",
  });
  const [showModal, setShowModal] = useState(false);

  const [showModalView, setShowModalView] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); //filter
  const [suggestions, setSuggestions] = useState([]); // To store the search suggestions

  const [selectedIndex, setSelectedIndex] = useState(-1); // Track the selected suggestion index
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const storedValue = sessionStorage.getItem("selectedId");
      try {
        const response = await axios.get(
          `${BASE_URL}/loyalty/campaigns.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setCampaigns(response.data);
        setFilteredItems(response.data); // Initialize filteredItems with campaigns
      } catch (err) {
        setError("Failed to fetch campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      target_audiance: campaign.target_audiance,
      campaign_tag: campaign.campaign_tag,
    });
    setShowModal(true);
  };

  const handleViewClick = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      target_audiance: campaign.target_audiance,
      campaign_tag: campaign.campaign_tag,
    });
    setShowModalView(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedCampaign) {
      try {
        const response = await axios.put(
          `${BASE_URL}/loyalty/campaigns/${selectedCampaign.id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
          { loyalty_campaign: formData }
        );
        if (response) {
          setCampaigns((prevCampaigns) =>
            prevCampaigns.map((campaign) =>
              campaign.id === selectedCampaign.id
                ? { ...campaign, ...formData }
                : campaign
            )
          );

          setFilteredItems((prevFiltered) =>
            prevFiltered.map((campaign) =>
              campaign.id === selectedCampaign.id
                ? { ...campaign, ...formData }
                : campaign
            )
          );
        }
        handleCloseModal();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setFormData({
      name: "",
      campaign_tag: "",
      target_audiance: "",
    });
  };

  const handleCloseModalView = () => {
    setShowModalView(false);
    // setSelectedCampaign(null);
    // setFormData({
    //   name: "",
    //   campaign_tag: "",
    //   target_audiance: "",
    // });
  };

  const handleReset = () => {
    setSearchTerm(""); // Clear search term
    setFilteredItems(campaigns); // Reset filtered items to the original data
    setCurrentPage(1); // Reset to first page
  };

  // Handle search submission (e.g., when pressing 'Go!')
  const handleSearch = () => {
    const filtered = campaigns.filter((member) =>
      // @ts-ignore
      `${member.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // @ts-ignore
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to the first page of results
    setSuggestions([]); // Clear suggestions after searching
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // If there's a search term, filter the members and show suggestions
    if (term) {
      const filteredSuggestions = campaigns.filter((member) =>
        // @ts-ignore
        `${member.name}`.toLowerCase().includes(term.toLowerCase())
      );
      // @ts-ignore
      setSuggestions(filteredSuggestions); // Update suggestions list
      setSelectedIndex(-1); // Reset the selected index
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Move down in the suggestion list
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      // Move up in the suggestion list
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      // Select the current suggestion
      const selectedItem = suggestions[selectedIndex];
      // handleSuggestionClick(selectedMember);
      setSearchTerm(selectedItem.name); // Update search term
      setFilteredItems([selectedItem]); // Filter items
      setSuggestions([]); // Clear suggestions
    }
  };

  const handleSuggestionClick = (member) => {
    setSearchTerm(`${member.name}`);
    setSuggestions([]); // Clear suggestions after selection
    // @ts-ignore
    setFilteredItems([member]); // Optionally, filter to show the selected member
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Pagination = ({
    currentPage,
    totalPages,
    totalEntries,
    onPageChange, // Pass the onPageChange function as a prop
  }) => {
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    // Function to get the range of page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5; // Set the maximum number of visible pages
      const halfVisible = Math.floor(maxVisiblePages / 2);

      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
        // If total pages are less than or equal to maxVisiblePages, show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // Otherwise, calculate the start and end pages
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

    const handleJumpForward = () => {
      if (currentPage + 5 <= totalPages) {
        onPageChange(currentPage + 5);
      } else {
        onPageChange(totalPages); // Go to last page if jump exceeds total pages
      }
    };

    // @ts-ignore
    const handleJumpBackward = () => {
      if (currentPage - 5 >= 1) {
        onPageChange(currentPage - 5);
      } else {
        onPageChange(1); // Go to first page if jump goes below 1
      }
    };

    return (
      <nav className="d-flex justify-content-between align-items-center">
        <ul
          className="pagination justify-content-center align-items-center"
          style={{ listStyleType: "none", padding: "0" }}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(1)} // Jump to first page
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              «« {/* Double left arrow for jumping to the first page */}
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

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              ›
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={handleJumpForward} // Jump forward by 7 pages
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", color: "#5e2750" }}
            >
              »» {/* Double right arrow for jumping to the last page */}
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
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2">
          <p className="pointer">
            <span>Campaign</span> &gt; Campaign List
          </p>
          <h5>Campaign</h5>

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/new-campaign">
              <button className="purple-btn1" style={{ borderRadius: "5px" }}>
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
                <span>New Campaign</span>
              </button>
            </Link>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center position-relative">
                <div
                  className="position-relative me-3"
                  style={{ width: "100%" }}
                >
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
                        width: "100%", // Match width of input field
                        zIndex: 1, // Ensure it appears on top of other elements
                        backgroundColor: "#fff", // Set solid background color
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow for visibility
                      }}
                    >
                      {suggestions.map((member, index) => (
                        <li
                          // @ts-ignore
                          key={member.id}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          className={selectedIndex === index ? "highlight" : ""}
                          onClick={() => handleSuggestionClick(member)}
                        >
                          {member.name}
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
                onClick={handleReset} // Reset search
              >
                Reset
              </button>
            </div>
          </div>

          <div
            className="tbl-container mx-3 mt-4"
            // style={{ height: "100%", overflowY: "hidden", margin: "0 100px" }}
            style={{
              height: "100%",
              // overflowY: "hidden",
              overflowX: "hidden",
              // textAlign: "center",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "space-between",
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                <table
                  className="w-100"
                  style={{ color: "#000", fontWeight: "400", fontSize: "13px" }}
                >
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Campaign Tag</th>
                      <th>Target Audience</th>
                      <th>Edit</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      color: "#000",
                      fontWeight: "400",
                      fontSize: "13px",
                      textAlign: "center",
                    }}
                  >
                    {currentItems.map((campaign) => (
                      <tr key={campaign.id}>
                        <td style={{ width: "20%" }}>{campaign.name}</td>
                        <td style={{ width: "20%" }}>
                          {campaign.campaign_tag}
                        </td>
                        <td style={{ width: "20%" }}>
                          {campaign.target_audiance}
                        </td>
                        <td style={{ width: "20%" }}>
                          <button
                            className="btn btn-link"
                            onClick={() => handleEditClick(campaign)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#5e2750"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </button>
                        </td>
                        <td style={{ width: "20%" }}>
                          <Link to={`/campaign-details/${campaign.id}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#000000"
                              className="bi bi-eye"
                              viewBox="0 0 16 16"
                              onClick={() => handleViewClick(campaign)}
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalEntries={filteredItems.length}
                />
              </>
            )}
            {/* foe edit */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Campaign</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="tierName" className="form-label">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tierName"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="campaignTag" className="form-label">
                      Campaign Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="campaignTag"
                      name="campaign_tag"
                      value={formData.campaign_tag}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="target_audience" className="form-label">
                      Target Audience
                    </label>
                    <select
                      className="form-select"
                      id="target_audiance"
                      name="target_audiance"
                      value={formData.target_audiance}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Target Audience</option>
                      <option value="Recently Joined">Recently Joined</option>
                      <option value="Suspended">Suspended</option>
                      <option value="1 - purchase">1 - purchase</option>
                      <option value="No purchase">No purchase</option>
                    </select>
                  </div>
                  {/* <button type="submit" className="purple-btn1">Save Changes</button> */}
                  <div className="row mt-2 justify-content-center align-items-center">
                    <div className="col-4">
                      <button type="submit" className="purple-btn1 w-100">
                        Submit
                      </button>
                    </div>
                    <div className="col-4">
                      <button
                        type="reset"
                        className="purple-btn2 w-100"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            {/* for view */}

            {/* <Modal show={showModalView} onHide={handleCloseModalView}>
              <Modal.Header closeButton>
                <Modal.Title>Campaign Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="mb-3">
                    <label htmlFor="tierName" className="form-label">Campaign Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tierName"
                      name="name"
                      value={formData.name}
                      // onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="campaignTag" className="form-label">Campaign Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      id="campaignTag"
                      name="campaign_tag"
                      value={formData.campaign_tag}
                      // onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="target_audience" className="form-label">Target Audience</label>
                    <select
                      className="form-select"
                      id="target_audiance"
                      name="target_audiance"
                      disabled
                      value={formData.target_audiance}
                      // onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Target Audience</option>
                      <option value="Recently Joined">Recently Joined</option>
                      <option value="Suspended">Suspended</option>
                      <option value="1 - purchase">1 - purchase</option>
                      <option value="No purchase">No purchase</option>
                    </select>
                  </div>
                  {/* <button type="submit" className="purple-btn1" closeButton>Cancle</button> */}
            {/* </form>
              </Modal.Body>
            </Modal> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Campaign;
