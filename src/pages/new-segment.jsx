import React, { useState, useEffect } from "react";
import "../styles/style.css";

import SubHeader from "../components/SubHeader";
import axios from "axios";
// Import axios for making API calls
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../Confi/baseurl";

const NewSegment = () => {
  const [name, setName] = useState(""); // Updated: Replaced segmentName
  const [segment_tag, setSegmentTag] = useState("");

  const [segment_type, setSegmentType] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // For navigation after success
  const storedValue = sessionStorage.getItem("selectedId");
  console.log("Stored ID in session after selection:", storedValue);
  const token = localStorage.getItem("access_token");

  const [segment_members, setSelectedMemberIds] = useState([]);

  const [tierLevels, setTierLevels] = useState([]);
  // @ts-ignore
  const [initialData, setInitialData] = useState([]);
  // @ts-ignore
  const [filteredItems, setFilteredItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedValue = sessionStorage.getItem("selectedId");
      try {
        const tierResponse = await axios.get(
          `${BASE_URL}/loyalty/tiers.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setTierLevels(tierResponse.data);

        const memberResponse = await axios.get(
          `${BASE_URL}/loyalty/members.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setInitialData(memberResponse.data);
        setFilteredData(memberResponse.data);
        // Set initial data as default filtered data
        setSelectedMemberIds([]); //
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTierLevels = async () => {
      const storedValue = sessionStorage.getItem("selectedId");
      try {
        const response = await axios.get(
          `${BASE_URL}/loyalty/tiers.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
        );
        setTierLevels(response.data);
        // Store API data in state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tier levels:", error);
      }
    };

    fetchTierLevels();
  }, []);

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !name ||
  //     !segment_tag ||
  //     !segment_type ||
  //     segment_members.length === 0 // Ensure at least one member is selected
  //   ) {
  //     toast.error(
  //       "All Mandatory field are required, and at least one member must be selected.",
  //       {
  //         position: "top-center",
  //         autoClose: 3000,
  //       }
  //     );
  //     return;
  //   }

  //   // Proceed with form submission if all fields are filled
  //   const data1 = {
  //     name,
  //     segment_tag,
  //     segment_type,
  //     loyalty_type_id: storedValue,
  //   };

  //   const data = {
  //     loyalty_segment: {
  //       name: data1.name,
  //       segment_tag: data1.segment_tag,
  //       segment_type: data1.segment_type,
  //       loyalty_type_id: storedValue,
  //       loyalty_members: { member_ids: segment_members },
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       "https://staging.lockated.com/loyalty/segments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
  //       data
  //     );
  //     if (response.statusText === "Created") {
  //       toast.success("Segment created successfully!", {
  //         position: "top-center",
  //         autoClose: 3000,
  //       });
  //       clearForm();
  //       navigate("/Segment");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to create segment. Please try again.", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!name || !segment_tag || !segment_type || segment_members.length === 0) {
  //     toast.error(
  //       "All Mandatory fields are required, and at least one member must be selected.",
  //       {
  //         position: "top-center",
  //         autoClose: 3000,
  //       }
  //     );
  //     return;
  //   }

  //   const data = {
  //     loyalty_segment: {
  //       name,
  //       segment_tag,
  //       segment_type,
  //       loyalty_type_id: storedValue,
  //       loyalty_members: {
  //         member_ids: segment_members.length > 0 ? segment_members : [],
  //          // Submit empty if no filters
  //       },
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       "https://staging.lockated.com/loyalty/segments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
  //       data
  //     );
  //     if (response.statusText === "Created") {
  //       toast.success("Segment created successfully!", {
  //         position: "top-center",
  //         autoClose: 3000,
  //       });
  //       clearForm();
  //       navigate("/Segment");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to create segment. Please try again. A segment with this Name, Tag, and Type already exists. ", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!name || !segment_tag || !segment_type || segment_members.length === 0) {
    //   toast.error(
    //     "All Mandatory fields are required, and at least one member must be selected.",
    //     {
    //       position: "top-center",
    //       autoClose: 3000,
    //     }
    //   );
    //   return;
    // }

    if (!name) {
      toast.error("Segment Name is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!segment_tag) {
      toast.error("Segment Tag is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!segment_type) {
      toast.error("Segment Type is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (segment_members.length === 0) {
      toast.error("At least one member must be selected.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const data = {
      loyalty_segment: {
        name,
        segment_tag,
        segment_type,
        loyalty_type_id: storedValue,
        loyalty_members: {
          member_ids: segment_members.length > 0 ? segment_members : [],
        },
      },
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/loyalty/segments.json?token=${token}`,
        data
      );

      if (response.statusText === "Created") {
        toast.success("Segment created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        clearForm();
        navigate("/Segment");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Check for the specific backend validation message
        const errorMessage = error.response.data?.name?.[0];
        if (
          errorMessage ===
          "with this name, type and tag combination must be unique"
        ) {
          toast.error(
            "A segment with this Name, Tag, and Type already exists.",
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        } else {
          // Handle other possible 422 error messages
          toast.error("Failed to create segment due to validation error.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        // Generic error message for other errors
        toast.error("Failed to create segment. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const clearForm = () => {
    setName(""); // Updated: Clear name field
    setSegmentTag("");
    // setSegmentFilters("");
    setSegmentType("");
    // setLoyaltyTierId(""); // Updated: Clear loyalty_tier_id field
    setError("");
    setSuccessMessage("");
    setSelectedMemberIds([]);
  };

  const initialFormValues = {
    enrollmentDate: "",
    status: "",
    age: "",
    activatedDate: "",
    gender: "",
    tierLevel: "",
  };
  const [formValues, setFormValues] = useState(initialFormValues);
  // const [formValues, setFormValues] = useState({
  //   enrollmentDate: "",
  //   status: "",
  //   age: "",

  //   activatedDate: "",
  //   gender: "",
  //   tierLevel: "",
  // });

  const [filteredData, setFilteredData] = useState([]); // State to store filtered data

  // Handle input change in filter fields
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  // const resetFilter = () => {
  //   setFormValues(initialFormValues); // Reset form values to initial state
  //   setFilteredData([]); // Clear filtered data
  // };

  const resetFilter = () => {
    setFormValues(initialFormValues); // Reset form values to initial state
    setFilteredData([]); // Clear filtered data
    setSelectedMemberIds([]); // Clear selected member IDs
    setShowMembers(false); // Hide members list
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle applying the filter and fetching data
  // const handleFilter = async (e) => {
  //   e.preventDefault();

  //   const isAnyFilterFilled = Object.values(formValues).some((value) => value);

  //   if (!isAnyFilterFilled) {
  //     setError("Please fill at least one filter field before applying.");
  //     return;
  //   }

  //   // Reset error if filter fields are filled
  //   setError("");

  //   // Create query params dynamically based on the formValues
  //   let query = [];

  //   // Add conditions only if values are provided
  //   if (formValues.enrollmentDate) {
  //     query.push(
  //       `q[joining_date_gteq]=${formatDate(formValues.enrollmentDate)}`
  //     );
  //   }
  //   if (formValues.activatedDate) {
  //     query.push(`q[created_at_gteq]=${formatDate(formValues.activatedDate)}`);
  //   }

  //   if (formValues.status) {
  //     query.push(
  //       `q[active_eq]=${formValues.status === "Active" ? "true" : "false"}`
  //     );
  //   }
  //   if (formValues.gender) {
  //     query.push(`q[user_gender_eq]=${formValues.gender}`);
  //   }
  //   if (formValues.tierLevel) {
  //     query.push(`q[loyalty_tier_name_eq]=${formValues.tierLevel}`);
  //   }

  //   // Construct full query string
  //   const queryString = query.length > 0 ? `?${query.join("&")}` : "";
  //   const storedValue = sessionStorage.getItem("selectedId")
  //   try {
  //     // Call API with query string
  //     const response = await axios.get(
  //       `https://staging.lockated.com/loyalty/members.json${queryString}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[loyalty_type_id_eq]=${storedValue}`
  //     );

  //     setFilteredData(response.data); // Set the fetched data
  //     setSelectedMemberIds(response.data.map((member) => member.id));

  //     if (response.data.length > 0) {
  //       setShowMembers(true); // Show members if data is returned
  //     } else {
  //       setShowMembers(false); // Hide members if no data
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filtered data", error);
  //   }
  // };

  const handleFilter = async (e) => {
    e.preventDefault();

    const isAnyFilterFilled = Object.values(formValues).some((value) => value);

    if (!isAnyFilterFilled) {
      setError("Please fill at least one filter field before applying.");
      return;
    }

    setError("");

    let query = [];
    if (formValues.enrollmentDate) {
      query.push(
        `q[joining_date_gteq]=${formatDate(formValues.enrollmentDate)}`
      );
    }
    if (formValues.activatedDate) {
      query.push(`q[created_at_gteq]=${formatDate(formValues.activatedDate)}`);
    }
    if (formValues.status) {
      query.push(
        `q[active_eq]=${formValues.status === "Active" ? "true" : "false"}`
      );
    }
    if (formValues.gender) {
      query.push(`q[user_gender_eq]=${formValues.gender}`);
    }
    if (formValues.tierLevel) {
      query.push(`q[loyalty_tier_name_eq]=${formValues.tierLevel}`);
    }

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${BASE_URL}/loyalty/members.json${queryString}&token=${token}&q[loyalty_type_id_eq]=${storedValue}`
      );

      // setFilteredData(response.data);

      const membersData = response.data;

      // Update state based on the filtered results
      setFilteredData(membersData);

      if (membersData.length > 0) {
        setSelectedMemberIds(membersData.map((member) => member.id));
        setShowMembers(true);
      } else {
        setSelectedMemberIds([]); // Clear selected members if no data found
        setShowMembers(false);
      }
    } catch (error) {
      console.error("Error fetching filtered data", error);
      setError("Failed to fetch data. Please try again.");
    }
  };
  //     setSelectedMemberIds(response.data.map((member) => member.id)); // Only update when filter applied

  //     if (response.data.length > 0) {
  //       setShowMembers(true);
  //     } else {
  //       setShowMembers(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filtered data", error);
  //   }
  // };

  const handleCheckboxChange = (id) => {
    // @ts-ignore
    setSelectedMemberIds((prevSelected) =>
      // @ts-ignore
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id)
        : [...prevSelected, id]
    );
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
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
          <p className="pointer ">
            <Link to="/segment">
              <span className=" text-dark font-weight-bold ">Segment</span>
            </Link>{" "}
            &gt; New Segment
          </p>
          <h5
            className="mb-1 title ms-3"
            style={{ marginBottom: "30px", marginTop: "33px" }}
          >
            New Segment
          </h5>
          {/* <div className="go-shadow me-3 pb-4"> */}
          <div className="row ms-2 mt-2" style={{ marginBottom: "30px" }}>
            <fieldset className="border col-md-3 m-2 col-sm-11 ">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Segment Name<span>*</span>
              </legend>

              <input
                type="text"
                className="border w-100 p-2 py-2 border-bottom pb-2 border-0 border-bottom-0 bold-placeholder"
                placeholder="Enter Segment Name"
                // @ts-ignore
                required=""
                value={name}
                onChange={(e) => setName(e.target.value)}
                // style={{
                //   height: '30px',
                //   width: '100%',
                //   padding: '8px',
                //   boxSizing: 'border-box',
                // }}
              />
            </fieldset>

            <fieldset className="border col-md-3 m-2 col-sm-11 ">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Segment tag<span>*</span>
              </legend>
              <select
                className="mt-1 mb-1"
                // @ts-ignore
                required=""
                value={segment_tag}
                onChange={(e) => setSegmentTag(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Select Segment tag
                </option>

                <option value="Recently joined">Recently joined</option>
                <option value="Suspended">Suspended</option>
                <option value="1-purchase">1-purchase</option>
                <option value="No purchase">No purchase</option>
              </select>
            </fieldset>

            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{
                  fontSize: "14px", // Adjust font size for visibility

                  padding: "6px", // Padding to ensure full visibility of text
                  lineHeight: "1.2", // Adjust line-height for better readability
                  marginBottom: "-8px", // Slight negative margin if legend is too high
                }}
              >
                Segment type<span>*</span>
              </legend>
              <select
                className="mt-1 mb-1"
                // @ts-ignore
                required=""
                value={segment_type}
                onChange={(e) => setSegmentType(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Select segment type
                </option>
                <option value="Point based">Point based</option>
                <option value="Discount based">Discount based</option>
                <option value="Referral Campaign">Referral Campaign</option>
                <option value="Tier - Up Campaign">Tier - Up Campaign</option>
                <option value="Custom Campaign">Custom Campaign</option>
              </select>
            </fieldset>

            {/* Filter Element */}

            <div className="filter-container mt-4">
              <h5 className="filter-label">Filter Members</h5>
              <div className="filter-fields d-flex flex-wrap border p-3">
                <div className="filter-field m-2">
                  <label
                    htmlFor="enrollmentDate"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    id="enrollmentDate"
                    name="enrollmentDate"
                    className="form-control border w-100 p-2 py-2  pb-2 bold-placeholder"
                    value={formValues.enrollmentDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="filter-field m-2">
                  <label
                    htmlFor="status"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-control form-control border w-100 p-2 py-2  pb-2 bold-placeholder"
                    value={formValues.status}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Select status
                    </option>
                    <option value=""> Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="filter-field m-2">
                  <label
                    htmlFor="gender"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control form-control form-control border w-100 p-2 py-2  pb-2 "
                    value={formValues.gender}
                    onChange={handleChange}
                  >
                    <option value="" disabled selected hidden>
                      Select gender
                    </option>
                    <option value=""> Select Gender</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                    {/* <option value=""> </option> Blank option */}
                  </select>
                </div>

                <div className="filter-field m-2">
                  <label
                    htmlFor="activatedDate"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Activated Date
                  </label>
                  <input
                    type="date"
                    id="activatedDate"
                    name="activatedDate"
                    className="form-control form-control form-control border w-100 p-2 py-2  pb-2 bold-placeholder"
                    value={formValues.activatedDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="filter-field m-2">
                  <label
                    htmlFor="tierLevel"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Tier Level
                  </label>
                  <select
                    id="tierLevel"
                    name="tierLevel"
                    className="form-control form-control form-control border w-100 p-2 py-2  pb-2 bold-placeholder"
                    value={formValues.tierLevel}
                    onChange={handleChange}
                  >
                    {/* <option value="" disabled hidden>
                        Select Tier Level
                      </option> */}
                    <option value=""> Select Tier Level</option>
                    {tierLevels?.map(
                      (
                        tier,
                        // @ts-ignore
                        index
                      ) => (
                        <option
                          key={
                            // @ts-ignore
                            tier.name
                          }
                          value={tier.name}
                        >
                          {
                            // @ts-ignore
                            tier.display_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
                {/* Apply Filter Button */}

                <div className=" d-flex align-items-center mt-4 ml-5">
                  <button
                    type="button"
                    className=" ml-5 purple-btn1 ms-3 "
                    onClick={handleFilter}
                  >
                    Apply Filter
                  </button>
                </div>

                <div className=" d-flex align-items-center mt-4 ml-5">
                  <button
                    type="button"
                    className=" ml-5 purple-btn2 ms-3 "
                    onClick={resetFilter}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Display Filtered Data */}
          <div className="filtered-data-section mt-4">
            <h5 className="ms-3">Members List</h5>
            {showMembers && filteredData.length > 0 ? (
              <div className="tbl-container mx-3 mt-4">
                <table
                  className="w-100 "
                  style={{
                    color: "#000",
                    fontWeight: "400",
                    fontSize: "13px",
                    // @ts-ignore
                    align: "center",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Select
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Address
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Gender
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          width: "400px",
                          fontWeight: "400",
                          fontSize: "13px",
                          height: "40px",
                        }}
                      >
                        Loyalty Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <input
                            type="checkbox"
                            // @ts-ignore
                            checked={segment_members.includes(member.id)}
                            onChange={() => handleCheckboxChange(member.id)}
                          />
                        </td>

                        <td>
                          {member.firstname} {member.lastname}
                        </td>
                        <td>{member.email}</td>
                        <td>
                          {member.address.address1}, {member.address.address2}
                        </td>
                        <td>{member.gender || "N/A"}</td>
                        <td>
                          {member.active !== null
                            ? member.active
                              ? "Active"
                              : "Inactive"
                            : "N/A"}
                        </td>
                        <td>{member.current_loyalty_points || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalEntries={filteredData.length}
                />
              </div>
            ) : (
              <p className="text-secondary mx-4">
                No data found. Please adjust the filters and try again.
              </p>
            )}
          </div>
          <div className="row mt-5 justify-content-center">
            <div className="col-md-2">
              <button className="purple-btn1 w-100" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100" onClick={clearForm}>
                Cancel
              </button>
            </div>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}{" "}
          {successMessage && (
            <div className="text-success mt-2">{successMessage}</div>
          )}
        </div>
      </div>
      {/* </div> */}
      <ToastContainer />
    </>
  );
};

export default NewSegment;
