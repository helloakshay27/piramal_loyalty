import React, { useState, useEffect } from "react";
import "../styles/style.css";

import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Confi/baseurl";

const Segment = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // @ts-ignore
  const [showModal, setShowModal] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredItems, setFilteredItems] = useState([]);
  // @ts-ignore
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); //filter
  const [suggestions, setSuggestions] = useState([]); // To store the search suggestions
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1); 


  const navigate = useNavigate();

const handleEditClick = (segment) => {
  // Navigate to the edit page with the segment ID
  navigate(`/edit-segment/${segment.id}`);
};

  // const [formData, setFormData] = useState({
  //   name: "",
  //   segment_tag: "",
  //   member_count: "",
  // });

  
 
    const handleSearch = () => {
      const filtered = segments.filter((member) =>
        // @ts-ignore
        `${member.name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // @ts-ignore
      setFilteredItems(filtered);
      setCurrentPage(1); // Reset to the first page of results
      setSuggestions([]); // Clear suggestions after searching
    };
  
    // Handle search input change
    // const handleSearchInputChange = (e) => {
    //   const term = e.target.value;
    //   setSearchTerm(term);
  
    //   // If there's a search term, filter the members and show suggestions
    //   if (term) {
    //     const filteredSuggestions = segments.filter(
    //       (member) =>
    //         // @ts-ignore
    //         `${member.name}`
    //           .toLowerCase()
    //           .includes(term.toLowerCase())
    //     );
    //     // @ts-ignore
    //     setSuggestions(filteredSuggestions); // Update suggestions list
    //     setSelectedIndex(-1); // Reset the selected index
    //   } else {
    //     setSuggestions([]); // Clear suggestions when input is empty
    //   }
    // };

    const handleSearchInputChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
  
      if (term) {
        const filteredSuggestions = segments.filter((member) =>
          member.name.toLowerCase().includes(term.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
  
      setSelectedIndex(-1); // Reset selected index on new input
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
        setSearchTerm(selectedItem.name); // Set search term
        setSuggestions([]); // Clear suggestions
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
    setFilteredItems(segments);
    setCurrentPage(1);
  };

  const fetchSegments = async () => { 
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${BASE_URL}/loyalty/segments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&&q[loyalty_type_id_eq]=${storedValue}`
        // `https://staging.lockated.com/loyalty/segments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}&per_page=${itemsPerPage}&&q[loyalty_type_id_eq]=${storedValue}`
      );


      console.log(response.data)
     
      setSegments(response.data);
      setFilteredItems(response.data);
      // setTotalEntries(response.data.total); 
      
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch segments. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // @ts-ignore
    fetchSegments(currentPage);
  }, [currentPage]);

  

  
  // const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 

  // const handlePageChange = (page) => {
  //   if (page !== currentPage) {
  //     setCurrentPage(page);
  //     setLoading(true); // Show loading when changing page
  //   }
  // };

  
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

 

  // const Pagination = ({
  //   currentPage,
  //   totalPages,
  //   totalEntries,
  //   onPageChange, // Pass the onPageChange function as a prop
  // }) => {
  //   const startEntry = (currentPage - 1) * itemsPerPage + 1;
  //   const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  //   // Function to get the range of page numbers to display
  //   const getPageNumbers = () => {
  //     const pages = [];
  //     const maxVisiblePages = 5; // Set the maximum number of visible pages
  //     const halfVisible = Math.floor(maxVisiblePages / 2);

  //     let startPage, endPage;
    
  //     if (totalPages <= maxVisiblePages) {
  //       // If total pages are less than or equal to maxVisiblePages, show all
  //       startPage = 1;
  //       endPage = totalPages;
  //     } else {
  //       // Otherwise, calculate the start and end pages
  //       if (currentPage <= halfVisible) {
  //         startPage = 1;
  //         endPage = maxVisiblePages;
  //       } else if (currentPage + halfVisible >= totalPages) {
  //         startPage = totalPages - maxVisiblePages + 1;
  //         endPage = totalPages;
  //       } else {
  //         startPage = currentPage - halfVisible;
  //         endPage = currentPage + halfVisible;
  //       }
  //     }

  //     for (let i = startPage; i <= endPage; i++) {
  //       pages.push(i);
  //     }

  //     return pages;
  //   };

  //   const pageNumbers = getPageNumbers();

  //   const handleJumpForward = () => {
  //     if (currentPage + 5 <= totalPages) {
  //       onPageChange(currentPage + 5);
  //     } else {
  //       onPageChange(totalPages); // Go to last page if jump exceeds total pages
  //     }
  //   };

  //   const handleJumpBackward = () => {
  //     if (currentPage - 5 >= 1) {
  //       onPageChange(currentPage - 5);
  //     } else {
  //       onPageChange(1); // Go to first page if jump goes below 1
  //     }
  //   };

  //   // const handleJumpForward = () => {
  //   //   const newPage = Math.min(currentPage + 5, totalPages); // Ensure it doesn't exceed totalPages
  //   //   // onPageChange(newPage);
  //   // };
    
  //   // const handleJumpBackward = () => {
  //   //   const newPage = Math.max(currentPage - 5, 1); // Ensure it doesn't go below 1
  //   //   onPageChange(newPage);
  //   // };

    
  

  //   return (
  //     <nav className="d-flex justify-content-between align-items-center">
  //       <ul
  //         className="pagination justify-content-center align-items-center"
  //         style={{ listStyleType: "none", padding: "0" }}
  //       >
  //         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
  //           <button
  //             className="page-link"
  //             onClick={() => onPageChange(1)} // Jump to first page
  //             disabled={currentPage === 1}
  //             style={{ padding: "8px 12px", color: "#5e2750" }}
  //           >
  //             «« {/* Double left arrow for jumping to the first page */}
  //           </button>
  //         </li>
  //         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
  //           <button
  //             className="page-link"
  //             onClick={() => onPageChange(currentPage - 1)}
  //             disabled={currentPage === 1}
  //             style={{ padding: "8px 12px", color: "#5e2750" }}
  //           >
  //             ‹
  //           </button>
  //         </li>

  //         {pageNumbers.map((page) => (
  //           <li
  //             key={page}
  //             className={`page-item ${page === currentPage ? "active" : ""}`}
  //           >
  //             <button
  //               className="page-link"
  //               onClick={() => onPageChange(page)}
  //               style={{
  //                 padding: "8px 12px",
  //                 color: page === currentPage ? "#fff" : "#5e2750",
  //                 backgroundColor: page === currentPage ? "#5e2750" : "#fff",
  //                 border: "2px solid #5e2750",
  //                 borderRadius: "3px",
  //               }}
  //             >
  //               {page}
  //             </button>
  //           </li>
  //         ))}

  //         <li
  //           className={`page-item ${currentPage === totalPages ? "disabled" : ""
  //             }`}
  //         >
  //           <button
  //             className="page-link"
  //             onClick={() => onPageChange(currentPage + 1)}
  //             disabled={currentPage === totalPages}
              
  //             style={{ padding: "8px 12px", color: "#5e2750" }}
  //           >
  //             ›
  //           </button>
  //         </li>
  //         <li
  //           className={`page-item ${currentPage === totalPages ? "disabled" : ""
  //             }`}
  //         >
  //           <button
  //             className="page-link"
  //             onClick={handleJumpForward} // Jump forward by 7 pages
  //             disabled={currentPage === totalPages}
  //             style={{ padding: "8px 12px", color: "#5e2750" }}
  //           >
  //             »» {/* Double right arrow for jumping to the last page */}
  //           </button>
  //         </li>
  //       </ul>
  //       <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
  //         Showing {startEntry} to {endEntry} of {totalEntries} entries
  //       </p>
  //     </nav>
  //   );
  // };


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
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
      {/* <SubHeader />   */}
      <div className="module-data-section mt-2">
        <p className="pointer">
          <span>Segment</span> &gt; Segment List
        </p>
        <h5>Segment</h5>  

        {/* Top Section for Buttons */}
        <div className="d-flex justify-content-between loyalty-header mb-3"> 
          <div>
            <Link to="/new-segment">  
              <button
                className="purple-btn1 px-3 rounded-1"
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
                <span>New Segment</span>
              </button>
            </Link>
          </div>

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
                {/* {suggestions.length > 0 && (
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
                        {member.
// @ts-ignore
                        name}
                      </li>
                    ))}
                  </ul>
                )} */}

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
                        width: "100%",        // Match width of input field
                        zIndex: 1,             // Ensure it appears on top of other elements
                        backgroundColor: "#fff", // Set solid background color
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow for visibility
                      }}
                    >
                      {suggestions.map((member,index) => (
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
                          {member.
                          name}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            <button className="purple-btn1 rounded-3 px-3" onClick={handleSearch}>
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

        {/* Table Section */}
        {loading && <p>Loading segments...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && (
          <>
            <div className="tbl-container mx-3 mt-4">
              <table
                className="w-100"
                style={{ color: "#000", fontWeight: "400", fontSize: "13px" }}
              >
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    <th style={{ width: "20%" }}>Segment Name</th>
                    <th style={{ width: "20%" }}>Segment Tag</th>
                    <th style={{ width: "20%" }}>Total Members</th>
                    <th style={{ width: "20%" }}>Edit</th>
                    <th style={{ width: "20%" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((segment, index) => (
                      <tr key={segment.id || index}>
                        <td
                          // @ts-ignore
                          style={{ align: "center", verticalAlign: "middle" }}
                        >
                          {segment.
// @ts-ignore
                          name}
                        </td>
                        <td
                          style={{
                            // @ts-ignore
                            align: "center",
                            fontSize: "13px ",
                            fontWeight: "700",
                          }}
                          className=""
                        >
                          {segment.
// @ts-ignore
                          segment_tag}
                        </td>
                        <td style={{ 
// @ts-ignore
                        align: "center" }}>
                          {segment.
// @ts-ignore
                          member_count}
                        </td>
                        <td>
                          <button
                            className="btn btn-link"
                            onClick={() => handleEditClick(segment)}
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
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V6.207a.5.5 0 0 0-1 0V13.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h7.293a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </button>
                        </td>

                        <Link to={`/view-segment/${segment.
// @ts-ignore
                        id}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#000000"
                            className="bi bi-eye ms-4 mt-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </Link>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ textAlign: "center" }} 
// @ts-ignore
                      colSpan="4">
                        No segments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              // totalPages={Math.ceil(totalEntries / itemsPerPage)}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalEntries={filteredItems.length}
            />
          </>
        )}
      </div>
    </div>
  </>
);

};

export default Segment;
