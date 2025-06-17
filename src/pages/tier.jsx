import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../styles/style.css";
import SubHeader from "../components/SubHeader";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../Confi/baseurl";

const validationSchema = Yup.object({
  name: Yup.string().required("Tier Name is required"),
  exit_points: Yup.number()
    .required("Exit Points are required")
    .positive("Exit Points must be a positive number"),
  multipliers: Yup.number()
    .required("Multipliers are required")
    .positive("Multipliers must be a positive number"),
  welcome_bonus: Yup.number()
    .required("Welcome Bonus is required")
    .positive("Welcome Bonus must be a positive number"),
  point_type: Yup.string()
    .required("Point type is required")
    .oneOf(["lifetime", "yearly"], "Invalid point type"),
});

const Tiers = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); //filter
  const [suggestions, setSuggestions] = useState([]); // To store the search suggestions

  const navigate = useNavigate();
  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");
  const fetchTiers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/loyalty/tiers.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      if (response && response.data) {
        setTiers(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      }
    } catch (err) {
      // @ts-ignore
      setError("Failed to fetch tiers data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleEditClick = (tier) => {
    setSelectedTier(tier);
    setShowModal(true);
  };

  const handleFormSubmit = async (values) => {
    if (selectedTier) {
      try {
        const response = await axios.put(
          // @ts-ignore
          `${BASE_URL}/loyalty/tiers/${selectedTier.id}.json?token=${token}`,
          { loyalty_tier: values },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response && response.data) {
          await fetchTiers(); // Refresh data after successful edit
        }

        handleCloseModal();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTier(null);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const handleSearch = () => {
  //   const filtered = tiers.filter((rule) => {
  //     const ruleName = rule.name ? rule.name.toLowerCase() : ""; // Ensure rule.name is not null
  //     return ruleName.includes(searchTerm.toLowerCase());
  //   });

  //   console.log("filtered :----", filtered);

  //   setFilteredItems(filtered);
  //   setCurrentPage(1);
  // };

  // Handle search submission (e.g., when pressing 'Go!')
  const handleSearch = () => {
    const filtered = tiers.filter((member) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      // Special handling for multipliers to match "5x" style search
      const multipliersStr =
        member.multipliers !== undefined && member.multipliers !== null
          ? String(member.multipliers) + "x"
          : "";
      return [
        member.name,
        member.exit_points,
        multipliersStr, // include "5x" style
        member.multipliers, // also allow searching just the number
        member.welcome_bonus,
        member.point_type,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
    setSuggestions([]);
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredSuggestions = tiers.filter((member) => {
        const q = term.toLowerCase();
        const multipliersStr =
          member.multipliers !== undefined && member.multipliers !== null
            ? String(member.multipliers) + "x"
            : "";
        return [
          member.name,
          member.exit_points,
          multipliersStr,
          member.multipliers,
          member.welcome_bonus,
          member.point_type,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (member) => {
    setSearchTerm(`${member.name}`);
    setSuggestions([]); // Clear suggestions after selection
    // @ts-ignore
    setFilteredItems([member]); // Optionally, filter to show the selected member
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(tiers);
    setCurrentPage(1);
  };

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

  // @ts-ignore
  let yearlyTier = tiers.filter((item) => item.point_type === "yearly").length;
  let lifeTimeTier = tiers.filter(
    // @ts-ignore
    (item) => item.point_type === "lifetime"
  ).length;

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div
          className="module-data-section mt-2 px-3"
          style={{ color: "#000" }}
        >
          <p className="pointer">
            <span style={{ fontSize: "16px !important" }}>Tiers</span> &gt; Tier
            List
          </p>
          <h5 style={{ fontSize: "22px" }}>Tier List</h5>
          <div className="loyalty-header">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/new-tier">
                <button
                  className="purple-btn1 rounded-1"
                  style={{ paddingRight: "50px" }}
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
                  <span>New Tier</span>
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
                        {suggestions.map((member) => (
                          <li
                            // @ts-ignore
                            key={member.id}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSuggestionClick(member)}
                          >
                            {
                              // @ts-ignore
                              member.name
                            }
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
              className="d-flex justify-content-start gap-3 mt-2 mx-3 mt-4"
              style={{ color: "#fff", flexWrap: "nowrap" }}
            >
              <div
                className="flex-grow-1 violet-red p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{tiers.length}</p>
                <p>Total Tiers</p>
              </div>
              <div
                className="flex-grow-1 green p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{yearlyTier}</p>
                <p>Rolling Year Tiers</p>
              </div>
              <div
                className="flex-grow-1 pink p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{lifeTimeTier}</p>
                <p>Life Time Tiers</p>
              </div>
            </div>

            {loading && <p>Loading tiers...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <div
                className="tbl-container mx-3 mt-4"
                style={{
                  maxHeight: "600px",
                }}
              >
                <div>
                  <table
                    className="w-100"
                    style={{
                      color: "#000",
                      fontWeight: "400",
                      fontSize: "13px",
                    }}
                  >
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        <th style={{ width: "16.66%" }}>Tier Name</th>
                        <th style={{ width: "16.66%" }}>Exit Points</th>
                        <th style={{ width: "16.66%" }}>Multipliers</th>
                        <th style={{ width: "16.66%" }}>Welcome Bonus</th>
                        <th style={{ width: "16.66%" }}>Edit</th>
                        <th style={{ width: "16.66%" }}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((tier) => (
                        <tr key={tier.id} style={{ color: "#334155" }}>
                          <td>{tier.name}</td>
                          <td>{tier.exit_points}</td>
                          <td>{tier.multipliers}x</td>
                          <td>{tier.welcome_bonus} Points</td>
                          <td>
                            <button
                              className="btn btn-link"
                              onClick={() => handleEditClick(tier)}
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
                          <td>
                            <button
                              className="btn btn-link"
                              onClick={() =>
                                navigate(`/tier-details/${tier.id}`)
                              }
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
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                                  stroke="black"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </button>
                          </td>
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
              </div>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Tier</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedTier && (
                  <Formik
                    initialValues={{
                      // @ts-ignore
                      name: selectedTier.name || "",
                      // @ts-ignore
                      exit_points: selectedTier.exit_points || 0,
                      // @ts-ignore
                      multipliers: selectedTier.multipliers || 0,
                      // @ts-ignore
                      welcome_bonus: selectedTier.welcome_bonus || 0,
                      // @ts-ignore
                      point_type: selectedTier.point_type || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                  >
                    {({ values, handleChange }) => (
                      <Form>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Tier Name<span>*</span>
                              </legend>
                              <Field
                                type="text"
                                className="form-control border-0"
                                id="tierName"
                                name="name"
                              />
                            </fieldset>
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Exit Points<span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="exitPoints"
                                name="exit_points"
                                value={values.exit_points}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="exit_points"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Multipliers
                                <span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="multipliers"
                                name="multipliers"
                                value={values.multipliers}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="multipliers"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Welcome Bonus<span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="welcomeBonus"
                                name="welcome_bonus"
                                value={values.welcome_bonus}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="welcome_bonus"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Point Type<span>*</span>
                              </legend>
                              <select
                                // className="form-control border-0"
                                style={{ padding: "8px" }}
                                id="pointType"
                                name="point_type"
                                onChange={handleChange}
                                value={values.point_type}
                              >
                                <option value="lifetime" label="Life Time" />
                                <option value="yearly" label="Yearly" />
                              </select>
                            </fieldset>

                            <ErrorMessage
                              name="point_type"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
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
                      </Form>
                    )}
                  </Formik>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

// Add PropTypes for type checking
Tiers.propTypes = {
  tiers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      exit_points: PropTypes.number.isRequired,
      multipliers: PropTypes.number.isRequired,
      welcome_bonus: PropTypes.number.isRequired,
      point_type: PropTypes.string.isRequired,
    })
  ),
};

export default Tiers;
