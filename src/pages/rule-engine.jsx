import React, { useState, useEffect } from "react";
import "../styles/style.css";
import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
} from "../Confi/ruleEngineApi";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BASE_URL from "../Confi/baseurl";

const RuleEngine = () => {
  const [RuleEngine, setRuleEngine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showModal, setShowModal] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [masterAttributes, setMasterAttributes] = useState([]);
  const [subAttributes, setSubAttributes] = useState([]);
  const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
  const [selectedSubAttribute, setSelectedSubAttribute] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    masterAttribute: "",
    subAttribute: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); //filter
  const [suggestions, setSuggestions] = useState([]); // To store the search suggestions
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track the selected suggestion index
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");


// console.log("masterAttributes", masterAttributes);

  useEffect(() => {
    const fetchRuleEngine = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/rule_engine/rules.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setRuleEngine(response.data);
        setFilteredItems(response.data);
      } catch (err) {
        setError("Failed to fetch rule engine.");
      } finally {
        setLoading(false);
      }
    };

    fetchRuleEngine();
  }, []);

  //transform
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/::/g, " ") // Replace :: with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const companyId = 44; // Set this according to your needs
        const activeStatus = true; // Set this according to your needs
        const masterAttrs = await fetchMasterAttributes(
          companyId,
          activeStatus
        );

        console.log("masterAttrs", masterAttrs);
        setMasterAttributes(masterAttrs.master_attributes || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);
  const handleMasterAttributeChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedMasterAttribute(selectedId);

    const selectedIndex = masterAttributes.findIndex(
      // @ts-ignore
      (attr) => attr.id === parseInt(selectedId)
    );

    if (selectedIndex !== -1) {
      try {
        const subAttrs = await fetchSubAttributes(selectedId);
        const selectedSubAttributes =
          subAttrs.master_attributes[selectedIndex].sub_attributes;
        setSubAttributes(selectedSubAttributes);

        // Initialize conditions if needed
        if (!conditions) {
          setConditions([]); // Initialize conditions if it is undefined or null
        }

        // @ts-ignore
        setFormValues({
          masterAttribute: selectedId,
          subAttribute: "", // Reset subAttribute in form values
        });
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };

  const handleSubAttributeChange = (e) => {
    setSelectedSubAttribute(e.target.value);

    // Map over conditions to update the subAttribute
    const updatedConditions = conditions.map((cond) => ({
      // @ts-ignore
      ...cond,
      subAttribute: e.target.value,
    }));

    // @ts-ignore
    setConditions(updatedConditions);
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    let query = [];
    if (selectedMasterAttribute) {
      query.push(
        `q[rule_engine_conditions_rule_engine_applicable_model_rule_engine_available_model_display_name_cont]=${selectedMasterAttribute}`
      );
    }
    if (selectedSubAttribute) {
      query.push(
        `q[rule_engine_conditions_condition_attribute_cont]=${selectedSubAttribute}`
      );
    }
    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    try {
      const response = await axios.get(
        `${BASE_URL}/rule_engine/rules.json?${queryString}&token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      if (response) {
        setFilteredItems(response.data);
        setSelectedMasterAttribute("");
        setSelectedSubAttribute("");
        setFormValues({ name: "", masterAttribute: "", subAttribute: "" });
        handleCloseModal();
        console.log("currentItems", filteredItems.length, filteredItems);
      }
    } catch (error) {
      console.error("Error fetching filtered data", error);
    }
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    const filtered = RuleEngine.filter((member) =>
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
      const filteredSuggestions = RuleEngine.filter((member) =>
        `${member.name}`.toLowerCase().includes(term.toLowerCase())
      );

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
    setFilteredItems([member]); // Optionally, filter to show the selected member
  };

  const handleReset = () => {
    setSearchTerm(""); // Clear search term
    setFilteredItems(RuleEngine); // Reset filtered items to the original data
    setCurrentPage(1); // Reset to first page
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

  const handleToggle = async (id, isActive) => {
    try {
      // Make an API call to update the rule's active state
      // @ts-ignore
      const response = await axios.patch(
        `${BASE_URL}/rule_engine/rules/${id}.json?token=${token}`,
        { rule_engine_rule: { active: isActive } }
      );

      // Update local state to reflect the change
      // @ts-ignore
      setRuleEngine((prevRules) =>
        prevRules.map((rule) =>
          // @ts-ignore
          rule.id === id ? { ...rule, active: isActive } : rule
        )
      );

      // Optional: You can also update filteredItems if needed
      // @ts-ignore
      setFilteredItems((prevFilteredItems) =>
        prevFilteredItems.map((rule) =>
          // @ts-ignore
          rule.id === id ? { ...rule, active: isActive } : rule
        )
      );
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2">
          <p className="pointer">
            <span>Rule Engine</span> &gt; Rule List
          </p>
          <h5>Rule List</h5>

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/create-rule-engine">
              <button
                className="purple-btn1"
                style={{ borderRadius: "5px", paddingRight: "50px" }}
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
                <span>New Rule</span>
              </button>
            </Link>
            <div className="d-flex align-items-center">
              <button
                className="purple-btn2 rounded-3 mt-2 me-3"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-plus mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                Filter
              </button>
              <div className="position-relative me-3">
                {/* <input
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                /> */}
                {/* <div
                  className="position-absolute"
                  style={{ top: "7px", left: "10px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </div> */}

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
                            className={
                              selectedIndex === index ? "highlight" : ""
                            }
                            onClick={() => handleSuggestionClick(member)}
                          >
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
            // style={{
            //   height: "100%",
            //   overflowY: "hidden",
            //   margin: "0 100px",

            // }}
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
            ) : currentItems.length > 0 ? (
              <>
                <table
                  className="w-100"
                  style={{ color: "#000", fontWeight: "400", fontSize: "13px" }}
                >
                  <thead>
                    <tr>
                      <th>Rule Name</th>
                      <th>Attribute</th>
                      <th>Sub-Attribute</th>
                      <th>Operatives</th>
                      <th>Sub Operatives</th>
                      <th>Reward Outcome</th>
                      <th>Sub Reward Outcome</th>
                      <th>Toggle</th>
                      <th>Edit</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      color: "#000",
                      fontWeight: "400",
                      fontSize: "13px",
                    }}
                  >
                    {currentItems.map((rule) => {
                      const { id, name, conditions, active, actions } = rule;
                      return conditions.map((condition, index) => (
                        <tr key={`${rule.id || name}-${index}`}>
                          {index === 0 && (
                            <td
                              rowSpan={conditions.length}
                              style={{ width: "11.11%" }}
                            >
                              {rule.name}
                            </td>
                          )}{" "}
                          {/* Row span for the rule name */}
                          {console.log(rule.name)}
                          <td style={{ width: "10%" }}>
                            {condition.model_name}
                          </td>
                          <td style={{ width: "10%" }}>
                            {/* {condition.condition_attribute} */}
                            {formatFieldName(condition.condition_attribute)}
                          </td>
                          <td style={{ width: "10%" }}>
                            {/* Common Operatives */}
                            {condition.master_operator}
                          </td>
                          <td style={{ width: "10%" }}>
                            {formatFieldName(condition.operator)}
                          </td>
                          {actions.length > 0 ? (
                            actions.map((act, actIndex) => (
                              <React.Fragment key={act.id || actIndex}>
                                <td style={{ width: "10%" }}>
                                  {formatFieldName(
                                    act.lock_model_name
                                      ? act.lock_model_name
                                      : ""
                                  )}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {formatFieldName(
                                    act.action_method ? act.action_method : ""
                                  )}
                                </td>
                              </React.Fragment>
                            ))
                          ) : (
                            <>
                              <td style={{ width: "10%" }}></td>
                              <td style={{ width: "10%" }}></td>
                            </>
                          )}
                          <td style={{ width: "10%" }}>
                            {/* <span className="form-switch ps-5">
                              <input
                                className="on-off-toggler form-check-input my-2"
                                type="checkbox"
                                checked={active}
                                onChange={(e) =>
                                  handleToggle(id, e.target.checked)
                                }  Handle toggle change
                              />
                            </span> */}
                            <div className="form-check form-switch mt-1">
                              <input
                                className="form-check-input custom-checkbox"
                                type="checkbox"
                                role="switch"
                                checked={active}
                                onChange={(e) =>
                                  handleToggle(id, e.target.checked)
                                } //Handle toggle change
                              />
                            </div>
                          </td>
                          <td style={{ width: "10%" }}>
                            <Link to={`/edit-rule-engine/${id}`}>
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
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V6.207a.5.5 0 0 0-1 0V13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h7.293a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                />
                              </svg>
                            </Link>
                          </td>
                          <td style={{ width: "10%" }}>
                            <Link to={`/view-rule-engine/${id}`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="black"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
                {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
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
                No matching rules found. Adjust your filters to see results.
              </div>
            )}
          </div>

          {/* Filter Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Filter By</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <p
                  className="title"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  Attributes
                </p>
                <div className="row ms-2">
                  <fieldset className="border col-md-5 m-2 col-sm-11">
                    <legend
                      className="float-none"
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      Master Attribute<span>*</span>
                    </legend>
                    <select
                      // @ts-ignore
                      required=""
                      className="mt-1 mb-1"
                      style={{ fontSize: "12px", fontWeight: "400" }}
                      onChange={handleMasterAttributeChange}
                      value={selectedMasterAttribute}
                    >
                      <option value="" disabled selected hidden>
                        Select Master Attribute
                      </option>
                      {masterAttributes.map((attr) => (
                        <option key={attr.id} value={attr.id}>
                          {attr.display_name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                  <fieldset className="border col-md-5 m-2 col-sm-11">
                    <legend
                      className="float-none"
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      Sub Attribute<span>*</span>
                    </legend>
                    <select
                      required=""
                      className="mt-1 mb-1"
                      style={{ fontSize: "12px", fontWeight: "400" }}
                      onChange={handleSubAttributeChange}
                      value={selectedSubAttribute}
                      disabled={!selectedMasterAttribute}
                    >
                      <option value="" disabled selected hidden>
                        Select Sub Attribute
                      </option>

                      {subAttributes.map((subAttr) => (
                        <option key={subAttr.id} value={subAttr.attribute_name}>
                          {subAttr.display_name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>
              </div>

              <div className="row mt-2 justify-content-center mt-5">
                <div className="col-md-4">
                  <button className="purple-btn1 w-100" onClick={handleFilter}>
                    Submit
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className="purple-btn2 w-100"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default RuleEngine;
